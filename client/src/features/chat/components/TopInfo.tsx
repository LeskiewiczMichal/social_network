import { Link } from 'react-router-dom';
import { UserTypes } from '../../users';
import { ProfilePicture } from '../../../components';

interface TopInfoProps {
  chatUser: UserTypes.UserInterface;
}

export default function TopInfo(props: TopInfoProps) {
  const { chatUser } = props;

  return (
    <div className="flex text-center bg-white w-full h-fit p-2 rounded-lg justify-between text-primary items-center border shadow border-b-0">
      <div className="grow items-center">
        <Link
          to="/chat"
          className="bg-primary flex justify-center items-center w-1/4 min-w-[3rem] h-8 rounded-xl ml-4"
        >
          <div className="flex flex-row align-middle">
            <svg
              className="w-5 mr-2"
              fill="#FFFFFF"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </Link>
      </div>
      <div className="grow flex justify-center items-center">
        <Link to={`/profile/${chatUser.id}`}>
          {chatUser.firstName} {chatUser.lastName}
        </Link>
      </div>
      <div className="mt-1 grow flex justify-end items-center">
        <ProfilePicture
          userId={chatUser.id}
          userPicture={chatUser.profilePicture}
          size={10}
        />
      </div>
    </div>
  );
}
