declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    ACCESS_SECRET: string;
    REFRESH_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN?: string;
    REFRESH_TOKEN_EXPIRES_IN?: string;
    BCRYPT_SALT_ROUNDS?: string;
    BASE_URL?: string;
  }
}
