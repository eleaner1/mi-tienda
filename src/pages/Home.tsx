import { useMemo, useRef, useEffect } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryIcon } from "@/lib/categoryIcons";
import {
  ShoppingBag, ShoppingCart, ArrowRight, ArrowLeft, ChevronDown, Zap, TrendingUp, Package,
  LayoutGrid, Star, Shield, Truck, Trophy,
  Gamepad2, BookOpen, Smartphone, Sparkles,
} from "lucide-react";


type Category = { id: number; name: string; icon: string | null; image: string | null };

function CategoriesCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const getStep = () => {
    const el = scrollRef.current;
    if (!el) return 200;
    const card = el.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + 12 : 200;
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getStep();
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  // Auto-scroll loop: advances one card every 2.5 s, loops back to start
  useEffect(() => {
    const interval = setInterval(() => {
      if (paused.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const step = getStep();
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - step / 2;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 pt-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 anim-fade-up">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Categorías</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border bg-white shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Desplazar izquierda"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border bg-white shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Desplazar derecha"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <Link to="/categories" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium ml-1">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
        onTouchStart={() => { paused.current = true; }}
        onTouchEnd={() => { paused.current = false; }}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat, i) => {
          const CatIcon = getCategoryIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              className="anim-fade-up group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shrink-0 w-[calc(100vw/3-1rem)] sm:w-[calc(100vw/6-1rem)]"
            >
              <div className="aspect-[3/4]">
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/55 via-indigo-700/65 to-violet-900/80" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2 p-3">
                  <CatIcon className="w-7 h-7 text-yellow-400 shrink-0" />
                  <span className="text-white font-bold text-xs text-center leading-tight">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  const { data: mostBought,  isLoading: loadingMost }   = trpc.product.mostBought.useQuery({ limit: 8 });
  const { data: offers,      isLoading: loadingOffers }  = trpc.product.onOffer.useQuery({ limit: 8 });
  const { data: categories }                             = trpc.category.list.useQuery();
  const { data: allProducts, isLoading: loadingAll }     = trpc.product.list.useQuery({ limit: 100, offset: 0 });

  const collage = useMemo(() => {
    const seen = new Set<number>();
    const top:  { id: number; name: string; price: string; image: string | null; brand: string | null; stock: number }[] = [];
    const rest: { id: number; name: string; price: string; image: string | null; brand: string | null; stock: number }[] = [];

    for (const p of mostBought ?? []) {
      if (!seen.has(p.id)) { seen.add(p.id); top.push(p); }
    }
    for (const { product } of offers ?? []) {
      seen.add(product.id);
    }
    for (const p of allProducts ?? []) {
      if (!seen.has(p.id)) { seen.add(p.id); rest.push(p); }
    }
    return { top, rest };
  }, [mostBought, offers, allProducts]);

  return (
    <div className="space-y-0 pb-16">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1a2b8c] text-white py-14 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-12">

            {/* Columna izquierda: eslogan + CTAs */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 anim-fade-up">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>La tienda online de confianza</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight anim-fade-up anim-delay-1">
                Productos que{" "}
                <span className="text-yellow-400">te hacen la vida más fácil.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-lg mx-auto md:mx-0 mb-8 anim-fade-up anim-delay-2">
                Descubre miles de productos con la mejor calidad y al mejor precio. Ofertas exclusivas cada día.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start anim-fade-up anim-delay-3">
                <Link to="/search">
                  <Button size="lg" className="gap-2 bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-lg font-bold">
                    <ShoppingBag className="w-5 h-5" />
                    Explorar productos
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button size="lg" variant="outline" className="gap-2 border-white/40 text-white hover:bg-white/10 bg-transparent">
                    Ver categorías <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Columna derecha: ilustración carrito mágico */}
            <div className="flex-1 flex items-center justify-center anim-fade-up anim-delay-2">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
                {/* Resplandor central */}
                <div className="absolute inset-8 rounded-full bg-yellow-400/20 blur-3xl animate-pulse" />

                {/* Carrito principal */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/10 border-2 border-white/25 flex items-center justify-center shadow-2xl">
                    <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 drop-shadow-lg" />
                    <div className="absolute inset-0 rounded-3xl bg-yellow-400/10 blur-md pointer-events-none" />
                  </div>
                </div>

                {/* Productos flotantes — 4 esquinas */}
                <div
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1e3a8a] border border-white/25 flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDuration: "3.2s" }}
                >
                  <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                </div>
                <div
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1e3a8a] border border-white/25 flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDuration: "2.8s", animationDelay: "0.4s" }}
                >
                  <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                </div>
                <div
                  className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1e3a8a] border border-white/25 flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDuration: "3.6s", animationDelay: "0.8s" }}
                >
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                </div>
                <div
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1e3a8a] border border-white/25 flex items-center justify-center shadow-lg animate-bounce"
                  style={{ animationDuration: "2.5s", animationDelay: "0.2s" }}
                >
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                </div>

                {/* Estrellas */}
                <Star className="absolute top-16 left-0 w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                <Star className="absolute top-1 right-[4.5rem] w-3 h-3 text-yellow-200 fill-yellow-200 animate-pulse" style={{ animationDelay: "0.7s" }} />
                <Star className="absolute bottom-16 right-0 w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" style={{ animationDelay: "1.2s" }} />
                <Star className="absolute bottom-1 left-[4.5rem] w-3 h-3 text-yellow-200 fill-yellow-200 animate-pulse" style={{ animationDelay: "0.4s" }} />

                {/* Destellos giratorios */}
                <Sparkles className="absolute top-10 right-12 w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: "8s" }} />
                <Sparkles className="absolute bottom-12 left-10 w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
                <Sparkles className="absolute top-[5.5rem] left-9 w-3 h-3 text-yellow-200 animate-pulse" style={{ animationDelay: "0.9s" }} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 anim-fade-up anim-delay-4">
            {[
              { icon: Package, value: `${allProducts?.length ?? "—"}+`, label: "Productos" },
              { icon: Zap,     value: `${offers?.length ?? "—"}`,       label: "En oferta ahora" },
              { icon: Shield,  value: "PayPal",                          label: "Pago 100% seguro" },
              { icon: Truck,   value: "Garantizada",                     label: "Entrega rápida" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
                <Icon className="w-5 h-5 mx-auto mb-1.5 text-yellow-400" />
                <p className="font-bold text-base leading-none">{value}</p>
                <p className="text-white/60 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky scroll hint — se pega al fondo del viewport mientras el hero esté visible,
            desaparece solo al salir de la sección. No cubre texto porque sticky fluye en el DOM. */}
        <div className="sticky bottom-0 flex justify-center py-3 pointer-events-none">
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            className="pointer-events-auto flex flex-col items-center gap-0.5 text-white/50 hover:text-white/90 transition-colors"
            aria-label="Ver más contenido"
          >
            <span className="text-[9px] tracking-[0.2em] uppercase font-semibold">Descubre más</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ── Categorías ────────────────────────────────────────────────── */}
      {categories && categories.length > 0 && (
        <CategoriesCarousel categories={categories} />
      )}

      {/* ── Los más comprados ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-2 anim-fade-up">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Los más comprados
          </h2>
          <Link to="/trending">
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {loadingMost ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
          </div>
        ) : mostBought && mostBought.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mostBought.map((product, i) => (
              <div key={product.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <ProductCard
                  id={product.id} name={product.name} price={product.price}
                  image={product.image} brand={product.brand} stock={product.stock}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 text-muted-foreground bg-muted/30 rounded-2xl">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Aún no hay productos destacados</p>
          </div>
        )}
      </section>

      {/* ── Ofertas especiales ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-2 anim-fade-up">
            <Zap className="w-6 h-6 text-yellow-500" />
            Ofertas especiales
          </h2>
          <Link to="/offers">
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {loadingOffers ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {offers.map((item, i) => {
              const endDate = item.offer.endDate ? new Date(item.offer.endDate) : null;
              const now = new Date();
              const diffMs = endDate ? endDate.getTime() - now.getTime() : null;
              const diffDays = diffMs !== null ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : null;
              const expiryLabel = diffDays !== null
                ? diffDays <= 0 ? "Vence hoy"
                  : diffDays === 1 ? "Vence mañana"
                  : diffDays <= 7 ? `Vence en ${diffDays} días`
                  : endDate!.toLocaleDateString("es-NI", { day: "numeric", month: "short", year: "numeric" })
                : null;
              return (
                <div key={item.product.id} className="anim-fade-up flex flex-col gap-1" style={{ animationDelay: `${i * 0.07}s` }}>
                  <ProductCard
                    id={item.product.id} name={item.product.name} price={item.product.price}
                    image={item.product.image} brand={item.product.brand} stock={item.product.stock}
                    discountPercent={item.offer.discountPercent}
                  />
                  {expiryLabel && (
                    <p className={`text-center text-xs font-medium px-2 py-0.5 rounded-full mx-auto ${diffDays !== null && diffDays <= 1 ? "bg-red-100 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                      ⏱ {expiryLabel}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-14 text-muted-foreground bg-muted/30 rounded-2xl">
            <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay ofertas activas en este momento</p>
          </div>
        )}
      </section>

      {/* ── Catálogo completo ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold anim-fade-up">Catálogo completo</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Link to="/search">
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80 ml-4">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loadingAll ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-8">
            {collage.top.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Más vendidos</span>
                  <div className="flex-1 h-px bg-amber-200" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {collage.top.map((p, i) => (
                    <div key={p.id} className="relative anim-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <span className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow pointer-events-none">
                        #{i + 1}
                      </span>
                      <ProductCard id={p.id} name={p.name} price={p.price} image={p.image} brand={p.brand} stock={p.stock} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {collage.rest.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Más productos</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {collage.rest.map((p, i) => (
                    <div key={p.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                      <ProductCard id={p.id} name={p.name} price={p.price} image={p.image} brand={p.brand} stock={p.stock} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {collage.top.length === 0 && collage.rest.length === 0 && (
              <div className="text-center py-14 text-muted-foreground bg-muted/30 rounded-2xl">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No hay productos disponibles</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
