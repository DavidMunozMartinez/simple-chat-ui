// import './style.scss'
// import './chat-upper-bar/chat-upper-bar.scss';
// import './chat-messages-list/chat-messages-list.scss';
// import './chat-input/chat-input.scss'
// import './chat-contacts/chat-contacts.scss';

import { ChatInput } from './chat-input/chat-input';
import { ChatMessagesList }  from './chat-messages-list/chat-messages-list'
import { initWebSockets } from './utils/ws-handler';
import { ChatUpperBar } from './chat-upper-bar/chat-upper-bar';
import { LoginBind } from './login-view/login-view';
import { ChatContacts } from './chat-contacts/chat-contacts';

LoginBind;
ChatInput;
ChatMessagesList;
ChatUpperBar;
ChatContacts;
initWebSockets();
