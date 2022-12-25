import { Bind } from "bindrjs";

export const SplashScreen = (() => {
  const { bind } = new Bind({
    id: 'splash-screen',
    bind: {
      loading: true
    }
  });

  return bind;
})();
