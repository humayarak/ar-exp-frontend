const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./database");

require("./models/Tool");
require("./models/Fault");
const Log = require("./models/Log");

const toolRoutes = require("./routes/tools");
const faultRoutes = require("./routes/faults");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/* API */
app.use("/api/tools", toolRoutes);
app.use("/api/faults", faultRoutes);

app.get("/api/logs", async (req, res, next) => {
  try {
    const logs = await Log.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

/* Health */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* React build (production) */
const clientBuildPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientBuildPath));


app.get("/*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Route not found" });
  }

  res.sendFile(path.join(clientBuildPath, "index.html"));
});

/* Error handler */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

/* Start */
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});