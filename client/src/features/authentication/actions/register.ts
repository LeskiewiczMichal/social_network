import { AppThunk } from '../../../types';

type RegisterProps = {
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  country: string;
  street: string;
  city: string;
  postalCode: string;
  about: string;
  profilePicture: string;
  googleId?: string;
};

const register =
  (props: RegisterProps): AppThunk =>
  async () => {
    const {
      firstName,
      lastName,
      email,
      birthday,
      country,
      street,
      city,
      postalCode,
      about,
      profilePicture,
      googleId,
    } = props;
  };
