import { useState } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { MOCK_USERS, type User } from './types';

function App() {
    const [activeDomain, setActiveDomain] = useState<'Books' | 'Movie'>('Books');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Filter users or just pass all depending on Sidebar logic. 
    // Sidebar handles filtering by domain, but current mock data has domains.

    return (
        <div className="app-container">
            <Sidebar
                users={MOCK_USERS}
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
