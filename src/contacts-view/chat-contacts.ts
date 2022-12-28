import { Bind } from "bindrjs"
import { AppModal } from "../global-views/app-modal/app-modal";
import { ChatMessagesList } from "../chat-views/chat-messages-list/chat-messages-list";
import { ChatHeader } from "../chat-views/chat-header/chat-header";
import { SplashScreen } from "../global-views/splash-screen/splash-screen";
import { DefaultResponse, queryGlobalContacts } from "../utils/server-services/server-handler";
import { acceptFriendRequest, AppUser, getUserContacts, sendFriendRequest, UserContactsData } from "../utils/server-services/user-server.service";
import { GestureHandler } from "../utils/gesture-handler";
import { MobileMediaQuery, prettyDate } from "../utils/utils";
import { Message } from "../utils/server-services/messages-server.service";

type Contact = AppUser & {
  lastMessage?: Message
}

export const ChatContacts = (() => {
  const ChatContactsRef = document.getElementById('chat-contacts');
  const { bind } = new Bind({
    id: 'chat-contacts',
    bind: {
      onSearchInput,
      loadContacts,
      friendRequest,
      acceptRequest,
      selectChat,
      updateLastMessage,
      activeChat: '',
      searchTerm: '',
      contacts: [] as Contact[],
      receivedRequests: [] as AppUser[],
      sentRequests: [] as string[],
      searchResults: [] as AppUser[],
      tab: 'friends',
      transition: 'none',
      transform: '',
      left: ''
    },
  });

  addGestureHandler();

  function onSearchInput(event: KeyboardEvent) {
    bind.searchTerm = (event.target as HTMLInputElement).value;
    if (event.key === 'Enter' && bind.searchTerm.trim()) {
      queryGlobalContacts(bind.searchTerm.trim()).then((results: AppUser[]) => {
        if (results && results.length) {
          let ids = bind.contacts.map((contact: AppUser) => contact._id);
          let filtered = results.filter((res: AppUser) => {
            return ids.indexOf(res._id) === -1 && res._id !== ChatHeader._id;
          });
          bind.searchResults = filtered;
        } else {
          bind.searchResults = [];
        }

        if (!bind.searchResults.length) {
          AppModal.show('No results');
        }
      });
    }
    if (event.key === 'Enter' && !bind.searchTerm.trim()) {
      bind.searchResults = [];
    }
  }

  function friendRequest(result: AppUser) {
    let hasSentFriendRequest = bind.sentRequests.some((_id: string) => result._id === _id);
    if (hasSentFriendRequest) {
      AppModal.show('You already sent a friend request to this account');
      bind.searchResults = [];
      let isInContacts = bind.contacts.some((req: AppUser) => result._id === req._id);
      if (isInContacts) {
        selectChat(result);
      }
    } else {
      sendFriendRequest(ChatHeader._id, result._id).then(() => {
        AppModal.show('Sent a friend request to: ' + result.email);
        bind.searchResults = [];
      });
    }
  }

  function acceptRequest(request: AppUser) {
    acceptFriendRequest(request._id, ChatHeader._id).then((data: DefaultResponse) => {
      if (data.success) {
        AppModal.show('Accepted ' + request.email + ' request!');
        let index = bind.receivedRequests.indexOf(request);
        let contact = bind.receivedRequests.splice(index, 1);
        bind.contacts.push(contact[0]);
        selectChat(contact[0]);
      }
    });
  }

  function loadContacts(autoSelectChat?: boolean) {
    let user = {
      _id: ChatHeader._id,
      email: ChatHeader.email,
    };

    getUserContacts(user).then((contactData: UserContactsData) => {
      if (contactData.contacts) {
        let contacts = contactData.contacts;
        bind.contacts = contacts;
        formatLastMessageDates();
        if (autoSelectChat) {
          let lastChatSelected = localStorage.getItem('last-chat-selected');
          let selectedContact = contacts.find((contact: any) => contact._id === lastChatSelected)
          if (lastChatSelected && selectedContact) {
            selectChat(selectedContact);
          } else {
            selectChat(contacts[0]);
          }
        }
      }

      if (contactData.sentRequests && contactData.sentRequests.length) {
        bind.sentRequests = contactData.sentRequests;
      }

      SplashScreen.loading = false;
    });
  }

  function selectChat(contact: AppUser) {
    if (bind.activeChat !== contact._id) {
      bind.activeChat = contact._id;
      ChatMessagesList.loadMessages(contact._id);
      ChatHeader.activeChatName = contact.name ? contact.name : contact.email;
      bind.activeChat = contact._id;
      localStorage.setItem('last-chat-selected', contact._id);
    }
    closeContacts();
  }

  function addGestureHandler() {
    if (ChatContactsRef && MobileMediaQuery.matches) {
      const animationTime = 138;
      const Gestures = new GestureHandler(ChatContactsRef);
      Gestures.on('drag-start', () => {
        bind.transition = 'none';
      });
      Gestures.on('drag-horizontal', (distance) => {
        if (distance.x < 0) {
          bind.transform = `translateX(${distance.x}px)`;
        }
      });
      Gestures.on('drag-end', (distance, speed) => {
        ChatContacts.transition = `transform ${animationTime}ms ease-in-out`;
        if (distance.x < -300 || (speed.x > 0.3 && distance.x < -50)) {
          closeContacts();
        } else {
          bind.transform = `translateX(0)`;
        }
      });
    }
  }

  function closeContacts() {
    if (!MobileMediaQuery.matches) return;
    const animationTime = 138;
    bind.transform = `translateX(-100%)`;
    bind.transition = `transform ${animationTime}ms ease-in-out`;
    setTimeout(() => {
      ChatContacts.transition = 'none';
      ChatContacts.left = '-100%';
      ChatContacts.transform = `translateX(0)`;
    }, animationTime);
  }

  function updateLastMessage(message: Message) {
    let contact = bind.contacts.find(contact => contact._id === message.from || contact._id === message.to)
    if (contact) {
      contact.lastMessage = message;
      contact.lastMessage.prettyDate = prettyDate(new Date(message.createdAt));
    }
    bind.contacts.sort((a, b) => {
      if (a.lastMessage && b .lastMessage) {
        let firstDate = a.lastMessage.createdAt
        let secondDate = b.lastMessage.createdAt
        return new Date(secondDate).getTime() - new Date(firstDate).getTime()
      }
      return 0
    });
  }

  function formatLastMessageDates() {

    bind.contacts.sort((a, b) => {
      if (a.lastMessage && b .lastMessage) {
        let firstDate = a.lastMessage.createdAt
        let secondDate = b.lastMessage.createdAt
        return new Date(secondDate).getTime() - new Date(firstDate).getTime()
      }
      return 0
    });

    bind.contacts.forEach((contact) => {
      if (contact.lastMessage) {
        contact.lastMessage.prettyDate = prettyDate(new Date(contact.lastMessage.createdAt))
      }
    });
  }

  return bind;
})();
