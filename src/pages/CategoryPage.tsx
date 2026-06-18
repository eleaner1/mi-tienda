import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Home, LayoutGrid, Package, ChevronRight } from "lucide-react";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);

  const { data: category, isLoading: loadingCat } = trpc.category.getById.useQuery(
    { id: categoryId },
    { enabled: !isNaN(categoryId) },
  );

  const { data: products, isLoading: loadingProducts } = trpc.product.byCategory.useQuery(
    { categoryId },
    { enabled: !isNaN(categoryId) },
  );

  return (
    <div className="min-h-screen pb-12">
      {/* Hero banner */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-indigo-50 py-10 px-4 border-b">
        <div className="container mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm mb-5 flex-wrap">
            <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-medium">
              <Home className="w-3.5 h-3.5" /> Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <Link to="/categories" className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-medium">
              <LayoutGrid className="w-3.5 h-3.5" /> Categorías
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <span className="text-foreground font-semibold truncate max-w-[180px]">
              {loadingCat ? "..." : (category?.name ?? "Categoría")}
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/categories">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="flex items-center gap-4">
              {category?.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shadow-sm">
                  <Package className="w-7 h-7 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">
                  {loadingCat ? <Skeleton className="h-8 w-40" /> : (category?.name ?? "Categoría")}
                </h1>
                {category?.description && (
                  <p className="text-muted-foreground text-sm mt-0.5">{category.description}</p>
                )}
                {!loadingProducts && products && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {products.length} producto{products.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <div className="container mx-auto px-4 pt-8 max-w-5xl">
        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
              <Package className="w-10 h-10 opacity-30" />
            </div>
            <p className="text-lg font-semibold mb-2">No hay productos en esta categoría</p>
            <p className="text-sm mb-6">Pronto agregaremos más productos aquí</p>
            <Link to="/categories">
              <Button variant="outline" className="gap-2">
                <LayoutGrid className="w-4 h-4" /> Ver otras categorías
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <div key={product.id} className="anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
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
          </>
        )}
      </div>
    </div>
  );
}
