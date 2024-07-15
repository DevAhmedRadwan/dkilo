import Joi from "joi";
import { EnvModel } from "../model";

export class EnvManager {
  private static instance: EnvManager | null = null;

  private envSchema = Joi.object<EnvModel>({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required()
      .description("Node environment type"),
    DOMAIN: Joi.string().required().description("Server domain"),
    PROTOCOL: Joi.string().required().description("Server protocol"),
    PORT: Joi.number().description("Server port"),
    DB_HOST: Joi.string().required().description("Database host"),
    DB_PORT: Joi.number().required().description("Database port"),
    DB_USERNAME: Joi.string().required().description("Database username"),
    DB_PASSWORD: Joi.string().required().description("Database password"),
    DB_NAME: Joi.string().required().description("Database name"),
    DB_CACHE: Joi.boolean().description("Database cache"),
    REDIS_HOST: Joi.string().required().description("Redis host"),
    REDIS_PORT: Joi.number().required().description("Redis port"),
  });

  public env: EnvModel;

  private constructor() {
    const env = new EnvModel();
    const { error, value: envVars } = this.envSchema.validate(env);
    if (error) {
      throw new Error(error.message);
    }
    this.env = envVars as EnvModel;
  }

  static instantiate() {
    if (this.instance === null) {
      this.instance = new EnvManager();
    }
    return this.instance;
  }
}
