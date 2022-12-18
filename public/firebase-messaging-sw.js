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
messaging.onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  if (payload.notification) {
    const notification = payload.notification;

    const notificationTitle = notification.title || 'Untitled';
    const notificationOptions = {
      body: notification.body,
      icon: notification.icon,
      image: notification.image
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  }
});