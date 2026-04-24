import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/profile');
        setUser(data);
        
        // If user is admin, fetch all users
        if (data.role === 'admin') {
          const usersRes = await API.get('/users');
          setUsers(usersRes.data);
        }
      } catch (err) {
        setError('Failed to load profile data');
        if (err.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) return <div className="center">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="profile-card">
        <h2>Welcome, {user?.name}!</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> <span className={`role-badge ${user?.role}`}>{user?.role}</span></p>
      </div>

      {user?.role === 'admin' && (
        <div className="users-list">
          <h3>All Registered Users</h3>
          {error && <p className="error-message">{error}</p>}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
