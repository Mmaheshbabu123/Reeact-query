import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Fetch users from JSONPlaceholder API
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Add a new user to the server (JSONPlaceholder API is a mock, so this won't persist)
const addUser = async (newUser) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  });
  if (!response.ok) {
    throw new Error('Failed to add user');
  }
  return response.json();
};

export default function Users() {
  const queryClient = useQueryClient();

  // Fetch users data
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Mutation to add a new user with optimistic updates
  const mutation = useMutation({
    mutationFn: addUser,
    onMutate: async (newUser) => {
      // Cancel any outgoing refetches (to avoid data inconsistency during optimistic update)
      await queryClient.cancelQueries(['users']);

      // Get the current user data
      const previousUsers = queryClient.getQueryData(['users']);

      // Optimistically update users list with new user data
      queryClient.setQueryData(['users'], (oldUsers) => [
        ...oldUsers,
        { ...newUser, id: Date.now() }, // Temporary ID
      ]);

      // Return the context object with previous data to roll back if needed
      return { previousUsers };
    },
    onError: (error, newUser, context) => {
      // Rollback to the previous user list if there's an error
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    onSuccess:()=>{
       queryClient.invalidateQueries(['users']);
    },
    // onSettled: () => {
    //   // Refetch users list to ensure data consistency with the server
    //   queryClient.invalidateQueries(['users']);
    // },
  });

  const handleAddUser = () => {
    // Call the mutation to add a new user
    mutation.mutate({
      name: 'New User',
      username: 'newuser',
      email: 'newuser@example.com',
    });
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>Users</h2>
      <button onClick={handleAddUser} disabled={mutation.isLoading}>
        Add New User
      </button>
      {users && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.username}) - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
