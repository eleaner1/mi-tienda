import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Edit2, LayoutGrid, Save, X } from "lucide-react";

export default function AdminCategories() {
  const utils = trpc.useUtils();
  const { data: categories, isLoading } = trpc.category.listAll.useQuery();

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.listAll.invalidate();
      utils.category.list.invalidate();
      setNewName("");
      setNewDesc("");
      setDialogOpen(false);
      toast.success("Categoría creada");
    },
  });

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: () => {
      utils.category.listAll.invalidate();
      utils.category.list.invalidate();
      setEditingId(null);
      toast.success("Categoría actualizada");
    },
  });

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      utils.category.listAll.invalidate();
      utils.category.list.invalidate();
      toast.success("Categoría eliminada");
    },
  });

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    createMutation.mutate({ name: newName.trim(), description: newDesc || undefined });
  };

  const handleUpdate = (id: number) => {
    if (!editName.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    updateMutation.mutate({ id, name: editName.trim(), description: editDesc || undefined });
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
          <LayoutGrid className="w-6 h-6" />
          Categorías
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto gap-2">
              <Plus className="w-4 h-4" />
              Nueva categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva categoría</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre *</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Electrónica" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción</label>
                <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Descripción opcional" />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creando..." : "Crear categoría"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando...</div>
          ) : categories && categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.id}</TableCell>
                    <TableCell>
                      {editingId === cat.id ? (
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full" />
                      ) : (
                        cat.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === cat.id ? (
                        <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full" />
                      ) : (
                        cat.description || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={cat.active ? "text-green-600" : "text-red-600"}>
                        {cat.active ? "Activa" : "Inactiva"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === cat.id ? (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => handleUpdate(cat.id)}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditName(cat.name);
                              setEditDesc(cat.description || "");
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("¿Eliminar esta categoría?")) {
                                deleteMutation.mutate({ id: cat.id });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No hay categorías. Crea la primera.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
