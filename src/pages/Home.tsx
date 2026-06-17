import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ArrowRight, Zap, TrendingUp, Package, Store, Star, Shield, Truck } from "lucide-react";

export default function Home() {
  const { data: mostBought, isLoading: loadingMost } = trpc.product.mostBought.useQuery({ limit: 8 });
  const { data: offers, isLoading: loadingOffers } = trpc.product.onOffer.useQuery({ limit: 8 });
  const { data: categories } = trpc.category.list.useQuery();

  return (
    <div className="space-y-0 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-indigo-700 text-white py-20 px-4">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 anim-fade-up">
            <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            <span>La tienda online de confianza</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight anim-fade-up anim-delay-1">
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

          <div className="flex flex-wrap justify-center gap-6 mt-10 anim-fade-up anim-delay-4">
            {[
              { icon: Shield, text: "Pago seguro" },
              { icon: Truck, text: "Entrega rápida" },
              { icon: Star, text: "Calidad garantizada" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/70 text-sm">
                <Icon className="w-4 h-4" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto px-4 pt-10">
          <div className="flex items-center gap-2 mb-5 anim-fade-up">
            <Store className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Categorías</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="anim-fade-up flex flex-col items-center p-4 rounded-xl border-2 border-transparent bg-muted/30 hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-8 h-8 object-cover rounded-full" />
                  ) : (
                    <Package className="w-6 h-6 text-primary" />
                  )}
                </div>
                <span className="text-sm font-medium text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ofertas */}
      <section className="container mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-2 anim-fade-up">
            <Zap className="w-6 h-6 text-yellow-500" />
            Ofertas especiales
          </h2>
          <Link to="/search">
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {loadingOffers ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {offers.map((item, i) => (
              <div key={item.product.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <ProductCard
                  id={item.product.id}
                  name={item.product.name}
                  price={item.product.price}
                  image={item.product.image}
                  brand={item.product.brand}
                  stock={item.product.stock}
                  discountPercent={item.offer.discountPercent}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-2xl">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No hay ofertas activas en este momento</p>
          </div>
        )}
      </section>

      {/* Más comprados */}
      <section className="container mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-2 anim-fade-up">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Los más comprados
          </h2>
          <Link to="/search">
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {loadingMost ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : mostBought && mostBought.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mostBought.map((product, i) => (
              <div key={product.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  brand={product.brand}
                  stock={product.stock}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-2xl">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aún no hay productos destacados</p>
          </div>
        )}
      </section>

      {/* Todos los productos */}
      <section className="container mx-auto px-4 pt-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-2xl font-bold anim-fade-up">Explora nuestros productos</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <ProductGrid />
      </section>
    </div>
  );
}

function ProductGrid() {
  const { data: products, isLoading } = trpc.product.list.useQuery({ limit: 12, offset: 0 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground bg-muted/30 rounded-2xl">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, i) => (
        <div key={product.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
          <ProductCard
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            brand={product.brand}
            stock={product.stock}
          />
        </div>
      ))}
    </div>
  );
}
