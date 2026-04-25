// Import API functions
import { getTool, updateTool } from "./api.js";

// Ensure DOM is ready
window.addEventListener("DOMContentLoaded", () => {

  const toolMarker = document.getElementById("hiroMarker");
  const faultMarker = document.getElementById("faultMarker");
  const faultTextEl = document.getElementById("faultText");

  // Tool marker
  if (toolMarker) {
    toolMarker.addEventListener("markerFound", () => {
      console.log("Tool marker detected");

      handleToolDetection(1); // replace later with real mapping
    });
  }

  // Fault marker
  if (faultMarker) {
    faultMarker.addEventListener("markerFound", async () => {
      console.log("Fault marker detected");

      try {
        const res = await fetch("/api/faults");
        const faults = await res.json();

        if (!faults || faults.length === 0) {
          if (faultTextEl) {
            faultTextEl.setAttribute("value", "No faults found");
          }
          return;
        }

        const activeFault =
          faults.find(f => f.status === "open") || faults[0];

        if (activeFault && faultTextEl) {
          faultTextEl.setAttribute(
            "value",
            `${activeFault.type}\nSeverity: ${activeFault.severity}`
          );
        }

      } catch (err) {
        console.error("Failed to load faults", err);

        if (faultTextEl) {
          faultTextEl.setAttribute("value", "Error loading faults");
        }
      }
    });
  }

  // Fallback triggered if no AR detection after a delay
  setTimeout(() => {
    console.log("Fallback triggered (no marker detected)");
    handleToolDetection(1);
  }, 3000);
});


// Tool handling

async function handleToolDetection(toolId) {
  try {
    const tool = await getTool(toolId);
    displayToolOverlay(tool);
  } catch (err) {
    console.error("Error fetching tool:", err);
  }
}

function displayToolOverlay(tool) {
  const dataPanel = document.getElementById("dataPanel");
  const statusEl = document.getElementById("status");

  if (!dataPanel || !statusEl) return;

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


// Status updates

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