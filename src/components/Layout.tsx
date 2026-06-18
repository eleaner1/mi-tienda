import { useState } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router";
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
  LayoutGrid,
  Tag,
  Sparkles,
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
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b bg-muted/30">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-primary" />
            </div>
            <span>Tu carrito</span>
            {totalItems > 0 && (
              <Badge className="ml-1 bg-primary text-white text-xs px-2">{totalItems}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16 px-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 opacity-30" />
              </div>
              <p className="font-medium mb-1">Tu carrito está vacío</p>
              {!isAuthenticated && (
                <p className="text-sm text-center mt-1">
                  Inicia sesión para guardar tu carrito
                </p>
              )}
              <Link to="/search" onClick={onClose} className="mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Package className="w-4 h-4" /> Ver productos
                </Button>
              </Link>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="space-y-3 p-4">
                {items.map((item) => {
                  const stock = item.product?.stock ?? 0;
                  const reachedStock = item.quantity >= stock;
                  const itemTotal = parseFloat(item.product?.price || "0") * item.quantity;

                  return (
                    <div
                      key={item.productId}
                      className="flex gap-3 p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden shrink-0 border">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-7 h-7 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate leading-tight">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ${parseFloat(item.product?.price || "0").toFixed(2)} c/u
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1.5 bg-muted rounded-lg p-0.5">
                            <button
                              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                            <button
                              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40"
                              disabled={reachedStock}
                              onClick={() => item.quantity < stock && updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">${itemTotal.toFixed(2)}</span>
                            <button
                              className="w-6 h-6 rounded-md flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {reachedStock && (
                          <p className="text-[10px] text-orange-500 mt-1">Stock máximo alcanzado</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t bg-muted/20 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{totalItems} producto{totalItems !== 1 ? "s" : ""}</span>
              <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full gap-2 h-11 font-semibold" onClick={handleCheckout}>
              <ShoppingCart className="w-4 h-4" />
              Ver carrito y pagar
            </Button>
            <button
              className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
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
  const location = useLocation();

  const { data: categories } = trpc.category.list.useQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          {/* Menu */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 hover:bg-primary/10 hover:text-primary transition-colors">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-full sm:max-w-xs p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="px-5 py-4 border-b bg-gradient-to-br from-primary/10 to-indigo-50">
                  <SheetTitle className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                      <Store className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-lg">MiTienda</span>
                  </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1">
                  <div className="px-4 py-4 space-y-5">
                    {/* User */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Cuenta</p>

                      {isAuthenticated && user ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{user.name || "Usuario"}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            {user.role === "admin" && (
                              <Shield className="w-4 h-4 text-primary shrink-0" />
                            )}
                          </div>

                          {user.role !== "admin" && (
                            <Link to="/orders" onClick={() => setMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start gap-2 h-9 rounded-lg hover:bg-primary/5 hover:text-primary">
                                <History className="w-4 h-4" /> Historial de compras
                              </Button>
                            </Link>
                          )}

                          {user.role === "admin" && (
                            <Link to="/admin" onClick={() => setMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start gap-2 h-9 rounded-lg text-primary hover:bg-primary/10">
                                <Shield className="w-4 h-4" /> Panel de admin
                              </Button>
                            </Link>
                          )}

                          <button
                            className="w-full flex items-center gap-2 px-3 h-9 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => { logout(); setMenuOpen(false); }}
                          >
                            <LogOut className="w-4 h-4" /> Cerrar sesión
                          </button>
                        </div>
                      ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                          <Button className="w-full gap-2 h-10 font-semibold">
                            <User className="w-4 h-4" /> Iniciar sesión
                          </Button>
                        </Link>
                      )}
                    </div>

                    <Separator />

                    {/* Navegación */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1 mb-2">Navegación</p>
                      <Link to="/" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className={`w-full justify-start gap-2 h-9 rounded-lg ${isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                          <Home className="w-4 h-4" /> Inicio
                        </Button>
                      </Link>
                      <Link to="/search" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className={`w-full justify-start gap-2 h-9 rounded-lg ${isActive("/search") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                          <Sparkles className="w-4 h-4" /> Explorar productos
                        </Button>
                      </Link>
                      <Link to="/categories" onClick={() => setMenuOpen(false)}>
                        <Button variant="ghost" className={`w-full justify-start gap-2 h-9 rounded-lg ${isActive("/categories") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                          <LayoutGrid className="w-4 h-4" /> Categorías
                        </Button>
                      </Link>
                      {user?.role !== "admin" && (
                        <Link to="/cart" onClick={() => setMenuOpen(false)}>
                          <Button variant="ghost" className={`w-full justify-start gap-2 h-9 rounded-lg ${isActive("/cart") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                            <ShoppingCart className="w-4 h-4" />
                            Carrito
                            {totalItems > 0 && (
                              <Badge className="ml-auto bg-primary text-white text-xs px-1.5">{totalItems}</Badge>
                            )}
                          </Button>
                        </Link>
                      )}
                    </div>

                    {categories && categories.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1 mb-2">Categorías</p>
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/category/${cat.id}`}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                            >
                              <div className="flex items-center gap-2">
                                {cat.image ? (
                                  <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-5 h-5 rounded-full object-cover" />
                                ) : (
                                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                                <span className="text-sm">{cat.name}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg hidden sm:block tracking-tight">MiTienda</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar productos..."
                className="pl-9 w-full bg-muted/50 border-0 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary/50 rounded-full transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Cart button */}
          {user?.role !== "admin" && (
            <button
              className="relative shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const handleClick = () => {
    if (pathname === to) window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <Link
      to={to}
      onClick={handleClick}
      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
    >
      <ChevronRight className="w-3 h-3" /> {label}
    </Link>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-br from-muted/60 to-muted mt-auto">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-lg">MiTienda</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tu tienda de confianza. Encuentra los mejores productos al mejor precio.
              </p>
            </div>
            {/* Links */}
            <div>
              <p className="font-semibold text-sm mb-3">Explorar</p>
              <ul className="space-y-2">
                {[
                  { to: "/", label: "Inicio" },
                  { to: "/categories", label: "Categorías" },
                  { to: "/search", label: "Todos los productos" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <FooterLink to={to} label={label} />
                  </li>
                ))}
              </ul>
            </div>
            {/* Info */}
            <div>
              <p className="font-semibold text-sm mb-3">Compras</p>
              <ul className="space-y-2">
                {[
                  { to: "/cart", label: "Mi carrito" },
                  { to: "/orders", label: "Mis pedidos" },
                  { to: "/login", label: "Mi cuenta" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <FooterLink to={to} label={label} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Separator className="mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© 2026 MiTienda. Todos los derechos reservados.</p>
            <p className="flex items-center gap-1">
              Pago seguro con <span className="font-semibold text-blue-600">PayPal</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
