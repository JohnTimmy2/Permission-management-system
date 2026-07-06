import {
  Calendar, Hourglass, CheckCircle2, XCircle, PartyPopper, Check, X,
  ClipboardList, RefreshCw, Search, ChevronLeft, ChevronRight, BarChart3, HelpCircle,
} from "./icons";
import StudentRequestGroup, { groupByStudent } from "./LecturerStudentGroup";

function DonutChart({ counts }) {
  const total = counts.total || 1;
  const accepted = counts.accepted;
  const pending = counts.pending;
  const rejected = counts.rejected;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const accAngle = (accepted / total) * circ;
  const pendAngle = (pending / total) * circ;
  const rejAngle = (rejected / total) * circ;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="16" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#10b981" strokeWidth="16"
        strokeDasharray={`${accAngle} ${circ}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f59e0b" strokeWidth="16"
        strokeDasharray={`${pendAngle} ${circ}`} strokeDashoffset={circ * 0.25 - accAngle} strokeLinecap="round" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f43f5e" strokeWidth="16"
        strokeDasharray={`${rejAngle} ${circ}`} strokeDashoffset={circ * 0.25 - accAngle - pendAngle} strokeLinecap="round" />
      <text x="70" y="65" textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">{counts.total}</text>
      <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">total</text>
    </svg>
  );
}

/* ===================== DASHBOARD ===================== */
export function LecturerOverviewView({
  counts, dashboardSort, setDashboardSort, dashboardPending,
  expandedStudent, setExpandedStudent, getAbsenceInfo,
  onAccept, onReject, setLightboxUrl, setActiveMenu, setStatusFilter, recentActivity,
}) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue"><Calendar size={22} /></div>
          <div><span className="stat-label">Total Requests</span><p className="stat-value">{counts.total}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-amber"><Hourglass size={22} /></div>
          <div><span className="stat-label">Pending</span><p className="stat-value text-amber">{counts.pending}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-emerald"><CheckCircle2 size={22} /></div>
          <div><span className="stat-label">Accepted</span><p className="stat-value text-emerald">{counts.accepted}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-rose"><XCircle size={22} /></div>
          <div><span className="stat-label">Rejected</span><p className="stat-value text-rose">{counts.rejected}</p></div>
        </div>
      </div>

      <div className="dash-two-col">
        <div className="requests-section">
          <div className="section-header-row">
            <div className="card-header-title">
              <span><Hourglass size={20} /></span>
              <h2>Pending Requests</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <select className="sort-select" value={dashboardSort} onChange={e => setDashboardSort(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              {counts.pending > 3 && (
                <button className="view-all-link" onClick={() => { setActiveMenu("requests"); setStatusFilter("pending"); }}>
                  View all {counts.pending} →
                </button>
              )}
            </div>
          </div>
          {dashboardPending.length > 0 ? (
            <div className="lec-request-list">
              {groupByStudent(dashboardPending).slice(0, 3).map((g) => (
                <StudentRequestGroup key={g.studentId}
                  studentName={g.studentName} studentId={g.studentId} groupName={g.groupName}
                  requests={g.requests}
                  isOpen={expandedStudent === g.studentId}
                  onToggle={() => setExpandedStudent(expandedStudent === g.studentId ? null : g.studentId)}
                  getAbsenceInfo={getAbsenceInfo}
                  onAccept={onAccept}
                  onReject={onReject}
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
            <div className="card-header-title" style={{ marginBottom: "20px" }}>
              <h2>Breakdown</h2>
            </div>
            <div className="donut-center"><DonutChart counts={counts} /></div>
            <div className="breakdown-legend">
              <div className="legend-row">
                <span><span className="legend-dot dot-green"></span>Accepted</span>
                <span className="legend-val text-emerald">{counts.accepted} ({counts.total ? Math.round(counts.accepted / counts.total * 100) : 0}%)</span>
              </div>
              <div className="legend-row">
                <span><span className="legend-dot dot-amber"></span>Pending</span>
                <span className="legend-val text-amber">{counts.pending} ({counts.total ? Math.round(counts.pending / counts.total * 100) : 0}%)</span>
              </div>
              <div className="legend-row">
                <span><span className="legend-dot dot-rose"></span>Rejected</span>
                <span className="legend-val text-rose">{counts.rejected} ({counts.total ? Math.round(counts.rejected / counts.total * 100) : 0}%)</span>
              </div>
            </div>
          </div>

          <div className="requests-section activity-card">
            <div className="card-header-title" style={{ marginBottom: "16px" }}><h2>Recent Activity</h2></div>
            {recentActivity.length > 0 ? (
              <div className="activity-list">
                {recentActivity.map(r => {
                  const isAcc = ["accepted", "accept", "approved"].includes(r.status?.toLowerCase());
                  return (
                    <div key={r.request_id} className="activity-row">
                      <div className={`activity-icon-badge ${isAcc ? "act-green" : "act-rose"}`}>
                        {isAcc ? <Check size={14} /> : <X size={14} />}
                      </div>
                      <div className="activity-meta">
                        <span className="activity-action">{isAcc ? "Accepted" : "Rejected"} — {r.student_name}</span>
                        <span className="activity-sub">{r.subject_name} · {r.created_at ? new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-log-state"><p>No activity yet.</p></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== ALL REQUESTS ===================== */
export function LecturerRequestsView({
  termTabs, searchTerm, setSearchTerm, statusFilter, setStatusFilter,
  activeGroup, setActiveGroup, setGroupPages, counts,
  paginatedRequests, expandedStudent, setExpandedStudent, getAbsenceInfo,
  onAccept, onReject, setLightboxUrl, setPage,
  currentPage, totalPages, allFiltered, ITEMS_PER_PAGE,
}) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="requests-section">
        <div className="section-header-row">
          <div className="card-header-title"><span><ClipboardList size={20} /></span><h2>All Student Requests</h2></div>
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
              <button key={s} className={`filter-pill ${s !== "all" ? `pill-${s}` : ""} ${statusFilter === s ? "active" : ""}`}
                onClick={() => { setStatusFilter(s); setPage(1); }}
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
          <button className={`group-tab ${activeGroup === "all" ? "group-tab-active" : ""}`}
            onClick={() => { setActiveGroup("all"); setGroupPages(p => ({ ...p, all: 1 })); }}>All Groups</button>
          {[1, 2, 3, 4].map(g => (
            <button key={g} className={`group-tab ${activeGroup === g ? "group-tab-active" : ""}`}
              onClick={() => { setActiveGroup(g); setGroupPages(p => ({ ...p, [g]: 1 })); }}>Group {g}</button>
          ))}
        </div>
        {paginatedRequests.length > 0 ? (
          <div className="lec-request-list">
            {groupByStudent(paginatedRequests).map((g) => (
              <StudentRequestGroup key={g.studentId}
                studentName={g.studentName} studentId={g.studentId} groupName={g.groupName}
                requests={g.requests}
                isOpen={expandedStudent === g.studentId}
                onToggle={() => setExpandedStudent(expandedStudent === g.studentId ? null : g.studentId)}
                getAbsenceInfo={getAbsenceInfo}
                onAccept={onAccept}
                onReject={onReject}
                onViewPhoto={(url) => setLightboxUrl(url)} />
            ))}
          </div>
        ) : (
          <div className="empty-log-state"><p>No requests match your filter.</p></div>
        )}
        {totalPages > 1 && (
          <div className="pagination-row">
            <span className="pagination-info">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, allFiltered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, allFiltered.length)} of {allFiltered.length} requests
            </span>
            <div className="pagination-btns">
              <button className="page-btn page-btn-nav" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <ChevronLeft size={14} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${p === currentPage ? "page-btn-active" : ""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-btn page-btn-nav" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== ABSENCE TRACKER ===================== */
export function LecturerAbsenceView({ termTabs, studentsAbsence, fetchRequests, ABSENCE_TOTAL_SESSIONS, ABSENCE_FAIL_THRESHOLD }) {
  const thresholdPercent = Math.round((ABSENCE_FAIL_THRESHOLD / ABSENCE_TOTAL_SESSIONS) * 100);
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="requests-section">
        <div className="section-header-row">
          <div className="card-header-title"><span><BarChart3 size={20} /></span><h2>Absence Tracker</h2></div>
          <button className="view-all-link" onClick={fetchRequests} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        {termTabs}
        <p className="lec-absence-note">
          Approved absences per subject, counted against the {thresholdPercent}% limit
          ({ABSENCE_FAIL_THRESHOLD - 1} of {ABSENCE_TOTAL_SESSIONS} sessions allowed).
          A student who reaches {ABSENCE_FAIL_THRESHOLD} approved absences has failed that class. Only students in your assigned classes are shown.
        </p>
        {studentsAbsence.length > 0 ? (
          <div className="lec-absence-list">
            {studentsAbsence.map((s) => (
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
          <div className="empty-log-state"><p>No students to track yet.</p></div>
        )}
      </div>
    </div>
  );
}

/* ===================== PROFILE ===================== */
export function LecturerProfileView({ lecturerName, initials, counts }) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="profile-container">
        <div className="profile-header-card">
          <div className="profile-banner">
            <div className="profile-banner-dots" />
          </div>
          <div className="profile-hero-body">
            <div className="profile-avatar-large">{initials}</div>
            <div className="profile-hero-text">
              <h1 className="profile-display-name">{lecturerName}</h1>
              <span className="student-badge">Lecturer</span>
            </div>
          </div>
          <div className="profile-stats-strip">
            <div className="profile-stat-item">
              <span className="profile-stat-num amber">{counts.pending}</span>
              <span className="profile-stat-label">Pending</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-num green">{counts.accepted}</span>
              <span className="profile-stat-label">Accepted</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-num rose">{counts.rejected}</span>
              <span className="profile-stat-label">Rejected</span>
            </div>
          </div>
        </div>
        <div className="profile-grid">
          <div className="info-card">
            <h3 className="info-card-title">Information</h3>
            <div className="info-row"><span>Full Name</span><strong>{lecturerName}</strong></div>
            <div className="info-row"><span>Role</span><strong>Lecturer</strong></div>
            <div className="info-row"><span>Total Handled</span><strong>{counts.accepted + counts.rejected}</strong></div>
          </div>
          <div className="info-card">
            <h3 className="info-card-title">Activity Summary</h3>
            <div className="info-row"><span>Pending Review</span><span className="val-amber">{counts.pending}</span></div>
            <div className="info-row"><span>Accepted</span><span className="val-green">{counts.accepted}</span></div>
            <div className="info-row"><span>Rejected</span><span className="val-rose">{counts.rejected}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== HELP & SUPPORT ===================== */
export function LecturerHelpView() {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="requests-section">
        <div className="card-header-title"><span><HelpCircle size={20} /></span><h2>Help & Support</h2></div>
        <div className="lec-help-grid">
          {[
            { q: "How do I accept a request?", a: "Go to Requests, find the student request and click the green Accept button. The student will be notified automatically." },
            { q: "Can I reject with a reason?", a: "Yes — clicking Reject opens a dialog where you must enter a reason. The student will see this reason alongside their rejected status." },
            { q: "Can I view the student's proof photo?", a: "Yes — if a student attached a photo, a 'View Proof Photo' button appears on the request card." },
            { q: "How do I find a specific student?", a: "Use the search bar on the Requests page. You can search by student name, student ID, or subject name." },
            { q: "Why do I only see some requests?", a: "You only see requests for the subjects and groups assigned to you. Requests for classes you don't teach are handled by their own lecturer." },
            { q: "Can I export request data?", a: "Yes — click the Export CSV button at the top of the Dashboard to download all requests as a spreadsheet." },
          ].map((item, i) => (
            <div key={i} className="lec-help-item">
              <strong>{item.q}</strong>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
