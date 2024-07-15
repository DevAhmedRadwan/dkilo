import "reflect-metadata";
import * as bodyParser from "body-parser";
import cors from "cors";
import useragent from "express-useragent";
import { InversifyExpressServer } from "inversify-express-utils";
import path from "path";
import { EnvManager } from "./config";
import { useSwagger } from "./config/swagger";
import { TypeormManager } from "./config/typeorm-manager";
import container from "./inversify.config";
import { GlobalHandlerMiddleware } from "./middleware";

async function startServer() {
  let dataSource = TypeormManager.instantiate().dataSource;

  try {
    await dataSource.initialize();
  } catch (error) {
    console.error(error);
    return;
  }

  const server = new InversifyExpressServer(container);

  server.setConfig((app) => {
    app.use(cors());
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");
    app.use(useragent.express());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    useSwagger(app, "/api/docs");
  });

  server.setErrorConfig((app) => {
    app.use(GlobalHandlerMiddleware.notFoundHandler);
    app.use(GlobalHandlerMiddleware.ErrorHandler);
  });

  const app = server.build();
  const { PORT, DOMAIN, PROTOCOL } = EnvManager.instantiate().env;

  app.listen(PORT, () => {
    console.log(
      `Server running on ${PROTOCOL}://localhost:${PORT} and ${PROTOCOL}://${DOMAIN}:${PORT}`
    );
    console.log(
      `Docs running on ${PROTOCOL}://localhost:${PORT}/api/docs and ${PROTOCOL}://${DOMAIN}:${PORT}/api/docs`
    );
  });
}
startServer();
