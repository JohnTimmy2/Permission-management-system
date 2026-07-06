import {
  Calendar, Clock, CheckCircle2, XCircle, Hourglass, Pencil, FileText,
  Rocket, Sparkles, FolderOpen, RefreshCw, Search, BookOpen, BarChart3, Bell,
  ImageIcon, PartyPopper, ChevronUp, ChevronDown, ChevronRight,
  Trash2, AlertTriangle, Lock, Mail, MessageSquare, Shield, Ticket,
  Headphones, User, HelpCircle,
} from "./icons";
import CalendarPicker from "./CalendarPicker";

/* ===================== DASHBOARD (new request form) ===================== */
export function StudentOverviewView({
  counts, editingRequestId, studentId, studentName, selectedSubjects, setIsMatrixOpen,
  reason, setReason, selectedDates, setSelectedDates, imagePreview, handleFileChange,
  handleSubmit, resetForm,
}) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue"><Calendar size={22} /></div>
          <div>
            <span className="stat-label">Total Requests</span>
            <p className="stat-value">{counts.total}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-amber"><Hourglass size={22} /></div>
          <div>
            <span className="stat-label">Pending</span>
            <p className="stat-value text-amber">{counts.pending}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-emerald"><CheckCircle2 size={22} /></div>
          <div>
            <span className="stat-label">Approved</span>
            <p className="stat-value text-emerald">{counts.approved}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-rose"><XCircle size={22} /></div>
          <div>
            <span className="stat-label">Rejected</span>
            <p className="stat-value text-rose">{counts.rejected}</p>
          </div>
        </div>
      </div>

      <div className="single-column-workspace">
        <div className="form-card">
          <div className="card-header-title">
            <span>{editingRequestId ? <Pencil size={20} /> : <FileText size={20} />}</span>
            <h2>{editingRequestId ? "Edit Permission Request" : "New Permission Request"}</h2>
          </div>
          <div className="form-fields">
            <div className="input-block">
              <label>Student ID</label>
              <input type="text" value={studentId} disabled style={{ background: "#f3f4f6", cursor: "not-allowed" }} />
            </div>
            <div className="input-block">
              <label>Student Name</label>
              <input type="text" value={studentName} disabled style={{ background: "#f3f4f6", cursor: "not-allowed" }} />
            </div>
            <div className="input-block">
              <label>Select Classes {editingRequestId ? "(Single Swap Mode)" : "(Multi-Select)"}</label>
              <button type="button" className="matrix-trigger-btn" onClick={() => setIsMatrixOpen(true)}>
                <span className={selectedSubjects.length > 0 ? "filled-text" : "placeholder-text"}>
                  {selectedSubjects.length > 0 ? `Selected: ${selectedSubjects.join(", ")}` : "Choose classes..."}
                </span>
                <span className="arrow-indicator"><ChevronRight size={16} /></span>
              </button>
            </div>
            <div className="input-block">
              <label>Reason</label>
              <textarea placeholder="Enter reason for request" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <div className="input-block">
              <label>{editingRequestId ? "Date" : "Date(s) — pick one or more"}</label>
              <CalendarPicker value={selectedDates} onChange={setSelectedDates} multiple={!editingRequestId} />
            </div>
            <div className="input-block">
              <label>Upload Photo Proof(OPTIONAL)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="file-uploader-input" />
              {imagePreview && (
                <div className="image-preview-box">
                  <img src={imagePreview} alt="Proof preview" />
                </div>
              )}
            </div>
            <div className="form-action-buttons">
              <button className="submit-btn" onClick={handleSubmit} style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                {editingRequestId ? (<>Save Changes <Sparkles size={16} /></>) : (<>Submit All Requests <Rocket size={16} /></>)}
              </button>
              {editingRequestId && (
                <button className="cancel-edit-btn" onClick={resetForm}>Cancel Edit</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== VIEW STATUS ===================== */
export function StudentViewStatusView({
  termTabs, syncLogs, counts, statusFilter, setStatusFilter,
  searchDashboardId, setSearchDashboardId, activeDay, setActiveDay,
  getRequestsForDay, handleEditClick, setProofLightboxUrl, setProofLightboxMeta,
}) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="page-term-tabs">{termTabs}</div>
      <div className="requests-section">
        <div className="section-header-row">
          <div className="card-header-title">
            <span><FolderOpen size={20} /></span>
            <h2>Your Requests Logs</h2>
          </div>
          <button className="view-all-link" onClick={syncLogs} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={14} /> Refresh Logs
          </button>
        </div>
        <div className="view-dashboard-bar">
          <div className="search-input-wrapper">
            <span className="search-icon"><Search size={16} /></span>
            <input type="text" placeholder="Enter student ID to view dashboard logs..." value={searchDashboardId} onChange={(e) => setSearchDashboardId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && syncLogs()} />
            <button className="search-fetch-btn" onClick={syncLogs}>View Logs</button>
          </div>
          <div className="filter-pill-container">
            <button className={`filter-pill ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>All ({counts.total})</button>
            <button className={`filter-pill pill-pending ${statusFilter === "pending" ? "active" : ""}`} onClick={() => setStatusFilter("pending")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Hourglass size={14} /> Pending ({counts.pending})
            </button>
            <button className={`filter-pill pill-approved ${statusFilter === "approved" ? "active" : ""}`} onClick={() => setStatusFilter("approved")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={14} /> Approved ({counts.approved})
            </button>
            <button className={`filter-pill pill-rejected ${statusFilter === "rejected" ? "active" : ""}`} onClick={() => setStatusFilter("rejected")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <XCircle size={14} /> Rejected ({counts.rejected})
            </button>
          </div>
        </div>
        <div className="accordion-list">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
            const isDayOpen = activeDay === day;
            const dayRequests = getRequestsForDay(day);
            return (
              <div key={day} className="accordion-item">
                <button type="button" className="accordion-trigger" onClick={() => setActiveDay(isDayOpen ? "" : day)}>
                  <span>{day} Classes</span>
                  <span className="day-count-badge">{dayRequests.length} filed</span>
                  <span className={`accordion-arrow ${isDayOpen ? "rotated" : ""}`}><ChevronUp size={16} /></span>
                </button>
                {isDayOpen && (
                  <div className="accordion-content">
                    {dayRequests.length > 0 ? (
                      dayRequests.map((request, idx) => (
                        <div key={idx} className="itemized-log-card">
                          <div className="log-details">
                            <div className="log-row" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} /> <strong>{request.class_time}</strong></div>
                            <div className="log-row" style={{ display: "flex", alignItems: "center", gap: "6px" }}><BookOpen size={14} /> Subject: <strong>{request.subject_name}</strong></div>
                            <div className="log-row" style={{ display: "flex", alignItems: "center", gap: "6px" }}><FileText size={14} /> Reason: <em>{request.reason}</em></div>
                            {request.proof_image_url && (
                              <div className="attached-proof-thumbnail">
                                <button
                                  className="proof-open-btn"
                                  onClick={() => {
                                    setProofLightboxUrl(request.proof_image_url);
                                    setProofLightboxMeta({ subject: request.subject_name, date: request.request_date?.split("T")[0], time: request.class_time });
                                  }}
                                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                                >
                                  <ImageIcon size={14} /> View Proof Photo
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="status-and-actions">
                            <span className={`status-pill ${request.status?.toLowerCase() || "pending"}`}>{request.status || "Pending"}</span>
                            {(request.status?.toLowerCase() === "pending") && (
                              <button className="row-edit-action-btn" onClick={() => handleEditClick(request)} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <Pencil size={14} /> Edit
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-log-state">
                        <p style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          {day === "Thursday" || day === "Friday" ? (<><PartyPopper size={16} /> No classes!</>) : "No verification requests filed for this day."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===================== ABSENCE TRACKER ===================== */
export function StudentAttendanceView({
  termTabs, syncLogs, attendanceData, ATTENDANCE_FAIL_PERCENT, allowedAbsences, TOTAL_SESSIONS_PER_SUBJECT,
}) {
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="page-term-tabs">{termTabs}</div>
      <div className="requests-section">
        <div className="section-header-row">
          <div className="card-header-title">
            <span><BarChart3 size={20} /></span>
            <h2>Absence Tracker</h2>
          </div>
          <button className="view-all-link" onClick={() => syncLogs()} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <p className="attendance-rule-note">
          You may miss up to <strong>{ATTENDANCE_FAIL_PERCENT}%</strong> of a class
          ({allowedAbsences} of {TOTAL_SESSIONS_PER_SUBJECT} sessions). Missing more than that
          <strong> fails</strong> the class. Only approved absences are counted.
        </p>
        <div className="attendance-list">
          {attendanceData.map((cls) => (
            <div key={cls.subject} className={`attendance-card ${cls.failed ? "att-failed" : ""}`}>
              <div className="attendance-card-head">
                <div>
                  <strong className="attendance-subject">{cls.subject}</strong>
                  <span className="attendance-teacher">by teacher {cls.teacher}</span>
                </div>
                <span className={`attendance-badge ${cls.failed ? "att-badge-fail" : "att-badge-safe"}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  {cls.failed ? (<><XCircle size={14} /> Failed</>) : (<><CheckCircle2 size={14} /> Safe</>)}
                </span>
              </div>
              <div className="attendance-bar-track">
                <div
                  className={`attendance-bar-fill ${cls.failed ? "fill-fail" : "fill-safe"}`}
                  style={{ width: `${Math.min(cls.percent, 100)}%` }}
                />
                <div className="attendance-threshold-marker" style={{ left: `${ATTENDANCE_FAIL_PERCENT}%` }} />
              </div>
              <div className="attendance-meta-row">
                <span>{cls.approvedAbsences} / {TOTAL_SESSIONS_PER_SUBJECT} missed</span>
                <span>{cls.percent}% absent</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================== NOTIFICATIONS ===================== */
export function StudentNotificationsView({ requests, handleDeleteAllPending }) {
  const unviewed = requests.filter(r => r.status_viewed === 0);
  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="requests-section">
        <div className="section-header-row">
          <div className="card-header-title">
            <span><Bell size={20} /></span>
            <h2>Your Notifications</h2>
          </div>
          {unviewed.length > 0 && (
            <button className="notif-clear-btn" onClick={handleDeleteAllPending} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>

        {unviewed.length > 0 ? (
          <div className="notif-list">
            {unviewed.map((req, idx) => {
              const status = req.status?.toLowerCase();
              const isAccepted = ["accepted", "accept", "approved"].includes(status);
              const isRejected = ["rejected", "reject"].includes(status);
              const type = isAccepted ? "accepted" : isRejected ? "rejected" : "pending";
              const labels = { accepted: "Accepted", rejected: "Rejected", pending: "Pending" };
              const NotifIcon = type === "accepted" ? CheckCircle2 : type === "rejected" ? XCircle : Hourglass;
              return (
                <div key={idx} className={`notif-card notif-${type}`}>
                  <div className={`notif-icon-badge notif-badge-${type}`}>
                    <NotifIcon size={20} />
                  </div>
                  <div className="notif-body">
                    <div className="notif-top-row">
                      <span className="notif-subject">{req.subject_name}</span>
                      <span className={`notif-status-chip chip-${type}`}>{labels[type]}</span>
                    </div>
                    <p className="notif-description">
                      {isAccepted && "Your permission request has been approved by your lecturer."}
                      {isRejected && "Your permission request was not approved."}
                      {!isAccepted && !isRejected && "Your request is waiting for lecturer review."}
                    </p>
                    {isRejected && req.reject_reason && (
                      <div className="notif-reject-reason">
                        <span className="notif-reject-label" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <AlertTriangle size={14} /> Reason
                        </span>
                        <p>{req.reject_reason}</p>
                      </div>
                    )}
                    <div className="notif-meta-row">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Calendar size={14} /> {req.request_date?.split("T")[0]}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Clock size={14} /> {req.class_time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="notif-empty">
            <div className="notif-empty-icon"><Bell size={40} /></div>
            <p className="notif-empty-title">You're all caught up!</p>
            <p className="notif-empty-sub">No new notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== PROFILE ===================== */
export function StudentProfileView({ studentName, studentId, counts, initials, setIsPasswordModalOpen }) {
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
              <h1 className="profile-display-name">{studentName}</h1>
              <span className="student-badge">Student</span>
            </div>
          </div>
          <div className="profile-stats-strip">
            <div className="profile-stat-item">
              <span className="profile-stat-num">{counts.total}</span>
              <span className="profile-stat-label">Total</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-num amber">{counts.pending}</span>
              <span className="profile-stat-label">Pending</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-num green">{counts.approved}</span>
              <span className="profile-stat-label">Approved</span>
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
            <div className="info-row">
              <span>Student Name</span> <strong>{studentName}</strong>
            </div>
            <div className="info-row">
              <span>Student ID</span> <strong>{studentId}</strong>
            </div>
            <div className="info-row">
              <span>Group</span> <strong>{localStorage.getItem("group_name") || "N/A"}</strong>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-card-title">Account Security</h3>
            <div className="info-row">
              <span>Password</span>
              <span className="password-strength-pill">●●●●●●●● Strong</span>
            </div>
            <button className="password-change-btn" onClick={() => setIsPasswordModalOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              <Lock size={16} /> Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== HELP & SUPPORT ===================== */
const faqs = [
  {
    id: "f1",
    question: "How do I check the status of my request?",
    answer: "You can check the status of any request by going to the \"View Status\" page from the sidebar. All your requests and their current progress will be listed there."
  },
  {
    id: "f2",
    question: "How long does it take to get a response?",
    answer: "Most requests are reviewed within 24 hours. You'll receive a notification as soon as your lecturer or admin responds."
  },
  {
    id: "f3",
    question: "Can I update my request after submitting?",
    answer: "Yes, as long as the request is still pending. Go to \"View Status\", find the request, and click the Edit button to make changes."
  },
  {
    id: "f4",
    question: "What if I can't access my student account?",
    answer: "You can reset your password from the Profile page. If you're still locked out, submit a support ticket below and our admin team will help you regain access."
  },
  {
    id: "f5",
    question: "Who should I contact for technical issues?",
    answer: "For technical issues with the platform itself, submit a support ticket through the Contact Admin section below and our team will assist you."
  }
];

const quickHelpItems = [
  { title: "Request Issues", desc: "Get help with your request related problems.", Icon: FileText, bg: "bg-blue" },
  { title: "Account Problems", desc: "Resolve login or account access issues.", Icon: User, bg: "bg-purple" },
  { title: "Password Reset", desc: "Reset or update your account password.", Icon: Lock, bg: "bg-amber" },
  { title: "System Guide", desc: "Learn how to use the system effectively.", Icon: BookOpen, bg: "bg-blue" }
];

export function StudentHelpView({ faqSearchTerm, setFaqSearchTerm, openFaqId, setOpenFaqId, showToast }) {
  const filteredFaqs = faqs.filter((f) => f.question.toLowerCase().includes(faqSearchTerm.toLowerCase()));

  return (
    <div className="single-column-workspace" style={{ marginTop: "32px" }}>
      <div className="help-layout">
        <div className="help-main-column">
          <div className="help-card">
            <div className="help-card-header">
              <div className="card-header-title" style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>
                <span><HelpCircle size={20} /></span>
                <h2>Frequently Asked Questions</h2>
              </div>
              <div className="faq-search-wrapper">
                <span className="search-icon"><Search size={16} /></span>
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={faqSearchTerm}
                  onChange={(e) => setFaqSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="faq-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id} className="faq-item">
                      <button type="button" className="faq-question" onClick={() => setOpenFaqId(isOpen ? null : faq.id)}>
                        <span>{faq.question}</span>
                        <span className={`faq-chevron ${isOpen ? "open" : ""}`}><ChevronDown size={16} /></span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="empty-log-state"><p>No FAQs match your search.</p></div>
              )}
            </div>
          </div>

          <div className="help-contact-grid">
            <div className="contact-card">
              <div className="contact-card-header">
                <div className="contact-icon bg-blue"><Mail size={20} /></div>
                <div>
                  <h3>Contact Lecturer</h3>
                  <p>Get in touch with your lecturer for academic support.</p>
                </div>
              </div>
              <div className="contact-action-row" onClick={() => showToast("Opening your email client...", "#2563eb")}>
                <span className="contact-action-icon"><Mail size={18} /></span>
                <div>
                  <strong>Email Lecturer</strong>
                  <p>Send an email to your lecturer</p>
                </div>
                <span className="contact-action-arrow"><ChevronRight size={16} /></span>
              </div>
              <div className="contact-action-row" onClick={() => showToast("Opening message portal...", "#2563eb")}>
                <span className="contact-action-icon"><MessageSquare size={18} /></span>
                <div>
                  <strong>Message Lecturer</strong>
                  <p>Send a message via the portal</p>
                </div>
                <span className="contact-action-arrow"><ChevronRight size={16} /></span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-header">
                <div className="contact-icon bg-emerald"><Shield size={20} /></div>
                <div>
                  <h3>Contact Admin</h3>
                  <p>Need help with administrative or general enquiries?</p>
                </div>
              </div>
              <div className="contact-ticket-row">
                <span className="contact-action-icon"><Ticket size={18} /></span>
                <div>
                  <strong>Submit a Support Ticket</strong>
                  <p>Our admin team will assist you as soon as possible.</p>
                </div>
                <button className="create-ticket-btn" onClick={() => showToast("Support ticket submitted!", "#059669")}>Create Ticket</button>
              </div>
            </div>
          </div>

          <div className="quick-help-section">
            <h3 className="quick-help-title">Quick Help</h3>
            <div className="quick-help-grid">
              {quickHelpItems.map((item) => (
                <div key={item.title} className="quick-help-card">
                  <div className={`quick-help-icon ${item.bg}`}><item.Icon size={20} /></div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                  <span className="quick-help-arrow"><ChevronRight size={16} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="help-sidebar-column">
          <div className="help-side-card">
            <h4 className="help-side-title">Support Status</h4>
            <div className="status-line">
              <span className="status-dot"></span>
              <strong>All Systems Operational</strong>
            </div>
            <p className="help-side-note">All services are running smoothly.</p>
            <p className="help-side-meta">Last updated: Today, 9:15 AM</p>
          </div>

          <div className="help-side-card contact-support-card">
            <div className="contact-support-icon"><Headphones size={28} /></div>
            <strong>Still need help?</strong>
            <p>Our support team is here to assist you.</p>
            <button className="contact-support-btn" onClick={() => showToast("Connecting you to support...", "#2563eb")}>Contact Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}
