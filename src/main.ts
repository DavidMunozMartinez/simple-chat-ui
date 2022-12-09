import './style.scss'

import { ChatInput } from './chat-input/chat-input';
import { ChatMessagesList }  from './chat-messages-list/chat-messages-list'
import { initWebSockets } from './utils/ws-handler';
import { ChatUpperBar } from './chat-upper-bar/chat-upper-bar';


ChatInput;
ChatMessagesList;
ChatUpperBar;
initWebSockets();

