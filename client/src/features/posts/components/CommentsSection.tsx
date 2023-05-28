import { useState, useEffect } from 'react';

import { useAppSelector } from '../../../hooks';
import addComment from '../services/addComment';
import { ReactComponent as SendMessageImg } from '../../../assets/icons/add-comment.svg';
import Comment from './Comment';
import getComments from '../actions/getComments';
import { CommentInterface } from '../types/Comment';
import { LoadingSpinner, ProfilePicture } from '../../../components';

type CommentsSectionProps = {
  postId: string;
  numberOfComments: number;
  setNumberOfComments: React.Dispatch<React.SetStateAction<number>>;
};

// See more button
export default function CommentsSection(props: CommentsSectionProps) {
  const { postId, numberOfComments, setNumberOfComments } = props;
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useAppSelector((state) => state.user);
  const [body, setBody] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  useEffect(() => {
    const handleGetComments = async () => {
      try {
        const queriedComments = await getComments({ postId, limit: 2, offset });
        setOffset((oldOffset: number) => oldOffset + 2);
        setComments(queriedComments);
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetComments();
  }, []);

  const handleAddComment = async () => {
    try {
      const newComment = await addComment({ body, postId });
      if (newComment) {
        setBody('');
        setNumberOfComments((oldNumber) => oldNumber + 1);
        setComments((oldComments) => {
          const newComments = [...oldComments];
          newComments.push(newComment);
          return newComments;
        });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="w-full border py-2 flex flex-col items-center rounded-lg">
      {/* Comment form */}
      <section className="flex flex-row w-full items-start px-4 py-2">
        <ProfilePicture
          size={10}
          userId={user.id!}
          userPicture={user.profilePicture!}
        />
        <form
          aria-label="add comment"
          className={`rounded-lg bg-gray-200 w-full px-2 pt-1 pb-2 flex flex-col  `}
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
          <button
            type="button"
            className="w-fit h-fit  self-end mr-1 font-medium rounded-full text-sm  text-center inline-flex items-center "
            aria-label="add comment"
            onClick={handleAddComment}
          >
            <SendMessageImg
              className="w-5 h-5 flex cursor-pointer items-center justify-center"
              viewBox="0 0 24 24"
              fill="#4f46e5"
            />
          </button>
        </form>
      </section>
      {/* Post's comments */}
      {comments.map((comment: CommentInterface) => {
        return (
          <Comment
            key={comment.id}
            id={comment.id}
            body={comment.body}
            author={comment.author}
            createdAt={comment.createdAt}
            updatedAt={comment.updatedAt}
            likes={comment.likes}
            post={comment.post}
          />
        );
      })}
      {comments.length < numberOfComments && (
        <button
          type="button"
          className="font-bold text-primary hover:text-primary-lighter"
        >
          Load more comments...
        </button>
      )}
    </section>
  );
}
