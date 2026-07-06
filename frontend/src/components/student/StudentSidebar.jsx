import { Home, ClipboardList, BarChart3, Bell, User, HelpCircle, LogOut } from "./icons";

export default function StudentSidebar({
  sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu,
  unviewedCount, studentName, initials, onLogout, syncLogs,
}) {
  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div>
          <div className="brand-header">
            <h2 className="logo-main">UNIVERSITY</h2>
            <p className="logo-sub">PERMISSION SYSTEM</p>
          </div>
          <ul className="menu">
            <li className={activeMenu === "dashboard" ? "active" : ""} onClick={() => { setActiveMenu("dashboard"); setSidebarOpen(false); }}>
              <span className="icon"><Home size={18} /></span> Dashboard
            </li>
            <li className={activeMenu === "view-status" ? "active" : ""} onClick={() => { setActiveMenu("view-status"); syncLogs(); setSidebarOpen(false); }}>
              <span className="icon"><ClipboardList size={18} /></span> View Status
            </li>
            <li className={activeMenu === "attendance" ? "active" : ""} onClick={() => { setActiveMenu("attendance"); syncLogs(true); setSidebarOpen(false); }}>
              <span className="icon"><BarChart3 size={18} /></span> Absence Tracker
            </li>
            <li className={activeMenu === "notifications" ? "active" : ""} onClick={() => { setActiveMenu("notifications"); syncLogs(true); setSidebarOpen(false); }}>
              <span className="icon"><Bell size={18} /></span> Notifications <span className="badge">{unviewedCount}</span>
            </li>
            <li className={activeMenu === "profile" ? "active" : ""} onClick={() => { setActiveMenu("profile"); setSidebarOpen(false); }}>
              <span className="icon"><User size={18} /></span> Profile
            </li>
            <li className={activeMenu === "help" ? "active" : ""} onClick={() => { setActiveMenu("help"); setSidebarOpen(false); }}>
              <span className="icon"><HelpCircle size={18} /></span> Help & Support
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}><span className="icon"><LogOut size={18} /></span> Logout</button>
          <div className="profile-tag">
            <div className="avatar-circle">{initials}</div>
            <div>
              <p className="profile-title">{studentName || "Student"}</p>
              <p className="profile-sub">{localStorage.getItem("group_name") || "Group 1"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
