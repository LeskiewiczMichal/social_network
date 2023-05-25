import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Notification from './Notification';
import notificationsImage from '../../../assets/icons/notifications.svg';

export default function NotificationsDropdown() {
  const [isDropdownVisible, setIsDropdownHidden] = useState<Boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdown = () => {
    setIsDropdownHidden((oldState) => !oldState);
  };

  useEffect(() => {
    // Clicking outside of popup will close it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isDropdownVisible &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownHidden(false);
      }
    };

    // Attach event
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Notifications button */}
      <button
        id="notifcationsButton"
        className="flex self-center items-center text-sm rounded-full md:mr-0 "
        type="button"
        aria-label="Drop down notifications"
        onClick={handleDropdown}
      >
        <img
          className="w-10 h-10 rounded-full"
          src={notificationsImage}
          alt="notifications"
        />
        <span className="absolute top-1 right-2.5 p-1 translate-x-1/2 bg-red-500 border border-white rounded-full text-xs text-white" />
      </button>

      {/* Dropdown menu */}
      <div
        ref={dropdownRef}
        id="dropdownNotification"
        className={`${
          isDropdownVisible ? 'fixed sm:absolute' : 'hidden'
        } z-50 w-screen sm:w-80 bg-white divide-y divide-gray-100 rounded-lg left-0 sm:-left-72 top-14 sm:top-12 sm:border shadow dark:bg-gray-800 dark:divide-gray-700`}
        aria-label="notifcationsButton"
      >
        <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
          Notifications
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <a
            href="/we"
            className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex-shrink-0">
              <img
                className="rounded-full w-11 h-11"
                src="/docs/images/people/profile-picture-1.jpg"
                alt="Jese"
              />
              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-blue-600 border border-white rounded-full dark:border-gray-800">
                <svg
                  className="w-3 h-3 text-white"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                  <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                </svg>
              </div>
            </div>

            <div className="w-full pl-3">
              <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                New message from{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  Jese Leos
                </span>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">
                a few moments ago
              </div>
            </div>
          </a>

          <Notification
            firstName="Michał"
            lastName="Leśkiewicz"
            message="sent a friends request."
            userId="1232421"
            userProfilePictureUrl="/photos/profilePictures/default.png"
          />

          <a
            href="/wer"
            className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex-shrink-0">
              <img
                className="rounded-full w-11 h-11"
                src="/docs/images/people/profile-picture-3.jpg"
                alt="Bonnie"
              />
              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-red-600 border border-white rounded-full dark:border-gray-800">
                <svg
                  className="w-3 h-3 text-white"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Bonnie Green
                </span>{' '}
                and{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  141 others
                </span>{' '}
                love your story. See it and view more stories.
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">
                44 minutes ago
              </div>
            </div>
          </a>
          <a
            href="/we"
            className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex-shrink-0">
              <img
                className="rounded-full w-11 h-11"
                src="/docs/images/people/profile-picture-4.jpg"
                alt="Leslie"
              />
              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-800">
                <svg
                  className="w-3 h-3 text-white"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Leslie Livingston
                </span>{' '}
                mentioned you in a comment: what do you say?
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">
                1 hour ago
              </div>
            </div>
          </a>
          <a
            href="/sd"
            className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex-shrink-0">
              <img
                className="rounded-full w-11 h-11"
                src="/docs/images/people/profile-picture-5.jpg"
                alt="Robert"
              />
              <div className="absolute flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-800">
                <svg
                  className="w-3 h-3 text-white"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Robert Brown
                </span>{' '}
                posted a new video: Glassmorphism - learn how to implement the
                new design trend.
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500">
                3 hours ago
              </div>
            </div>
          </a>
        </div>
        <Link
          to="/notifications"
          className="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
        >
          <div className="inline-flex items-center ">
            <svg
              className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            View all
          </div>
        </Link>
      </div>
    </div>
  );
}
