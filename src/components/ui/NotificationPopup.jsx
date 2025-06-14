import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { format } from 'date-fns';

const NotificationPopup = ({ onClose }) => {
  const { notifications, markAsRead, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
        <div className="p-4 text-center text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
      <div className="p-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                notification.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(notification.date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPopup; 