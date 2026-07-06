import { Menu, Hand, Bell } from "./icons";

export default function LecturerTopHeader({
  activeMenu, setSidebarOpen, lecturerName, counts, onExportCSV, setActiveMenu, fetchRequests,
  absenceThresholdPercent,
}) {
  return (
    <div className="top-header">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div className="header-title-block">
          <h1>
            {activeMenu === "dashboard" ? (
              <>
                Welcome back, {lecturerName || "Lecturer"}{" "}
                <Hand size={22} color="#f59e0b" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "4px" }} />
              </>
            )
              : activeMenu === "requests" ? "Student Requests"
              : activeMenu === "absence" ? "Absence Tracker"
              : activeMenu === "profile" ? "Your Profile"
              : "Help & Support"}
          </h1>
          <p className={activeMenu === "help" ? "help-subtitle" : ""}>
            {activeMenu === "dashboard" && <span>Lecturer Dashboard</span>}
            {activeMenu === "requests" && <span>Review and respond to student requests</span>}
            {activeMenu === "absence" && <span>Track student absences against the {absenceThresholdPercent}% limit</span>}
            {activeMenu === "profile" && <span>Lecturer</span>}
            {activeMenu === "help" && "Find answers to common questions"}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {activeMenu === "dashboard" && (
          <button className="export-csv-btn" onClick={onExportCSV}>Export CSV</button>
        )}
        <button className="notif-bell" onClick={() => { setActiveMenu("requests"); fetchRequests(); }}>
          <Bell size={20} />{counts.pending > 0 && <span className="bell-dot"></span>}
        </button>
      </div>
    </div>
  );
}
