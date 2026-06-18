import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, LogIn, UserPlus, Tag, Star, Shield, Zap } from "lucide-react";
import { trpc } from "@/providers/trpc";

const FEATURES = [
  { icon: Tag, text: "Miles de productos disponibles" },
  { icon: Zap, text: "Ofertas exclusivas para miembros" },
  { icon: Shield, text: "Compras 100% seguras con PayPal" },
  { icon: Star, text: "Historial completo de pedidos" },
];

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const utils = trpc.useUtils();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (user) => {
      setError("");
      await utils.auth.me.invalidate();
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    },
    onError: (err) => {
      setError(err.message || "No se pudo iniciar sesión");
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      setError("");
      await utils.auth.me.invalidate();
      navigate(redirectTo, { replace: true });
    },
    onError: (err) => {
      setError(err.message || "No se pudo registrar");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ name, email, password });
    }
  }

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary/5 via-background to-indigo-50">
      {/* Panel izquierdo - solo en desktop */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary via-primary/90 to-indigo-700 p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">MiTienda</span>
          </div>
          <p className="text-white/60 text-sm">Tu tienda de confianza</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Todo lo que necesitas,<br />
            <span className="text-yellow-300">en un solo lugar</span>
          </h2>
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-white/80 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/40 text-xs">
          © 2026 MiTienda. Todos los derechos reservados.
        </p>
      </div>

      {/* Panel derecho - formulario */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 sm:p-12">
        {/* Logo mobile */}
        <div className="flex flex-col items-center mb-8 lg:hidden">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-3 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">MiTienda</h1>
          <p className="text-muted-foreground text-sm">Tu tienda de confianza</p>
        </div>

        <div className="w-full max-w-md mx-auto anim-fade-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {mode === "login" ? "Iniciar sesión" : "Crear una cuenta"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "login"
                ? "Ingresa tus credenciales para continuar"
                : "Completa el formulario para registrarte"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === "login" ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LogIn className="w-4 h-4" /> Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setEmail(""); setPassword(""); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === "register" ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <UserPlus className="w-4 h-4" /> Registro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 gap-2 font-semibold text-base" disabled={isPending}>
              {mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isPending
                ? "Procesando..."
                : mode === "login"
                  ? "Entrar a mi cuenta"
                  : "Crear cuenta gratis"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-primary font-medium hover:underline"
            >
              {mode === "login" ? "Regístrate gratis" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
