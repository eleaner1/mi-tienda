import { Link } from "react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart, Package } from "lucide-react";

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

  const product = { id, name, price, image, stock, brand };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${id}`}>
        <div className="aspect-square bg-muted relative overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              -{discountPercent}%
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Agotado
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-3">
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{name}</h3>
        </Link>
        {brand && <p className="text-xs text-muted-foreground mt-1">{brand}</p>}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-lg">${discountedPrice.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
      {!isAdmin && (
        <CardFooter className="p-3 pt-0">
          <Button
            className="w-full gap-2"
            size="sm"
            disabled={stock === 0}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
