export type UserState = {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  postalCode: string | null;
  about: string | null;
  friends: string[] | null;
  friendRequests: string[] | null;
  birthday: string | null;
  profilePicture: string | null;
  googleId: string | null;
};
