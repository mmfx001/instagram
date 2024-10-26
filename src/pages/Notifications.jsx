import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState({ thisMonth: [], earlier: [] });

  useEffect(() => {
    // Fetch data from your JSON Server
    fetch('http://localhost:5001/notification')
      .then(response => response.json())
      .then(data => setNotifications(data))
      .catch(error => console.error('Error fetching notifications:', error));
  }, []);

  const toggleSubscription = (id, type) => {
    // Update the subscription status based on ID and type (thisMonth or earlier)
    setNotifications(prevNotifications => ({
      ...prevNotifications,
      [type]: prevNotifications[type].map(notification =>
        notification.id === id
          ? { ...notification, followable: !notification.followable }
          : notification
      ),
    }));
  };

  const renderNotification = (notification, type, hasButton) => (
    <div key={notification.id} className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <img src={notification.avatar} alt={notification.user} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="text-sm">
            <span className="font-bold">{notification.user}</span> {notification.action}
          </p>
          <span className="text-xs text-gray-500">{notification.time}</span>
        </div>
      </div>
      {hasButton && ( // Show buttons only if hasButton is true
        notification.followable ? (
          <button
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded-lg"
            onClick={() => toggleSubscription(notification.id, type)}
          >
            Подписаться
          </button>
        ) : (
          <button
            className="bg-gray-600 text-white text-sm px-3 py-1 rounded-lg"
            onClick={() => toggleSubscription(notification.id, type)}
          >
            Отписаться
          </button>
        )
      )}
    </div>
  );

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-black text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Уведомления</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">В этом месяце</h3>
        {/* No buttons for this month's notifications */}
        {notifications.thisMonth.map(notification => renderNotification(notification, 'thisMonth', false))}
      </div>

      <hr className="border-gray-600 mb-4" />

      <div>
        <h3 className="text-lg font-semibold mb-2">Ранее</h3>
        {/* Buttons are shown for earlier notifications */}
        {notifications.earlier.map(notification => renderNotification(notification, 'earlier', true))}
      </div>
    </div>
  );
};

export default Notifications;
