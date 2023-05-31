import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  UserOverview,
  UserDetails,
  AllFriendsDisplay,
  ProfilePageReducer,
  UserTypes,
} from '../features/users';
import getUsers from '../features/users/services/getUsers';
import { useAppSelector, useAppDispatch } from '../hooks';
import { PostsSection } from '../features/posts';
import { EditUserData } from '../features/users/types/editUserDataForm';
import editProfile from '../features/users/actions/editProfile';
import { setEditUserActive } from '../features/users/reducers/profilePageReducer';

export default function Profile() {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loggedUser = useAppSelector((state) => state.user);
  const displayedUserId = useAppSelector((state) => state.profilePage.id);
  const [editUserData, setEditUserData] = useState<EditUserData>({
    about: '',
    city: '',
    birthday: '',
    country: '',
    email: '',
  });

  const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setEditUserData((oldData: EditUserData) => {
      const newData: EditUserData = { ...oldData };

      if (name === 'about') {
        newData.about = e.target.value;
      }
      if (name === 'city') {
        newData.city = e.target.value;
      }
      if (name === 'birthday') {
        newData.birthday = e.target.value;
      }
      if (name === 'country') {
        newData.country = e.target.value;
      }
      if (name === 'email') {
        newData.email = e.target.value;
      }

      return newData;
    });
  };

  // Confirm edit changes
  const handleConfirmChanges = () => {
    dispatch(
      editProfile({
        about: editUserData.about,
        city: editUserData.city,
        country: editUserData.country,
        birthday: editUserData.birthday,
        email: editUserData.email,
      }),
    );
    dispatch(setEditUserActive(false));
  };

  useEffect(() => {
    // When id from params changes, get user to display
    const handleGetProfile = async () => {
      try {
        let user: UserTypes.UserInterface[];
        // Get user
        if (userId) {
          user = await getUsers({
            usersList: [userId],
            friendRequests: 'true',
          });
        } else {
          // Display user profile
          user = await getUsers({
            usersList: [loggedUser.id!],
            friendRequests: 'true',
          });
        }
        if (user) {
          const currentUser = user[0];
          dispatch(
            ProfilePageReducer.setUser({
              ...currentUser,
              friendRequests: currentUser.friendRequests!,
            }),
          );
          // Turn date into proper string format
          const date = new Date(currentUser.birthday);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          // Set initial data for editing user
          setEditUserData({
            about: currentUser.about,
            city: currentUser.city,
            birthday: formattedDate,
            country: currentUser.country,
            email: currentUser.email,
          });
        }
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetProfile();
  }, [userId]);

  return (
    <main className="padding-top-header grid grid-cols-1 md:grid-cols-5 items-center bg-background-white min-h-screen dark:bg-gray-900">
      <AllFriendsDisplay />

      <div className="flex flex-col items-center h-full md:col-start-2 md:col-end-5 col-start-1 col-end-2">
        <UserOverview
          handleChangeUserData={handleChangeUserData}
          changeUserDataForm={editUserData}
          handleConfirmChanges={handleConfirmChanges}
        />
        <UserDetails
          changeUserDataForm={editUserData}
          handleChangeUserData={handleChangeUserData}
        />
        <PostsSection author={displayedUserId} />
      </div>
    </main>
  );
}
