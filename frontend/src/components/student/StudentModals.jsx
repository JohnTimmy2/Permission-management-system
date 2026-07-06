import { LogOut, Trash2, X, Paperclip, Calendar, ExternalLink, Check } from "./icons";

export function StudentModals({
  isLogoutOpen, setIsLogoutOpen, confirmLogout,
  isClearAllOpen, setIsClearAllOpen, confirmClearAll,
  proofLightboxUrl, setProofLightboxUrl, proofLightboxMeta,
  isPasswordModalOpen, setIsPasswordModalOpen, setNewPassword, handleActualPasswordUpdate,
  isMatrixOpen, setIsMatrixOpen, termTabs, matrixClasses, selectedSubjects, handleSelectFromMatrix,
}) {
  return (
    <>
      {isLogoutOpen && (
        <div className="lo-overlay" onClick={() => setIsLogoutOpen(false)}>
          <div className="lo-card" onClick={e => e.stopPropagation()}>
            <div className="lo-icon"><LogOut size={24} /></div>
            <h3 className="lo-title">Log out?</h3>
            <p className="lo-sub">You'll need to sign in again to access your dashboard.</p>
            <div className="lo-actions">
              <button className="lo-stay" onClick={() => setIsLogoutOpen(false)}>Stay Logged In</button>
              <button className="lo-confirm" onClick={confirmLogout}>Log Out</button>
            </div>
          </div>
        </div>
      )}

      {isClearAllOpen && (
        <div className="lo-overlay" onClick={() => setIsClearAllOpen(false)}>
          <div className="lo-card" onClick={e => e.stopPropagation()}>
            <div className="lo-icon" style={{ background: "#eff6ff" }}><Trash2 size={24} /></div>
            <h3 className="lo-title">Clear all notifications?</h3>
            <p className="lo-sub">This will mark all current notifications as read. You can't undo this.</p>
            <div className="lo-actions">
              <button className="lo-stay" onClick={() => setIsClearAllOpen(false)}>Cancel</button>
              <button className="lo-confirm" onClick={confirmClearAll}>Clear All</button>
            </div>
          </div>
        </div>
      )}

      {proofLightboxUrl && (
        <div className="proof-lightbox-overlay" onClick={() => setProofLightboxUrl(null)}>
          <div className="proof-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <button className="proof-lightbox-close" onClick={() => setProofLightboxUrl(null)}><X size={18} /></button>
            <div className="proof-lightbox-img-area">
              <img src={`http://localhost:5000${proofLightboxUrl}`} alt="Proof" />
            </div>
            <div className="proof-lightbox-body">
              <h3 className="proof-lightbox-title">{proofLightboxMeta?.subject} — Proof</h3>
              <div className="proof-lightbox-meta">
                <span className="proof-lightbox-chip" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <Paperclip size={14} /> Submitted Proof
                </span>
                <span className="proof-lightbox-date" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <Calendar size={14} /> {proofLightboxMeta?.date} · {proofLightboxMeta?.time}
                </span>
              </div>
              <a
                href={`http://localhost:5000${proofLightboxUrl}`}
                target="_blank"
                rel="noreferrer"
                className="proof-lightbox-download"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <ExternalLink size={14} /> Open full image in new tab
              </a>
            </div>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <input type="password" placeholder="Enter new password" onChange={(e) => setNewPassword(e.target.value)} />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
              <button className="btn-update" onClick={handleActualPasswordUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}

      {isMatrixOpen && (
        <div className="modal-overlay">
          <div className="modal-window">
            <div className="modal-header">
              <div>
                <h3>Select Class Matrix</h3>
                <p>You can check multiple classes across different days before hitting Done!</p>
              </div>
              <button className="close-modal-btn" onClick={() => setIsMatrixOpen(false)}><X size={18} /></button>
            </div>
            <div className="modal-term-tabs-wrap">{termTabs}</div>
            <div className="modal-grid-container">
              <div className="matrix-columns-grid">
                {Object.keys(matrixClasses).map((day) => (
                  <div key={day} className="matrix-day-column">
                    <h4 className="column-day-title">{day}</h4>
                    <div className="column-cards-list">
                      {matrixClasses[day].map((cls, idx) => {
                        if (cls.isLazy) {
                          return (
                            <div key={idx} className="lazy-day-card">
                              <span>No Classes</span>
                              <small>Free Day</small>
                            </div>
                          );
                        }
                        const isSelected = selectedSubjects.includes(cls.subject);
                        return (
                          <div key={cls.id || idx} onClick={() => handleSelectFromMatrix(cls)} className={`matrix-class-card ${isSelected ? "selected" : ""} ${cls.isSeminar ? "seminar" : ""}`} style={{ backgroundColor: isSelected ? "#e0f2fe" : "", borderColor: isSelected ? "#2563eb" : "" }}>
                            <div className="card-top-info">
                              <span className="class-time-text" style={{ color: isSelected ? "#1e3a8a" : "" }}>{cls.time}</span>
                              <div className="custom-checkbox-circle">{isSelected && <span className="checkbox-check"><Check size={12} /></span>}</div>
                            </div>
                            <p className="class-teacher-text" style={{ color: isSelected ? "#1e3a8a" : "" }}>by teacher {cls.teacher}</p>
                            <div className="card-bottom-subject"><span style={{ color: isSelected ? "#1d4ed8" : "" }}>{cls.subject}</span></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-done-btn" onClick={() => setIsMatrixOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
