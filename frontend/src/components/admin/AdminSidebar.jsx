import { Home, ClipboardList, Gauge, Users, BarChart3, Clock, Settings, User, LogOut } from "./icons";

export default function AdminSidebar({
  sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu,
  counts, adminName, initials, onLogout, fetchRequests, fetchUsers,
}) {
  return (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div>
          <div className="brand-header">
            <h2 className="logo-main">UNIVERSITY</h2>
            <p className="logo-sub">ADMIN PANEL</p>
          </div>
          <ul className="menu">
            <li className={activeMenu === "dashboard" ? "active" : ""} onClick={() => { setActiveMenu("dashboard"); setSidebarOpen(false); }}>
              <span className="icon"><Home size={18} /></span> Dashboard
            </li>
            <li className={activeMenu === "requests" ? "active" : ""} onClick={() => { setActiveMenu("requests"); fetchRequests(); setSidebarOpen(false); }}>
              <span className="icon"><ClipboardList size={18} /></span> All Requests
              {counts.pending > 0 && <span className="badge">{counts.pending}</span>}
            </li>
            <li className={activeMenu === "absence" ? "active" : ""} onClick={() => { setActiveMenu("absence"); fetchRequests(); setSidebarOpen(false); }}>
              <span className="icon"><Gauge size={18} /></span> Absence Tracker
            </li>
            <li className={activeMenu === "users" ? "active" : ""} onClick={() => { setActiveMenu("users"); fetchUsers(); setSidebarOpen(false); }}>
              <span className="icon"><Users size={18} /></span> Manage Users
            </li>
            <li className={activeMenu === "analytics" ? "active" : ""} onClick={() => { setActiveMenu("analytics"); setSidebarOpen(false); }}>
              <span className="icon"><BarChart3 size={18} /></span> Analytics
            </li>
            <li className={activeMenu === "activity" ? "active" : ""} onClick={() => { setActiveMenu("activity"); setSidebarOpen(false); }}>
              <span className="icon"><Clock size={18} /></span> Activity Log
            </li>
            <li className={activeMenu === "settings" ? "active" : ""} onClick={() => { setActiveMenu("settings"); setSidebarOpen(false); }}>
              <span className="icon"><Settings size={18} /></span> Settings
            </li>
            <li className={activeMenu === "profile" ? "active" : ""} onClick={() => { setActiveMenu("profile"); setSidebarOpen(false); }}>
              <span className="icon"><User size={18} /></span> Profile
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}><span className="icon"><LogOut size={18} /></span> Logout</button>
          <div className="profile-tag">
            <div className="avatar-circle">{initials}</div>
            <div>
              <p className="profile-title">{adminName || "Admin"}</p>
              <p className="profile-sub">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
