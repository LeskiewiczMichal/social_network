import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../../hooks';
import { logout } from '../../authentication';

export default function ProfileDropdown() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [profileMenuOpen, setProfileMenuOpen] = useState<Boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropDown = () => {
    setProfileMenuOpen((oldState) => !oldState);
  };

  useEffect(() => {
    // Clicking outside of popup will close it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !profileMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* User picture button */}
      <button
        id="profileButton"
        aria-label="Profile dropdown"
        className="flex self-center flex-auto text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        type="button"
        onClick={handleDropDown}
      >
        <img
          className="w-10 h-10 rounded-full"
          src={`${process.env.REACT_APP_SERVER_URL}${user.profilePicture}`}
          alt="user"
        />
      </button>

      {/* Dropdown */}
      <nav
        ref={dropdownRef}
        aria-labelledby="profileButton"
        className={`z-50 bg-white border divide-y divide-gray-100 rounded-lg shadow w-screen sm:w-44 left-0 sm:-left-36 top-14 sm:top-12 dark:bg-gray-700 dark:divide-gray-600 ${
          profileMenuOpen ? 'fixed sm:absolute' : 'hidden'
        }`}
      >
        {/* User info */}
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div>
            {user.firstName} {user.lastName}
          </div>
          <div className="font-bold truncate ">{user.email}</div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownUserAvatarButton"
        >
          {/* Profile link button */}
          <li>
            <Link
              to={`/profile/${user.id}`}
              aria-label="profile"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setProfileMenuOpen(false)}
            >
              Profile
            </Link>
          </li>
        </ul>
        {/* Sing out button */}
        <div className="py-2">
          <button
            type="button"
            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            onClick={() => dispatch(logout())}
          >
            Sign out
          </button>
        </div>
      </nav>
    </div>
  );
}
