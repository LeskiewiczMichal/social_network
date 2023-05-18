import { useEffect, useState } from 'react';
import axios from 'axios';
import { JsxElement } from 'typescript';

import { UserTypes } from '../types';
import { Post, PostTypes } from '../features/posts';
import dataToPostObject from '../utils/dataToPostObject';

export default function Home() {
  const [posts, setPosts] = useState<PostTypes.Post[]>([]);
  useEffect(() => {
    const getPosts = async () => {
      const token = localStorage.getItem(UserTypes.Token.localStorageName);
      axios.defaults.headers.common.Authorization = token;

      const request = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/posts`,
      );

      const { posts: postsData } = request.data;
      const postsDataObjects: PostTypes.Post[] = postsData.map((post: any) => {
        return dataToPostObject(post);
      });
      setPosts(postsDataObjects);
    };

    getPosts();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen padding-top-header flex flex-col items-center">
      {posts.map((post: PostTypes.Post) => {
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
