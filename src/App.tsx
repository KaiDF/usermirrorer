import { useState, useEffect } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import type { User } from './types';
import { getAllUsers } from './utils/dataLoader';

function App() {
    const [activeDomain, setActiveDomain] = useState<'Books' | 'Movie' | ''>('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const loadedUsers = await getAllUsers();
                setUsers(loadedUsers);
            } catch (error) {
                console.error('Failed to load users:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    if (loading) {
        return <div className="app-container loading">Loading...</div>;
    }

    return (
        <div className="app-container">
            <Sidebar
                users={users}
                selectedDomain={activeDomain}
                onSelectDomain={setActiveDomain}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
            />

            <MainContent
                selectedUser={selectedUser}
            />
        </div>
    );
}

export default App;

