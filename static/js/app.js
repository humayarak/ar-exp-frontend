import { getTools, createTool, getTool, updateTool } from "./api.js";
import { renderTools, renderDetails, setMessage } from "./ui.js";

const listEl = document.getElementById("list");
const detailsEl = document.getElementById("details");
const msgEl = document.getElementById("msg");

const nameEl = document.getElementById("name");
const typeEl = document.getElementById("type");

const addBtn = document.getElementById("addBtn");

// Filters
const filterAllBtn = document.getElementById("filterAll");
const filterAvailableBtn = document.getElementById("filterAvailable");
const filterInUseBtn = document.getElementById("filterInUse");
const filterMissingBtn = document.getElementById("filterMissing");

let currentFilter = null;

// Refresh list
async function refresh() {
  try {
    const tools = await getTools(currentFilter);
    renderTools(listEl, tools);
  } catch (err) {
    setMessage(msgEl, "Failed to load tools: " + err.message);
  }
}

// Add tool
addBtn?.addEventListener("click", async () => {
  console.log("Add button clicked") //debug purposes only
  try {
    setMessage(msgEl, "");

    const name = nameEl.value.trim();
    const type = typeEl.value.trim();

    if (!name || !type) {
      setMessage(msgEl, "Name and type are required.");
      return;
    }

    const location = document.getElementById("location").value.trim();

    await createTool({
      name,
      type,
      location
    });

    setMessage(msgEl, "Tool created successfully");

    nameEl.value = "";
    typeEl.value = "";

    await refresh();

  } catch (err) {
    console.error(err);
    setMessage(msgEl, "Error creating tool: " + err.message);
  }
});

// List interactions
listEl?.addEventListener("click", async (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  const id = Number(target.dataset.id);

  if (!Number.isFinite(id)) return;

  try {
    setMessage(msgEl, "");

    if (action === "toggle") {
      const newStatus = target.dataset.status;

      const updated = await updateTool(id, newStatus);

      setMessage(msgEl, `Tool updated: ${updated.status}`);
      await refresh();
      return;
    }

    if (action === "details") {
      const tool = await getTool(id);

      if (detailsEl) {
        detailsEl.dataset.currentId = String(id);
        renderDetails(detailsEl, tool);
      }
    }

  } catch (err) {
    setMessage(msgEl, "Error: " + err.message);
  }
});

// Filter events
filterAllBtn?.addEventListener("click", async () => {
  currentFilter = null;
  await refresh();
});

filterAvailableBtn?.addEventListener("click", async () => {
  currentFilter = "available";
  await refresh();
});

filterInUseBtn?.addEventListener("click", async () => {
  currentFilter = "in-use";
  await refresh();
});

filterMissingBtn?.addEventListener("click", async () => {
  currentFilter = "missing";
  await refresh();
});

// Init
refresh();