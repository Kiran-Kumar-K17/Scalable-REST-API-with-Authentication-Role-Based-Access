import { useState, useEffect } from "react";

function AdminPanel({ apiBase, token, showMessage }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.data || []);
      showMessage(`Loaded ${data.results} users`, "success");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!selectedUserId) {
      showMessage("Please select a user to delete", "error");
      return;
    }

    const selectedUser = users.find((u) => u._id === selectedUserId);
    if (
      !confirm(`Are you sure you want to delete user "${selectedUser?.name}"?`)
    )
      return;

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/users/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      showMessage("User deleted successfully!", "success");
      setSelectedUserId("");
      fetchUsers(); // Refresh the list
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>🛡️ Admin Panel</h2>
      <p className="admin-note">
        As an admin, you can manage users. Select a user from the list below.
      </p>

      <div className="delete-user-form">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="user-select"
          disabled={loading}
        >
          <option value="">-- Select a user to delete --</option>
          {users
            .filter((user) => user.role !== "admin")
            .map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
        </select>
        <button
          onClick={handleDeleteUser}
          className="btn btn-danger"
          disabled={loading || !selectedUserId}
        >
          {loading ? "Deleting..." : "🗑️ Delete User"}
        </button>
        <button
          onClick={fetchUsers}
          className="btn btn-secondary"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {users.length > 0 && (
        <div className="users-list">
          <h3>📋 All Users ({users.length})</h3>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className={selectedUserId === user._id ? "selected" : ""}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
