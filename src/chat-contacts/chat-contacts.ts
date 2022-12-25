import { Bind } from "bindrjs"
import { AppModal } from "../app-modal/app-moda";
import { ChatMessagesList } from "../chat-messages-list/chat-messages-list";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { SplashScreen } from "../splash-screen/splash-screen";
import { DefaultResponse, queryGlobalContacts } from "../utils/server-handler";
import { acceptFriendRequest, AppUser, getUserContacts, sendFriendRequest, UserContactsData } from "../utils/user-server.service";

export const ChatContacts = (() => {
  const { bind } = new Bind({
    id: 'chat-contacts',
    bind: {
      onSearchInput,
      loadContacts,
      friendRequest,
      acceptRequest,
      selectChat,
      activeChat: '',
      searchTerm: '',
      contacts: [] as AppUser[],
      receivedRequests: [] as AppUser[],
      sentRequests: [] as string[],
      searchResults: [] as AppUser[],
      hideContacts: true,
      tab: 'friends'
    },
  });
  return bind;

  function onSearchInput(event: KeyboardEvent) {
    bind.searchTerm = (event.target as HTMLInputElement).value;
    if (event.key === 'Enter' && bind.searchTerm.trim()) {
      queryGlobalContacts(bind.searchTerm.trim()).then((results: AppUser[]) => {
        if (results && results.length) {
          let ids = bind.contacts.map((contact: AppUser) => contact._id);
          let filtered = results.filter((res: AppUser) => {
            return ids.indexOf(res._id) === -1 && res._id !== ChatUpperBar._id;
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
      sendFriendRequest(ChatUpperBar._id, result._id).then(() => {
        AppModal.show('Sent a friend request to: ' + result.email);
        bind.searchResults = [];
      });
    }
  }

  function acceptRequest(request: AppUser) {
    acceptFriendRequest(request._id, ChatUpperBar._id).then((data: DefaultResponse) => {
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
      _id: ChatUpperBar._id,
      email: ChatUpperBar.email,
    };

    getUserContacts(user).then((contactData: UserContactsData) => {
      if (contactData.contacts) {
        let contacts = contactData.contacts;
        bind.contacts = contacts as any;
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
      ChatUpperBar.activeChatName = contact.name ? contact.name : contact.email;
      ChatContacts.hideContacts = true;
      localStorage.setItem('last-chat-selected', contact._id)
    }
  }
})();
