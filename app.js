const express = require("express");
const app = express();
const logger = require("morgan");
const log = require("./utils/logger").LOG;
const dbConfig = require("./db.config/db.config");
const router = require("./src/router/router");
const mongoose = require("mongoose");
var cors = require("cors");

mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {})
  .then(() => {
    log.info("Connected to MongoDB");
  })
  .catch((err) => {
    log.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);
const corsOption = {
  origin: ["http://localhost:3000/api/v1"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors());

module.exports = app;
