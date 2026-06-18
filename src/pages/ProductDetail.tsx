import { useState } from "react";
import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, ShoppingCart, AlertTriangle, Plus, Minus } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = trpc.product.getById.useQuery({
    id: productId,
  });

  if (isLoading) {
    return <div className="p-8 text-center">Cargando producto...</div>;
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p>Producto no encontrado</p>
        <Link to="/">
          <Button className="mt-4">Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </Link>

      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl flex items-center justify-center overflow-hidden min-h-[300px] border">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-contain p-4 max-h-[400px]"
              />
            ) : (
              <Package className="w-24 h-24 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {product.brand && (
              <p className="text-muted-foreground">Marca: {product.brand}</p>
            )}

            <p className="text-2xl font-bold">
              ${parseFloat(product.price).toFixed(2)}
            </p>

            <div>
              <h2 className="font-semibold mb-1">Descripción</h2>
              <p className="text-muted-foreground">
                {product.description || "Este producto no tiene descripción."}
              </p>
            </div>

            <div>
              <h2 className="font-semibold mb-1">Stock disponible</h2>
              <p>{product.stock} unidades</p>
              {product.stock > 0 && product.stock < 20 && (
                <div className="flex items-center gap-1.5 mt-1.5 text-orange-500">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">¡Pocas unidades disponibles!</span>
                </div>
              )}
            </div>

            {!isAdmin && (
              <>
                {product.stock > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Cantidad:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9"
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-9 h-9"
                        disabled={quantity >= product.stock}
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full gap-2"
                  disabled={product.stock <= 0}
                  onClick={() => {
                    addToCart(
                      {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        stock: product.stock,
                        brand: product.brand,
                      },
                      quantity,
                    );
                    setQuantity(1);
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}