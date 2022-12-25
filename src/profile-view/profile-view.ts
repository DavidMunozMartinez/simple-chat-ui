import { Bind } from "bindrjs";
import { ChatHeader } from "../chat-views/chat-header/chat-header";
import { LoginBind } from "../login-view/login-view";
import { updateUserProfile } from "../utils/server-services/user-server.service";

export const ProfileBind = (() => {
  const { bind } = new Bind({
    id: 'profile-view',
    bind: {
      email: '',
      photo: '',
      displayName: '',
      showProfile: false,
      updateProfile,
      closeProfile,
      logout,
    },
  });

  function updateProfile() {
    updateUserProfile(ChatHeader._id, bind.displayName)
  }

  function closeProfile() {
    bind.showProfile = false;
    updateProfile();
  }

  function logout() {
    LoginBind.logout();
  }

  return bind;
})();