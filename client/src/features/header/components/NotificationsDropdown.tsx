import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  Notification,
  getNotifications,
  NotificationTypes,
  dataToNotificationObject,
} from '../../notifications';
import { useSocket, UserSlice } from '../../authentication';
import { useAppDispatch } from '../../../hooks';

export default function NotificationsDropdown() {
  const dispatch = useAppDispatch();
  const [isDropdownVisible, setIsDropdownHidden] = useState<Boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<
    NotificationTypes.NotificationInterface[]
  >([]);
  const socket = useSocket();

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

    // Get notifications from server
    const handleGetNotifications = async () => {
      try {
        const limit = 5;
        setIsLoading(true);
        const queriedNotifications = await getNotifications({
          offset: 0,
          limit,
        });
        setNotifications(queriedNotifications);
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetNotifications();

    // Attach event
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // When received notification display it
    const handleNewNotification = (notification: any) => {
      const newNotification = dataToNotificationObject(notification);
      setNotifications((prevNotifications) => {
        const newNotifications = [...prevNotifications];
        newNotifications.unshift(newNotification);
        newNotifications.pop();
        return newNotifications;
      });
      dispatch(UserSlice.addFriendRequest(notification.sender._id));
    };
    if (!socket) {
      return;
    }

    socket.on('new-notification', handleNewNotification);
    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  }, [socket]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notifications button */}
      <button
        id="notifcationsButton"
        className="flex self-center items-center text-sm rounded-full md:mr-0 "
        type="button"
        aria-label="Drop down notifications"
        onClick={handleDropdown}
      >
        <svg
          className="w-10 h-10 rounded-full fill-primary"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          aria-label="notifications"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />

          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            <path d="M10,21h4a2,2,0,0,1-4,0ZM3.076,18.383a1,1,0,0,1,.217-1.09L5,15.586V10a7.006,7.006,0,0,1,6-6.92V2a1,1,0,0,1,2,0V3.08A7.006,7.006,0,0,1,19,10v5.586l1.707,1.707A1,1,0,0,1,20,19H4A1,1,0,0,1,3.076,18.383ZM6.414,17H17.586l-.293-.293A1,1,0,0,1,17,16V10A5,5,0,0,0,7,10v6a1,1,0,0,1-.293.707Z" />
          </g>
        </svg>
        {/* Red dot on notification button */}
        {/* <span className="absolute top-1 right-2.5 p-1 translate-x-1/2 bg-red-500 border border-white rounded-full text-xs text-white" /> */}
      </button>

      {/* Dropdown menu */}
      <div
        id="dropdownNotification"
        className={`${
          isDropdownVisible ? 'fixed sm:absolute' : 'hidden'
        } z-50 w-screen sm:w-80 bg-white divide-y divide-gray-100 rounded-lg left-0 sm:-left-72 top-14 sm:top-12 sm:border shadow dark:bg-gray-800 dark:divide-gray-700`}
        aria-label="notifcationsButton"
      >
        <div className="block px-4 py-2 font-medium shadow text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
          Notifications
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {notifications.map(
            (notification: NotificationTypes.NotificationInterface) => {
              return (
                <Notification
                  key={notification.id}
                  sender={notification.sender}
                  receiver={notification.receiver}
                  id={notification.id}
                  createdAt={notification.createdAt}
                  type={notification.type}
                />
              );
            },
          )}
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
