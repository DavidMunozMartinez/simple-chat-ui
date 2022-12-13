import { Bind } from "bindrjs"
import { ChatMessagesList } from "../chat-messages-list/chat-messages-list";
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
      hideContacts: true,
    },
  });
  return bind;

  function onSearchInput(event: KeyboardEvent) {
    bind.searchTerm = (event.target as HTMLInputElement).value;
    if (event.key === 'Enter' && bind.searchTerm.trim()) {
      queryGlobalContacts(bind.searchTerm.trim()).then((results: never[]) => {
        if (results && (results as any[]).length) {
          // Remove yourself
          let filtered = results.filter((res: any) => res._id != ChatUpperBar._id)
          bind.searchResults = filtered;
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
    addContact(id, contact._id).then(() => {
      getUserContacts({
        _id: ChatUpperBar._id,
        email: ChatUpperBar.email
      }).then((contacts: never[]) => {
        bind.contacts = contacts;
        bind.searchResults = [];
        selectChat(contact);
      });
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
        let lastChatSelected = localStorage.getItem('last-chat-selected');
        let selectedContact = contacts.find((contact: any) => contact._id === lastChatSelected)
        if (lastChatSelected && selectedContact) {
          selectChat(selectedContact);
        } else {
          selectChat(contacts[0]);
        }
      }
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
