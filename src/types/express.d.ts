import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}

declare module 'express' {
  export interface Request {
    cookies: {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}

export {};
