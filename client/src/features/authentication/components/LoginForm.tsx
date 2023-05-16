import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import login from '../actions/login';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import GoogleLogo from '../../../assets/google-icon.svg';
import SeparatorLine from '../../../components/SeparatorLine';
import StandardButton from '../../../components/StandardButton';
import StandardInput from '../../../components/StandardInput';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.error.loginError);
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
    <form className="self-center w-96">
      {/* Text */}
      <div className="mb-10">
        <Logo />
        <h1 className="font-extrabold text-2xl mt-4 mb-2">
          Sign in to your account
        </h1>
        <h4 className="text-gray-500">
          Not a member?{' '}
          <Link
            to="/register"
            className="font-bold text-primary hover:text-primary-lighter"
          >
            Click here to register
          </Link>
        </h4>
      </div>

      {/* Input fields */}
      <div className="mb-6">
        <StandardInput
          name="email"
          type="email"
          labelText="Email address"
          value={email}
          handleChange={handleChange}
          autoComplete="email"
        />
      </div>

      <div>
        <StandardInput
          name="password"
          type="password"
          labelText="Password"
          value={password}
          handleChange={handleChange}
        />
      </div>

      {/* Error  */}
      {error && (
        <p className="text-red-500 text-sm italic mb-2 self-center">{error}</p>
      )}

      {/* Buttons */}
      <div className="flex flex-col mt-4">
        {/* Sign in */}
        <StandardButton text="Sign In" handleClick={handleSubmit} />

        <SeparatorLine text="Or continue with" />

        {/* Google */}
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

          {/* Offline */}
          <StandardButton
            text="Offline"
            handleClick={handleSubmit}
            width="2/5"
          />
        </div>
      </div>
    </form>
  );
}
