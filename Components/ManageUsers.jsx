import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import UserDetails  from './UserDetails';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const navigate = useNavigate();
  const goToBaciQueryPage = () => {
    navigate('/BasicUseQuery'); // This will unmount `OtherComponent` and mount `goToMnageUsers` so cacheTime will start
  };
  // Fetch all users
  function fetchUsers() {
    return fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json());
  }
  const [selectedUserId, setSelectedUserId] = useState(null);

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={()=> setSelectedUserId(user.id)}>Edit</button>
          </li>
        ))}
      </ul>
      <button onClick={()=>goToBaciQueryPage()}>Go to basic query page</button>
      {selectedUserId && <UserDetails userId={selectedUserId} />}
    </div>
  );
}

export default ManageUsers;
