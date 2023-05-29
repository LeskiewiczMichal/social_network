import { NotificationsList } from '../features/notifications';

export default function Notifications() {
  return (
    <main className="padding-top-header grid grid-cols-1 md:grid-cols-5 items-center bg-background-white min-h-screen">
      <NotificationsList />
    </main>
  );
}
