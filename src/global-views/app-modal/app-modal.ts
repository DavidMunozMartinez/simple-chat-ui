import { Bind } from "bindrjs"

export const AppModal = (() => {
  const { bind } = new Bind({
    id: 'app-modal',
    bind: {
      show,
      message: ''
    }
  });

  function show(message: string) {
    bind.message = message;
    setTimeout(() => {
      bind.message = ''
    }, 2000);
  }

  return bind;
})()