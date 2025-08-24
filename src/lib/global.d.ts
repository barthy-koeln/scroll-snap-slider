declare global {
  interface HTMLElementEventMap {
    'slide-pass': CustomEvent<number>;
    'slide-stop': CustomEvent<number>;
    'slide-start': CustomEvent<number>;
  }
}

export {}
