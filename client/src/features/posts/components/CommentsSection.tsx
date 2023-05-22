import { useState, useEffect } from 'react';

import CommentForm from './CommentForm';
import Comment from './Comment';
import getComments from '../actions/getComments';
import { CommentInterface } from '../types/Comment';
import { LoadingSpinner } from '../../../components';

type CommentsSectionProps = {
  postId: string;
  numberOfComments: number;
};

export default function CommentsSection(props: CommentsSectionProps) {
  const { postId, numberOfComments } = props;
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="w-full border py-2 flex flex-col items-center rounded-lg">
      <CommentForm postId={postId} />
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
        <p>placeholder for see more button</p>
      )}
    </section>
  );
}
