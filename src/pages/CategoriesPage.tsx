import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, LayoutGrid, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-green-500 to-emerald-600",
  "from-orange-500 to-red-500",
  "from-yellow-500 to-amber-600",
  "from-teal-500 to-cyan-600",
  "from-rose-500 to-pink-500",
  "from-violet-500 to-purple-600",
];

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const gradient = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  className="anim-fade-up group relative rounded-2xl overflow-hidden border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Gradient background */}
                  <div className={`bg-gradient-to-br ${gradient} p-6 flex flex-col items-center justify-center min-h-[140px] text-white`}>
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-full" />
                      ) : (
                        <Package className="w-7 h-7" />
                      )}
                    </div>
                    <h3 className="font-bold text-center text-sm leading-tight">{cat.name}</h3>
                  </div>
                  {/* Hover arrow */}
                  <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3 h-3 text-white" />
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
