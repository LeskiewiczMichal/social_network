import axios from 'axios';
import { AppThunk } from '../../../types';

/// TODO: do a path on the server to just upload a profile picture, without user first ///
/// propably cant do that because of picture type, better to first register user and than send file to upload here automatically ///

const uploadProfilePicture =
  (picture: File): AppThunk =>
  async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/`,
      );
    } catch (err) {
      console.error(err);
    }
  };
