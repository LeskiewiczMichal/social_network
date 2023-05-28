import { useAppSelector } from '../../../hooks';
import { UserState } from '../../authentication/types/userState';
import { UserTypes } from '../../users';

interface MessageProps {
  body: string;
  sender: UserTypes.UserInterface | UserState;
}

export default function Message(props: MessageProps) {
  const loggedUserId = useAppSelector((state) => state.user.id);
  const { body, sender } = props;
  //   const loggedUserId = sender.id;

  return (
    <div
      className={`${
        loggedUserId === sender.id ? 'self-end justify-end' : 'self-start'
      } w-3/5 flex`}
    >
      {loggedUserId !== sender.id && (
        <img
          src={`${process.env.REACT_APP_SERVER_URL}${sender.profilePicture}`}
          alt="message author profile"
          className="rounded-full w-4 h-4 self-end transform translate-y-1/2"
        />
      )}
      <span className="bg-primary-lighter py-2 px-4 w-fit max-w-full rounded-lg mx-2 text-white">
        {body}
      </span>
      {loggedUserId === sender.id && (
        <img
          src={`${process.env.REACT_APP_SERVER_URL}${sender.profilePicture}`}
          alt="message author profile"
          className="rounded-full border w-4 h-4 self-end transform translate-y-1/2"
        />
      )}
    </div>
  );
}
