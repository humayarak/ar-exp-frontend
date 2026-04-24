/*
export function renderItems(container, tools) {
  if (!tools.length) {
    container.innerHTML = "<p class='muted'>No tools yet.</p>";
    return;
  }

  container.innerHTML = tools.map(t => `
    <div class="card" data-action="details" data-id="${t.id}" style="cursor:pointer;">
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:center;">
        <div>
          <strong>#${t.id} — ${escapeHtml(t.name)}</strong><br/>
          <span class="muted">
            Type: ${escapeHtml(t.type)} • Status: ${t.status}
          </span>
        </div>

        <button
          type="button"
          data-action="toggle"
          data-id="${t.id}"
          style="width:auto; padding:10px 12px;"
          title="Cycle tool status"
        >
          ${getNextActionLabel(t.status)}
        </button>
      </div>
    </div>
  `).join("");
}

export function renderDetails(container, tool) {
  container.innerHTML = `
    <div class="card">
      <h3 style="margin:0 0 8px 0;">Tool Details</h3>

      <div><strong>ID:</strong> ${tool.id}</div>
      <div><strong>Name:</strong> ${escapeHtml(tool.name)}</div>
      <div><strong>Type:</strong> ${escapeHtml(tool.type)}</div>
      <div><strong>Status:</strong> ${tool.status}</div>

      ${tool.location ? `<div><strong>Location:</strong> ${escapeHtml(tool.location)}</div>` : ""}
    </div>
  `;
}

export function setMessage(container, text) {
  container.textContent = text || "";
}

// Helpers

function getNextActionLabel(status) {
  switch (status) {
    case "available":
      return "Mark In Use";
    case "in-use":
      return "Mark Available";
    case "missing":
      return "Report Found";
    default:
      return "Update";
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
*/

// Show message
export function setMessage(el, message) {
  if (!el) return;
  el.textContent = message || "";
}

// Render list of tools
export function renderTools(container, tools) {
  if (!container) return;

  if (!tools || tools.length === 0) {
    container.innerHTML = "<p>No tools found.</p>";
    return;
  }

  container.innerHTML = tools.map(tool => {
    let nextStatus = "in-use";

    if (tool.status === "in-use") nextStatus = "available";
    if (tool.status === "available") nextStatus = "missing";
    if (tool.status === "missing") nextStatus = "available";

    return `
      <div class="card">
        <strong>${tool.name}</strong> (${tool.type})<br/>
        Status: ${tool.status}<br/>

        <button data-action="details" data-id="${tool.id}">
          View Details
        </button>

        <button data-action="toggle" data-id="${tool.id}" data-status="${nextStatus}">
          Set ${nextStatus}
        </button>
      </div>
    `;
  }).join("");
}

// Render tool details
export function renderDetails(container, tool) {
  if (!container) return;

  container.innerHTML = `
    <h3>${tool.name}</h3>
    <p>Type: ${tool.type}</p>
    <p>Status: ${tool.status}</p>
    <p>ID: ${tool.id}</p>
  `;
}