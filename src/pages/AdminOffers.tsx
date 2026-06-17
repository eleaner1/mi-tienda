import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import type { Offer } from "@db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Tag, Save, X } from "lucide-react";

export default function AdminOffers() {
  const utils = trpc.useUtils();
  const { data: offers, isLoading } = trpc.offer.listAll.useQuery();
  const { data: products } = trpc.product.list.useQuery({ limit: 100 });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [productId, setProductId] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [endDate, setEndDate] = useState("");

  const createMutation = trpc.offer.create.useMutation({
    onSuccess: () => {
      utils.offer.listAll.invalidate();
      utils.product.onOffer.invalidate();
      resetForm();
      setDialogOpen(false);
      toast.success("Oferta creada");
    },
  });

  const updateMutation = trpc.offer.update.useMutation({
    onSuccess: () => {
      utils.offer.listAll.invalidate();
      utils.product.onOffer.invalidate();
      setEditingId(null);
      toast.success("Oferta actualizada");
    },
  });

  const deleteMutation = trpc.offer.delete.useMutation({
    onSuccess: () => {
      utils.offer.listAll.invalidate();
      utils.product.onOffer.invalidate();
      toast.success("Oferta eliminada");
    },
  });

  const resetForm = () => {
    setProductId("");
    setDiscountPercent("");
    setEndDate("");
  };

  const handleCreate = () => {
    if (!productId || !discountPercent) {
      toast.error("Producto y descuento son requeridos");
      return;
    }
    const percent = parseInt(discountPercent);
    if (percent < 1 || percent > 99) {
      toast.error("El descuento debe ser entre 1% y 99%");
      return;
    }
    createMutation.mutate({
      productId: parseInt(productId),
      discountPercent: percent,
      endDate: endDate || undefined,
    });
  };

  const handleUpdate = (id: number) => {
    const percent = parseInt(discountPercent);
    if (discountPercent && (percent < 1 || percent > 99)) {
      toast.error("El descuento debe ser entre 1% y 99%");
      return;
    }
    updateMutation.mutate({
      id,
      ...(discountPercent && { discountPercent: percent }),
      ...(endDate && { endDate }),
    });
  };

  const startEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setDiscountPercent(String(offer.discountPercent));
    setEndDate(offer.endDate ? new Date(offer.endDate).toISOString().split("T")[0] : "");
  };

  const getProductName = (id: number) => {
    return products?.find(p => p.id === id)?.name || `Producto #${id}`;
  };

  const isActive = (offer: Offer) => {
    if (!offer.active) return false;
    const now = new Date();
    const start = new Date(offer.startDate);
    if (start > now) return false;
    if (offer.endDate && new Date(offer.endDate) < now) return false;
    return true;
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
          <Tag className="w-6 h-6" />
          Ofertas y Descuentos
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto gap-2">
              <Plus className="w-4 h-4" />
              Nueva oferta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva oferta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Producto *</label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descuento (%) *</label>
                <Input type="number" min={1} max={99} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="Ej: 20" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Fecha de fin (opcional)</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creando..." : "Crear oferta"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando...</div>
          ) : offers && offers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    {editingId === offer.id ? (
                      <>
                        <TableCell colSpan={7}>
                          <div className="space-y-3 py-2">
                            <div className="grid grid-cols-2 gap-3">
                              <Input type="number" min={1} max={99} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="Descuento %" />
                              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" onClick={() => handleUpdate(offer.id)} disabled={updateMutation.isPending}>
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
                        <TableCell>{offer.id}</TableCell>
                        <TableCell>{getProductName(offer.productId)}</TableCell>
                        <TableCell className="font-bold text-red-600">-{offer.discountPercent}%</TableCell>
                        <TableCell>{new Date(offer.startDate).toLocaleDateString("es-ES")}</TableCell>
                        <TableCell>{offer.endDate ? new Date(offer.endDate).toLocaleDateString("es-ES") : "Sin fecha"}</TableCell>
                        <TableCell>
                          <Badge variant={isActive(offer) ? "default" : "secondary"}>
                            {isActive(offer) ? "Activa" : "Inactiva"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => startEdit(offer)}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => {
                                if (confirm("¿Eliminar esta oferta?")) {
                                  deleteMutation.mutate({ id: offer.id });
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
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No hay ofertas. Crea la primera.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
