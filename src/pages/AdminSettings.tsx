import { useEffect, useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Settings, MessageSquare, Phone, CheckCircle2, Save } from "lucide-react";

export default function AdminSettings() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.settings.get.useQuery();

  const [message, setMessage] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setMessage(settings.additionalInfo ?? "");
      setWhatsappPhone(settings.bankPhone ?? "");
    }
  }, [settings]);

  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.get.invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Configuración guardada");
    },
    onError: (err) => {
      toast.error(err.message || "Error al guardar");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      additionalInfo: message || undefined,
      bankPhone: whatsappPhone || undefined,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Configuración
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contacto post-pago</CardTitle>
          <p className="text-sm text-muted-foreground">
            Esta información se muestra al cliente después de pagar y aparece en el comprobante.
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Cargando...</div>
          ) : (
            <>
              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4" />
                  Número de WhatsApp
                </Label>
                <Input
                  placeholder="+505 8888-0000"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Incluye el código de país. Ej: +50588880000 o 50588880000
                </p>
              </div>

              <Separator />

              <div>
                <Label className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  Mensaje de instrucciones
                </Label>
                <Textarea
                  placeholder={"Ej: Envía tu comprobante al WhatsApp para confirmar tu pedido y coordinar la entrega."}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{message.length}/1000</p>
              </div>

              {(whatsappPhone || message) && (
                <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Vista previa</p>
                  {whatsappPhone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-green-600" />
                      WhatsApp: <strong>{whatsappPhone}</strong>
                    </p>
                  )}
                  {message && (
                    <p className="text-muted-foreground whitespace-pre-line">{message}</p>
                  )}
                </div>
              )}

              <Button
                className="w-full gap-2"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Guardado
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {updateMutation.isPending ? "Guardando..." : "Guardar configuración"}
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
