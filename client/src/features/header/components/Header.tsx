import ProfileDropdown from './ProfileDropdown';
import FriendsSearchBar from './FriendsSearchBar';
import NotificationsDropdown from './NotificationsDropdown';
import MessagesButton from './MessagesButton';
import { ReactComponent as Logo } from '../../../assets/logo.svg';

export default function Header() {
  return (
    <nav className="fixed top-0 w-full flex bg-white p-1 px-4 items-center justify-between shadow">
      <div className="flex flex-auto items-center">
        <Logo />
        <FriendsSearchBar />
      </div>
      <div className="flex items-start justify-end gap-3">
        <MessagesButton />
        <NotificationsDropdown />
        <ProfileDropdown />
      </div>
    </nav>
  );
}
