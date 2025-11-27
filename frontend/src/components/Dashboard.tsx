import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProjectArchitecture from './ProjectArchitecture'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'architecture'>('dashboard')

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-tabs">
          <button 
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            儀表板
          </button>
          <button 
            className={`tab-button ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            專案架構
          </button>
        </div>
        <div className="user-info">
          <span>Logged in as: <strong>{user?.name}</strong> ({user?.email})</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      
      {activeTab === 'dashboard' ? (
        <div className="dashboard-content">
          <div className="profile-card">
            <h2>User Profile</h2>
            <div className="profile-info">
              <div className="profile-item">
                <label>Name:</label>
                <span>{user?.name || 'N/A'}</span>
              </div>
              <div className="profile-item">
                <label>Email:</label>
                <span>{user?.email || 'N/A'}</span>
              </div>
              <div className="profile-item">
                <label>User ID:</label>
                <span className="user-id">{user?.id || 'N/A'}</span>
              </div>
              <div className="profile-item">
                <label>Role:</label>
                <span className={`role-badge ${user?.role || 'member'}`}>
                  {user?.role || 'member'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="welcome-card">
            <h2>Your Dashboard</h2>
            <p>Welcome back, {user?.name}! This is your personal dashboard.</p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Projects</h3>
                <p>0 Active Projects</p>
              </div>
              <div className="stat-card">
                <h3>Tasks</h3>
                <p>0 Pending Tasks</p>
              </div>
              <div className="stat-card">
                <h3>Team</h3>
                <p>Team Members</p>
              </div>
            </div>
            
            <div className="actions">
              <button className="action-button primary">
                Create New Project
              </button>
              <button className="action-button secondary">
                Invite Team Members
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ProjectArchitecture />
      )}
    </div>
  )
}
