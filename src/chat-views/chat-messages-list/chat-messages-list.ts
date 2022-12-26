import { Bind } from "bindrjs";
import { ChatHeader } from "../chat-header/chat-header";
import { SplashScreen } from "../../global-views/splash-screen/splash-screen";
import { getMessagesBetweenUsers, Message } from "../../utils/server-services/messages-server.service";
import { GestureHandler } from "../../utils/gesture-handler";
import { ChatContacts } from "../../contacts-view/chat-contacts";

const ChatMessagesListRef = document.getElementById("chat-ui");
const Trash = document.getElementById("chat-ui");

export const MessageLists: {[key: string]: Message[]} = {};
export const UnreadMessages: {[key: string]: Message[]} = {};

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

  addGestureHandler();
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
      getMessagesBetweenUsers(ChatHeader._id, you).then((messages: Message[]) => {
        if (UnreadMessages[you] && UnreadMessages[you].length) {
          MessageLists[you] = messages.concat(UnreadMessages[you] as any || []);
          UnreadMessages[you] = [];
        } else {
          MessageLists[you] = messages;
        }
        messages.forEach((message: Message) => {
          let from = message.from === you ? you : undefined;
          appendMessage(message.message, new Date(message.createdAt), from);
        });
        SplashScreen.loading = false;
      });
    } else {
      if (UnreadMessages[you] && UnreadMessages[you].length) {
        MessageLists[you] = MessageLists[you].concat(UnreadMessages[you] || []);
        UnreadMessages[you] = [];
      }
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
      getMessagesBetweenUsers(ChatHeader._id, contactId, lastMessageId).then((newMessages) => {
        MessageLists[contactId] = MessageLists[contactId].concat(newMessages);
        newMessages.forEach((message: any) => {
          appendMessage(message.message, new Date(message.createdAt), contactId);
        });
      });
    });
  }

  function addGestureHandler() {
    if (ChatMessagesListRef) {
      const animationTime = 138;
      const Gestures = new GestureHandler(ChatMessagesListRef);
      Gestures.on('drag-start', () => {
        ChatContacts.transition = 'none';
      });
      Gestures.on('drag-horizontal', (distance) => {
        ChatContacts.transform = `translateX(${distance.x}px)`;
      });
      Gestures.on('drag-end', (distance, speed) => {
        ChatContacts.transition = `transform ${animationTime}ms ease-in-out`;
        if (distance.x > 300 || (speed.x > 0.35 && distance.x > 50)) {
          ChatContacts.transform = `translateX(100%)`;
          setTimeout(() => {
            ChatContacts.transition = 'none';
            ChatContacts.left = '0px';
            ChatContacts.transform = `translateX(0)`;
          }, animationTime);
        } else {
          ChatContacts.transform = `translateX(0)`;
        }
      });
    }
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
  if (!dateMarks[dateKey]) {
    insertTimeMarker(dateKey);
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

function insertTimeMarker(dateKey: string) {
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
