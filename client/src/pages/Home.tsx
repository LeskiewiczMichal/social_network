import { useEffect, useState } from 'react';

import { LoadingSpinner } from '../components';
import { Post, PostTypes, getPosts } from '../features/posts';

export default function Home() {
  const [posts, setPosts] = useState<PostTypes.PostInterface[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleGetPosts = async () => {
      const queriedPosts = await getPosts({ offset });
      setOffset((oldOffset) => oldOffset + 10);
      setPosts(queriedPosts);
      setIsLoading(false);
    };

    handleGetPosts();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-slate-50 min-h-screen padding-top-header flex flex-col items-center">
      {posts.map((post: PostTypes.PostInterface) => {
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
