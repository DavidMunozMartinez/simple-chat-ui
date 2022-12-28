import { AppModal } from "../global-views/app-modal/app-modal";
import { ChatContacts } from "../contacts-view/chat-contacts";
import { appendMessage, ChatMessagesList, MessageLists, UnreadMessages } from "../chat-views/chat-messages-list/chat-messages-list";
import { IS_LOCAL, SERVER } from "./constants";
import { Message } from "./server-services/messages-server.service";

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
      const message: Message = JSON.parse(event.data);
      if (ChatContacts.activeChat === message.from) {
        appendMessage(message.message, new Date(message.createdAt), message.from);
        MessageLists[message.from].push(JSON.parse(event.data));
      } else {
        if (!UnreadMessages[message.from]) UnreadMessages[message.from] = [];
        UnreadMessages[message.from].push(JSON.parse(event.data));
      }
      ChatContacts.updateLastMessage(message)

    } else {
      switch (data.type) {
        case 'request-received':
          AppModal.show('New Friend Request!');
          ChatContacts.receivedRequests.push(data as never);
          break;
        case 'request-accepted':
          AppModal.show(data.email + ' accepted your firend request');
          ChatContacts.contacts.push(data as never);
          break;
      }
    }
  });

  document.onfocus = () => {
    if (ws.readyState === WebSocket.CLOSED) {
      setTimeout(() => {
        initWebSockets(_id);
        ChatMessagesList.refreshMessages();
        // TODO: make a refresh version of this function
        ChatContacts.loadContacts();
      });
    }
  }

  ws.onclose = () => {
    setTimeout(() => {
      initWebSockets(_id);
      ChatMessagesList.refreshMessages();
      // TODO: make a refresh version of this function
      ChatContacts.loadContacts();
    });
  };

  (window as any)['ws'] = ws;

  return ws;
}
