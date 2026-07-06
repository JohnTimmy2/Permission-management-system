import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "./icons";

// Click-to-pick calendar (no typing). `value` is an array of "YYYY-MM-DD" strings.
// multiple=true lets the student pick several separate days. Past dates are blocked.
export default function CalendarPicker({ value, onChange, multiple = true }) {
  const dates = value || [];
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(dates[0] ? new Date(dates[0] + "T00:00:00") : new Date());

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const now = new Date();
  const todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate());

  const fmt = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const displayLabel = dates.length === 0
    ? (multiple ? "Select one or more dates" : "Select a date")
    : dates.length === 1
      ? fmt(dates[0])
      : `${dates.length} dates selected`;

  const pick = (d) => {
    const iso = toISO(year, month, d);
    if (iso < todayISO) return;
    if (multiple) {
      if (dates.includes(iso)) {
        onChange(dates.filter((v) => v !== iso));
      } else {
        onChange([...dates, iso].sort());
      }
    } else {
      onChange([iso]);
      setOpen(false);
    }
  };

  return (
    <div className="calendar-picker">
      <button type="button" className={`calendar-trigger ${dates.length ? "has-value" : ""}`} onClick={() => setOpen((o) => !o)}>
        <span>{displayLabel}</span>
        <span className="calendar-trigger-icon"><Calendar size={16} /></span>
      </button>
      {open && (
        <>
          <div className="calendar-backdrop" onClick={() => setOpen(false)} />
          <div className="calendar-popup">
            <div className="calendar-head">
              <button type="button" className="calendar-nav" onClick={() => setViewDate(new Date(year, month - 1, 1))}><ChevronLeft size={16} /></button>
              <span className="calendar-month-label">{months[month]} {year}</span>
              <button type="button" className="calendar-nav" onClick={() => setViewDate(new Date(year, month + 1, 1))}><ChevronRight size={16} /></button>
            </div>
            <div className="calendar-weekdays">
              {weekdays.map((w) => <span key={w}>{w}</span>)}
            </div>
            <div className="calendar-grid">
              {cells.map((d, i) => {
                if (d === null) return <span key={i} className="calendar-cell empty" />;
                const iso = toISO(year, month, d);
                const isPast = iso < todayISO;
                return (
                  <button
                    type="button"
                    key={i}
                    disabled={isPast}
                    className={`calendar-cell ${dates.includes(iso) ? "selected" : ""} ${iso === todayISO ? "today" : ""} ${isPast ? "disabled" : ""}`}
                    onClick={() => pick(d)}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            {multiple && (
              <div className="calendar-footer">
                <span className="calendar-count">{dates.length} selected</span>
                <button type="button" className="calendar-done-btn" onClick={() => setOpen(false)}>Done</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
