import { ChatContacts } from "../chat-contacts/chat-contacts";
import { appendMessage, MessageLists } from "../chat-messages-list/chat-messages-list";
import { IS_LOCAL, SERVER } from "./constants";

export function initWebSockets(_id: string) {
  let ws;
  let wss = "wss";
  if (IS_LOCAL) {
    wss = "ws";
  }
  ws = new WebSocket(
    `${wss}://${SERVER}/ws?id=${_id}`
  );

  ws.addEventListener('message', (event) => {
    const { message, from } = JSON.parse(event.data);
    
    if (ChatContacts.activeChat === from) {
      appendMessage(message, from);
    }
    MessageLists[from].push(JSON.parse(event.data))
  });

  return ws;
}
