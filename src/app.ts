import cors from "cors";
import "dotenv/config";
import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import docs from "./documantation";
import router from "./routes";
import { routes_home_page } from "./utils/html.utils";
import session from "express-session";
import pgSession from "connect-pg-simple";
import passport from "./middlewares/passport";
import { SESSION_SECRET } from "./utils/keys";

const app: Express = express();
const allowedOrigins = process.env.ALLOWED_ORIGIN || "http://localhost:5000";
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(String(origin)) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Your domain not supported"));
      }
    },
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(
  session({
    store: new (pgSession(session))({
      conString: process.env.DB_DEV_URL,
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(docs));

app.get("/api/v1", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to cascade documentation",
  });
});
app.get("/", (_req: Request, res: Response) => {
  res.send(routes_home_page);
});

export default app;
