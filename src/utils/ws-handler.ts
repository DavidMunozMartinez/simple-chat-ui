import { appendMessage } from "../chat-messages-list/chat-messages-list";
import { IS_LOCAL, SERVER } from "./constants";

export const uniqueId = Math.random().toString(16).slice(2);

export let ws: WebSocket;

export function initWebSockets() {
  let wss = "wss";
  if (IS_LOCAL) {
    wss = "ws";
  }
  ws = new WebSocket(
    wss + "://" + SERVER + "/ws?id=" + uniqueId
  );

  ws.addEventListener('message', (event) => {
    const { message, id } = JSON.parse(event.data);
    appendMessage(message, id);
  });

  return ws;
}

export function sendMessage(message: string, to: string) {
  ws.send(
    JSON.stringify({
      id: uniqueId, /**From */
      to,
      message,
      timestamp: new Date().getTime(),
    })
  );
}
