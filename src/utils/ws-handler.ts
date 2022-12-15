import { AppModal } from "../app-modal/app-moda";
import { ChatContacts } from "../chat-contacts/chat-contacts";
import { appendMessage, ChatMessagesList, MessageLists } from "../chat-messages-list/chat-messages-list";
import { IS_LOCAL, SERVER } from "./constants";

export function initWebSockets(_id: string) {
  let ws: WebSocket;
  let wss = "wss";
  if (IS_LOCAL) {
    wss = "ws";
  }
  ws = new WebSocket(
    `${wss}://${SERVER}/ws?id=${_id}`
  );

  ws.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);
    if (!data.type) {
      const { message, from } = JSON.parse(event.data);
      if (ChatContacts.activeChat === from) {
        appendMessage(message, from);
      }
      MessageLists[from].push(JSON.parse(event.data))
    } else {
      switch (data.type) {
        case 'request-received':
          (AppModal.show as any)('New Friend Request!');
          ChatContacts.requests.push(data as never);
          break;
        case 'request-accepted':
          (AppModal.show as any)(data.email + ' accepted your firend request');
          ChatContacts.contacts.push(data as never);
          break;
      }
    }
  });

  ws.onclose = () => {
    setTimeout(() => {
      initWebSockets(_id);
      (ChatMessagesList.refreshMessages as any)()
      (ChatContacts.loadContacts as any)();
    });
  };

  (window as any)['ws'] = ws;

  return ws;
}
