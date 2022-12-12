import { appendMessage } from "../chat-messages-list/chat-messages-list";
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
    
    appendMessage(message, from);
  });

  return ws;
}
