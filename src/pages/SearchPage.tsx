import { useSearchParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowLeft, Package } from "lucide-react";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);

  const { data: searchResults, isLoading: loadingSearch } = trpc.product.search.useQuery(
    { query },
    { enabled: query.length > 0 },
  );

  const { data: allProducts, isLoading: loadingAll } = trpc.product.list.useQuery(
    { limit: 100, offset: 0 },
    { enabled: query.length === 0 },
  );

  const isLoading = query.length > 0 ? loadingSearch : loadingAll;
  const results = query.length > 0 ? searchResults : allProducts;

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Explorar productos</h1>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o marca..."
            className="pl-9 pr-20"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
            Buscar
          </Button>
        </div>
      </form>

      {query && (
        <div className="mb-4 flex items-center gap-2">
          <p className="text-muted-foreground">
            Resultados para: <span className="font-medium text-foreground">"{query}"</span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => { setSearchInput(""); setSearchParams({}); }}
          >
            Limpiar
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : results && results.length > 0 ? (
        <>
          {!query && (
            <p className="text-sm text-muted-foreground mb-4">{results.length} productos disponibles</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product) => (
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
        </>
      ) : query ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No se encontraron productos para "{query}"</p>
          <p className="text-sm mt-2">Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay productos disponibles</p>
        </div>
      )}
    </div>
  );
}
