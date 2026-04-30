import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [filter, setFilter] = useState(null);

  async function loadTools() {
    const res = await fetch("/api/tools");
    let data = await res.json();

    if (filter) {
      data = data.filter(t => t.status === filter);
    }

    setTools(data);
  }

  useEffect(() => {
    loadTools();
  }, [filter]);

  return (
    <div>
      <h1>Tool Tracker</h1>

      <Link to="/ar">AR View</Link>
      <Link to="/faults">Fault Logs</Link>

      <button onClick={() => setFilter(null)}>All</button>
      <button onClick={() => setFilter("available")}>Available</button>

      {tools.map(tool => (
        <div key={tool.id}>
          {tool.name} - {tool.status}
        </div>
      ))}
    </div>
  );
}