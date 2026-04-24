const express = require("express");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./database");

// Models
const Tool = require("./models/Tool"); 
const Log = require("./models/Log");

// Schemas
const { ToolCreateSchema, ToolUpdateSchema } = require("./schemas");

const app = express();

app.use(express.json());
app.use(express.static("static"));


// Routes
// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

// AR page
app.get("/ar", (req, res) => {
  res.sendFile(path.join(__dirname, "static/ar.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Inspect console fix 
app.get("/favicon.ico", (req, res) => res.status(204));

// Tool API
// GET all tools
app.get("/api/tools", async (req, res) => {
  try {
    const { status } = req.query;

    let where = {};

    if (status) {
      where.status = status;
    }

    const tools = await Tool.findAll({ where });

    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET single tool
app.get("/api/tools/:id", async (req, res) => {
  try {
    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE tool
app.post("/api/tools", async (req, res) => {
  try {
    const { error } = ToolCreateSchema.validate(req.body);

    if (error) {
      return res.status(422).json({ 
        error: {
          message: error.details[0].message
        } 
      });
    }

    const tool = await Tool.create({
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      status: "available"
    });

    // Log creation
    await Log.create({
      tool_id: tool.id,
      action: "created",
      user: "engineer" // later replace with logged-in user
    });

    res.status(201).json(tool);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE tool status
app.patch("/api/tools/:id", async (req, res) => {
  try {
    const { error } = ToolUpdateSchema.validate(req.body);

    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    // Update tool
    tool.status = req.body.status;
    tool.last_checked_by = "engineer";
    await tool.save();

    // Log status change
    await Log.create({
      tool_id: tool.id,
      action: req.body.status, // available / in-use / missing
      user: "engineer"
    });

    res.json(tool);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET logs (for dashboard later)
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.findAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start server

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});