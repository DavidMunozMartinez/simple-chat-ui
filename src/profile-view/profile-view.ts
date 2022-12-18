import { Bind } from "bindrjs";
import { ChatUpperBar } from "../chat-upper-bar/chat-upper-bar";
import { LoginBind } from "../login-view/login-view";
import { updateUserProfile } from "../utils/server-handler";

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
    updateUserProfile(ChatUpperBar._id, bind.displayName)
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