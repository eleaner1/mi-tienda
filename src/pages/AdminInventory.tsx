import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Warehouse, Package, AlertTriangle, Save, X, Edit2, Download, Search } from "lucide-react";

export default function AdminInventory() {
  const utils = trpc.useUtils();
  const { data: inventory, isLoading } = trpc.inventory.getInventory.useQuery();
  const { data: summary } = trpc.inventory.summary.useQuery();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStock, setEditStock] = useState("");
  const [search, setSearch] = useState("");

  const filtered = inventory?.filter((item) => {
    const q = search.toLowerCase();
    return item.name.toLowerCase().includes(q) || (item.brand ?? "").toLowerCase().includes(q);
  });

  const updateStockMutation = trpc.product.updateStock.useMutation({
    onSuccess: () => {
      utils.inventory.getInventory.invalidate();
      utils.inventory.summary.invalidate();
      utils.product.list.invalidate();
      setEditingId(null);
      toast.success("Stock actualizado");
    },
  });

  const handleUpdateStock = (id: number) => {
    const stock = parseInt(editStock);
    if (isNaN(stock) || stock < 0) {
      toast.error("Stock inválido");
      return;
    }
    updateStockMutation.mutate({ id, stock });
  };

  const exportInventory = () => {
    if (!inventory) return;
    const csv = [
      ["ID", "Nombre", "Marca", "Stock", "Precio", "Vendidos", "Estado"].join(","),
      ...inventory.map(item => [
        item.id,
        `"${item.name}"`,
        `"${item.brand || ""}"`,
        item.stock,
        item.price,
        item.mostBought,
        item.active ? "Activo" : "Inactivo",
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Warehouse className="w-6 h-6" />
          Inventario
        </h1>
        <Button variant="outline" className="ml-auto gap-2" onClick={exportInventory}>
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total productos</p>
              <p className="text-2xl font-bold">{summary?.totalProducts || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Warehouse className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Stock total</p>
              <p className="text-2xl font-bold">{summary?.totalStock || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Stock bajo</p>
              <p className="text-2xl font-bold">{summary?.lowStock || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <X className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Agotados</p>
              <p className="text-2xl font-bold">{summary?.outOfStock || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de inventario */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>Lista de inventario</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar por nombre o marca..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando...</div>
          ) : filtered && filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Vendidos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.brand || "-"}</TableCell>
                    <TableCell className="text-right">
                      {editingId === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            min={0}
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-20 text-right"
                          />
                          <Button size="icon" className="w-8 h-8" onClick={() => handleUpdateStock(item.id)}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => setEditingId(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className={item.stock === 0 ? "text-red-600 font-bold" : item.stock < 10 ? "text-yellow-600 font-medium" : ""}>
                          {item.stock}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">${parseFloat(item.price).toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.mostBought}</TableCell>
                    <TableCell>
                      <Badge variant={item.active ? "default" : "secondary"}>
                        {item.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditStock(String(item.stock));
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {search ? "No se encontraron productos." : "No hay productos en el inventario."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
