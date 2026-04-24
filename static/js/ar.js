// Import API functions
import { getTool, updateTool } from "./api.js";

// Simulated marker detection (fallback if AR not triggered)
function simulateMarkerDetection() {
  const detectedToolId = 1;
  handleToolDetection(detectedToolId);
}

// When a tool is detected
async function handleToolDetection(toolId) {
  try {
    const tool = await getTool(toolId);
    displayToolOverlay(tool);
  } catch (err) {
    console.error("Error fetching tool:", err);
  }
}

// Display tool info WITHOUT breaking existing overlay
function displayToolOverlay(tool) {
  const dataPanel = document.getElementById("dataPanel");
  const statusEl = document.getElementById("status");

  if (!dataPanel) return;

  statusEl.textContent = "Tool detected via AR";

  dataPanel.innerHTML = `
    <p><strong>Name:</strong> ${tool.name}</p>
    <p><strong>Type:</strong> ${tool.type}</p>
    <p><strong>Status:</strong> ${tool.status}</p>

    <button onclick="markInUse(${tool.id})">Use</button>
    <button onclick="markAvailable(${tool.id})">Return</button>
    <button onclick="markMissing(${tool.id})">Missing</button>
  `;
}

// Update tool status functions
window.markInUse = async function(id) {
  await updateTool(id, "in-use");
  alert("Tool marked as in use");
};

window.markAvailable = async function(id) {
  await updateTool(id, "available");
  alert("Tool marked as available");
};

window.markMissing = async function(id) {
  await updateTool(id, "missing");
  alert("Tool marked as missing");
};

// Optional fallback if AR marker not triggered
window.addEventListener("load", () => {
  // Delay slightly so AR system has chance first
  setTimeout(() => {
    simulateMarkerDetection();
  }, 2000);
});