import { useEffect, useState } from 'react';

import { LoadingSpinner } from '../../../components';
import Post from './Post';
import { PostInterface } from '../types/Post';
import getPosts from '../services/getPosts';

interface PostsSectionProps {
  author?: string;
}

export default function PostsSection(props: PostsSectionProps) {
  const { author } = props;
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [offset, setOffset] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noMorePostsTextActive, setNoMorePostsTextActive] =
    useState<boolean>(false);

  useEffect(() => {
    // Get posts from the server
    const handleGetPosts = async () => {
      try {
        setNoMorePostsTextActive(false);
        const limit = 10;
        setIsLoading(true);
        const queriedPosts = await getPosts({
          offset: 0,
          author,
          limit,
          inUserFriends: true,
        });
        setPosts(queriedPosts);
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetPosts();
  }, [author]);

  // When scrolled to the bottom, query more posts
  const handleScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        const limit = 10;
        const queriedPosts = await getPosts({
          offset,
          author,
          limit,
          inUserFriends: true,
        });
        setOffset((oldOffset) => oldOffset + limit);
        setPosts((oldPosts) => {
          return [...oldPosts, ...queriedPosts];
        });
        // If no posts added, show text
        if (queriedPosts.length === 0) {
          setNoMorePostsTextActive(true);
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Attach scroll event
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset, author]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-slate-50 min-h-screen w-full flex flex-col items-center dark:bg-gray-900">
      {posts.length === 0 && (
        <>
          <span className="text-primary">
            Currently there are no posts that we can show you
          </span>
          <span className="text-primary">Add some friends to see more</span>
        </>
      )}
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
      {noMorePostsTextActive && posts.length !== 0 && (
        <p className="mb-4">No more posts to show</p>
      )}
    </div>
  );
}

PostsSection.defaultProps = {
  author: null,
};
