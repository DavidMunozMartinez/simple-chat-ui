import { Bind } from "bindrjs";

export const SpashScreen = (() => {
  const { bind } = new Bind({
    id: 'splash-screen',
    bind: {
      loading: true
    }
  });

  return bind;
})();
