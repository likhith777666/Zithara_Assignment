import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(21);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:3300/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        (user?.Name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
        user?.Location?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortBy === 'created_at') {
            
            const dateA = new Date(a.created_at.split(' ')[0]);
            const timeA = new Date('1970-01-01T' + a.created_at.split(' ')[1]);
    
            const dateB = new Date(b.created_at.split(' ')[0]);
            const timeB = new Date('1970-01-01T' + b.created_at.split(' ')[1]);
    
           
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
    
            
            if (timeA < timeB) return -1;
            if (timeA > timeB) return 1;
    
            return 0; 
        } else {
            
            if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
                return a[sortBy].localeCompare(b[sortBy]);
            } else {
                
                return a[sortBy] - b[sortBy];
            }
        }
    });
    
    
    

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div style={{ textAlign: 'center' }}>
            <h2>User Table</h2>
            <input 
                type="text"
                placeholder="Search by name or location"
                value={searchTerm}
                onChange={handleSearchChange}
                
            />
            <select onChange={handleSortChange}>
                <option value="created_at">Sort by Date</option>
                <option value="time">Sort by Time</option>
            </select>

            <table style={{ margin: 'auto', width: '80%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}>Sno</th>
                        <th style={{ border: '1px solid black', padding: '5px' }}>Name</th>
                        <th style={{ border: '1px solid black', padding: '5px' }}>Age</th>
                        <th style={{ border: '1px solid black', padding: '5px' }}>Phone</th>
                        <th style={{ border: '1px solid black', padding: '5px' }}>Location</th>
                        <th style={{ border: '1px solid black', padding: '5px' }}>Created_at</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((user, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{user.Sno}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{user.Name}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{user.Age}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{user.Phone}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{user.Location}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{user.created_at}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div>
    {sortedUsers.length > itemsPerPage && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Array.from({ length: Math.ceil(sortedUsers.length / itemsPerPage) }, (_, i) => (
                <li key={i}>
                    <button onClick={() => paginate(i + 1)}>{i + 1}</button>
                </li>
            ))}
        </ul>
    )}
</div>

        </div>
    );
}

export default App;
