import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Shield,
  Package,
  LayoutGrid,
  Tag,
  ShoppingCart,
  Warehouse,
  ArrowRight,
  DollarSign,
  Settings,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== "admin") {
      toast.error("No tienes permisos de administrador");
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const { data: inventorySummary, isLoading: loadingInventory } = trpc.inventory.summary.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const { data: allOrders } = trpc.order.listAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const { data: allCategories } = trpc.category.listAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">Acceso restringido</h2>
        <p className="text-muted-foreground mb-6">Necesitas permisos de administrador</p>
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  const totalOrders = allOrders?.length || 0;

  const monthlySales = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return allOrders
      ?.filter((o) => new Date(o.createdAt) >= startOfMonth)
      .reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;
  }, [allOrders]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 anim-fade-up">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Panel de administración</h1>
          <p className="text-muted-foreground">Gestiona tu tienda online</p>
        </div>
        <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Admin</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="anim-fade-up anim-delay-1 border-t-4 border-t-primary overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-3xl font-bold">{loadingInventory ? "-" : inventorySummary?.totalProducts || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="anim-fade-up anim-delay-2 border-t-4 border-t-blue-500 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categorías</p>
                <p className="text-3xl font-bold">{allCategories?.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="anim-fade-up anim-delay-3 border-t-4 border-t-green-500 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Órdenes</p>
                <p className="text-3xl font-bold">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="anim-fade-up anim-delay-4 border-t-4 border-t-yellow-500 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos del mes</p>
                <p className="text-3xl font-bold">${monthlySales.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/categories">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Categorías</h3>
                  <p className="text-sm text-muted-foreground">Gestionar categorías de productos</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/products">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Productos</h3>
                  <p className="text-sm text-muted-foreground">Agregar, editar y eliminar productos</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/offers">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Ofertas y Descuentos</h3>
                  <p className="text-sm text-muted-foreground">Crear promociones especiales</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/inventory">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Warehouse className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Inventario</h3>
                  <p className="text-sm text-muted-foreground">Control de stock y existencias</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/orders">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Órdenes</h3>
                  <p className="text-sm text-muted-foreground">Ver y gestionar pedidos de clientes</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/settings">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Configuración</h3>
                  <p className="text-sm text-muted-foreground">WhatsApp y mensajes de pago</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/reports">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Reporte de ingresos</h3>
                  <p className="text-sm text-muted-foreground">Diario, semanal, mensual y descargable</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
