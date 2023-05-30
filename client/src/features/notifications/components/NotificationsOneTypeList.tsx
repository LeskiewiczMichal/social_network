import { LoadingSpinner } from '../../../components';
import { NotificationInterface } from '../types/notification';
import Notification from './Notification';

interface NotificationsOneTypeListProps {
  notificationsToShow: NotificationInterface[];
  noMoreRequestsTextActive: boolean;
  getMoreNotifications: (limit: number, initial: boolean) => Promise<void>;
  isLoading: boolean;
  header: string;
}

export default function NotificationsOneTypeList(
  props: NotificationsOneTypeListProps,
) {
  const {
    notificationsToShow,
    noMoreRequestsTextActive,
    getMoreNotifications,
    isLoading,
    header,
  } = props;

  return (
    <div className="flex flex-col items-center w-full md:w-2/6 bg-white mb-2 border rounded-lg">
      <h4 className="border-b my-2 text-gray-600">{header}:</h4>
      <div className="flex flex-col items-center w-full divide-y divide-gray-100 dark:divide-gray-700">
        {notificationsToShow.map((notification: NotificationInterface) => {
          return (
            <Notification
              key={notification.id}
              sender={notification.sender}
              receiver={notification.receiver}
              id={notification.id}
              createdAt={notification.createdAt}
              type={notification.type}
            />
          );
        })}
        {isLoading && <LoadingSpinner />}
        {!noMoreRequestsTextActive && (
          <button
            className="mb-2 text-sm text-primary"
            type="button"
            onClick={() => getMoreNotifications(5, false)}
          >
            Load more...
          </button>
        )}
        {noMoreRequestsTextActive && (
          <p className="mb-2 text-sm text-gray-600">No more posts to show</p>
        )}
      </div>
    </div>
  );
}
