import { useEffect, useState } from 'react';

import { LoadingSpinner } from '../../../components';
import Post from './Post';
import { PostInterface } from '../types/Post';
import getPosts from '../actions/getPosts';

interface PostsSectionProps {
  authorId?: string | null;
}

export default function PostsSection(props: PostsSectionProps) {
  const { authorId } = props;
  const [posts, setPosts] = useState<PostInterface[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // When user changes, reset state and query his posts
    const handleGetPosts = async () => {
      try {
        setIsLoading(true);
        setOffset(0);
        const queriedPosts = await getPosts({ offset: 0, authorId });
        setOffset((oldOffset) => oldOffset + 10);
        setPosts(queriedPosts);
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetPosts();
  }, [authorId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-slate-50 min-h-screen padding-top-header flex flex-col items-center">
      {posts.map((post: PostInterface) => {
        return (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            body={post.body}
            author={post.author}
            comments={post.comments}
            likes={post.likes}
            photo={post.photo}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
          />
        );
      })}
    </div>
  );
}

PostsSection.defaultProps = {
  authorId: null,
};
