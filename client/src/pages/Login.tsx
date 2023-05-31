import { LoginForm } from '../features/authentication';
import LoginPhoto from '../assets/login-background.png';

export default function Login() {
  return (
    <div className="min-h-screen w-screen flex justify-center dark:bg-gray-900">
      <div className="w-5/6 sm:w-3/4 flex items-center justify-center">
        <LoginForm />
      </div>
      <img
        src={LoginPhoto}
        alt="People connected with each other"
        loading="lazy"
        className="hidden lg:block w-7/12 object-center h-screen"
      />
    </div>
  );
}
