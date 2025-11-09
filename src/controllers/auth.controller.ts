import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "@/db/prisma.db.js";
import { env } from "@/env/env.js";
import { JwtPayload } from "@/middleware/auth.middleware.js";

// Helper function - for token generating.
const generateTokens = (userId: number, email: string) => {
  const accessToken = jwt.sign({ userId, email }, env.accessSecret, {
    expiresIn: env.accessTokenExpiresIn,
  });

  const refreshToken = jwt.sign({ userId, email }, env.refreshSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  });

  return { accessToken, refreshToken };
};

// Helper function - for setting cookies
const setTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Register controller
export const register = async (
  req: Request<
    {},
    {},
    {
      name: string;
      email: string;
      password: string;
    }
  >,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
};

// Login controller
export const login = async (req : Request<
  {},
  {},
  {
    email: string;
    password: string;
  }
  >, res : Response)=>{
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password required'
        });
      }

      const user = await prisma.user.findUnique({where : {
        email : email
      }});

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      const {accessToken,refreshToken} = generateTokens(user.id, user.email);

      await prisma.user.update({
        where : {id : user.id},
        data : {
          refreshToken : refreshToken
        }
      });

      setTokenCookies(res, accessToken, refreshToken);

      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
}

// Refresh Access Token
export const  refreshAccessToken = async (req : Request , res : Response)=>{
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
        code: 'NO_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      env.refreshSecret
    ) as JwtPayload;

    // Checking if refresh token exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.accessSecret,
      { expiresIn: '15m' }
    );

    // Set new access token cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Access token refreshed'
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token expired. Please login again.',
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      error: 'Token refresh failed'
    });
  }
}

// Get Profile controller
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

// Logout controller
export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Remove refresh token from database
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null }
      });
    }

    // Clearing both cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
};
