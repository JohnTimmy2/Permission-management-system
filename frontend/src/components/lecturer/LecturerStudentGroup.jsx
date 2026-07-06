import {
  AlertTriangle, BookOpen, Calendar, Tag, FileText, BarChart3, XCircle,
  ImageIcon, Check, X, ChevronDown,
} from "./icons";

// Groups a flat list of requests into one entry per student
// eslint-disable-next-line react-refresh/only-export-components
export function groupByStudent(list) {
  const map = {};
  list.forEach((r) => {
    const key = r.student_id ?? r.student_name;
    if (!map[key]) {
      map[key] = { studentId: r.student_id, studentName: r.student_name, groupName: r.group_name, requests: [] };
    }
    map[key].requests.push(r);
  });
  return Object.values(map);
}

// One card per student, with each of their requests listed inside (each with its own Accept/Reject)
export default function StudentRequestGroup({ studentName, studentId, groupName, requests, isOpen, onToggle, getAbsenceInfo, onAccept, onReject, onViewPhoto }) {
  const pendingCount = requests.filter((r) => r.status?.toLowerCase() === "pending").length;
  // Check every subject this student has — flag the header if any is near/over the limit
  const subjectStatuses = [...new Set(requests.map((r) => r.subject_name))].map((s) => (getAbsenceInfo ? getAbsenceInfo(studentId, s).status : "ok"));
  const hasOver = subjectStatuses.includes("over");
  const hasNear = subjectStatuses.includes("near");
  return (
    <div className={`lec-group-card ${isOpen ? "lec-group-open" : ""}`}>
      <button type="button" className="lec-group-header" onClick={onToggle}>
        <div className="lec-student-meta">
          <div className="lec-avatar">{studentName?.[0]?.toUpperCase() || "?"}</div>
          <div>
            <strong className="lec-student-name">{studentName}</strong>
            <span className="lec-student-sub">ID: {studentId} · {groupName}</span>
          </div>
        </div>
        <div className="lec-group-header-right">
          {hasOver && <span className="lec-risk-flag over" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><AlertTriangle size={12} /> At risk · Failed</span>}
          {!hasOver && hasNear && <span className="lec-risk-flag near" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><AlertTriangle size={12} /> At risk</span>}
          {pendingCount > 0 && <span className="lec-group-pending-pill">{pendingCount} pending</span>}
          <span className="lec-group-count">{requests.length} request{requests.length > 1 ? "s" : ""}</span>
          <span className={`lec-group-chevron ${isOpen ? "open" : ""}`}><ChevronDown size={16} /></span>
        </div>
      </button>
      {isOpen && (
      <div className="lec-group-body">
        {requests.map((req) => {
          const isPending = req.status?.toLowerCase() === "pending";
          const isRejected = ["rejected", "reject"].includes(req.status?.toLowerCase());
          const statusClass = isPending ? "pending"
            : ["accepted", "accept", "approved"].includes(req.status?.toLowerCase()) ? "accepted"
            : "rejected";
          const info = getAbsenceInfo ? getAbsenceInfo(studentId, req.subject_name) : null;
          return (
            <div key={req.request_id} className="lec-group-request">
              <div className="lec-group-request-top">
                <div className="lec-detail-row"><span><BookOpen size={14} /></span><span><strong>{req.subject_name}</strong> — {req.class_time}</span></div>
                <span className={`lec-status-pill ${statusClass}`}>{req.status || "Pending"}</span>
              </div>
              <div className="lec-detail-row"><span><Calendar size={14} /></span><span>{req.request_date ? new Date(req.request_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span></div>
              <div className="lec-detail-row"><span><Tag size={14} /></span><span>{req.term || "Term 1"}</span></div>
              <div className="lec-detail-row"><span><FileText size={14} /></span><span className="lec-reason-text">{req.reason}</span></div>
              {info && (
                <div className={`lec-absence-badge ${info.status}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <BarChart3 size={12} /> Approved absences: <strong>{info.approved}/{info.total}</strong> ({info.percent}%)
                  {info.status === "over" && <span className="lec-absence-tag"> · Failed</span>}
                  {info.status === "near" && <span className="lec-absence-tag"> · Near limit</span>}
                </div>
              )}
              {isRejected && req.reject_reason && (
                <div className="lec-reject-reason-display" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <AlertTriangle size={14} /><span>Rejection reason:</span> {req.reject_reason}
                </div>
              )}
              {info && info.status === "near" && (
                <div className="lec-absence-warn near" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={14} /> One more approval fails this class (limit is 20%).
                </div>
              )}
              {info && info.status === "over" && (
                <div className="lec-absence-warn over" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <XCircle size={14} /> This student is over the 20% limit and has failed this class.
                </div>
              )}
              {(req.proof_image_url || isPending) && (
                <div className="lec-group-request-actions">
                  {req.proof_image_url && (
                    <button className="lec-photo-btn" onClick={() => onViewPhoto(req.proof_image_url)} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <ImageIcon size={14} /> View Proof
                    </button>
                  )}
                  {isPending && (
                    <div className="lec-action-btns">
                      <button className="lec-btn-accept" onClick={() => onAccept(req.request_id)} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Check size={14} /> Accept
                      </button>
                      <button className="lec-btn-reject-trigger" onClick={() => onReject(req.request_id)} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <X size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

export function RequestCard({ req, onAccept, onReject, onViewPhoto }) {
  const isPending = req.status?.toLowerCase() === "pending";
  const isRejected = ["rejected", "reject"].includes(req.status?.toLowerCase());
  const statusClass = isPending ? "pending"
    : ["accepted", "accept", "approved"].includes(req.status?.toLowerCase()) ? "accepted"
    : "rejected";

  return (
    <div className="lec-request-card">
      <div className="lec-request-card-top">
        <div className="lec-student-meta">
          <div className="lec-avatar">{req.student_name?.[0]?.toUpperCase() || "?"}</div>
          <div>
            <strong className="lec-student-name">{req.student_name}</strong>
            <span className="lec-student-sub">ID: {req.student_id} · {req.group_name}</span>
          </div>
        </div>
        <span className={`lec-status-pill ${statusClass}`}>{req.status || "Pending"}</span>
      </div>
      <div className="lec-request-details">
        <div className="lec-detail-row"><span><BookOpen size={14} /></span><span><strong>{req.subject_name}</strong> — {req.class_time}</span></div>
        <div className="lec-detail-row"><span><Calendar size={14} /></span><span>{req.request_date ? new Date(req.request_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span></div>
        <div className="lec-detail-row"><span><FileText size={14} /></span><span className="lec-reason-text">{req.reason}</span></div>
        {isRejected && req.reject_reason && (
          <div className="lec-reject-reason-display" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <AlertTriangle size={14} /><span>Rejection reason:</span> {req.reject_reason}
          </div>
        )}
      </div>
      <div className="lec-request-card-footer">
        {req.proof_image_url && (
          <button className="lec-photo-btn" onClick={() => onViewPhoto(req.proof_image_url)} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ImageIcon size={14} /> View Proof
          </button>
        )}
        {isPending && (
          <div className="lec-action-btns">
            <button className="lec-btn-accept" onClick={onAccept} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Check size={14} /> Accept
            </button>
            <button className="lec-btn-reject-trigger" onClick={onReject} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <X size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
