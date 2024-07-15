export class EnvModel {
  NODE_ENV: string;
  PROTOCOL: string;
  DOMAIN: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_CACHE: boolean;
  REDIS_HOST: string;
  REDIS_PORT: number;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.PROTOCOL = process.env.PROTOCOL;
    this.DOMAIN = process.env.DOMAIN;
    this.PORT = parseInt(process.env.PORT);
    this.DB_HOST = process.env.DB_HOST;
    this.DB_PORT = parseInt(process.env.DB_PORT);
    this.DB_USERNAME = process.env.DB_USERNAME;
    this.DB_PASSWORD = process.env.DB_PASSWORD;
    this.DB_NAME = process.env.DB_NAME;
    this.DB_CACHE = process.env.DB_CACHE == "true";
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.REDIS_PORT = parseInt(process.env.REDIS_PORT);
  }
}
