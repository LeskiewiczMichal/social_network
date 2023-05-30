import { Link } from 'react-router-dom';

import { UserInterface } from '../types/user';

export default function UserOnList(props: UserInterface) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, firstName, lastName, profilePicture, city } = props;

  return (
    <section className="w-full flex flex-col items-center bg-white shadow-lg rounded-lg p-2 mb-6">
      <img
        src={`${process.env.REACT_APP_SERVER_URL}${profilePicture}`}
        alt="user profile"
        className="w-1/2 h-auto border rounded-lg mb-4"
      />
      <span className="text-gray-600">
        {firstName} {lastName}
      </span>
      <span className="text-gray-600">From {city}</span>
      <Link
        to={`/profile/${id}`}
        className="border rounded-xl py-2 px-4 mt-2 bg-primary text-white"
      >
        See profile
      </Link>
    </section>
  );
}
