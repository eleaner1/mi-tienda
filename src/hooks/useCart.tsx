import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "./useAuth";

interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string | null;
    stock: number;
    brand: string | null;
  } | null;
}

interface LocalCartItem {
  id: number; // equals productId for local cart
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string | null;
    stock: number;
    brand: string | null;
  };
}

interface CartContextType {
  items: (CartItem | LocalCartItem)[];
  isLoading: boolean;
  addToCart: (product: { id: number; name: string; price: string; image: string | null; stock: number; brand: string | null }, quantity?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([]);
  const utils = trpc.useUtils();

  // Cargar carrito local del storage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setLocalCart(JSON.parse(stored));
      } catch {
        setLocalCart([]);
      }
    }
  }, []);

  // Guardar carrito local
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(localCart));
  }, [localCart]);

  // Carrito del servidor (usuarios logueados)
  const { data: serverCart, isLoading } = trpc.cart.getCart.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });

  const addMutation = trpc.cart.add.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });
  const removeMutation = trpc.cart.remove.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });
  const updateMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });
  const clearMutation = trpc.cart.clear.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });

  const addToCart = useCallback((product: { id: number; name: string; price: string; image: string | null; stock: number; brand: string | null }, quantity = 1) => {
    if (isAuthenticated && user) {
      addMutation.mutate({ productId: product.id, quantity });
    } else {
      setLocalCart(prev => {
        const existing = prev.find(item => item.productId === product.id);
        if (existing) {
          return prev.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { id: product.id, productId: product.id, quantity, product }];
      });
    }
  }, [isAuthenticated, user, addMutation]);

  const removeFromCart = useCallback((itemId: number) => {
    if (isAuthenticated) {
      removeMutation.mutate({ cartItemId: itemId });
    } else {
      setLocalCart(prev => prev.filter(item => item.productId !== itemId));
    }
  }, [isAuthenticated, removeMutation]);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (isAuthenticated) {
      updateMutation.mutate({ cartItemId: itemId, quantity });
    } else {
      setLocalCart(prev =>
        prev.map(item =>
          item.productId === itemId ? { ...item, quantity } : item
        )
      );
    }
  }, [isAuthenticated, updateMutation]);

  const clearCart = useCallback(() => {
    if (isAuthenticated) {
      clearMutation.mutate();
    } else {
      setLocalCart([]);
    }
  }, [isAuthenticated, clearMutation]);

  const items = isAuthenticated && serverCart ? serverCart.map(item => ({
    id: item.id,
    userId: item.userId,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product ? {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      stock: item.product.stock,
      brand: item.product.brand,
    } : null,
  })) : localCart;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product ? parseFloat(item.product.price) : 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
