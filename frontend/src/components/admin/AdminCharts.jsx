export function DonutChart({ counts }) {
  const total = counts.total || 1;
  const r = 54, circ = 2 * Math.PI * r;
  const acc = (counts.accepted / total) * circ;
  const pend = (counts.pending / total) * circ;
  const rej = (counts.rejected / total) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="16" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray={`${acc} ${circ}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray={`${pend} ${circ}`} strokeDashoffset={circ * 0.25 - acc} strokeLinecap="round" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f43f5e" strokeWidth="16" strokeDasharray={`${rej} ${circ}`} strokeDashoffset={circ * 0.25 - acc - pend} strokeLinecap="round" />
      <text x="70" y="65" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">{counts.total}</text>
      <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">total</text>
    </svg>
  );
}

export function GroupBarChart({ requests, groupNames }) {
  const data = groupNames.map(g => ({
    label: g.replace("SE Group ", "G"),
    value: requests.filter(r => r.group_name === g).length,
  }));
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = 48, gap = 32, chartH = 160;
  return (
    <svg width="100%" height={chartH + 40} viewBox={`0 0 ${data.length * (barW + gap)} ${chartH + 40}`} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const h = (d.value / max) * chartH;
        const x = i * (barW + gap) + gap / 2;
        return (
          <g key={i}>
            <rect x={x} y={chartH - h} width={barW} height={h} rx="8" fill="#3b82f6" opacity={d.value ? 1 : 0.25} />
            <text x={x + barW / 2} y={chartH - h - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">{d.value}</text>
            <text x={x + barW / 2} y={chartH + 24} textAnchor="middle" fontSize="13" fontWeight="600" fill="#94a3b8">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function StatusBarChart({ counts }) {
  const data = [
    { label: "Pending", value: counts.pending, color: "#f59e0b" },
    { label: "Accepted", value: counts.accepted, color: "#10b981" },
    { label: "Rejected", value: counts.rejected, color: "#f43f5e" },
  ];
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="hbar-chart">
      {data.map((d, i) => (
        <div key={i} className="hbar-row">
          <span className="hbar-label">{d.label}</span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${(d.value / max) * 100}%`, background: d.color }} />
          </div>
          <span className="hbar-value">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
