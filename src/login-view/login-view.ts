import { createClient, User, UserResponse } from "@supabase/supabase-js";
import { Bind } from "bindrjs"
import { ChatContacts } from "../chat-contacts/chat-contacts";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { ProfileBind } from "../profile-view/profile-view";
import { SpashScreen } from "../splash-screen/spash-screen";
import { SUPABASE_URL, SUPABASE_KEY, WEB_PUSH_KEY } from "../utils/constants";
import { getUserId, serverSignIn, updateUserToken } from "../utils/server-handler";
import { initWebSockets } from "../utils/ws-handler";
import './login-view.scss';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, MessagePayload, NotificationPayload, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const messaging = getMessaging(app);

onMessage(messaging, (data: MessagePayload) => {
  if (data.notification) {
    const notification: NotificationPayload = data.notification;
    new Notification(notification.title || 'Untitled', {
      body: notification.body,
      icon: notification.icon,
      image: notification.image
    });
  }
});

export const LoginBind = (() => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  // const observer = new Obs
  const { bind } = new Bind({
    id: 'login-view',
    bind: {
      activeSession: false,
      activeHeader: 'Login',
      tabHeaders: ['Login', 'Sign in'],
      showPassword: false,
      showRepeatPassword: false,
      email: '',
      password: '',
      repeatPassword: '',
      loginKeyListener,
      signinKeyListener,
      onHeaderClick,
      signin,
      login,
      logout,
    },
    ready: () => {
      supabase.auth.getUser()
        .then((value: UserResponse) => {
          if (value.data && value.data.user && value.data.user.id) {
            getUserId(value.data.user.id).then((user) => {
              assignUserToApp(user, value.data.user as User);
            })
          } else {
            SpashScreen.loading = false;
          }
        })
        .catch(() => {
          SpashScreen.loading = false;
        })
    }
  });

  function loginKeyListener(event: KeyboardEvent) {
    if (event.key === 'Enter') (bind.login as any)();
  }

  function signinKeyListener(event: KeyboardEvent) {
    if (event.key === 'Enter') (bind.signin as any)();
  }

  function onHeaderClick(header: string) {
    bind.activeHeader = header;
  }

  async function signin() {
    if (!bind.email || !bind.password || (bind.password != bind.repeatPassword)) return;
    const { data, error } = await supabase.auth.signUp({
      email: bind.email,
      password: bind.password,
    });
    if (error) {
      console.error(error);
    } else {
      if (data.user && data.user.email && data.user.id) {
        let auth = data.user;
        serverSignIn(data.user.id, data.user.email).then((user: any) => {
          assignUserToApp(user, auth);
        });
      }
    }
  }

  async function login() {
    if (!bind.email || !bind.password) return;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: bind.email,
      password: bind.password,
    });
    if (error) {
      console.error(error);
    } else {
      if (data.user) {
        let auth = data.user;
        getUserId(data.user.id).then((user) => {
          assignUserToApp(user, auth);
        })
      }
    }
  }

  function logout () {
    return supabase.auth.signOut().then(() => {
      location.reload();
    });
  }

  function assignUserToApp(user: any, auth: User) {
    bind.activeSession = true;
    ChatUpperBar._id = user._id;
    if (auth.email) {
      ProfileBind.email = auth.email;
      ProfileBind.photo = '';
      ProfileBind.displayName = user.name;
      ChatUpperBar.email = auth.email;

    }
    (ChatContacts.loadContacts as any)(true);
    initWebSockets(user._id);
    initWebPush();
  }

  async function initWebPush() {
    let currentToken = '';
    try {
      // messaging.app.option
      currentToken = await getToken(messaging, {
        vapidKey: WEB_PUSH_KEY
      });
      console.log(currentToken);
      updateUserToken(ChatUpperBar._id, currentToken);
    } catch (error) {
      console.log('An error occurred while retrieving token.', error);
    }
  }

  return bind;
})();
