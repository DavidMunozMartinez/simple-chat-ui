importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyBPQc7Y2scgOXCFzs_2guJXM6ZlfuaNO00",
  authDomain: "simple-web-chat-64586.firebaseapp.com",
  projectId: "simple-web-chat-64586",
  storageBucket: "simple-web-chat-64586.appspot.com",
  messagingSenderId: "727296131926",
  appId: "1:727296131926:web:6943b05a173c42e69d8cf7"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  if (payload.notification) {
    const notification = payload.notification;

    const notificationTitle = notification.title || 'Untitled';
    const notificationOptions = {
      body: notification.body,
      icon: '/icon-x120.png',
      // image: notification.image,
      timestamp: Date.now(),
      tag: payload.data.tag,
      // renotify: true,
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  }
});

self.addEventListener('notificationclick', (event) => {
  let url = 'https://simple-chat-ui.vercel.app/';
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({type: 'window'}).then( windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});