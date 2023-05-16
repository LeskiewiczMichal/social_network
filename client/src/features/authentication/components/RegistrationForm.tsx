import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  RegisterFormData,
  RegisterFieldNames,
  RegisterChangeEvent,
  DEFAULT_PIC_URL,
} from '../types/register';
import CountrySelect from './CountrySelect';
import register from '../actions/register';
import StandardButton from '../../../components/StandardButton';
import StandardInput from '../../../components/StandardInput';

export const initialFormData: RegisterFormData = {
  firstName: '',
  lastName: '',
  birthday: '2020-01-01',
  email: '',
  password: '',
  country: 'Poland',
  city: '',
  postalCode: '',
  about: '',
  profilePicture: null,
};

export default function RegistrationForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.error.registerError);
  const [imagePreview, setImagePreview] = useState(DEFAULT_PIC_URL);
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);

  const handleRegister = () => {
    dispatch(register({ ...formData, navigate }));
  };

  const handleChange = (e: RegisterChangeEvent): void => {
    const { value, name } = e.target;

    setFormData((oldData: RegisterFormData) => {
      const newData: RegisterFormData = { ...oldData };

      switch (name) {
        case RegisterFieldNames.FirstName:
          newData.firstName = value;
          break;
        case RegisterFieldNames.LastName:
          newData.lastName = value;
          break;
        case RegisterFieldNames.Birthday:
          newData.birthday = value;
          break;
        case RegisterFieldNames.Email:
          newData.email = value;
          break;
        case RegisterFieldNames.City:
          newData.city = value;
          break;
        case RegisterFieldNames.About:
          newData.about = value;
          break;
        case RegisterFieldNames.Country:
          newData.country = value;
          break;
        case RegisterFieldNames.PostalCode:
          newData.postalCode = value;
          break;
        case RegisterFieldNames.ProfilePicture:
          if (e.target instanceof HTMLInputElement) {
            const { files } = e.target;
            if (!files) {
              newData.profilePicture = null;
              setImagePreview(DEFAULT_PIC_URL);
              break;
            }
            // eslint-disable-next-line prefer-destructuring
            const file = files[0];
            if (!file) {
              newData.profilePicture = null;
              setImagePreview(DEFAULT_PIC_URL);
              break;
            }
            // Set file in form and add preview to the page
            newData.profilePicture = file;
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.result) {
                let dataURL = reader.result;
                if (typeof dataURL !== 'string') {
                  const decoder = new TextDecoder('utf-8');
                  dataURL = decoder.decode(dataURL);
                }
                setImagePreview(dataURL);
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        case RegisterFieldNames.Password:
          newData.password = value;
          break;
        default:
          break;
      }

      return newData;
    });
  };

  return (
    <form>
      <Logo className="mb-4" />
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="font-extrabold text-2xl mt-4 mb-1">
          Personal Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Give us some info about yourself.
        </p>

        {/* First name */}
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <StandardInput
              name={RegisterFieldNames.FirstName}
              labelText="First name"
              value={formData[RegisterFieldNames.FirstName]}
              handleChange={handleChange}
              autoComplete="name"
              autoCapitalize="words"
            />
          </div>

          {/* Last name */}
          <div className="sm:col-span-3">
            <StandardInput
              name={RegisterFieldNames.LastName}
              labelText="Last name"
              value={formData[RegisterFieldNames.LastName]}
              handleChange={handleChange}
              autoComplete="family-name"
              autoCapitalize="words"
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-3">
            <StandardInput
              name={RegisterFieldNames.Password}
              type="password"
              labelText="Password"
              value={formData[RegisterFieldNames.Password]}
              handleChange={handleChange}
            />
          </div>

          {/* Birthday */}
          <div className="sm:col-span-4">
            <StandardInput
              name={RegisterFieldNames.Birthday}
              type="date"
              labelText="Birthday"
              value={formData[RegisterFieldNames.Birthday]}
              handleChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-4">
            <StandardInput
              name={RegisterFieldNames.Email}
              type="email"
              labelText="Email address"
              value={formData[RegisterFieldNames.Email]}
              handleChange={handleChange}
              autoComplete="email"
            />
          </div>

          {/* Country */}
          <CountrySelect
            fieldName={RegisterFieldNames.Country}
            value={formData.country}
            handleChange={handleChange}
          />

          {/* City */}
          <div className="sm:col-span-2 sm:col-start-1">
            <StandardInput
              name={RegisterFieldNames.City}
              labelText="City"
              value={formData[RegisterFieldNames.City]}
              handleChange={handleChange}
              autoComplete="address-level2"
              autoCapitalize="words"
            />
          </div>

          {/* ZIP */}
          <div className="sm:col-span-2">
            <StandardInput
              name={RegisterFieldNames.PostalCode}
              labelText="ZIP / Postal code"
              value={formData[RegisterFieldNames.PostalCode]}
              handleChange={handleChange}
              autoComplete="postal-code"
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="border-b border-gray-900/10 pb-12">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor={RegisterFieldNames.About}
              className="block text-gray-700 text-sm font-bold mb-3"
            >
              About me
            </label>
            <div className="mt-2">
              <textarea
                id={RegisterFieldNames.About}
                name={RegisterFieldNames.About}
                value={formData[RegisterFieldNames.About]}
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={handleChange}
              />
            </div>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Write a few sentences.
            </p>
          </div>

          {/* Profile picture */}
          <div className="col-span-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-3"
              htmlFor={RegisterFieldNames.ProfilePicture}
            >
              Upload profile picture
            </label>
            <img
              src={imagePreview}
              alt="Preview of profile pic"
              className="w-60 h-60 border-2 border-black mb-2"
              loading="lazy"
            />
            <input
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-lighter focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-describedby="User avatar input"
              id={RegisterFieldNames.ProfilePicture}
              name={RegisterFieldNames.ProfilePicture}
              type="file"
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm italic mb-2 self-center">
            {error}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <StandardButton
          text="Cancel"
          handleClick={() => navigate('/')}
          width="1/5"
          bgColor="white"
          hoverColor="white"
          textColor="black"
        />
        <StandardButton text="Save" handleClick={handleRegister} width="1/5" />
      </div>
    </form>
  );
}
