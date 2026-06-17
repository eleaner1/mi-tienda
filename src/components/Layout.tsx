import { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  ShoppingCart,
  Search,
  Home,
  Package,
  History,
  User,
  LogOut,
  Shield,
  Plus,
  Minus,
  Trash2,
  Store,
  ChevronRight,
} from "lucide-react";

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  if (user?.role === "admin") return null;

  const handleCheckout = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden mt-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-50" />
              <p>Tu carrito está vacío</p>

              {!isAuthenticated && (
                <p className="text-sm mt-2">
                  Inicia sesión para guardar tu carrito
                </p>
              )}
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                {items.map((item) => {
                  const stock = item.product?.stock ?? 0;
                  const reachedStock = item.quantity >= stock;

                  return (
                    <div
                      key={item.productId}
                      className="flex gap-3 p-3 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden shrink-0">
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
                        <p className="font-medium text-sm truncate">
                          {item.product?.name}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          ${parseFloat(item.product?.price || "0").toFixed(2)}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Stock: {stock}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            disabled={item.quantity <= 1}
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1,
                                );
                              }
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="text-sm w-6 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="w-6 h-6"
                            disabled={reachedStock}
                            onClick={() => {
                              if (item.quantity < stock) {
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1,
                                );
                              }
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 ml-auto text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <Button className="w-full" onClick={handleCheckout}>
              Ver carrito y pagar
            </Button>

            <Button
              variant="ghost"
              className="w-full text-destructive"
              onClick={clearCart}
            >
              Vaciar carrito
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { data: categories } = trpc.category.list.useQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-full sm:max-w-xs p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Mi Tienda
                  </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1">
                  <div className="px-4 py-4 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Cuenta
                      </h3>

                      {isAuthenticated && user ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name || ""}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <User className="w-8 h-8 p-1 rounded-full bg-primary text-primary-foreground" />
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {user.name || "Usuario"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>

                            {user.role === "admin" && (
                              <Shield className="w-4 h-4 text-primary" />
                            )}
                          </div>

                          <Link to="/orders" onClick={() => setMenuOpen(false)}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-2"
                            >
                              <History className="w-4 h-4" />
                              Historial de compras
                            </Button>
                          </Link>

                          {user.role === "admin" && (
                            <Link to="/admin" onClick={() => setMenuOpen(false)}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 text-primary"
                              >
                                <Shield className="w-4 h-4" />
                                Panel de administración
                              </Button>
                            </Link>
                          )}

                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-destructive"
                            onClick={() => {
                              logout();
                              setMenuOpen(false);
                            }}
                          >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión
                          </Button>
                        </div>
                      ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                          <Button className="w-full gap-2">
                            <User className="w-4 h-4" />
                            Iniciar sesión
                          </Button>
                        </Link>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Categorías
                      </h3>

                      <div className="space-y-1">
                        {categories?.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <span className="text-sm">{cat.name}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Navegación
                      </h3>

                      <Link to="/" onClick={() => setMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                        >
                          <Home className="w-4 h-4" />
                          Inicio
                        </Button>
                      </Link>

                      {user?.role !== "admin" && (
                        <Link to="/cart" onClick={() => setMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Carrito
                            {totalItems > 0 && (
                              <Badge variant="secondary" className="ml-auto">
                                {totalItems}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="font-bold text-xl shrink-0 hidden sm:block">
            MiTienda
          </Link>

          <Link to="/" className="font-bold text-lg shrink-0 sm:hidden">
            MT
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos por nombre o marca..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {user?.role !== "admin" && (
            <Button
              variant="ghost"
              size="icon"
              className="relative shrink-0"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-6 bg-muted">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Mi Tienda Online - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}