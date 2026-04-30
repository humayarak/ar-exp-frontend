import { useEffect, useState } from "react";

export default function FaultsPage() {
  const [faults, setFaults] = useState([]);

  async function loadFaults() {
    const res = await fetch("/api/faults");
    const data = await res.json();
    setFaults(data);
  }

  useEffect(() => {
    loadFaults();
  }, []);

  return (
    <div>
      <h1>Fault Tracker</h1>

      {faults.map(fault => (
        <div key={fault.id}>
          {fault.type} - {fault.severity}
        </div>
      ))}
    </div>
  );
}