import { Bind } from "bindrjs";
import { ChatContacts } from "../../contacts-view/chat-contacts";
import { appendMessage, MessageLists } from "../chat-messages-list/chat-messages-list";
import { ChatHeader } from "../chat-header/chat-header";
import { ProfileBind } from "../../profile-view/profile-view";
import { Message, sendMessage } from "../../utils/server-services/messages-server.service";

export const ChatInput = (() => {
  const MessageInput = document.getElementById('message-input') as HTMLInputElement;

  const { bind } = new Bind({
    id: 'chat-input',
    bind: {
      enabled: true,
      inputValue: '',
      onInputKeydown,
      submitMessage    }
  });

  function onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      submitMessage();
    }
    // iOS thing
    if (!MessageInput.innerText.trim()) {
      MessageInput.innerText = '';
    }
  }

  function submitMessage() {
    if (bind.inputValue.trim() && ChatContacts.activeChat && ChatContacts.activeChat.trim()) {
      appendMessage(bind.inputValue, new Date());
      MessageInput.innerText = '';
      sendMessage(
        ChatHeader._id,
        ChatContacts.activeChat,
        ProfileBind.displayName ? ProfileBind.displayName : ProfileBind.email,
        bind.inputValue
      ).then((message: Message) => {
        if (MessageLists[ChatContacts.activeChat]) {
          MessageLists[ChatContacts.activeChat].push(message);
        } else {
          MessageLists[ChatContacts.activeChat] = [message];
        }
        bind.inputValue = '';
        ChatContacts.updateLastMessage(message);
      });
    }
  }

  return bind;
})();