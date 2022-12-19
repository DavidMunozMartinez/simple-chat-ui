import { Bind } from "bindrjs";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { SpashScreen } from "../splash-screen/spash-screen";
import { getMessagesBetweenUsers } from "../utils/server-handler";
import "./chat-messages-list.scss";

const ChatMessagesListRef = document.getElementById("chat-ui");
const Trash = document.getElementById("chat-ui");

export const MessageLists: {[key: string]: any[]} = {};
export const UnreadMessages: {[key: string]: any[]} = {};

const ShortTimeFormatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' });
const ShortDateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium'});
let dateMarks: { [key: string]: boolean } = {};


export const ChatMessagesList = (() => {
  const { bind } = new Bind({
    id: "chat-ui",
    bind: {
      CheckIfInView,
      loadMessages,
      refreshMessages,
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
    if (ChatMessagesListRef) ChatMessagesListRef.innerHTML = '';
    dateMarks = {};
    if (!MessageLists[you]) {
      getMessagesBetweenUsers(ChatUpperBar._id, you).then((messages: never[]) => {
        if (UnreadMessages[you]) {
          MessageLists[you] = messages.concat(UnreadMessages[you] as any || []);
          UnreadMessages[you] = [];
        } else {
          MessageLists[you] = messages;
        }
        messages.forEach((message: any) => {
          let from = message.from === you ? you : undefined;
          appendMessage(message.message, new Date(message.createdAt), from);
        });
        SpashScreen.loading = false;
      });
    } else {
      MessageLists[you].forEach((message) => {
        let from = message.from === you ? you : undefined;
        appendMessage(message.message, new Date(message.createdAt), from);
      });
    }
  }

  /**
   * Executed only when the app is focused again, we lost ws connection and need to
   * retrieve missing messages while the tab was closed/minimized etc
   */
  function refreshMessages() {
    let reloadContacts = Object.keys(MessageLists);
    reloadContacts.forEach((contactId) => {
      let lastMessageId = MessageLists[contactId][MessageLists[contactId].length - 1]._id;
      getMessagesBetweenUsers(ChatUpperBar._id, contactId, lastMessageId).then((newMessages) => {
        MessageLists[contactId] = MessageLists[contactId].concat(newMessages);
        newMessages.forEach((message: any) => {
          appendMessage(message.message, new Date(message.createdAt), contactId);
        });
      });
    });
  }

  return bind;
})();

/**
 * We use native methods here to have more control over the animations and transition
 */
export function appendMessage(message: string, dateTime: Date, from?: string) {
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
  let dateKey = ShortDateFormatter.format(dateTime);
  console.log(dateKey);
  if (!dateMarks[dateKey]) {
    let now = new Date();
    dateMarks[dateKey] = true;
    let marker = document.createElement("div");
    marker.classList.add('message-container');
    marker.classList.add('marker');
    let dateText = dateKey === ShortDateFormatter.format(now) ? 'Today' : dateKey
    marker.innerHTML = `
      <p class="timestamp marker">${dateText}</p>
    `;
    ChatMessagesListRef?.insertBefore(marker, ChatMessagesListRef.firstChild)
  }

  el.innerHTML = `
      <p class="timestamp"> ${ShortTimeFormatter.format(dateTime)} </p>
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
