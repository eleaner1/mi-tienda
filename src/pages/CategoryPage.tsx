import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Package,
  MessageCircle,
  Send,
} from "lucide-react";

const STORE_WHATSAPP_NUMBER = "50576136481";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const { isAuthenticated, user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const utils = trpc.useUtils();

  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      utils.order.myOrders.invalidate();
      clearCart();
      toast.success("¡Pedido realizado con éxito!");
    },
  });

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    let message = "¡Hola! Quiero hacer un pedido:\n\n";

    items.forEach((item, index) => {
      const product = item.product;

      if (product) {
        const price = parseFloat(product.price);
        const subtotal = item.quantity * price;

        message += `${index + 1}. ${product.name}`;

        if (product.brand) {
          message += ` (${product.brand})`;
        }

        message += ` - ${item.quantity} x $${price.toFixed(2)} = $${subtotal.toFixed(2)}\n`;
      }
    });

    message += `\n*Total: $${totalPrice.toFixed(2)}*`;
    message += `\n\nCliente: ${user?.name || "N/A"}`;

    if (user?.phone) {
      message += `\nTeléfono del cliente: ${user.phone}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    if (isAuthenticated) {
      createOrder.mutate({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product?.price || "0",
        })),
        total: totalPrice.toFixed(2),
      });
    } else {
      clearCart();
    }

    window.open(whatsappUrl, "_blank");
    setIsCheckingOut(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Carrito de compras
        </h1>

        {totalItems > 0 && (
          <Badge variant="secondary" className="text-sm">
            {totalItems} items
          </Badge>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Tu carrito está vacío</p>
            <p className="text-sm mt-2">Agrega productos para comenzar a comprar</p>

            <Link to="/" className="mt-6">
              <Button>Seguir comprando</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.product?.name}</h3>

                      {item.product?.brand && (
                        <p className="text-sm text-muted-foreground">
                          {item.product.brand}
                        </p>
                      )}

                      <p className="font-bold mt-1">
                        ${parseFloat(item.product?.price || "0").toFixed(2)}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.productId, item.quantity - 1);
                              }
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);

                              if (val > 0) {
                                updateQuantity(item.productId, val);
                              }
                            }}
                            className="w-16 h-8 text-center"
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Quitar
                        </Button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-lg">
                        $
                        {(
                          item.quantity *
                          parseFloat(item.product?.price || "0")
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Subtotal ({totalItems} productos)
                  </span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>

                {!isCheckingOut ? (
                  <Button
                    className="w-full gap-2 h-12 text-lg"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.info("Inicia sesión para guardar tu historial de compras");
                      }

                      setIsCheckingOut(true);
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Pagar por WhatsApp
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-md border p-3 text-sm text-muted-foreground">
                      El pedido se enviará al WhatsApp de la tienda:
                      <strong className="block text-foreground mt-1">
                        +505 76136481
                      </strong>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsCheckingOut(false)}
                      >
                        Cancelar
                      </Button>

                      <Button
                        className="flex-1 gap-2"
                        onClick={handleWhatsAppCheckout}
                        disabled={createOrder.isPending}
                      >
                        <Send className="w-4 h-4" />
                        {createOrder.isPending ? "Procesando..." : "Confirmar pedido"}
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="w-full text-destructive"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}