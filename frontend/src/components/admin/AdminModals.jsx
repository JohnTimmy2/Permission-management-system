import { X, ChevronRight, Check, LogOut, Trash2 } from "./icons";

const API = "http://localhost:5000";

/* ===================== ADD/EDIT USER ===================== */
export function AdminUserModal({
  userModalOpen, setUserModalOpen, editingUser, userForm, setUserForm,
  groupNames, saveUser, onOpenMatrix,
}) {
  if (!userModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setUserModalOpen(false)}>
      <div className="user-modal" onClick={e => e.stopPropagation()}>
        <div className="user-modal-head">
          <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
          <button className="close-modal-btn" onClick={() => setUserModalOpen(false)}><X size={14} /></button>
        </div>
        <div className="user-modal-body">
          {!editingUser && (
            <div className="user-field">
              <label>User ID</label>
              <input type="text" value={userForm.user_id} onChange={e => setUserForm({ ...userForm, user_id: e.target.value })} placeholder="e.g. 260101" />
            </div>
          )}
          {editingUser && (
            <div className="user-field">
              <label>User ID <span className="optional-hint">(can't be changed)</span></label>
              <input type="text" value={userForm.user_id} disabled style={{ background: "#f1f5f9", cursor: "not-allowed", color: "#94a3b8" }} />
            </div>
          )}
          <div className="user-field">
            <label>Full Name</label>
            <input type="text" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="e.g. Ly Heng" />
          </div>
          <div className="user-field">
            <label>Email</label>
            <input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="e.g. student@test.com" />
          </div>
          <div className="user-field">
            <label>Password {editingUser && <span className="optional-hint">(leave blank to keep current)</span>}</label>
            <input type="text" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} placeholder={editingUser ? "••••••••" : "Set a password"} />
          </div>
          <div className="user-field">
            <label>Role</label>
            <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {userForm.role === "student" && (
            <div className="user-field">
              <label>Group</label>
              <select value={userForm.group_name} onChange={e => setUserForm({ ...userForm, group_name: e.target.value })}>
                {groupNames.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          )}
          {userForm.role === "lecturer" && (
            <div className="user-field">
              <label>Classes Teaching</label>
              <button type="button" className="matrix-trigger-btn" onClick={onOpenMatrix}>
                <span className={userForm.subjects.length > 0 ? "filled-text" : "placeholder-text"}>
                  {userForm.subjects.length > 0 ? `Selected: ${userForm.subjects.join(", ")}` : "Choose classes to teach..."}
                </span>
                <span className="arrow-indicator"><ChevronRight size={16} /></span>
              </button>
            </div>
          )}
        </div>
        <div className="user-modal-foot">
          <button className="btn-cancel" onClick={() => setUserModalOpen(false)}>Cancel</button>
          <button className="btn-save" onClick={saveUser}>{editingUser ? "Save Changes" : "Create User"}</button>
        </div>
      </div>
    </div>
  );
}

