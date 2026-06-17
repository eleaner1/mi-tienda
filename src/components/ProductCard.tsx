import { Link } from "react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, Package, Eye } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string | null;
  brand: string | null;
  stock: number;
  discountPercent?: number;
}

export function ProductCard({ id, name, price, image, brand, stock, discountPercent }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const originalPrice = parseFloat(price);
  const isAdmin = user?.role === "admin";
  const hasDiscount = discountPercent && discountPercent > 0;
  const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercent / 100) : originalPrice;
  const outOfStock = stock === 0;

  const product = { id, name, price, image, stock, brand };

  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-sm bg-white">
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Package className="w-12 h-12 opacity-30" />
              <span className="text-xs opacity-50">Sin imagen</span>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Agotado
              </span>
            </div>
          )}

          {/* Hover overlay with "Ver" button */}
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

        {/* Stock indicator */}
        {!outOfStock && stock <= 5 && (
          <p className="text-[10px] text-orange-500 font-medium mt-1">Solo {stock} en stock</p>
        )}
      </CardContent>

      {!isAdmin && (
        <CardFooter className="p-3 pt-0">
          <Button
            className="w-full gap-2 h-8 text-sm font-semibold transition-all"
            size="sm"
            disabled={outOfStock}
            variant={outOfStock ? "outline" : "default"}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {outOfStock ? "Agotado" : "Agregar"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
