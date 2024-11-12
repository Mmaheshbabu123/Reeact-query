import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Fetch a single user by ID
function fetchUserById(userId) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((res) => res.json());
}

function UserDetails({ userId }) {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    
  });

  if (isLoading) return <div>Loading user details...</div>;
  if (isError) return <div>Error loading user details</div>;

  return (
    <div>
      <h3>User Details</h3>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Website:</strong> {user.website}</p>
    </div>
  );
}

export default UserDetails;
