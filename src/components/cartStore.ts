export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

const CART_KEY = 'kbmv-cart';
const EVENT_NAME = 'kbmv-cart-updated';

type Listener = (items: CartItem[]) => void;

const readStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
};

const writeStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: items }));
};

export const cartStore = {
  get: readStorage,
  set: writeStorage,
  subscribe: (listener: Listener) => {
    if (typeof window === 'undefined') return () => undefined;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<CartItem[]>).detail;
      listener(detail ?? readStorage());
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }
};
