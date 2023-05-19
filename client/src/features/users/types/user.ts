export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  postalCode: string;
  about: string;
  friends: string[];
  friendRequests: string[];
  birthday: string;
  profilePicture: string;
  googleId?: string;
}
