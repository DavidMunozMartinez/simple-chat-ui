import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPQc7Y2scgOXCFzs_2guJXM6ZlfuaNO00",
  authDomain: "simple-web-chat-64586.firebaseapp.com",
  projectId: "simple-web-chat-64586",
  storageBucket: "simple-web-chat-64586.appspot.com",
  messagingSenderId: "727296131926",
  appId: "1:727296131926:web:6943b05a173c42e69d8cf7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// export const unsubscribe: Unsubscribe = onMessage(messaging, (data: MessagePayload) => {
//   if (data.notification) {
//     const notification: NotificationPayload = data.notification;
//     new Notification(notification.title || 'Untitled', {
//       body: notification.body,
//       icon: notification.icon,
//       image: notification.image
//     });
//   }
// });