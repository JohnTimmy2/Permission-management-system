import { Menu, Hand, Bell } from "./icons";

export default function AdminTopHeader({
  activeMenu, setActiveMenu, setSidebarOpen, adminName, counts,
  onExportCSV, onAddUser, fetchRequests, absenceThresholdPercent,
}) {
  return (
    <div className="top-header">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div>
          <h1>
            {activeMenu === "dashboard" && (
              <>
                Welcome back, {adminName || "Admin"}{" "}
                <Hand size={22} color="#f59e0b" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "4px" }} />
              </>
            )}
            {activeMenu === "requests" && "All Student Requests"}
            {activeMenu === "absence" && "Absence Tracker"}
            {activeMenu === "users" && "Manage Users"}
            {activeMenu === "analytics" && "Analytics"}
            {activeMenu === "activity" && "Activity Log"}
            {activeMenu === "settings" && "Settings"}
            {activeMenu === "profile" && "Your Profile"}
          </h1>
          <p>
            {activeMenu === "dashboard" && <span>Admin Dashboard</span>}
            {activeMenu === "requests" && <span>Manage all permission requests</span>}
            {activeMenu === "absence" && <span>Track all students against the {absenceThresholdPercent}% limit</span>}
            {activeMenu === "users" && <span>Students, lecturers & admins</span>}
            {activeMenu === "analytics" && <span>System insights</span>}
            {activeMenu === "activity" && <span>Recent decisions</span>}
            {activeMenu === "settings" && <span>Admin preferences</span>}
            {activeMenu === "profile" && <span>Administrator</span>}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {activeMenu === "dashboard" && <button className="export-csv-btn" onClick={onExportCSV}>Export CSV</button>}
        {activeMenu === "users" && <button className="export-csv-btn" onClick={onAddUser}>+ Add User</button>}
        <button className="notif-bell" onClick={() => { setActiveMenu("requests"); fetchRequests(); }}>
          <Bell size={20} />{counts.pending > 0 && <span className="bell-dot"></span>}
        </button>
      </div>
    </div>
  );
}
