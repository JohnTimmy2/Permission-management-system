import {
  Calendar, Hourglass, CheckCircle2, XCircle, PartyPopper, Check, X,
  ClipboardList, RefreshCw, Search, Gauge, Users, GraduationCap, Presentation,
  Shield, Pencil, Trash2, BarChart3, TrendingUp, Settings, Clock,
} from "./icons";
import AdminStudentGroup, { groupByStudent } from "./AdminStudentGroup";
import { DonutChart, GroupBarChart, StatusBarChart } from "./AdminCharts";

/* ===================== DASHBOARD ===================== */
export function AdminOverviewView({
  counts, dashboardPending, expandedStudent, toggleStudent, getAbsenceInfo,
  onAccept, onReject, onDelete, setLightboxUrl, setActiveMenu, setStatusFilter,
  recentActivity,
}) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon bg-blue"><Calendar size={22} /></div><div><span className="stat-label">Total Requests</span><p className="stat-value">{counts.total}</p></div></div>
        <div className="stat-card"><div className="stat-icon bg-amber"><Hourglass size={22} /></div><div><span className="stat-label">Pending</span><p className="stat-value text-amber">{counts.pending}</p></div></div>
        <div className="stat-card"><div className="stat-icon bg-emerald"><CheckCircle2 size={22} /></div><div><span className="stat-label">Accepted</span><p className="stat-value text-emerald">{counts.accepted}</p></div></div>
        <div className="stat-card"><div className="stat-icon bg-rose"><XCircle size={22} /></div><div><span className="stat-label">Rejected</span><p className="stat-value text-rose">{counts.rejected}</p></div></div>
      </div>

      <div className="dash-two-col">
        <div className="requests-section">
          <div className="section-header-row">
            <div className="card-header-title"><span><Hourglass size={20} /></span><h2>Pending Requests</h2></div>
            {counts.pending > 3 && <button className="view-all-link" onClick={() => { setActiveMenu("requests"); setStatusFilter("pending"); }}>View all {counts.pending} →</button>}
          </div>
          {dashboardPending.length > 0 ? (
            <div className="lec-request-list">
              {groupByStudent(dashboardPending).slice(0, 3).map(g => (
                <AdminStudentGroup key={g.studentId}
                  studentName={g.studentName} studentId={g.studentId} groupName={g.groupName}
                  requests={g.requests}
                  isOpen={expandedStudent === g.studentId}
                  onToggle={() => toggleStudent(g.studentId)}
                  getAbsenceInfo={getAbsenceInfo}
                  onAccept={onAccept}
                  onReject={onReject}
                  onDelete={onDelete}
                  onViewPhoto={(url) => setLightboxUrl(url)} />
              ))}
            </div>
          ) : (
            <div className="empty-log-state">
              <p style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <PartyPopper size={16} /> No pending requests right now.
              </p>
            </div>
          )}
        </div>

        <div className="dash-right-col">
          <div className="requests-section breakdown-card">
            <div className="card-header-title" style={{ marginBottom: "20px" }}><h2>Breakdown</h2></div>
            <div className="donut-center"><DonutChart counts={counts} /></div>
            <div className="breakdown-legend">
              <div className="legend-row"><span><span className="legend-dot dot-green"></span>Accepted</span><span className="legend-val text-emerald">{counts.accepted}</span></div>
              <div className="legend-row"><span><span className="legend-dot dot-amber"></span>Pending</span><span className="legend-val text-amber">{counts.pending}</span></div>
              <div className="legend-row"><span><span className="legend-dot dot-rose"></span>Rejected</span><span className="legend-val text-rose">{counts.rejected}</span></div>
            </div>
          </div>
          <div className="requests-section activity-card">
            <div className="card-header-title" style={{ marginBottom: "16px" }}><h2>Recent Activity</h2></div>
            {recentActivity.length > 0 ? (
              <div className="activity-list">
                {recentActivity.slice(0, 5).map(r => {
                  const isAcc = ["accepted", "accept", "approved"].includes(r.status?.toLowerCase());
                  return (
                    <div key={r.request_id} className="activity-row">
                      <div className={`activity-icon-badge ${isAcc ? "act-green" : "act-rose"}`}>
                        {isAcc ? <Check size={14} /> : <X size={14} />}
                      </div>
                      <div className="activity-meta">
                        <span className="activity-action">{isAcc ? "Accepted" : "Rejected"} — {r.student_name}</span>
                        <span className="activity-sub">{r.subject_name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="empty-log-state"><p>No activity yet.</p></div>}
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== ALL REQUESTS ===================== */
export function AdminRequestsView({
  termTabs, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
  activeGroup, setActiveGroup, counts, requestGroups, expandedStudent, toggleStudent,
  getAbsenceInfo, onAccept, onReject, onDelete, setLightboxUrl, fetchRequests,
}) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="requests-section">
        <div className="section-header-row">
          <div className="card-header-title"><span><ClipboardList size={20} /></span><h2>All Student Requests</h2></div>
          <button className="view-all-link" onClick={fetchRequests} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        {termTabs}

        <div className="view-dashboard-bar">
          <div className="search-input-wrapper">
            <span className="search-icon"><Search size={16} /></span>
            <input type="text" placeholder="Search by name, ID or subject..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            {searchTerm && (
              <button className="search-fetch-btn" onClick={() => setSearchTerm("")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <X size={12} /> Clear
              </button>
            )}
          </div>
          <div className="filter-pill-container">
            {["all", "pending", "accepted", "rejected"].map(s => (
              <button key={s} className={`filter-pill ${s !== "all" ? `pill-${s}` : ""} ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}
                style={s !== "all" ? { display: "inline-flex", alignItems: "center", gap: "6px" } : {}}>
                {s === "all" && `All (${counts.total})`}
                {s === "pending" && (<><Hourglass size={14} /> Pending ({counts.pending})</>)}
                {s === "accepted" && (<><CheckCircle2 size={14} /> Accepted ({counts.accepted})</>)}
                {s === "rejected" && (<><XCircle size={14} /> Rejected ({counts.rejected})</>)}
              </button>
            ))}
          </div>
        </div>

        <div className="group-tabs">
          <button className={`group-tab ${activeGroup === "all" ? "group-tab-active" : ""}`} onClick={() => setActiveGroup("all")}>All Groups</button>
          {[1, 2, 3, 4].map(g => (
            <button key={g} className={`group-tab ${activeGroup === g ? "group-tab-active" : ""}`} onClick={() => setActiveGroup(g)}>Group {g}</button>
          ))}
        </div>

        {requestGroups.length > 0 ? (
          <div className="lec-request-list">
            {requestGroups.map(g => (
              <AdminStudentGroup key={g.studentId}
                studentName={g.studentName} studentId={g.studentId} groupName={g.groupName}
                requests={g.requests}
                isOpen={expandedStudent === g.studentId}
                onToggle={() => toggleStudent(g.studentId)}
                getAbsenceInfo={getAbsenceInfo}
                onAccept={onAccept}
                onReject={onReject}
                onDelete={onDelete}
                onViewPhoto={(url) => setLightboxUrl(url)} />
            ))}
          </div>
        ) : <div className="empty-log-state"><p>No requests match your filter.</p></div>}
      </div>
    </div>
  );
}

/* ===================== ABSENCE TRACKER ===================== */
export function AdminAbsenceView({
  termTabs, absenceGroup, setAbsenceGroup, visibleAbsence, ABSENCE_TOTAL_SESSIONS, ABSENCE_FAIL_THRESHOLD, fetchRequests,
}) {
  const thresholdPercent = Math.round((ABSENCE_FAIL_THRESHOLD / ABSENCE_TOTAL_SESSIONS) * 100);
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="requests-section">
        <div className="section-header-row">
          <div className="card-header-title"><span><Gauge size={20} /></span><h2>Absence Tracker</h2></div>
          <button className="view-all-link" onClick={fetchRequests} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        {termTabs}
        <p className="lec-absence-note">
          Approved absences per subject, counted against the {thresholdPercent}% limit
          ({ABSENCE_FAIL_THRESHOLD - 1} of {ABSENCE_TOTAL_SESSIONS} sessions allowed).
          A student who reaches {ABSENCE_FAIL_THRESHOLD} approved absences has failed that class.
        </p>
        <div className="group-tabs">
          <button className={`group-tab ${absenceGroup === "all" ? "group-tab-active" : ""}`} onClick={() => setAbsenceGroup("all")}>All Groups</button>
          {[1, 2, 3, 4].map(g => (
            <button key={g} className={`group-tab ${absenceGroup === g ? "group-tab-active" : ""}`} onClick={() => setAbsenceGroup(g)}>Group {g}</button>
          ))}
        </div>
        {visibleAbsence.length > 0 ? (
          <div className="lec-absence-list">
            {visibleAbsence.map((s) => (
              <div key={s.studentId} className="lec-absence-student">
                <div className="lec-absence-student-head">
                  <div className="lec-student-meta">
                    <div className="lec-avatar">{s.studentName?.[0]?.toUpperCase() || "?"}</div>
                    <div>
                      <strong className="lec-student-name">{s.studentName}</strong>
                      <span className="lec-student-sub">ID: {s.studentId} · {s.groupName}</span>
                    </div>
                  </div>
                </div>
                <div className="lec-absence-subjects">
                  {s.subjects.map((sub) => (
                    <div key={sub.subject} className="lec-absence-subject-row">
                      <span className="lec-absence-subject-name">{sub.subject}</span>
                      <div className="lec-absence-bar-track">
                        <div className={`lec-absence-bar-fill fill-${sub.status}`} style={{ width: `${Math.min(sub.percent, 100)}%` }} />
                        <div className="lec-absence-bar-mark" style={{ left: `${thresholdPercent}%` }} />
                      </div>
                      <span className={`lec-absence-badge ${sub.status}`}>
                        {sub.approved}/{sub.total} ({sub.percent}%)
                        {sub.status === "over" && <span className="lec-absence-tag"> · Failed</span>}
                        {sub.status === "near" && <span className="lec-absence-tag"> · Near</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-log-state"><p>No students to track in this group yet.</p></div>
        )}
      </div>
    </div>
  );
}

/* ===================== MANAGE USERS ===================== */
function roleBadgeClass(role) {
  const r = role?.toLowerCase();
  if (r === "admin") return "role-admin";
  if (r === "lecturer") return "role-lecturer";
  return "role-student";
}

export function AdminUsersView({
  userCounts, userSearch, setUserSearch, userRoleFilter, setUserRoleFilter,
  filteredUsers, users, openEditUser, setDeleteUserId,
}) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon bg-blue"><Users size={22} /></div><div><span className="stat-label">Total Users</span><p className="stat-value">{userCounts.total}</p></div></div>
        <div className="stat-card"><div className="stat-icon bg-emerald"><GraduationCap size={22} /></div><div><span className="stat-label">Students</span><p className="stat-value text-emerald">{userCounts.students}</p></div></div>
        <div className="stat-card"><div className="stat-icon bg-amber"><Presentation size={22} /></div><div><span className="stat-label">Lecturers</span><p className="stat-value text-amber">{userCounts.lecturers}</p></div></div>
        <div className="stat-card"><div className="stat-icon bg-rose"><Shield size={22} /></div><div><span className="stat-label">Admins</span><p className="stat-value text-rose">{userCounts.admins}</p></div></div>
      </div>

      <div className="single-column-workspace">
        <div className="requests-section">
          <div className="section-header-row">
            <div className="card-header-title"><span><Users size={20} /></span><h2>All Users</h2></div>
          </div>

          <div className="view-dashboard-bar">
            <div className="search-input-wrapper">
              <span className="search-icon"><Search size={16} /></span>
              <input type="text" placeholder="Search by name or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              {userSearch && (
                <button className="search-fetch-btn" onClick={() => setUserSearch("")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <div className="filter-pill-container">
              {["all", "student", "lecturer", "admin"].map(r => (
                <button key={r} className={`filter-pill ${userRoleFilter === r ? "active" : ""}`} onClick={() => setUserRoleFilter(r)}>
                  {r === "all" ? `All (${userCounts.total})` : r.charAt(0).toUpperCase() + r.slice(1) + "s"}
                </button>
              ))}
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="user-table">
              <div className="user-table-head">
                <span>User</span><span>Email</span><span>Role</span><span>Group</span><span>Actions</span>
              </div>
              {filteredUsers.map(u => (
                <div key={u.user_id} className="user-row">
                  <div className="user-cell user-name-cell">
                    <div className="user-avatar">{u.name?.[0]?.toUpperCase() || "?"}</div>
                    <div>
                      <strong>{u.name}</strong>
                      <span className="user-id-sub">ID: {u.user_id}</span>
                    </div>
                  </div>
                  <div className="user-cell user-email">{u.email}</div>
                  <div className="user-cell"><span className={`role-pill ${roleBadgeClass(u.role)}`}>{u.role}</span></div>
                  <div className="user-cell user-group">{u.role?.toLowerCase() === "student" ? (u.group_name || "—") : "—"}</div>
                  <div className="user-cell user-actions">
                    <button className="user-edit-btn" onClick={() => openEditUser(u)} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button className="user-delete-btn" onClick={() => setDeleteUserId(u.user_id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-log-state">
              <p>{users.length === 0 ? "No users loaded. Make sure the /users endpoint exists on your backend." : "No users match your filter."}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ===================== ANALYTICS ===================== */
export function AdminAnalyticsView({ requests, groupNames, counts }) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="analytics-grid">
        <div className="requests-section">
          <div className="card-header-title"><span><BarChart3 size={20} /></span><h2>Requests by Group</h2></div>
          <GroupBarChart requests={requests} groupNames={groupNames} />
        </div>
        <div className="requests-section">
          <div className="card-header-title"><span><TrendingUp size={20} /></span><h2>Status Overview</h2></div>
          <StatusBarChart counts={counts} />
          <div className="analytics-summary">
            <div className="summary-item"><span className="summary-num">{counts.total ? Math.round(counts.accepted / counts.total * 100) : 0}%</span><span className="summary-label">Acceptance Rate</span></div>
            <div className="summary-item"><span className="summary-num">{counts.total}</span><span className="summary-label">Total Processed</span></div>
            <div className="summary-item"><span className="summary-num">{counts.pending}</span><span className="summary-label">Awaiting Review</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== ACTIVITY LOG ===================== */
export function AdminActivityView({ activityLog, fetchRequests }) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="requests-section">
        <div className="section-header-row">
          <div className="card-header-title"><span><Clock size={20} /></span><h2>Decision Activity Log</h2></div>
          <button className="view-all-link" onClick={fetchRequests} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        {activityLog.length > 0 ? (
          <div className="timeline">
            {activityLog.map(r => {
              const isAcc = ["accepted", "accept", "approved"].includes(r.status?.toLowerCase());
              return (
                <div key={r.request_id} className="timeline-row">
                  <div className={`timeline-dot ${isAcc ? "tl-green" : "tl-rose"}`}>
                    {isAcc ? <Check size={14} /> : <X size={14} />}
                  </div>
                  <div className="timeline-body">
                    <div className="timeline-top">
                      <strong>{r.student_name}</strong>
                      <span className={`lec-status-pill ${isAcc ? "accepted" : "rejected"}`}>{r.status}</span>
                    </div>
                    <span className="timeline-sub">{r.subject_name} · {r.group_name} · {r.class_time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <div className="empty-log-state"><p>No decisions logged yet.</p></div>}
      </div>
    </div>
  );
}

/* ===================== SETTINGS ===================== */
function SettingToggle({ label, desc, on, onToggle }) {
  return (
    <div className="setting-item">
      <div className="setting-text">
        <strong>{label}</strong>
        <span>{desc}</span>
      </div>
      <button className={`toggle-switch ${on ? "toggle-on" : ""}`} onClick={onToggle}>
        <span className="toggle-knob" />
      </button>
    </div>
  );
}

export function AdminSettingsView({ settings, setSettings }) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="requests-section" style={{ maxWidth: "640px" }}>
        <div className="card-header-title"><span><Settings size={20} /></span><h2>Admin Preferences</h2></div>
        <div className="settings-list">
          <SettingToggle label="Auto-refresh requests" desc="Reload requests every 30 seconds automatically."
            on={settings.autoRefresh} onToggle={() => setSettings(s => ({ ...s, autoRefresh: !s.autoRefresh }))} />
          <SettingToggle label="Compact request cards" desc="Show denser cards to fit more on screen."
            on={settings.compactCards} onToggle={() => setSettings(s => ({ ...s, compactCards: !s.compactCards }))} />
          <SettingToggle label="Confirm before actions" desc="Ask for confirmation on delete actions."
            on={settings.confirmActions} onToggle={() => setSettings(s => ({ ...s, confirmActions: !s.confirmActions }))} />
        </div>
        <p className="settings-note">Preferences are saved on this device.</p>
      </div>
    </div>
  );
}

/* ===================== PROFILE ===================== */
export function AdminProfileView({ adminName, initials, counts, userCounts }) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="profile-container">
        <div className="profile-header-card">
          <div className="profile-banner"><div className="profile-banner-dots" /></div>
          <div className="profile-hero-body">
            <div className="profile-avatar-large">{initials}</div>
            <div className="profile-hero-text">
              <h1 className="profile-display-name">{adminName}</h1>
              <span className="student-badge">Administrator</span>
            </div>
          </div>
          <div className="profile-stats-strip">
            <div className="profile-stat-item"><span className="profile-stat-num">{counts.total}</span><span className="profile-stat-label">Requests</span></div>
            <div className="profile-stat-item"><span className="profile-stat-num">{userCounts.total}</span><span className="profile-stat-label">Users</span></div>
            <div className="profile-stat-item"><span className="profile-stat-num green">{counts.accepted}</span><span className="profile-stat-label">Accepted</span></div>
            <div className="profile-stat-item"><span className="profile-stat-num rose">{counts.rejected}</span><span className="profile-stat-label">Rejected</span></div>
          </div>
        </div>
        <div className="profile-grid">
          <div className="info-card">
            <h3 className="info-card-title">Information</h3>
            <div className="info-row"><span>Full Name</span><strong>{adminName}</strong></div>
            <div className="info-row"><span>Role</span><strong>Administrator</strong></div>
            <div className="info-row"><span>Users Managed</span><strong>{userCounts.total}</strong></div>
          </div>
          <div className="info-card">
            <h3 className="info-card-title">System Summary</h3>
            <div className="info-row"><span>Pending Review</span><span className="val-amber">{counts.pending}</span></div>
            <div className="info-row"><span>Accepted</span><span className="val-green">{counts.accepted}</span></div>
            <div className="info-row"><span>Rejected</span><span className="val-rose">{counts.rejected}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
