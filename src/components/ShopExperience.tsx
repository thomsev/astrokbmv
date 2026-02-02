import { useMemo, useState } from 'react';
import { cartStore, type CartItem } from './cartStore';
import '../styles/shop.css';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: 'kbmv-01',
    title: 'Fjordglass Karaffel',
    description: 'Munnblåst karaffel med havgrønt skjær.',
    price: 890,
    image: '/product1.svg'
  },
  {
    id: 'kbmv-02',
    title: 'Signert Seilduk',
    description: 'Kunstprint på seilduk, nummerert og signert.',
    price: 1450,
    image: '/product2.svg'
  },
  {
    id: 'kbmv-03',
    title: 'Kystlinje Notatbok',
    description: 'Linen innbundet bok til egne kjellernotater.',
    price: 320,
    image: '/product3.svg'
  },
  {
    id: 'kbmv-04',
    title: 'Salt & Vin Duftlys',
    description: 'Håndlaget lys med maritime kryddernoter.',
    price: 410,
    image: '/product4.svg'
  }
];

const formatPrice = (price: number) => `${price.toLocaleString('no-NO')} kr`;

export default function ShopExperience() {
  const [items, setItems] = useState<CartItem[]>(cartStore.get());
  const [receipt, setReceipt] = useState<string | null>(null);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const updateStore = (next: CartItem[]) => {
    setItems(next);
    cartStore.set(next);
  };

  const addToCart = (product: Product) => {
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      updateStore(
        items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      updateStore([
        ...items,
        { id: product.id, title: product.title, price: product.price, quantity: 1 }
      ]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    updateStore(
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    updateStore(items.filter((item) => item.id !== id));
  };

  const handleCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) return;
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    setReceipt(`Takk ${name ?? 'kunde'}! Kvittering sendt til ${email ?? 'e-post'}.`);
    updateStore([]);
    event.currentTarget.reset();
  };

  return (
    <section className="section">
      <div className="container">
        <div className="info-bar">
          <div className="info-card">
            <h4>Gratis frakt</h4>
            <p>Bestillinger over 1200 kr sendes uten kostnad.</p>
          </div>
          <div className="info-card">
            <h4>Signert kvalitet</h4>
            <p>Alle kunstprodukter er nummerert og sertifisert.</p>
          </div>
          <div className="info-card">
            <h4>Sikker betaling</h4>
            <p>Kryptert betaling og trygg kvittering i etterkant.</p>
          </div>
        </div>

        <div className="shop-layout">
          <div className="products">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.title} />
                <div>
                  <h4>{product.title}</h4>
                  <p>{product.description}</p>
                </div>
                <div className="product-price">{formatPrice(product.price)}</div>
                <button className="button" type="button" onClick={() => addToCart(product)}>
                  Legg i kurv
                </button>
              </div>
            ))}
          </div>

          <aside className="cart-panel">
            <h3>Handlekurv</h3>
            {items.length === 0 && <p>Kurven er tom.</p>}
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <div className="qty-controls">
                    <button type="button" onClick={() => updateQty(item.id, -1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <div>{formatPrice(item.price * item.quantity)}</div>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    Fjern
                  </button>
                </div>
              </div>
            ))}
            <p className="cart-total">Total: {formatPrice(total)}</p>
            <p>Frakt beregnes i kassen. Gratis frakt over 1200 kr.</p>
            <form className="checkout-form" onSubmit={handleCheckout}>
              <input name="name" type="text" placeholder="Navn" required />
              <input name="email" type="email" placeholder="E-post" required />
              <button className="button" type="submit">
                Fullfør kjøp
              </button>
            </form>
            {receipt && <div className="receipt">{receipt}</div>}
          </aside>
        </div>
      </div>
    </section>
  );
}
