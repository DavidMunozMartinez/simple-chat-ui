import { createClient, User, UserResponse } from "@supabase/supabase-js";
import { Bind } from "bindrjs"
import { ChatContacts } from "../contacts-view/chat-contacts";
import { ChatHeader } from "../chat-views/chat-header/chat-header";
import { ProfileBind } from "../profile-view/profile-view";
import { SplashScreen } from "../global-views/splash-screen/splash-screen";
import { SUPABASE_URL, SUPABASE_KEY, WEB_PUSH_KEY } from "../utils/constants";
import { AppUser, getUserId, updateUserToken } from "../utils/server-services/user-server.service";
import { initWebSockets } from "../utils/ws-handler";
import { AppModal } from "../global-views/app-modal/app-modal";
import { serverSignIn } from "../utils/server-services/server-handler";
import { messaging } from "../utils/firebase-service";
import { getToken } from "firebase/messaging";

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
            getUserId(value.data.user.id).then((user: AppUser) => {
              assignUserToApp(user, value.data.user as User);
            })
          } else {
            SplashScreen.loading = false;
          }
        })
        .catch(() => {
          SplashScreen.loading = false;
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
    SplashScreen.loading = true;
    AppModal.show('Signing in...')
    const { data, error } = await supabase.auth.signUp({
      email: bind.email,
      password: bind.password,
    });
    if (error) {
      console.error(error);
      SplashScreen.loading = false;
    } else {
      if (data.user && data.user.email && data.user.id) {
        let auth = data.user;
        serverSignIn(data.user.id, data.user.email).then((user: any) => {
          assignUserToApp(user, auth);
          SplashScreen.loading = false;
        });
      }
    }
  }

  async function login() {
    if (!bind.email || !bind.password) return;
    SplashScreen.loading = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: bind.email,
      password: bind.password,
    });
    if (error) {
      console.error(error);
      SplashScreen.loading = false;
    } else {
      if (data.user) {
        let auth = data.user;
        getUserId(data.user.id).then((user) => {
          assignUserToApp(user, auth);
          SplashScreen.loading = false;
        })
      }
    }
  }

  function logout () {
    return supabase.auth.signOut().then(() => {
      // unsubscribe();
      location.reload();
    });
  }

  function assignUserToApp(user: AppUser, auth: User) {
    bind.activeSession = true;
    ChatHeader._id = user._id;
    if (auth.email) {
      ProfileBind.email = auth.email;
      ProfileBind.photo = '';
      ProfileBind.displayName = user.name || '';
      ChatHeader.email = auth.email;

    }
    ChatContacts.loadContacts(true);
    initWebSockets(user._id);
    initWebPush();
  }

  async function initWebPush() {
    let currentToken = '';
    try {
      currentToken = await getToken(messaging, {
        vapidKey: WEB_PUSH_KEY
      });
      updateUserToken(ChatHeader._id, currentToken);
    } catch (error) {
      console.log('An error occurred while retrieving token.', error);
    }
  }

  return bind;
})();
