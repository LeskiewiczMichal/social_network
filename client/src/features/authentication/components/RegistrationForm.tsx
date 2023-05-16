import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  RegisterFormData,
  RegisterFieldNames,
  RegisterChangeEvent,
  DEFAULT_PIC_URL,
} from '../types/register';
import CountrySelect from './CountrySelect';
import register from '../actions/register';

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
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Personal Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Informations will be displayed publicly so be careful what you share.
        </p>

        {/* First name */}
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor={RegisterFieldNames.FirstName}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name={RegisterFieldNames.FirstName}
                id={RegisterFieldNames.FirstName}
                value={formData[RegisterFieldNames.FirstName]}
                autoComplete="given-name"
                className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Last name */}
          <div className="sm:col-span-3">
            <label
              htmlFor={RegisterFieldNames.LastName}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name={RegisterFieldNames.LastName}
                id={RegisterFieldNames.LastName}
                value={formData[RegisterFieldNames.LastName]}
                autoComplete="family-name"
                className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="sm:col-span-3">
            <label
              htmlFor={RegisterFieldNames.Password}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name={RegisterFieldNames.Password}
                id={RegisterFieldNames.Password}
                value={formData[RegisterFieldNames.Password]}
                className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Birthday */}
          <div className="sm:col-span-4">
            <label
              htmlFor={RegisterFieldNames.Birthday}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Birthday
            </label>
            <div className="mt-2">
              <input
                type="date"
                id={RegisterFieldNames.Birthday}
                name={RegisterFieldNames.Birthday}
                value={formData[RegisterFieldNames.Birthday]}
                min="1950-01-01"
                className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="sm:col-span-4">
            <label
              htmlFor={RegisterFieldNames.Email}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id={RegisterFieldNames.Email}
                name={RegisterFieldNames.Email}
                value={formData[RegisterFieldNames.Email]}
                type="email"
                autoComplete="email"
                className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Country */}
          <CountrySelect
            fieldName={RegisterFieldNames.Country}
            value={formData.country}
            handleChange={handleChange}
          />

          {/* City */}
          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor={RegisterFieldNames.City}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              City
            </label>
            <div className="mt-2">
              <input
                type="text"
                name={RegisterFieldNames.City}
                id={RegisterFieldNames.City}
                value={formData[RegisterFieldNames.City]}
                autoComplete="address-level2"
                className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ZIP */}
          <div className="sm:col-span-2">
            <label
              htmlFor={RegisterFieldNames.PostalCode}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ZIP / Postal code
            </label>
            <div className="mt-2">
              <input
                type="text"
                name={RegisterFieldNames.PostalCode}
                id={RegisterFieldNames.PostalCode}
                value={formData[RegisterFieldNames.PostalCode]}
                autoComplete="postal-code"
                className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Give us some info about yourself.
          </p>

          {/* About */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor={RegisterFieldNames.About}
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id={RegisterFieldNames.About}
                  name={RegisterFieldNames.About}
                  value={formData[RegisterFieldNames.About]}
                  rows={3}
                  className="block w-full rounded-md px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={handleChange}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences.
              </p>
            </div>

            {/* Profile picture */}
            <div className="col-span-full">
              <img
                src={imagePreview}
                alt="Preview of profile pic"
                className="w-60 h-60 border-2 border-black"
              />
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor={RegisterFieldNames.ProfilePicture}
              >
                Upload profile picture
              </label>
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
          {error && (
            <p className="text-red-500 text-sm italic mb-2 self-center">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-lighter focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={handleRegister}
        >
          Save
        </button>
      </div>
    </form>
  );
}
