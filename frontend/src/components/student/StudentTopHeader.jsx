import { Menu, Hand, Bell } from "./icons";

export default function StudentTopHeader({
  activeMenu, setSidebarOpen, studentName, unviewedCount, setActiveMenu, syncLogs,
}) {
  return (
    <div className="top-header">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div>
          <h1>
            {activeMenu === "dashboard" ? `Welcome back, ${studentName || "Student"}`
              : activeMenu === "profile" ? "Your Profile"
              : activeMenu === "help" ? "Help & Support"
              : activeMenu === "attendance" ? "Absence Tracker"
              : "Your Requests Log"}
          </h1>
          {activeMenu === "help" ? (
            <p className="help-subtitle">Find answers to common questions or contact our support team.</p>
          ) : (
            <p style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Hand size={16} color="#f59e0b" /> Group: <span>{localStorage.getItem("group_name") || "Group 1"}</span>
            </p>
          )}
        </div>
      </div>
      <button className="notif-bell" onClick={() => { setActiveMenu("notifications"); syncLogs(true); }}>
        <Bell size={20} />{unviewedCount > 0 && <span className="bell-dot"></span>}
      </button>
    </div>
  );
}
