import { DEPLOYED_URL, SERVER_URL } from "../utils/keys";

const basicInfo = {
  openapi: "3.0.0",
  info: {
    title: "CASCADE API",
    description: "cascade api documentation",
    version: "1.0.0",
  },

  servers: [
    {
      url: DEPLOYED_URL ? DEPLOYED_URL : SERVER_URL,
      description: "My server",
    },
  ],
  security: [
    {
      // google_auth: [],
      bearerAuth: [],
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export default basicInfo;
