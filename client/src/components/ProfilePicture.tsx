import { Link } from 'react-router-dom';

type ProfilePictureProps = {
  userId: string;
  userPicture: string;
  size: number;
};

export default function ProfilePicture(props: ProfilePictureProps) {
  const { userId, userPicture, size } = props;

  return (
    <Link aria-label="Profile" to={`/profile/${userId}`}>
      <div
        className={`w-${size} h-${size} rounded-full object-cover mr-4 shadow mb-2 md:mb-0`}
      >
        <img
          className={`w-${size} h-${size} rounded-full object-cover mr-4 shadow mb-2 md:mb-0`}
          src={`${process.env.REACT_APP_SERVER_URL}${userPicture}`}
          alt="avatar"
        />
      </div>
    </Link>
  );
}
