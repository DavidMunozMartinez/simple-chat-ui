import { Bind } from "bindrjs";
import { ChatContacts } from "../chat-contacts/chat-contacts";
import { LoginBind } from "../login-view/login-view";
import { ProfileBind } from "../profile-view/profile-view";

export const ChatUpperBar = (() => {
  const { bind } = new Bind({
    id: 'chat-upper-bar',
    bind: {
      _id: '',
      activeChatName: '',
      email: '',
      logout,
      profile,
      toggleContacts,

    }
  });

  function profile() {
    ProfileBind.showProfile = !ProfileBind.showProfile
  }

  function toggleContacts() {
    ChatContacts.hideContacts = !ChatContacts.hideContacts;
  }

  function logout() {
    LoginBind.logout().then(() => {
      LoginBind.activeSession = false;
      bind._id = '';
      bind.email = '';
    });
  }

  return bind;
})();