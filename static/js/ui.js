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