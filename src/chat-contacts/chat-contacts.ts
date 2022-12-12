import { Bind } from "bindrjs"
import { ChatMessagesList, MessageLists } from "../chat-messages-list/chat-messages-list";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { addContact, getUserContacts, queryGlobalContacts } from "../utils/server-handler";

export const ChatContacts = (() => {
  const { bind } = new Bind({
    id: 'chat-contacts',
    bind: {
      onSearchInput: onSearchInput,
      loadContacts: loadContacts,
      addUserContact: addUserContact,
      selectChat: selectChat,
      activeChat: null,
      searchTerm: '',
      contacts: [],
      searchResults: [],
    },
  });
  return bind;

  function onSearchInput(event: KeyboardEvent) {
    bind.searchTerm = (event.target as HTMLInputElement).value;
    if (event.key === 'Enter' && bind.searchTerm.trim()) {
      queryGlobalContacts(bind.searchTerm.trim()).then((results) => {
        if (results && (results as any[]).length) {
          bind.searchResults = results as never[];
        } else {
          bind.searchResults = [];
        }
      });
    }
    if (event.key === 'Enter' && !bind.searchTerm.trim()) {
      bind.searchResults = [];
    }
  }

  function addUserContact(contact: any) {
    let id = ChatUpperBar._id;
    addContact(id, contact._id).then((contacts: never[]) => {
      bind.contacts = contacts;
      bind.searchResults = [];
    });
  }

  function loadContacts() {
    let user = {
      _id: ChatUpperBar._id,
      email: ChatUpperBar.email,
    };

    getUserContacts(user).then((contacts: never[]) => {
      if (contacts && contacts.length) {
        bind.contacts = contacts;
        selectChat(contacts[0]);
      }
    });
  }

  function selectChat(contact: any) {
    if (bind.activeChat !== contact._id) {
      bind.activeChat = contact._id;
      (ChatMessagesList.loadMessages as any)(contact._id);
      ChatUpperBar.activeChatName = contact.name ? contact.name : contact.email
    }
  }
})();
