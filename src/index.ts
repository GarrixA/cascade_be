import * as http from "http";
import { connectionToDatabase } from "./database/config/db.config";
import { PORT } from "./utils/keys";

import app from "./app";
const startServer = async () => {
  await connectionToDatabase();

  const server = http.createServer(app);

  server.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

startServer();
