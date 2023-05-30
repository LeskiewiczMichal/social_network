import axios from 'axios';

import { getToken } from '../../../utils';

interface AddPostProps {
  body: string;
  title: string;
  file: File | null;
}

const addPost = async (props: AddPostProps): Promise<string> => {
  try {
    const { body, title, file } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const formData = new FormData();
    formData.append('body', body);
    formData.append('title', title);
    if (file) {
      formData.append('photo', file);
    }

    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/posts`;
    await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return 'Post created. Go to your profile page to see it!';
  } catch (err: any) {
    console.error(err);
    return 'Post creation failed';
  }
};

export default addPost;
