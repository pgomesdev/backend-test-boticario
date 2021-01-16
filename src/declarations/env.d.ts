declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    MONGODB_STRING_CONN: string;
    BCRYPT_SALT_ROUNDS: string;
    APP_SECRET_KEY: string;
  }
}