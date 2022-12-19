import { Bind } from "bindrjs";
import { ChatContacts } from "../chat-contacts/chat-contacts";
import { appendMessage, MessageLists } from "../chat-messages-list/chat-messages-list";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { ProfileBind } from "../profile-view/profile-view";
import { sendMessage } from "../utils/server-handler";
import './chat-input.scss';

export const ChatInput = (() => {
  const MessageInput = document.getElementById('message-input') as HTMLInputElement;

  const { bind } = new Bind({
    id: 'chat-input',
    bind: {
      enabled: true,
      inputValue: '',
      onInputKeydown,
      submitMessage,
      toggleContactList
    }
  });

  function toggleContactList() {
    ChatContacts.hideContacts = !ChatContacts.hideContacts;
  }

  function onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      submitMessage();
    }
  }

  function submitMessage() {
    if (bind.inputValue.trim() && ChatContacts.activeChat && ChatContacts.activeChat.trim()) {
      appendMessage(bind.inputValue, null, new Date());
      MessageInput.value = '';
      sendMessage(
        ChatUpperBar._id,
        ChatContacts.activeChat,
        ProfileBind.displayName ? ProfileBind.displayName : ProfileBind.email,
        bind.inputValue
      ).then((message: any) => {
        if (MessageLists[ChatContacts.activeChat]) {
          MessageLists[ChatContacts.activeChat].push(message);
        } else {
          MessageLists[ChatContacts.activeChat] = [message];
        }
        bind.inputValue = '';
      })
    }
  }

  return bind;
})();