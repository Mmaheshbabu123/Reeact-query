import { useQuery, QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';

import { useNavigate } from 'react-router-dom';
const BasicUseQuery = ()  => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 10000, // 10 seconds
        cacheTime: 20000, // 20 seconds
        refetchOnWindowFocus: false,
      });

      function fetchUsers() {
        console.log("Fetching data...");
        return fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json());
      }
      const navigate = useNavigate();

      const goToMnageUsers = () => {
        navigate('/ManageUsers'); // This will unmount `OtherComponent` and mount `goToMnageUsers` so cacheTime will start
      };
  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
      <button onClick={goToMnageUsers}>Go to ManageUsers</button>
    </ul>
  );
}
export default BasicUseQuery;
