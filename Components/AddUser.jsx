import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Fetch users function for useQuery
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

// Add user function for useMutation
const addUser = async (newUser) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });
  if (!response.ok) {
    throw new Error('Failed to add user');
  }
  return response.json();
};

function Users() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetching users with useQuery
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Adding new user with useMutation
  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      // Invalidate and refetch users after a new user is added
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('Error adding user:', error);
    },
  });

  // Handle form submission to add new user
  const handleAddUser = () => {
    mutation.mutate({ name, email });
    setName(''); // Clear input fields
    setEmail('');
  };

  // Render loading, error, and user list states
  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error fetching users: {error.message}</div>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <h2>Add New User</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAddUser} disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Adding...' : 'Add User'}
      </button>

      {mutation.isError && <p>Error adding user. Please try again.</p>}
      {mutation.isSuccess && <p>User added successfully!</p>}
    </div>
  );
}

export default Users;
