import { Bind } from "bindrjs"
import { AppModal } from "../app-modal/app-moda";
import { ChatMessagesList } from "../chat-messages-list/chat-messages-list";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { SpashScreen } from "../splash-screen/spash-screen";
import { acceptFriendRequest, getUserContacts, queryGlobalContacts, sendFriendRequest } from "../utils/server-handler";

export const ChatContacts = (() => {
  const { bind } = new Bind({
    id: 'chat-contacts',
    bind: {
      onSearchInput: onSearchInput,
      loadContacts: loadContacts,
      friendRequest,
      acceptRequest,
      selectChat: selectChat,
      activeChat: '',
      searchTerm: '',
      contacts: [],
      requests: [],
      sentRequests: [],
      searchResults: [],
      hideContacts: true,
      tab: 'friends'
    },
  });
  return bind;

  function onSearchInput(event: KeyboardEvent) {
    bind.searchTerm = (event.target as HTMLInputElement).value;
    if (event.key === 'Enter' && bind.searchTerm.trim()) {
      queryGlobalContacts(bind.searchTerm.trim()).then((results: never[]) => {
        if (results && (results as any[]).length) {
          // Remove yourself
          let filtered = results.filter((res: any) => {
            (bind.contacts as any).indexOf(res._id) === -1 &&
            res._id != ChatUpperBar._id;
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

  function friendRequest(result: any) {
    let hasSentFriendRequest = bind.sentRequests.some((req: any) => result._id === req._id);
    if (!hasSentFriendRequest) {
      AppModal.show('You already sent a friend request to this account');
      bind.searchResults = [];
      let isInContacts = bind.contacts.some((req: any) => result._id === req._id);
      if (isInContacts) {
        selectChat(result);
      }
    } else {
      sendFriendRequest(ChatUpperBar._id, result._id).then((sentRequests: any) => {
        AppModal.show('Sent a friend request to: ' + result.email);
        bind.searchResults = [];
        bind.sentRequests = sentRequests;
      });
    }
  }

  function acceptRequest(request: any) {
    acceptFriendRequest(request._id, ChatUpperBar._id).then((data: any) => {
      if (data.success) {
        (AppModal.show as any)('Accepted ' + request.email + ' request!');
        let index = bind.requests.indexOf(request as never);
        let contact = bind.requests.splice(index, 1);
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

    getUserContacts(user).then((contactData: any) => {
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

      if (contactData.requests) {
        bind.requests = contactData.requests as any;
      }

      if (contactData.sentRequests && contactData.sentRequests.length) {
        bind.sentRequests = contactData.sentRequests;
      }

      SpashScreen.loading = false;
    });
  }

  function selectChat(contact: any) {
    if (bind.activeChat !== contact._id) {
      bind.activeChat = contact._id;
      (ChatMessagesList.loadMessages as any)(contact._id);
      ChatUpperBar.activeChatName = contact.name ? contact.name : contact.email;
      ChatContacts.hideContacts = true;
      localStorage.setItem('last-chat-selected', contact._id)
    }
  }
})();
