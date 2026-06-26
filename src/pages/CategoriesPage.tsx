import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, LayoutGrid, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "@/lib/categoryIcons";

export default function CategoriesPage() {
  const { data: categories, isLoading } = trpc.category.list.useQuery();

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-indigo-50 py-10 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Inicio
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Categorías</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-primary" />
            Todas las categorías
          </h1>
          <p className="text-muted-foreground">
            Explora nuestra selección de productos por categoría
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-8 max-w-5xl">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <LayoutGrid className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No hay categorías disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const CatIcon = getCategoryIcon(cat.icon);
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  className="anim-fade-up group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-[3/4]"
                >
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
                  <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3 p-4">
                    <CatIcon className="w-9 h-9 text-yellow-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-white font-bold text-sm text-center leading-tight">{cat.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Back button */}
        <div className="mt-10 text-center">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" /> Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
