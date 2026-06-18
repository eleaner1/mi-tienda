import { useMemo } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryIcon } from "@/lib/categoryIcons";
import {
  ShoppingBag, ArrowRight, Zap, TrendingUp, Package,
  Store, Star, Shield, Truck, ChevronRight, Trophy,
} from "lucide-react";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-indigo-700 text-white py-24 px-4">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 rounded-full bg-yellow-300/10 pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 anim-fade-up">
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              <span>La tienda online de confianza</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight anim-fade-up anim-delay-1">
              Bienvenido a{" "}
              <span className="text-yellow-300 drop-shadow">MiTienda</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 anim-fade-up anim-delay-2">
              Descubre los mejores productos al mejor precio. Ofertas exclusivas y calidad garantizada.
            </p>
            <div className="flex flex-wrap gap-3 justify-center anim-fade-up anim-delay-3">
              <Link to="/search">
                <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg font-semibold">
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

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 anim-fade-up anim-delay-4">
            {[
              { icon: Package, value: `${allProducts?.length ?? "—"}+`, label: "Productos" },
              { icon: Zap,     value: `${offers?.length ?? "—"}`,       label: "En oferta ahora" },
              { icon: Shield,  value: "PayPal",                          label: "Pago 100% seguro" },
              { icon: Truck,   value: "Garantizada",                     label: "Entrega rápida" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
                <Icon className="w-5 h-5 mx-auto mb-1.5 text-yellow-300" />
                <p className="font-bold text-base leading-none">{value}</p>
                <p className="text-white/60 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorías ────────────────────────────────────────────────── */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto px-4 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 anim-fade-up">
              <Store className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Categorías</h2>
            </div>
            <Link to="/categories" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const CatIcon = getCategoryIcon(cat.icon);
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  className="anim-fade-up group flex flex-col items-center p-5 rounded-2xl border-2 border-transparent bg-muted/40 shadow-sm hover:border-primary hover:shadow-[0_8px_30px_rgba(0,0,0,0.13)] hover:-translate-y-2 hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    {!cat.icon && cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        decoding="async"
                        className="w-9 h-9 object-cover rounded-xl group-hover:brightness-0 group-hover:invert transition-all"
                      />
                    ) : (
                      <CatIcon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-center leading-tight group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
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
            {offers.map((item, i) => (
              <div key={item.product.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <ProductCard
                  id={item.product.id} name={item.product.name} price={item.product.price}
                  image={item.product.image} brand={item.product.brand} stock={item.product.stock}
                  discountPercent={item.offer.discountPercent}
                />
              </div>
            ))}
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
