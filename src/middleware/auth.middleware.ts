import { env } from "@/env/env";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  email: string;
}

export const authMiddleware = (
  req : Request,
  res : Response,
  next : NextFunction
) =>{
  try {
    const accessToken = req.cookies.accessToken;

    if(!accessToken){
      return res.status(401).json({
        success : false,
        error : "Access token required",
        code : 'NO_ACCESS_TOKEN'
      });
    }

    const decoded = jwt.verify(
      accessToken,
      env.accessSecret
    ) as JwtPayload;

    req.user = {
      userId : decoded.userId,
      email : decoded.email
    };

    next();
  } catch (error) {
    if(error instanceof jwt.TokenExpiredError){
      return res.status(401).json({
        success : false,
        error: "Access token expired. Use refresh token.",
        code: 'ACCESS_TOKEN_EXPIRED'
      })
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid access token',
        code: 'INVALID_ACCESS_TOKEN'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
}
