import axios from 'axios';
import { useState, useEffect } from 'react';

import { getToken } from '../../../utils';
import dataToCommentObject from '../utils/dataToCommentObject';
import Comment from './Comment';
import { CommentInterface } from '../types/Comment';

type CommentsSectionProps = {
  postId: string;
};

export default function CommentsSection(props: CommentsSectionProps) {
  const { postId } = props;
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const getComments = async () => {
      axios.defaults.headers.common.Authorization = getToken();

      const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/comments/${postId}?sortOrder=desc&limit=5&offset=${offset}`;
      setOffset((oldOffset) => oldOffset + 5);

      const request = await axios.get(apiUrl);
      const { comments: commentsData } = request.data;

      const commentObjects: CommentInterface[] = commentsData.map(
        (comment: any) => {
          return dataToCommentObject(comment);
        },
      );

      setComments(commentObjects);
    };

    getComments();
  }, []);

  if (comments.length === 0) {
    return null;
  }

  return (
    <section className="w-full border">
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
    </section>
  );
}
