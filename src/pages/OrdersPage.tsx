import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  History,
  ShoppingBag,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    pending:    { bg: "bg-yellow-100", text: "text-yellow-800", icon: <Clock className="w-3 h-3" />,       label: "Pendiente" },
    processing: { bg: "bg-blue-100",   text: "text-blue-800",   icon: <Clock className="w-3 h-3" />,       label: "Procesando" },
    completed:  { bg: "bg-green-100",  text: "text-green-800",  icon: <CheckCircle className="w-3 h-3" />, label: "Completado" },
    cancelled:  { bg: "bg-red-100",    text: "text-red-800",    icon: <XCircle className="w-3 h-3" />,     label: "Cancelado" },
  };
  const c = configs[status] ?? configs.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${c.bg} ${c.text}`}>
      {c.icon} {c.label}
    </span>
  );
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.order.myOrders.useQuery(undefined, { enabled: isAuthenticated });
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const { data: orderDetail, isLoading: loadingDetail } = trpc.order.getById.useQuery(
    { id: expandedOrder! },
    { enabled: expandedOrder !== null },
  );

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
          <History className="w-10 h-10 text-muted-foreground opacity-50" />
        </div>
        <h2 className="text-xl font-bold mb-2">Inicia sesión</h2>
        <p className="text-muted-foreground mb-6">
          Debes iniciar sesión para ver tu historial de compras
        </p>
        <Link to="/login?redirect=/orders">
          <Button className="gap-2"><ShoppingBag className="w-4 h-4" /> Iniciar sesión</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Historial de compras
          </h1>
          {orders && orders.length > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">{orders.length} pedido{orders.length !== 1 ? "s" : ""} realizados</p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className="anim-fade-up rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              {/* Order header row */}
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">Orden #{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("es-NI", {
                            year: "numeric", month: "long", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })
                        : "Fecha no disponible"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-lg text-primary">${parseFloat(order.total).toFixed(2)}</span>
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    {expandedOrder === order.id
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              {expandedOrder === order.id && (
                <div className="border-t bg-muted/20 px-4 pb-4 pt-3">
                  {loadingDetail ? (
                    <div className="space-y-2">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 rounded-lg" />
                      ))}
                    </div>
                  ) : orderDetail?.items && orderDetail.items.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Productos comprados</p>
                      {orderDetail.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border">
                          <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden shrink-0 flex items-center justify-center border">
                            {item.product?.image ? (
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.product?.name || "Producto"}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × ${parseFloat(item.unitPrice).toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-primary shrink-0">
                            ${(item.quantity * parseFloat(item.unitPrice)).toFixed(2)}
                          </p>
                        </div>
                      ))}

                      <div className="flex justify-between items-center pt-2 font-bold text-sm">
                        <span>Total pagado</span>
                        <span className="text-primary text-base">${parseFloat(order.total).toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold">${parseFloat(order.total).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pagado con PayPal</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <Package className="w-10 h-10 text-muted-foreground opacity-40" />
          </div>
          <p className="text-lg font-semibold mb-2">No tienes compras aún</p>
          <p className="text-sm text-muted-foreground mb-6">Tus pedidos aparecerán aquí cuando realices tu primera compra</p>
          <Link to="/">
            <Button className="gap-2">
              <ShoppingBag className="w-4 h-4" /> Ir a comprar
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
