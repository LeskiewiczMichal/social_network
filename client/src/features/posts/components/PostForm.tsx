import React, { useState } from 'react';

import { ProfilePicture, StandardButton } from '../../../components';
import { useAppSelector } from '../../../hooks';
import addPost from '../services/addPost';

enum FormFields {
  POST_TITLE = 'postTitle',
  POST_PHOTO = 'postPhoto',
  POST_BODY = 'postBody',
}

export default function PostForm() {
  const user = useAppSelector((state) => state.user);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postBody, setPostBody] = useState<string>('');
  const [postPhoto, setPostPhoto] = useState<File | null>(null);
  const [postCreatedMessage, setPostCreatedMessage] = useState<string | null>(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target.name === FormFields.POST_TITLE) {
      setPostTitle(e.target.value);
    }
    if (e.target.name === FormFields.POST_PHOTO) {
      if (e.target instanceof HTMLInputElement) {
        const { files } = e.target;
        if (!files || !files[0]) {
          setPostPhoto(null);
          return;
        }
        setPostPhoto(files![0]);
      }
    }
    if (e.target.name === FormFields.POST_BODY) {
      setPostBody(e.target.value);
    }
  };

  const handleAddPost = async () => {
    if (postTitle === '' || postBody === '') {
      setPostCreatedMessage('Please provide title and body');
      return;
    }

    const message = await addPost({
      title: postTitle,
      body: postBody,
      file: postPhoto,
    });
    setPostCreatedMessage(message);
    setPostTitle('');
    setPostPhoto(null);
    setPostBody('');
  };

  return (
    <form className="flex flex-col p-4 bg-white shadow-lg rounded-xl mx-4 md:mx-auto min-h-fit  max-w-md md:max-w-2xl mb-6 md:mb-12 dark:bg-background-dark">
      <div className="flex flex-col md:flex-row items-start py-2">
        <ProfilePicture
          size={10}
          userId={user.id!}
          userPicture={user.profilePicture!}
        />
        <div className="flex flex-col gap-2">
          <input
            name={FormFields.POST_TITLE}
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600"
            onChange={handleChange}
            value={postTitle}
            placeholder="Title..."
          />

          <textarea
            name={FormFields.POST_BODY}
            id=""
            cols={30}
            rows={4}
            className="bg-gray-100 border border-primary-lighter shadow no-scrollbar resize-none rounded-xl p-2 dark:bg-gray-600 dark:border-white"
            placeholder="Share your thoughts..."
            value={postBody}
            onChange={handleChange}
          />
          <input
            type="file"
            name={FormFields.POST_PHOTO}
            onChange={handleChange}
            className="block w-full text-sm text-slate-500 dark:text-gray-dark
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-slate-150 dark:file:bg-gray-400
      file:text-primary dark:file:text-white-dark
      hover:file:bg-primary-lighter
      hover:file:text-white
    "
          />

          <StandardButton text="Add post" handleClick={handleAddPost} />
          {postCreatedMessage && (
            <span className="text-gray-600">{postCreatedMessage}</span>
          )}
        </div>
      </div>
    </form>
  );
}
