import { ButtonType } from "../Enums/ButtonType";

const ButtonConfig: { [key in ButtonType]: { keyCode: string[] } } = {
  [ButtonType.Left]: {
    keyCode: ['ArrowLeft'],
  },
  [ButtonType.Right]: {
    keyCode: ['ArrowRight'],
  },
  [ButtonType.Start]: {
    keyCode: ['Space', 'Enter'],
  },
}

export { ButtonConfig };