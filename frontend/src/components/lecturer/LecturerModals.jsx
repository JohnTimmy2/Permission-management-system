import { LogOut, X } from "./icons";

export function LecturerConfirmModals({
  isLogoutOpen, setIsLogoutOpen, confirmLogout,
  rejectModalOpen, setRejectModalOpen, rejectReason, setRejectReason, rejectLoading, handleRejectSubmit,
  lightboxUrl, setLightboxUrl,
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

      {rejectModalOpen && (
        <div className="modal-overlay" onClick={() => setRejectModalOpen(false)}>
          <div className="modal-content lec-reject-modal" onClick={e => e.stopPropagation()}>
            <h3>Reject Request</h3>
            <p className="lec-reject-subtitle">Please provide a reason — the student will see this alongside their rejected status.</p>
            <div className="input-block" style={{ marginTop: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Reason for rejection <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea className="lec-reject-textarea"
                placeholder="e.g. Insufficient documentation, please resubmit with a valid medical certificate."
                value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={4} autoFocus />
            </div>
            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button className="btn-cancel" onClick={() => setRejectModalOpen(false)}>Cancel</button>
              <button className="lec-btn-reject" onClick={handleRejectSubmit} disabled={rejectLoading}>
                {rejectLoading ? "Rejecting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxUrl && (
        <div className="lec-lightbox-overlay" onClick={() => setLightboxUrl(null)}>
          <div className="lec-lightbox-box" onClick={e => e.stopPropagation()}>
            <button className="lec-lightbox-close" onClick={() => setLightboxUrl(null)}><X size={16} /></button>
            <img src={`http://localhost:5000${lightboxUrl}`} alt="Proof" />
          </div>
        </div>
      )}
    </>
  );
}
