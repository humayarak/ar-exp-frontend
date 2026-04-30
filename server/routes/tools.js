const express = require("express");
const router = express.Router();

const Tool = require("../models/Tool");
const Log = require("../models/Log");
const {
  ToolCreateSchema,
  ToolUpdateSchema
} = require("../schemas/toolSchema");

/* Get all tools */
router.get("/", async (req, res) => {
  try {
    const where = {};

    if (req.query.status) {
      where.status = req.query.status;
    }

    const tools = await Tool.findAll({ where });
    res.json(tools);

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* Get one */
router.get("/:id", async (req, res) => {
  const tool = await Tool.findByPk(req.params.id);

  if (!tool) {
    return res.status(404).json({ error: "Tool not found" });
  }

  res.json(tool);
});

/* Create */
router.post("/", async (req, res) => {
  try {
    const { error } = ToolCreateSchema.validate(req.body);

    if (error) {
      return res.status(422).json({
        error: error.details[0].message
      });
    }

    const tool = await Tool.create({
      ...req.body,
      status: "available"
    });

    await Log.create({
      tool_id: tool.id,
      action: "created",
      user: "engineer"
    });

    res.status(201).json(tool);

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* Update status */
router.patch("/:id", async (req, res) => {
  try {
    const { error } = ToolUpdateSchema.validate(req.body);

    if (error) {
      return res.status(422).json({
        error: error.details[0].message
      });
    }

    const tool = await Tool.findByPk(req.params.id);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    tool.status = req.body.status;
    tool.last_checked = new Date();

    await tool.save();

    await Log.create({
      tool_id: tool.id,
      action: req.body.status,
      user: "engineer"
    });

    res.json(tool);

  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;