/* ===================== LECTURER CLASS MATRIX ===================== */
export function AdminLecturerMatrixModal({
  isLecturerMatrixOpen, setIsLecturerMatrixOpen, termNames, termTimetables,
  matrixActiveTerm, setMatrixActiveTerm, userForm, handleToggleLecturerClass,
}) {
  if (!isLecturerMatrixOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsLecturerMatrixOpen(false)}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Select Classes to Teach</h3>
            <p>Check every class this lecturer teaches, across any term.</p>
          </div>
          <button className="close-modal-btn" onClick={() => setIsLecturerMatrixOpen(false)}><X size={14} /></button>
        </div>
        <div className="modal-term-tabs-wrap">
          <div className="term-tabs">
            {termNames.map((t) => (
              <button key={t} className={`term-tab ${matrixActiveTerm === t ? "term-tab-active" : ""}`} onClick={() => setMatrixActiveTerm(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="modal-grid-container">
          <div className="matrix-columns-grid">
            {Object.keys(termTimetables[matrixActiveTerm]).map((day) => (
              <div key={day} className="matrix-day-column">
                <h4 className="column-day-title">{day}</h4>
                <div className="column-cards-list">
                  {termTimetables[matrixActiveTerm][day].map((cls, idx) => {
                    if (cls.isLazy) {
                      return (
                        <div key={idx} className="lazy-day-card">
                          <span>No Classes</span>
                          <small>Free Day</small>
                        </div>
                      );
                    }
                    const isSelected = userForm.subjects.includes(cls.subject);
                    return (
                      <div key={cls.id || idx} onClick={() => handleToggleLecturerClass(cls)} className={`matrix-class-card ${isSelected ? "selected" : ""}`}>
                        <div className="card-top-info">
                          <span className="class-time-text">{cls.time}</span>
                          <div className="custom-checkbox-circle">{isSelected && <span className="checkbox-check"><Check size={12} /></span>}</div>
                        </div>
                        <p className="class-teacher-text">by teacher {cls.teacher}</p>
                        <div className="card-bottom-subject"><span>{cls.subject}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-done-btn" onClick={() => setIsLecturerMatrixOpen(false)}>Done</button>
        </div>
      </div>
    </div>
  );
}

/* ===================== LOGOUT / DELETE CONFIRM / PHOTO LIGHTBOX ===================== */
export function AdminConfirmModals({
  lightboxUrl, setLightboxUrl,
  isLogoutOpen, setIsLogoutOpen, confirmLogout,
  deleteTargetId, setDeleteTargetId, confirmDelete,
  deleteUserId, setDeleteUserId, confirmDeleteUser,
}) {
  return (
    <>
      {lightboxUrl && (
        <div className="lec-lightbox-overlay" onClick={() => setLightboxUrl(null)}>
          <div className="lec-lightbox-box" onClick={e => e.stopPropagation()}>
            <button className="lec-lightbox-close" onClick={() => setLightboxUrl(null)}><X size={16} /></button>
            <img src={`${API}${lightboxUrl}`} alt="Proof" />
          </div>
        </div>
      )}

      {isLogoutOpen && (
        <div className="lo-overlay" onClick={() => setIsLogoutOpen(false)}>
          <div className="lo-card" onClick={e => e.stopPropagation()}>
            <div className="lo-icon"><LogOut size={24} /></div>
            <h3 className="lo-title">Log out?</h3>
            <p className="lo-sub">You'll need to sign in again to access the admin panel.</p>
            <div className="lo-actions">
              <button className="lo-stay" onClick={() => setIsLogoutOpen(false)}>Stay Logged In</button>
              <button className="lo-confirm" onClick={confirmLogout}>Log Out</button>
            </div>
          </div>
        </div>
      )}

      {deleteTargetId && (
        <div className="lo-overlay" onClick={() => setDeleteTargetId(null)}>
          <div className="lo-card" onClick={e => e.stopPropagation()}>
            <div className="lo-icon"><Trash2 size={24} /></div>
            <h3 className="lo-title">Delete request?</h3>
            <p className="lo-sub">This permanently removes the request from the system. You can't undo this.</p>
            <div className="lo-actions">
              <button className="lo-stay" onClick={() => setDeleteTargetId(null)}>Cancel</button>
              <button className="lo-confirm" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {deleteUserId && (
        <div className="lo-overlay" onClick={() => setDeleteUserId(null)}>
          <div className="lo-card" onClick={e => e.stopPropagation()}>
            <div className="lo-icon"><Trash2 size={24} /></div>
            <h3 className="lo-title">Delete user?</h3>
            <p className="lo-sub">This permanently removes the user account. You can't undo this.</p>
            <div className="lo-actions">
              <button className="lo-stay" onClick={() => setDeleteUserId(null)}>Cancel</button>
              <button className="lo-confirm" onClick={confirmDeleteUser}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
