import { useEffect } from "react";
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

  const totalSales = allOrders?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;
  const totalOrders = allOrders?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Panel de administración</h1>
          <p className="text-muted-foreground">Gestiona tu tienda online</p>
        </div>
        <Badge variant="secondary" className="ml-auto">Admin</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-3xl font-bold">{loadingInventory ? "-" : inventorySummary?.totalProducts || 0}</p>
              </div>
              <Package className="w-8 h-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categorías</p>
                <p className="text-3xl font-bold">{allCategories?.length || 0}</p>
              </div>
              <LayoutGrid className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Órdenes</p>
                <p className="text-3xl font-bold">{totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventas totales</p>
                <p className="text-3xl font-bold">${totalSales.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/categories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Configuración de pagos</h3>
                  <p className="text-sm text-muted-foreground">Banco, cuenta y datos para recibir pagos</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
