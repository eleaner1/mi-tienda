import { useState, useRef, memo } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, Package, Eye, Plus, Minus } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string | null;
  brand: string | null;
  stock: number;
  discountPercent?: number;
}

export const ProductCard = memo(function ProductCard({ id, name, price, image, brand, stock, discountPercent }: ProductCardProps) {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const originalPrice = parseFloat(price);
  const isAdmin = user?.role === "admin";
  const hasDiscount = discountPercent && discountPercent > 0;
  const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercent / 100) : originalPrice;
  const outOfStock = stock === 0;

  const product = { id, name, price, image, stock, brand };

  const [qty, setQty] = useState(0);
  const [active, setActive] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartItem = items.find((item) => item.productId === id);

  const collapse = () => {
    setActive(false);
    setQty(0);
  };

  const handleAdd = () => {
    addToCart(product, 1);
    setQty(1);
    setActive(true);
  };

  const handlePlus = () => {
    addToCart(product, 1);
    setQty((q) => q + 1);
  };

  const handleMinus = () => {
    if (qty <= 1) {
      if (cartItem) removeFromCart(cartItem.id);
      collapse();
    } else {
      if (cartItem) updateQuantity(cartItem.id, qty - 1);
      setQty((q) => q - 1);
    }
  };

  const handlePointerLeave = () => {
    leaveTimer.current = setTimeout(collapse, 800);
  };

  const handlePointerEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-sm bg-white">
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square bg-white relative overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Package className="w-12 h-12 opacity-30" />
              <span className="text-xs opacity-50">Sin imagen</span>
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                -{discountPercent}%
              </span>
            </div>
          )}

          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Agotado
              </span>
            </div>
          )}

          {!outOfStock && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 bg-white text-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Eye className="w-3.5 h-3.5" /> Ver detalle
              </span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3 pb-2">
        {brand && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-0.5">{brand}</p>
        )}
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors leading-snug">{name}</h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={`font-bold text-lg ${hasDiscount ? "text-primary" : "text-foreground"}`}>
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>

        {!outOfStock && stock < 20 && (
          <p className="text-[10px] text-orange-500 font-medium mt-1">¡Pocas unidades! Solo {stock} disponibles</p>
        )}
      </CardContent>

      {!isAdmin && (
        <CardFooter className="p-3 pt-0">
          {active ? (
            <div
              className="w-full flex items-center justify-between gap-1 bg-muted rounded-lg px-1 py-0.5"
              onPointerLeave={handlePointerLeave}
              onPointerEnter={handlePointerEnter}
            >
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-md hover:bg-background"
                onClick={handleMinus}
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="flex-1 text-center font-bold text-sm tabular-nums">{qty}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-md hover:bg-background"
                onClick={handlePlus}
                disabled={qty >= stock}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full gap-2 h-8 text-sm font-semibold transition-all"
              size="sm"
              disabled={outOfStock}
              variant={outOfStock ? "outline" : "default"}
              onClick={handleAdd}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {outOfStock ? "Agotado" : "Agregar"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
});
