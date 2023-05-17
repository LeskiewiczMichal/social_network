import { useState } from 'react';

import { useAppSelector } from '../../../hooks';

export default function ProfileDropdown() {
  const user = useAppSelector((state) => state.user);
  const [profileMenuOpen, setProfileMenuOpen] = useState<Boolean>(false);

  const handleDropDown = () => {
    setProfileMenuOpen((oldState) => !oldState);
  };

  return (
    <div className="relative">
      <button
        id="dropdownUserAvatarButton"
        data-dropdown-toggle="dropdownAvatar"
        className="flex self-center flex-auto text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        type="button"
        onClick={handleDropDown}
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-10 h-10 rounded-full"
          src={`${process.env.REACT_APP_SERVER_URL}${user.profilePicture}`}
          alt="user"
        />
      </button>

      <div
        id="dropdownAvatar"
        className={`z-10 bg-white border divide-y divide-gray-100 rounded-lg shadow w-screen sm:w-44 left-0 sm:-left-36 top-14 sm:top-12 dark:bg-gray-700 dark:divide-gray-600 ${
          profileMenuOpen ? 'fixed sm:absolute' : 'hidden'
        }`}
      >
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div>Bonnie Green</div>
          <div className="font-medium truncate ">name@flowbite.com</div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownUserAvatarButton"
        >
          <li>
            <a
              href="/fe"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/w"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
          <li>
            <a
              href="/w"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Earnings
            </a>
          </li>
        </ul>
        <div className="py-2">
          <a
            href="/w"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}
