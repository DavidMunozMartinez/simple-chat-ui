import { Bind } from "bindrjs";
import { appendMessage } from "../chat-messages-list/chat-messages-list";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { sendMessage } from "../utils/ws-handler";
import './chat-input.scss';

export const ChatInput = (() => {
  const MessageInput = document.getElementById('message-input') as HTMLInputElement;

  const { bind } = new Bind({
    id: 'chat-input',
    bind: {
      inputValue: '',
      onInputKeydown,
      submitMessage,
    }
  });

  function onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      submitMessage();
    }
  }

  function submitMessage() {
    if (bind.inputValue.trim()) {
      sendMessage(bind.inputValue, ChatUpperBar.sendTo);
      appendMessage(bind.inputValue);
      bind.inputValue = '';
      if (MessageInput) MessageInput.value = ''
    }
  }

  return bind;
})();