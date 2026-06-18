import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Home, Zap, Package } from "lucide-react";

export default function OffersPage() {
  const { data: offers, isLoading } = trpc.product.onOffer.useQuery({ limit: 100 });

  return (
    <div className="min-h-screen pb-12">
      <section className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-10 px-4 border-b">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Inicio
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Ofertas especiales</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-yellow-100 hover:text-yellow-600 shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Ofertas especiales</h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Cargando..." : `${offers?.length ?? 0} producto${(offers?.length ?? 0) !== 1 ? "s" : ""} en oferta`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 pt-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {offers.map((item, i) => (
              <div key={item.product.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
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
          <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-2xl">
            <Package className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No hay ofertas activas en este momento</p>
            <p className="text-sm mt-1">Vuelve pronto para ver nuevas promociones</p>
            <Link to="/" className="mt-6 inline-block">
              <Button variant="outline" className="gap-2 mt-4">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
