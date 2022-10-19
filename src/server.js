const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api-routes");
const authRoutes = require("./routes/auth-routes");
const adminRoutes = require("./routes/admin-routes");
const verifyJwt = require("./middlewares/verifyJwt");

exports.createExpressServer = () => {
  const app = express();

  app.use(cors());

  // Configure bodyparser to handle post requests
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());
  app.use(cookieParser());

  // Send message for default URL
  app.get("/", (_, res) => res.send("Hello World with Express (CD activated)"));

  app.use("/auth", authRoutes);

  app.use(verifyJwt);

  // Use Api routes in the App
  app.use("/api", apiRoutes);

  app.use("/admin", adminRoutes);

  // Return 404 otherwise
  app.use("*", (_, res) => {
    res.status(404).json({
      status: "error",
      message: "invalid api route!",
    });
  });
  return app;
};
