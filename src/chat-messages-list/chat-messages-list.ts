import { Bind } from "bindrjs";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { getMessagesBetweenUsers } from "../utils/server-handler";
import "./chat-messages-list.scss";

const ChatMessagesListRef = document.getElementById("chat-ui");
const Trash = document.getElementById("chat-ui");

export const MessageLists: {[key: string]: any[]} = {};

const TimeFormatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' })

export const ChatMessagesList = (() => {
  const { bind } = new Bind({
    id: "chat-ui",
    bind: {
      CheckIfInView,
      loadMessages,
    },
  });

  /**
   * Iterates over the chat messages and assigns a class when the element
   * is out of bounds to help animate when the message is in-bounds again
   * while scrolling
   */
  function CheckIfInView() {
    if (!ChatMessagesListRef) return;
    let messages = document.querySelectorAll(".message-container");
    let chatRect = ChatMessagesListRef.getBoundingClientRect();
    messages.forEach((message) => {
      let messageRect = message.getBoundingClientRect();
      let isOut =
        messageRect.y - chatRect.y < message.clientHeight * -1 ||
        messageRect.y > chatRect.bottom;
      if (isOut && !message.classList.contains("out")) {
        message.classList.add("out");
      }
      if (!isOut && message.classList.contains("out")) {
        message.classList.remove("out");
      }
    });
  }

  function loadMessages(you: string) {
    if (ChatMessagesListRef) ChatMessagesListRef.innerHTML = ''
    if (!MessageLists[you]) {
      getMessagesBetweenUsers(ChatUpperBar._id, you).then((messages: never[]) => {
        MessageLists[you] = messages;
        messages.forEach((message: any) => {
          let from = message.from === you ? you : undefined;
          appendMessage(message.message, from, new Date(message.createdAt));
        });
      });
    } else {
      MessageLists[you].forEach((message) => {
        let from = message.from === you ? you : undefined;
        appendMessage(message.message, from);
      });
    }
  }

  return bind;
})();

/**
 * We use native methods here to have more control over the animations and transition
 */
export function appendMessage(message: string, from?: string, dateTime?: Date) {
  let el = document.createElement("div");
  el.classList.add("message-container");
  el.classList.add(!from ? "sent" : "received");
  let options = "";
  if (from) {
    options = `
        <div class="options">
          <span><i class="iconoir-reply"></i></span>
        </div>
      `;
  }
  el.innerHTML = `
      <p class="timestamp"> ${TimeFormatter.format(dateTime)} </p>
      <p class="${!from ? "sent" : "received"}">${message} </p>
      ${options}
      `;
  let height = getAnimationEndHeight(el);
  el.style.height = "0px";
  if (!ChatMessagesListRef) return;
  ChatMessagesListRef.style.overflowY = 'hidden'
  ChatMessagesListRef.insertBefore(el, ChatMessagesListRef.firstChild);
  setTimeout(() => {
    el.style.height = height + "px";
    setTimeout(() => {
      el.style.height = 'auto';
      ChatMessagesListRef.scrollTop = 0;
      ChatMessagesListRef.style.overflowY = 'scroll'
    },200);
  });
}

/**
 * Appends an element to an invisible replica container so we can get its final height
 */
function getAnimationEndHeight(el: HTMLElement): number {
  let height = 0;
  if (Trash) {
    Trash.append(el);
    height = el.clientHeight;
    Trash.removeChild(el);
  }
  return height;
}
