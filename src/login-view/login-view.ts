import { createClient, User, UserResponse } from "@supabase/supabase-js";
import { Bind } from "bindrjs"
import { ChatContacts } from "../chat-contacts/chat-contacts";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { SUPABASE_URL, SUPABASE_KEY } from "../utils/constants";
import { getUserId, serverSignIn } from "../utils/server-handler";
import { initWebSockets } from "../utils/ws-handler";
import './login-view.scss';

export const LoginBind = (() => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
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
      supabase.auth.getUser().then((value: UserResponse) => {
        if (value.data && value.data.user && value.data.user.id) {
          getUserId(value.data.user.id).then(({ _id }) => {
            assignUserToApp(_id, value.data.user as User);
          })
        }
      });
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
        let user = data.user;
        serverSignIn(data.user.id, data.user.email).then((id) => {
          assignUserToApp(id, user);
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
        let user = data.user;
        getUserId(data.user.id).then(({_id}) => {
          assignUserToApp(_id, user)
        })
      }
    }
  }

  function logout () {
    return supabase.auth.signOut();
  }

  function assignUserToApp(_id: string, user: User) {
    bind.activeSession = true;
    ChatUpperBar._id = _id;
    if (user.email) {
      ChatUpperBar.email = user.email
    }
    (ChatContacts.loadContacts as any)();
    initWebSockets(_id);
  }

  return bind;
})();