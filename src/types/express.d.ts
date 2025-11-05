import "express";
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
      cookies: {
        accessToken?: string;
        refreshToken?: string;
      };
    }
  }
}

export {};
