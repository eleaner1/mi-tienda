import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ArrowRight, Zap, TrendingUp, Package, Store } from "lucide-react";

export default function Home() {
  const { data: mostBought, isLoading: loadingMost } = trpc.product.mostBought.useQuery({ limit: 8 });
  const { data: offers, isLoading: loadingOffers } = trpc.product.onOffer.useQuery({ limit: 8 });
  const { data: categories } = trpc.category.list.useQuery();

  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Bienvenido a <span className="text-primary">MiTienda</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre los mejores productos al mejor precio. Envíos rápidos, ofertas exclusivas y calidad garantizada.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Link to="/search">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="w-5 h-5" />
                Explorar productos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Store className="w-6 h-6" />
              Categorías
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex flex-col items-center p-4 rounded-xl border hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-8 h-8 object-cover rounded-full" />
                  ) : (
                    <Package className="w-6 h-6 text-primary" />
                  )}
                </div>
                <span className="text-sm font-medium text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ofertas */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Ofertas especiales
          </h2>
          <Link to="/search">
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {loadingOffers ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {offers.map((item) => (
              <ProductCard
                key={item.product.id}
                id={item.product.id}
                name={item.product.name}
                price={item.product.price}
                image={item.product.image}
                brand={item.product.brand}
                stock={item.product.stock}
                discountPercent={item.offer.discountPercent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay ofertas activas en este momento</p>
          </div>
        )}
      </section>

      {/* Más comprados */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Los más comprados
          </h2>
          <Link to="/search">
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {loadingMost ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : mostBought && mostBought.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mostBought.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                brand={product.brand}
                stock={product.stock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aún no hay productos destacados</p>
          </div>
        )}
      </section>

      {/* Productos populares - grid grande */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Explora nuestros productos</h2>
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
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          brand={product.brand}
          stock={product.stock}
        />
      ))}
    </div>
  );
}
