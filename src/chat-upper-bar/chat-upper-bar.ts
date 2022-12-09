import { Bind } from "bindrjs";
import { uniqueId } from "../utils/ws-handler";
import './chat-upper-bar.scss';

export const ChatUpperBar = (() => {

  const params: any = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });

  const { bind } = new Bind({
    id: 'chat-info',
    bind: {
      id: uniqueId,
      sendTo: params.id ? params.id : '',
    }
  });
  return bind;
})();