import { useEffect, useState } from 'react';
import axios from 'axios';

import { UserTypes } from '../types';
import { Post, PostTypes } from '../features/posts';
import dataToPostObject from '../features/posts/utils/dataToPostObject';

export default function Home() {
  const [posts, setPosts] = useState<PostTypes.PostInterface[]>([]);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const getPosts = async () => {
      const token = localStorage.getItem(UserTypes.Token.localStorageName);
      axios.defaults.headers.common.Authorization = token;

      const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/posts?sortOrder=desc&limit=15&offset=${offset}}`;
      setOffset((oldOffset) => oldOffset + 15);

      const request = await axios.get(apiUrl);
      const { posts: postsData } = request.data;

      const postsDataObjects: PostTypes.PostInterface[] = postsData.map(
        (post: any) => {
          return dataToPostObject(post);
        },
      );

      setPosts(postsDataObjects);
    };

    getPosts();
  }, []);

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
