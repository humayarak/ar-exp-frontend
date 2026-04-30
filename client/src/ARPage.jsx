import "aframe";
import { useEffect, useState } from "react";

export default function ARPage() {
  const [status, setStatus] = useState("Scanning...");
  const [tool, setTool] = useState(null);
  const [fault, setFault] = useState(null);
  const [logs, setLogs] = useState([]);
  const [arReady, setArReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    script.async = true;
    script.onload = () => setArReady(true);

    document.body.appendChild(script);
  }, []);

  /* ---------------- LOG SYSTEM (BOTTOM BAR) ---------------- */
  function logEvent(msg, type = "info") {
    const time = new Date().toLocaleTimeString();

    setLogs((prev) => [
      ...prev,
      {
        text: `[${time}] ${msg}`,
        type
      }
    ]);
  }

  async function loadTool() {
    const res = await fetch("/api/tools");
    const data = await res.json();

    if (data.length) {
      setTool(data[0]);
      setStatus("Tool loaded");
      logEvent("Tool loaded");
    }
  }

  async function updateTool(statusValue) {
    if (!tool) return;

    await fetch(`/api/tools/${tool.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusValue })
    });

    logEvent(`Tool updated: ${statusValue}`, "warn");
    loadTool();
  }

  async function loadFault() {
    const res = await fetch("/api/faults/detect");
    const data = await res.json();

    setFault(data);

    if (data.detected) {
      setStatus("Fault detected");
      logEvent(`Fault: ${data.fault.type}`, "warn");
    } else {
      setStatus("No faults");
      logEvent("No faults detected");
    }
  }

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>

      {/* ---------------- TOP OVERLAY ---------------- */}
      <div
        style={{
          position: "fixed",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: 12,
          borderRadius: 8,
          zIndex: 9999,
          textAlign: "center",
          minWidth: 220
        }}
      >
        <h3>AR Maintenance</h3>
        <p>{status}</p>

        {tool && (
          <div>
            Tool: {tool.name} ({tool.status})
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <button onClick={loadTool}>Load Tool</button>
          <button onClick={loadFault} style={{ marginLeft: 8 }}>
            Check Fault
          </button>
        </div>

        {tool && (
          <div style={{ marginTop: 8 }}>
            <button onClick={() => updateTool("available")}>Return</button>
            <button onClick={() => updateTool("in-use")} style={{ marginLeft: 5 }}>
              Use
            </button>
            <button onClick={() => updateTool("missing")} style={{ marginLeft: 5 }}>
              Missing
            </button>
          </div>
        )}
      </div>

      {/* ---------------- AR SCENE ---------------- */}
      {!arReady ? (
        <div style={{ padding: 20 }}>Loading AR...</div>
      ) : (
        <a-scene embedded arjs="sourceType: webcam; debugUIEnabled:false;">

          <a-marker preset="hiro">

            <a-box
              position="0 0.5 0"
              color="red"
              scale="0.8 0.8 0.8"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
            />

            <a-text
              value="Tool Detected"
              position="0 1.3 0"
              align="center"
              color="white"
              scale="2 2 2"
            />

          </a-marker>

          <a-entity camera></a-entity>

        </a-scene>
      )}

      {/* ---------------- BOTTOM FAULT LOG BAR ---------------- */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(0,20,40,0.9)",
          color: "#00FF88",
          fontFamily: "monospace",
          fontSize: "12px",
          padding: "10px",
          maxHeight: "120px",
          overflowY: "auto",
          zIndex: 9999
        }}
      >
        {logs.length === 0 ? (
          <div>No logs yet...</div>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              style={{
                color: log.type === "warn" ? "#FF8800" : "#00FF88"
              }}
            >
              {log.text}
            </div>
          ))
        )}
      </div>

    </div>
  );
}