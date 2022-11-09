export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      API_URL: string;
      PORT: string;
      COOKIE_NAME: string;
      SALT_ROUNDS: string;
      JWT_SECRET: string;
    }
  }
}