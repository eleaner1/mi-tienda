import { Fragment, useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Package,
  User,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; label: string }> = {
    pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendiente" },
    processing: { color: "bg-blue-100 text-blue-800", label: "Procesando" },
    completed: { color: "bg-green-100 text-green-800", label: "Completado" },
    cancelled: { color: "bg-red-100 text-red-800", label: "Cancelado" },
  };
  const config = configs[status] || configs.pending;
  return <Badge className={config.color}>{config.label}</Badge>;
}

export default function AdminOrders() {
  const utils = trpc.useUtils();
  const { data: orders, isLoading } = trpc.order.listAllWithUsers.useQuery();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const { data: orderDetail, isLoading: loadingDetail } =
    trpc.order.getDetailsAdmin.useQuery(
      { id: expandedOrder! },
      { enabled: expandedOrder !== null },
    );

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      utils.order.listAllWithUsers.invalidate();
      toast.success("Estado actualizado");
    },
    onError: (err) => {
      toast.error(err.message || "Error al actualizar estado");
    },
  });

  const pendingCount = orders?.filter((o) => o.status === "pending").length ?? 0;
  const totalSales =
    orders
      ?.filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + parseFloat(o.total), 0) ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Órdenes
        </h1>
        <Badge variant="secondary" className="ml-auto">
          {orders?.length ?? 0} en total
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total órdenes</p>
            <p className="text-2xl font-bold">{orders?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Ventas completadas</p>
            <p className="text-2xl font-bold text-green-600">
              ${totalSales.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <Fragment key={order.id}>
                      <TableRow
                        className={
                          expandedOrder === order.id ? "bg-muted/50" : ""
                        }
                      >
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-sm font-medium leading-tight">
                                {order.userName || "Usuario"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.userEmail}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-right font-bold">
                          ${parseFloat(order.total).toFixed(2)}
                        </TableCell>

                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(val) =>
                              updateStatus.mutate({
                                id: order.id,
                                status: val as
                                  | "pending"
                                  | "processing"
                                  | "completed"
                                  | "cancelled",
                              })
                            }
                          >
                            <SelectTrigger className="w-36 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="processing">
                                Procesando
                              </SelectItem>
                              <SelectItem value="completed">
                                Completado
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedOrder(
                                expandedOrder === order.id ? null : order.id,
                              )
                            }
                          >
                            {expandedOrder === order.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="p-0 bg-muted/30"
                          >
                            <div className="px-6 py-4">
                              <p className="text-sm font-medium mb-3">
                                Productos del pedido:
                              </p>

                              {loadingDetail ? (
                                <div className="space-y-2">
                                  {Array.from({ length: 2 }).map((_, i) => (
                                    <Skeleton key={i} className="h-8 rounded" />
                                  ))}
                                </div>
                              ) : orderDetail?.items &&
                                orderDetail.items.length > 0 ? (
                                <div className="space-y-2">
                                  {orderDetail.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center gap-3"
                                    >
                                      <div className="w-8 h-8 bg-background rounded border overflow-hidden shrink-0 flex items-center justify-center">
                                        {item.product?.image ? (
                                          <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Package className="w-4 h-4 text-muted-foreground" />
                                        )}
                                      </div>
                                      <span className="text-sm flex-1 min-w-0 truncate">
                                        {item.product?.name || "Producto"}{" "}
                                        <span className="text-muted-foreground">
                                          × {item.quantity}
                                        </span>
                                      </span>
                                      <span className="text-sm font-medium shrink-0">
                                        $
                                        {(
                                          item.quantity *
                                          parseFloat(item.unitPrice)
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  ))}

                                  <Separator className="my-2" />

                                  <div className="flex justify-between text-sm font-bold">
                                    <span>Total</span>
                                    <span>
                                      ${parseFloat(order.total).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Sin detalles disponibles
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay órdenes aún</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
