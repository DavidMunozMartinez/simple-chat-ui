import { Bind } from "bindrjs";
import { LoginBind } from "../login-view/login-view";
import { uniqueId } from "../utils/ws-handler";
import './chat-upper-bar.scss';

export const ChatUpperBar = (() => {

  const params: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });

  const { bind } = new Bind({
    id: 'chat-upper-bar',
    bind: {
      id: uniqueId,
      sendTo: params.id ? params.id : '',
      email: '',
      logout,
    }
  });


  function logout() {
    (LoginBind.logout as any)().then(() => {
      LoginBind.activeSession = false;
      bind.id = '';
      bind.email = '';
    });
  }

  return bind;
})();