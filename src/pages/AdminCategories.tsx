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
import { CATEGORY_ICONS, ICON_LABELS, getCategoryIcon } from "@/lib/categoryIcons";

// ─── Selector de icono ────────────────────────────────────────────────────────

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Icono</label>
      <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto border rounded-lg p-2">
        {Object.entries(CATEGORY_ICONS).map(([key, Icon]) => (
          <button
            key={key}
            type="button"
            title={ICON_LABELS[key]}
            onClick={() => onChange(key)}
            className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors text-center
              ${value === key
                ? "bg-primary text-white"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-[9px] leading-none truncate w-full text-center">{ICON_LABELS[key]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function AdminCategories() {
  const utils = trpc.useUtils();
  const { data: categories, isLoading } = trpc.category.listAll.useQuery();

  // Crear
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName]   = useState("");
  const [newDesc, setNewDesc]   = useState("");
  const [newIcon, setNewIcon]   = useState("package");

  // Editar
  const [editOpen, setEditOpen]   = useState(false);
  const [editId, setEditId]       = useState<number | null>(null);
  const [editName, setEditName]   = useState("");
  const [editDesc, setEditDesc]   = useState("");
  const [editIcon, setEditIcon]   = useState("package");

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.listAll.invalidate();
      utils.category.list.invalidate();
      setNewName(""); setNewDesc(""); setNewIcon("package");
      setCreateOpen(false);
      toast.success("Categoría creada");
    },
  });

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: () => {
      utils.category.listAll.invalidate();
      utils.category.list.invalidate();
      setEditOpen(false);
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
    if (!newName.trim()) { toast.error("El nombre es requerido"); return; }
    createMutation.mutate({ name: newName.trim(), description: newDesc || undefined, icon: newIcon });
  };

  const handleUpdate = () => {
    if (!editId || !editName.trim()) { toast.error("El nombre es requerido"); return; }
    updateMutation.mutate({ id: editId, name: editName.trim(), description: editDesc || undefined, icon: editIcon });
  };

  const openEdit = (cat: { id: number; name: string; description: string | null; icon: string | null }) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description ?? "");
    setEditIcon(cat.icon ?? "package");
    setEditOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutGrid className="w-6 h-6" /> Categorías
        </h1>

        {/* Crear */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto gap-2"><Plus className="w-4 h-4" /> Nueva categoría</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Nueva categoría</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre *</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Electrónica" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción</label>
                <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Descripción opcional" />
              </div>
              <IconPicker value={newIcon} onChange={setNewIcon} />
              <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creando..." : "Crear categoría"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Editar */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Editar categoría</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre *</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción</label>
                <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
              </div>
              <IconPicker value={editIcon} onChange={setEditIcon} />
              <Button className="w-full" onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
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
                  <TableHead className="w-10">ID</TableHead>
                  <TableHead className="w-12">Icono</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => {
                  const Icon = getCategoryIcon(cat.icon);
                  return (
                    <TableRow key={cat.id}>
                      <TableCell className="text-muted-foreground">{cat.id}</TableCell>
                      <TableCell>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="text-muted-foreground">{cat.description || "—"}</TableCell>
                      <TableCell>
                        <span className={cat.active ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                          {cat.active ? "Activa" : "Inactiva"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm("¿Eliminar esta categoría?")) {
                                deleteMutation.mutate({ id: cat.id });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
