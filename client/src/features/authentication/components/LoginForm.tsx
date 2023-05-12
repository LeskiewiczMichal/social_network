import React, { useState } from 'react';
import { useAppDispatch } from '../../../hooks';
import login from '../actions/login';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import GoogleLogo from '../../../assets/google-icon.svg';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(login({ email, password }));
  };

  return (
    <form className="self-center w-5/6">
      {/* Text */}
      <div className="mb-10">
        <Logo />
        <h1 className="font-extrabold text-2xl mt-4 mb-2">
          Sign in to your account
        </h1>
        <h4 className="text-gray-500">
          Not a member?{' '}
          <a
            href="ok"
            className="font-bold text-primary hover:text-primary-lighter"
          >
            Click here to register
          </a>
        </h4>
      </div>
      {/* Input fields */}
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-3"
        >
          Email address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-3"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {/* Sing-ins */}
      <div className="flex flex-col mt-4">
        <a
          href="aef"
          className="font-bold text-primary self-end mb-4 hover:text-primary-lighter"
        >
          Forgot password?
        </a>
        <button
          className="bg-primary hover:bg-primary-lighter text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150"
          type="button"
          onClick={handleSubmit}
        >
          Sign In
        </button>

        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-full h-px my-8 bg-gray-300 border-0 dark:bg-gray-700" />
          <span className="absolute px-3 font-medium text-gray-600 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
            Or continue with
          </span>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="w-2/5 px-4 py-2 border flex justify-center gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
          >
            <img
              className="w-6 h-6"
              src={GoogleLogo}
              loading="lazy"
              alt="google logo"
            />
            <span>Google</span>
          </button>
          <button
            className="w-2/5 bg-primary hover:bg-primary-lighter text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150"
            type="button"
            onClick={handleSubmit}
          >
            Offline
          </button>
        </div>
      </div>
    </form>
  );
}
