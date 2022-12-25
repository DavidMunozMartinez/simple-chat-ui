import { Bind } from "bindrjs";
import { LoginBind } from "../../login-view/login-view";
import { ProfileBind } from "../../profile-view/profile-view";

export const ChatHeader = (() => {
  const { bind } = new Bind({
    id: 'chat-upper-bar',
    bind: {
      _id: '',
      activeChatName: '',
      email: '',
      logout,
      profile
    }
  });

  function profile() {
    ProfileBind.showProfile = !ProfileBind.showProfile
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