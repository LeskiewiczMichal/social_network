import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

import { UsersList } from '../features/users';

export default function ShowUsers() {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const { firstName, lastName } = params;

  return (
    <main className="padding-top-header min-h-screen flex flex-col items-center">
      <UsersList
        firstName={typeof firstName === 'string' ? firstName : undefined}
        lastName={typeof lastName === 'string' ? lastName : undefined}
      />
    </main>
  );
}
