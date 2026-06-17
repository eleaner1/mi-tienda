import { useMemo, useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Download,
  DollarSign, ShoppingBag, TrendingUp, Calendar,
  BarChart3,
} from "lucide-react";

// ---- Helpers de fecha ----
const sod = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
const eod = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const som = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const eom = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
const sow = (d: Date) => { const c = new Date(d); const day = c.getDay(); c.setDate(c.getDate() - (day === 0 ? 6 : day - 1)); return sod(c); };
const eow = (d: Date) => { const s = sow(d); const e = new Date(s); e.setDate(s.getDate() + 6); return eod(e); };

function addDays(d: Date, n: number) { const c = new Date(d); c.setDate(c.getDate() + n); return c; }
function addWeeks(d: Date, n: number) { return addDays(d, n * 7); }
function addMonths(d: Date, n: number) { const c = new Date(d); c.setMonth(c.getMonth() + n); return c; }

function fmtDate(d: Date) {
  return d.toLocaleDateString("es-NI", { day: "numeric", month: "short", year: "numeric" });
}
function fmtMes(d: Date) {
  return d.toLocaleDateString("es-NI", { month: "long", year: "numeric" });
}
function fmtHora(d: Date) {
  return d.toLocaleTimeString("es-NI", { hour: "2-digit", minute: "2-digit" });
}

