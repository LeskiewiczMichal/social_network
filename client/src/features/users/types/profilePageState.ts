export interface ProfilePageState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: string[];
  country: string;
  city: string;
  postalCode: string;
  about: string;
  birthday: string;
  profilePicture: string;
  showFriends: boolean;
  friendRequests: string[];
}
