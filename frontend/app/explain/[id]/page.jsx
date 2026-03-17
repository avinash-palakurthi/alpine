"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ExplainPage() {
  const { id } = useParams();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/explain/${id}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, [id]);

  if (!data) return <p style={{ padding: 20 }}>Loading...</p>;

  const exp = data.explanation;
  const row = data.data;

  return (
    <div style={{ padding: 20 }}>
      <h1>Explanation</h1>

      <p>
        <strong>Product:</strong> {row.product}
      </p>

      <p>
        <strong>CBAM:</strong> {exp.cbam.status ? "Yes" : "No"}
      </p>
      <p>{exp.cbam.reason}</p>

      <p>
        <strong>Cost:</strong> €{exp.cost.total}
      </p>
      <p>{exp.cost.formula}</p>

      <p>
        <strong>Risk:</strong> {exp.risk.level}
      </p>

      <ul>
        {exp.risk.reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      <p>
        <strong>AI Insight:</strong> {exp.ai_insight}
      </p>

      <br />

      <button onClick={() => window.history.back()}>← Back</button>
    </div>
  );
}
