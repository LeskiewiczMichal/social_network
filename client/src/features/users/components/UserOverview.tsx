import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import StandardButton from '../../../components/StandardButton';
import sendFriendRequest from '../services/sendFriendRequest';
import { useSocket, UserSlice } from '../../authentication';
import addFriend from '../services/addFriend';
import removeFriend from '../services/removeFriend';
import * as ProfilePageSlice from '../reducers/profilePageReducer';
import { EditUserData } from '../types/editUserDataForm';

interface UserOverviewProps {
  handleChangeUserData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeUserDataForm: EditUserData;
  handleConfirmChanges: () => void;
}

export default function UserOverview(props: UserOverviewProps) {
  const { handleConfirmChanges, handleChangeUserData, changeUserDataForm } =
    props;
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.user);
  const displayedProfile = useAppSelector((state) => state.profilePage);
  const socket = useSocket();

  // Handlers for different friend activities
  const handleAddFriend = () => {
    dispatch(ProfilePageSlice.addFriend(loggedUser.id!));
    dispatch(UserSlice.addFriend(displayedProfile.id));
    dispatch(UserSlice.removeFriendRequest(displayedProfile.id));
    addFriend({ newFriendId: displayedProfile.id, socket });
  };

  const handleRemoveFriend = () => {
    dispatch(ProfilePageSlice.removeFriend(loggedUser.id!));
    dispatch(UserSlice.removeFriend(displayedProfile.id));
    removeFriend({ friendToRemove: displayedProfile.id });
  };

  const handleSendFriendRequest = () => {
    dispatch(ProfilePageSlice.addFriendRequest(loggedUser.id!));
    sendFriendRequest({ newFriendId: displayedProfile.id, socket });
  };

  // Selecting button based on your relationship with user
  let befriendButton: JSX.Element;
  if (displayedProfile.friends.includes(loggedUser.id!)) {
    befriendButton = (
      <StandardButton
        text="Remove friend"
        handleClick={() => {
          handleRemoveFriend();
        }}
      />
    );
  } else if (loggedUser.friendRequests?.includes(displayedProfile.id)) {
    befriendButton = (
      <StandardButton
        text="Add friend"
        handleClick={() => {
          handleAddFriend();
        }}
      />
    );
  } else if (!displayedProfile.friendRequests.includes(loggedUser.id!)) {
    befriendButton = (
      <StandardButton
        text="Send request"
        handleClick={() => {
          handleSendFriendRequest();
        }}
      />
    );
  } else {
    befriendButton = (
      <span className="w-full bg-primary text-white flex items-center justify-center font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150">
        Request sent
      </span>
    );
  }

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow shadow-primary dark:bg-background-dark dark:border-gray-700">
      <div className="flex flex-col items-center pb-10 mt-5">
        {/* Profile picture */}
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={`${process.env.REACT_APP_SERVER_URL}${displayedProfile.profilePicture}`}
          alt={`${displayedProfile.firstName} ${displayedProfile.lastName}`}
        />
        {/* Name */}
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {displayedProfile.firstName} {displayedProfile.lastName}
        </h5>
        {/* About user */}
        {displayedProfile.editUserActive ? (
          <input
            type="text"
            className="border p-1 border-primary rounded-lg"
            name="about"
            value={changeUserDataForm.about}
            onChange={handleChangeUserData}
          />
        ) : (
          <span className="text-sm text-center px-8 text-gray-500 dark:text-gray-dark">
            {displayedProfile.about}
          </span>
        )}

        {loggedUser.id !== displayedProfile.id && (
          <div className="flex w-full px-8 mt-4 space-x-3 md:mt-6">
            {/* Remove or add friend button */}
            {befriendButton}
            {/* Message button */}
            <Link
              to={`/chat/${displayedProfile.id}`}
              className="w-full px-4 py-2 border flex justify-center gap-2 border-slate-300 rounded-lg dark:text-white text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
            >
              Message
            </Link>
          </div>
        )}
        {/* If seeing your own profile, can edit it */}
        {loggedUser.id === displayedProfile.id &&
          !displayedProfile.editUserActive && (
            <button
              type="button"
              className="text-primary text-sm mt-2 hover:text-primary-lighter dark:text-primary-lighter dark:hover:text-primary"
              onClick={() => dispatch(ProfilePageSlice.setEditUserActive(true))}
            >
              Edit profile
            </button>
          )}
        {loggedUser.id === displayedProfile.id &&
          displayedProfile.editUserActive && (
            <div className="flex w-full px-8 mt-4 space-x-3 md:mt-6 justify-center">
              <button
                type="button"
                className="text-primary text-sm mt-2  hover:text-primary-lighter dark:text-primary-lighter dark:hover:text-primary"
                onClick={handleConfirmChanges}
              >
                Confirm changes
              </button>
              <button
                type="button"
                className="text-primary text-sm mt-2  hover:text-primary-lighter dark:text-primary-lighter dark:hover:text-primary"
                onClick={() =>
                  dispatch(ProfilePageSlice.setEditUserActive(false))
                }
              >
                Cancel
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
