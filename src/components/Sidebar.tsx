import React, { useState } from 'react';
import type { User } from '../types';
import './Sidebar.css';

interface SidebarProps {
    users: User[];
    selectedDomain: 'Books' | 'Movie' | '';
    onSelectDomain: (domain: 'Books' | 'Movie' | '') => void;
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    users,
    selectedDomain,
    onSelectDomain,
    selectedUser,
    onSelectUser,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const filteredUsers = users.filter((u) => u.domain === selectedDomain);

    const domainIcon = selectedDomain === 'Books' ? '📚' : selectedDomain === 'Movie' ? '🎬' : '🌐';

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {!isCollapsed && (
                <>
                    <button
                        className="sidebar-toggle collapse-btn"
                        onClick={() => setIsCollapsed(true)}
                        title="Collapse sidebar"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 10L8 12L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="sidebar-header">
                        <h2>UserMirrorer</h2>
                        <div className="domain-selector">
                            <div className="custom-select">
                                <span className="select-icon">{domainIcon}</span>
                                <select
                                    value={selectedDomain}
                                    onChange={(e) => onSelectDomain(e.target.value as 'Books' | 'Movie' | '')}
                                >
                                    <option value="" disabled>Choose Domain</option>
                                    <option value="Books">Books</option>
                                    <option value="Movie">Movie</option>
                                </select>
                                <span className="select-arrow">▼</span>
                            </div>
                        </div>
                    </div>

                    <div className="user-list">
                        <h3>Example Users</h3>
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className={`user-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                                onClick={() => onSelectUser(user)}
                            >
                                <img src={user.avatar} alt={user.name} className="user-avatar" />
                                <div className="user-info">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-snippet">
                                        {user.profile.traits.join(', ')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {isCollapsed && (
                <div className="collapsed-content">
                    <div className="logo-container" onClick={() => setIsCollapsed(false)}>
                        <span className="collapsed-icon">🪞</span>
                        <button
                            className="sidebar-toggle expand-btn"
                            title="Expand sidebar"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 10L16 12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
