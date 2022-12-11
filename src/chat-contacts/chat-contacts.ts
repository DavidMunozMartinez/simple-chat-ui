import { Bind } from "bindrjs"
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { getUserContacts, queryGlobalContacts } from "../utils/server-handler";

export const ChatContacts = (() => {
  const { bind } = new Bind({
    id: 'chat-contacts',
    bind: {
      onSearchInput: onSearchInput,
      loadContacts: loadContacts,
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

  function loadContacts() {
    let user = {
      email: ChatUpperBar.email,
      id: ChatUpperBar.id,
    };

    getUserContacts(user).then((contacts) => {
      bind.contacts = contacts;
      console.log(contacts);
    });
  }
})();
