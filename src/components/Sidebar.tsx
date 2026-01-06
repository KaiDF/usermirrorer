import React from 'react';
import type { User } from '../types';
import './Sidebar.css';

interface SidebarProps {
    users: User[];
    selectedDomain: 'Books' | 'Movie';
    onSelectDomain: (domain: 'Books' | 'Movie') => void;
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
    const filteredUsers = users.filter((u) => u.domain === selectedDomain);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>UserMirrorer</h2>
                <div className="domain-selector">
                    <select
                        value={selectedDomain}
                        onChange={(e) => onSelectDomain(e.target.value as 'Books' | 'Movie')}
                    >
                        <option value="Books">Books</option>
                        <option value="Movie">Movie</option>
                    </select>
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
        </div>
    );
};