type OrderRow = {
  id: number; userId: number; status: string; total: string;
  createdAt: Date; updatedAt: Date;
  userName: string | null; userEmail: string | null;
};
type Tab = "day" | "week" | "month";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente", processing: "Procesando",
  completed: "Completada", cancelled: "Cancelada",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function downloadReport(label: string, orders: OrderRow[], total: number) {
  const rows = orders.map((o) => `
    <tr>
      <td>#${o.id}</td>
      <td>${o.userName ?? "-"}</td>
      <td>${o.userEmail ?? "-"}</td>
      <td>${new Date(o.createdAt).toLocaleString("es-NI")}</td>
      <td>${STATUS_LABEL[o.status] ?? o.status}</td>
      <td style="text-align:right;font-weight:bold">$${parseFloat(o.total).toFixed(2)}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
  <title>Reporte ${label}</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;padding:20px;color:#1a1a1a}
    h1{margin-bottom:4px} h2{color:#4f46e5;margin-top:0}
    .stat{display:inline-block;background:#f5f3ff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 24px;margin:8px 8px 16px 0}
    .stat p{margin:0;font-size:13px;color:#6b7280} .stat b{font-size:22px;color:#4f46e5}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    th{background:#f5f3ff;padding:8px;text-align:left;border:1px solid #e0e7ff;font-size:13px}
    td{padding:8px;border:1px solid #e5e7eb;font-size:13px}
    tr:nth-child(even){background:#fafafa}
    @media print{.no-print{display:none}}
  </style></head><body>
  <h1>Reporte de Ingresos</h1>
  <h2>${label}</h2>
  <div class="stat"><p>Total ingresos</p><b>$${total.toFixed(2)}</b></div>
  <div class="stat"><p>Órdenes</p><b>${orders.length}</b></div>
  <div class="stat"><p>Promedio por orden</p><b>$${orders.length ? (total / orders.length).toFixed(2) : "0.00"}</b></div>
  <table>
    <thead><tr><th>Orden</th><th>Cliente</th><th>Correo</th><th>Fecha</th><th>Estado</th><th>Total</th></tr></thead>
    <tbody>${rows || "<tr><td colspan='6' style='text-align:center;color:#9ca3af'>Sin órdenes en este período</td></tr>"}</tbody>
  </table>
  <br><button class="no-print" onclick="window.print()" style="padding:10px 24px;background:#4f46e5;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">Imprimir / Guardar PDF</button>
  </body></html>`;

  const win = window.open("", "_blank");
  if (!win) { toast.error("Permite ventanas emergentes"); return; }
  win.document.write(html);
  win.document.close();
}

export default function AdminReports() {
  const { data: allOrders = [], isLoading } = trpc.order.listAllWithUsers.useQuery();

  const [tab, setTab] = useState<Tab>("month");
  const [offset, setOffset] = useState(0);
  const [dayInput, setDayInput] = useState(() => new Date().toISOString().split("T")[0]);

  // Base date según tab
  const baseDate = useMemo(() => {
    if (tab === "day") return new Date(dayInput + "T12:00:00");
    return new Date();
  }, [tab, dayInput]);

  // Rango del período actual
  const [rangeStart, rangeEnd] = useMemo(() => {
    if (tab === "day") return [sod(baseDate), eod(baseDate)];
    if (tab === "week") return [sow(addWeeks(new Date(), offset)), eow(addWeeks(new Date(), offset))];
    return [som(addMonths(new Date(), offset)), eom(addMonths(new Date(), offset))];
  }, [tab, baseDate, offset]);

  // Filtrar órdenes del período
  const periodOrders = useMemo(() =>
    allOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= rangeStart && d <= rangeEnd;
    }), [allOrders, rangeStart, rangeEnd]);

  const periodTotal = useMemo(() =>
    periodOrders.reduce((s, o) => s + parseFloat(o.total), 0), [periodOrders]);

  // Historial mensual (agrupa todos los órdenes por mes)
  const monthlyHistory = useMemo(() => {
    const map = new Map<string, { total: number; count: number; date: Date }>();
    for (const o of allOrders) {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const entry = map.get(key) ?? { total: 0, count: 0, date: new Date(d.getFullYear(), d.getMonth(), 1) };
      entry.total += parseFloat(o.total);
      entry.count += 1;
      map.set(key, entry);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, v]) => ({ key, ...v }));
  }, [allOrders]);

  // Etiqueta del período
  const periodLabel = useMemo(() => {
    if (tab === "day") return fmtDate(baseDate);
    if (tab === "week") return `${fmtDate(rangeStart)} — ${fmtDate(rangeEnd)}`;
    return fmtMes(rangeStart);
  }, [tab, baseDate, rangeStart, rangeEnd]);

  const isCurrentPeriod = offset === 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Reporte de ingresos
          </h1>
          <p className="text-sm text-muted-foreground">Analiza las ventas por período</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg w-fit">
        {(["day", "week", "month"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setOffset(0); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "day" ? "Diario" : t === "week" ? "Semanal" : "Mensual"}
          </button>
        ))}
      </div>

      {/* Selector de período */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {tab === "day" ? (
              <div className="flex items-center gap-3 flex-1">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  type="date"
                  value={dayInput}
                  onChange={(e) => setDayInput(e.target.value)}
                  className="w-48"
                />
                <span className="text-sm font-medium">{periodLabel}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <Button variant="ghost" size="icon" onClick={() => setOffset(o => o - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-semibold min-w-48 text-center capitalize">{periodLabel}</span>
                <Button variant="ghost" size="icon" onClick={() => setOffset(o => o + 1)} disabled={isCurrentPeriod}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                {!isCurrentPeriod && (
                  <Button variant="outline" size="sm" onClick={() => setOffset(0)} className="text-xs">
                    Hoy
                  </Button>
                )}
              </div>
            )}
            <Button
              variant="outline"
              className="gap-2 shrink-0"
              onClick={() => downloadReport(periodLabel, periodOrders, periodTotal)}
            >
              <Download className="w-4 h-4" /> Descargar reporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats del período */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ingresos del período</p>
              <p className="text-2xl font-bold text-primary">${periodTotal.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Órdenes</p>
              <p className="text-2xl font-bold">{periodOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Promedio por orden</p>
              <p className="text-2xl font-bold">
                ${periodOrders.length ? (periodTotal / periodOrders.length).toFixed(2) : "0.00"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de órdenes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Órdenes del período</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando...</div>
          ) : periodOrders.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No hay órdenes en este período</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-sm">#{o.id}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{o.userName ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{o.userEmail ?? ""}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fmtHora(new Date(o.createdAt))}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[o.status] ?? "bg-gray-100 text-gray-700"}`}>
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold">${parseFloat(o.total).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial mensual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Historial mensual
            </CardTitle>
            <Button
              variant="outline" size="sm" className="gap-1.5 text-xs"
              onClick={() => {
                const allMonthsLabel = "Historial completo";
                // Download all months
                const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Historial</title>
                <style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;padding:20px}
                table{width:100%;border-collapse:collapse}th{background:#f5f3ff;padding:8px;border:1px solid #e0e7ff;text-align:left}
                td{padding:8px;border:1px solid #e5e7eb}
                @media print{.no-print{display:none}}</style></head>
                <body><h1>Historial mensual de ingresos</h1>
                <table><thead><tr><th>Mes</th><th>Órdenes</th><th>Total ingresos</th></tr></thead>
                <tbody>${monthlyHistory.map(m => `<tr><td style="text-transform:capitalize">${fmtMes(m.date)}</td><td>${m.count}</td><td style="font-weight:bold">$${m.total.toFixed(2)}</td></tr>`).join("")}</tbody>
                </table><br>
                <button class="no-print" onclick="window.print()" style="padding:10px 24px;background:#4f46e5;color:#fff;border:none;border-radius:6px;cursor:pointer">Imprimir / PDF</button>
                </body></html>`;
                const win = window.open("", "_blank");
                if (win) { win.document.write(html); win.document.close(); }
              }}
            >
              <Download className="w-3.5 h-3.5" /> Exportar historial
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {monthlyHistory.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Sin historial disponible</div>
          ) : (
            <div className="divide-y">
              {monthlyHistory.map((m) => {
                const isCurrentMonth = m.key === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
                return (
                  <div key={m.key} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isCurrentMonth ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <div>
                        <p className="font-medium text-sm capitalize">{fmtMes(m.date)}</p>
                        <p className="text-xs text-muted-foreground">{m.count} orden{m.count !== 1 ? "es" : ""}</p>
                      </div>
                      {isCurrentMonth && <Badge variant="secondary" className="text-xs">Mes actual</Badge>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${m.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        Prom: ${(m.total / m.count).toFixed(2)}/orden
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
