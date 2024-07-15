import { DataSource } from "typeorm";
import { Campaign, Conversion, QRCode, Scan } from "../entity";
import { EnvManager } from "./env-manager";

const {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_CACHE,
  REDIS_HOST,
  REDIS_PORT,
} = EnvManager.instantiate().env;

let cache: boolean | object = false;
if (DB_CACHE) {
  cache = {
    type: "redis",
    options: {
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    },
  };
}

const dataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [Campaign, QRCode, Scan, Conversion],
  // options: {
  //   trustServerCertificate: true,
  // },
  cache,
  migrationsRun: true,
  migrations: ["dist/migration/*.js"],
  logging: false,
});

export default dataSource;
