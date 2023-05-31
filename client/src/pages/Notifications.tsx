import { NotificationsDisplay } from '../features/notifications';

export default function Notifications() {
  return (
    <main className="padding-top-header px-8 flex justify-center bg-background-white dark:bg-gray-900 min-h-screen">
      <NotificationsDisplay />
    </main>
  );
}
