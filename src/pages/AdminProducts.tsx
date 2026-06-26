import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import type { Product } from "@db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Edit2, Package, Save, X, ImageIcon, Search } from "lucide-react";

export default function AdminProducts() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.product.list.useQuery({ limit: 100 });
  const { data: categories } = trpc.category.listAll.useQuery();
  const [search, setSearch] = useState("");

  const filtered = products?.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q);
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      utils.product.mostBought.invalidate();
      utils.product.onOffer.invalidate();
      resetForm();
      setDialogOpen(false);
      toast.success("Producto creado");
    },
  });

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      utils.product.mostBought.invalidate();
      utils.product.onOffer.invalidate();
      setEditingId(null);
      toast.success("Producto actualizado");
    },
  });

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      utils.product.mostBought.invalidate();
      utils.product.onOffer.invalidate();
      toast.success("Producto eliminado");
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setBrand("");
    setPrice("");
    setStock("0");
    setImage("");
    setCategoryId("");
  };

  const handleCreate = () => {
    if (!name.trim() || !price) {
      toast.error("Nombre y precio son requeridos");
      return;
    }
    createMutation.mutate({
      name: name.trim(),
      description: description || undefined,
      brand: brand || undefined,
      price: price,
      stock: parseInt(stock) || 0,
      image: image || undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    });
  };

  const handleUpdate = (id: number) => {
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    updateMutation.mutate({
      id,
      name: name.trim(),
      description: description || undefined,
      brand: brand || undefined,
      price: price || undefined,
      stock: stock ? parseInt(stock) : undefined,
      image: image || undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
    });
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setBrand(product.brand || "");
    setPrice(product.price);
    setStock(String(product.stock));
    setImage(product.image || "");
    setCategoryId(product.categoryId ? String(product.categoryId) : "");
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
          <Package className="w-6 h-6" />
          Productos
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto gap-2">
              <Plus className="w-4 h-4" />
              Nuevo producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo producto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del producto" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Marca</label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Marca" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción del producto" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Precio *</label>
                  <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Stock</label>
                  <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Categoría</label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">URL de imagen</label>
                <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creando..." : "Crear producto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar por nombre o marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando...</div>
          ) : filtered && filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((product) => (
                    <TableRow key={product.id}>
                      {editingId === product.id ? (
                        <>
                          <TableCell colSpan={9}>
                            <div className="space-y-3 py-2">
                              <div className="grid grid-cols-2 gap-3">
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
                                <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Marca" />
                              </div>
                              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />
                              <div className="grid grid-cols-3 gap-3">
                                <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" />
                                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" />
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories?.map((cat) => (
                                      <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL de imagen" />
                              <div className="flex gap-2 justify-end">
                                <Button size="sm" onClick={() => handleUpdate(product.id)} disabled={updateMutation.isPending}>
                                  <Save className="w-4 h-4 mr-1" />
                                  Guardar
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                  <X className="w-4 h-4 mr-1" />
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                            ) : (
                              <ImageIcon className="w-10 h-10 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.brand || "-"}</TableCell>
                          <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell>
                            {categories?.find(c => c.id === product.categoryId)?.name || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.active ? "default" : "secondary"}>
                              {product.active ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="ghost" onClick={() => startEdit(product)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => {
                                  if (confirm("¿Eliminar este producto?")) {
                                    deleteMutation.mutate({ id: product.id });
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              {search ? "No se encontraron productos." : "No hay productos. Crea el primero."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
