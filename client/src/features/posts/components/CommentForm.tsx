import { useState } from 'react';

import { ReactComponent as SendMessageImg } from '../../../assets/icons/add-comment.svg';
import { useAppSelector } from '../../../hooks';
import { ProfilePicture } from '../../../components';

interface CommentFormProps {
  postId: string;
}

export default function CommentForm(props: CommentFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { postId } = props;
  const user = useAppSelector((state) => state.user);
  const [body, setBody] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  return (
    <section className="flex flex-row w-full items-start px-4 py-2">
      {/* Profile picture */}
      {/* <Link className="" to={`/profile/${user.id}`}>
        <div className="w-10 h-10 rounded-full object-cover mr-4 shadow mb-4 md:mb-0">
          <img
            className="w-10 h-10 rounded-full object-cover mr-4 shadow mb-4 md:mb-0"
            src={`${process.env.REACT_APP_SERVER_URL}${user.profilePicture}`}
            alt="avatar"
          />
        </div>
      </Link> */}
      <ProfilePicture
        size={10}
        userId={user.id!}
        userPicture={user.profilePicture!}
      />
      <form
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label="add comment"
        className={`rounded-lg bg-gray-200 w-full px-2 pt-1 pb-2 flex flex-col ${
          isFocused ? 'max-h-full' : 'max-h-fit'
        } `}
      >
        {/* Input */}
        <textarea
          name="body"
          id="body"
          className="bg-gray-200 w-full px-2 focus:outline-none no-scrollbar resize-none"
          placeholder="Add a comment..."
          value={body}
          onChange={handleChange}
        />
        {/* Send button */}
        {isFocused && (
          <button
            type="button"
            className="w-fit h-fit  self-end mr-1 font-medium rounded-full text-sm  text-center inline-flex items-center "
            aria-label="add comment"
          >
            <SendMessageImg
              className="w-5 h-5 flex cursor-pointer items-center justify-center"
              viewBox="0 0 24 24"
              fill="#4f46e5"
            />
          </button>
        )}
      </form>
    </section>
  );
}
