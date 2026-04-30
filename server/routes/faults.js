const express = require("express");
const router = express.Router();

const Fault = require("../models/Fault");

/* Get all */
router.get("/", async (req, res) => {
  const faults = await Fault.findAll();
  res.json(faults);
});

/* Detect */
router.get("/detect", async (req, res) => {
  const fault = await Fault.findOne({
    where: { status: "open" }
  });

  if (!fault) {
    return res.json({ detected: false });
  }

  res.json({
    detected: true,
    fault
  });
});

/* Add */
router.post("/", async (req, res) => {
  const fault = await Fault.create(req.body);
  res.status(201).json(fault);
});

/* Resolve */
router.patch("/:id", async (req, res) => {
  const fault = await Fault.findByPk(req.params.id);

  if (!fault) {
    return res.status(404).json({
      error: "Fault not found"
    });
  }

  fault.status = req.body.status;
  await fault.save();

  res.json(fault);
});

module.exports = router;