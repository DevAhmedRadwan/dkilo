import path from "path";
import { EnvManager } from "./env-manager";

export function useSwagger(app: any, doc_route: string) {
  const { NODE_ENV, PORT, DOMAIN, PROTOCOL } = EnvManager.instantiate().env;
  if (NODE_ENV == "development") {
    const swaggerJsDoc = require("swagger-jsdoc");
    const swaggerUI = require("swagger-ui-express");
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "dkilo",
          version: "1.0.0",
          description: "this is dkilo",
        },
        servers: [
          {
            url: `${PROTOCOL}://${DOMAIN}:${PORT}`,
            description: "dkilo api",
          },
        ],
      },
      apis: [path.join(__dirname, "../docs/**/*.yml")],
    };

    const specs = swaggerJsDoc(options);

    app.use(doc_route, swaggerUI.serve, swaggerUI.setup(specs));
  }
}
