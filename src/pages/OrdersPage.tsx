import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3" />, label: "Pendiente" },
    processing: { color: "bg-blue-100 text-blue-800", icon: <Clock className="w-3 h-3" />, label: "Procesando" },
    completed: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" />, label: "Completado" },
    cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" />, label: "Cancelado" },
  };
  const config = configs[status] || configs.pending;

  return (
    <Badge className={`${config.color} gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.order.myOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">Inicia sesión</h2>
            <p className="text-muted-foreground mb-6">Debes iniciar sesión para ver tu historial de compras</p>
            <Link to="/login">
              <Button>Iniciar sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Historial de compras</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Orden #{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : "Fecha no disponible"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">${parseFloat(order.total).toFixed(2)}</span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-4 pb-4">
                    <Separator className="mb-4" />
                    <div className="space-y-3">
                      {/* Aquí irían los items de la orden si tuviéramos el detalle */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total de la orden:</span>
                        <span className="font-bold">${parseFloat(order.total).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Estado:</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">WhatsApp enviado:</span>
                        <span>{order.whatsappSent ? "Sí" : "No"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No tienes compras aún</p>
            <p className="text-sm mt-2">Tus pedidos aparecerán aquí</p>
            <Link to="/" className="mt-6">
              <Button>Ir a comprar</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
