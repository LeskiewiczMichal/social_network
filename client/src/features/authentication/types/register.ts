export enum RegisterFieldNames {
  FirstName = 'firstName',
  LastName = 'lastName',
  Password = 'password',
  Birthday = 'birthday',
  Email = 'email',
  Country = 'country',
  City = 'city',
  PostalCode = 'postalCode',
  About = 'about',
  ProfilePicture = 'profilePicture',
}

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  password: string;
  country: string;
  city: string;
  postalCode: string;
  about: string;
  profilePicture: string;
};

export type RegisterChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;
