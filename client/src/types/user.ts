export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: string[];
  friendRequests: string[];
  birthday: Date;
  profilePicture: string;
  googleId?: string;
}

export type UserState = {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  friends: string[] | null;
  friendRequests: string[] | null;
  birthday: Date | null;
  profilePicture: string | null;
  googleId: string | null;
};
