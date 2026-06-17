import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, LogIn, UserPlus } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (user) => {
      setError("");
      await utils.auth.me.invalidate();

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
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
      navigate("/", { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Store className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">MiTienda</h1>
          <p className="text-muted-foreground">
            {mode === "login" ? "Inicia sesión con tu cuenta" : "Crea tu cuenta"}
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              {mode === "login" ? "Iniciar sesión" : "Registrarse"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Escribe tu correo y contraseña"
                : "Crea una cuenta para comprar"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                type="button"
                variant={mode === "login" ? "default" : "outline"}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Iniciar sesión
              </Button>

              <Button
                type="button"
                variant={mode === "register" ? "default" : "outline"}
                onClick={() => {
                  setMode("register");
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
              >
                Registro
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Escribe tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full gap-2 h-12" disabled={isPending}>
                {mode === "login" ? (
                  <LogIn className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}

                {isPending
                  ? "Procesando..."
                  : mode === "login"
                    ? "Entrar"
                    : "Crear cuenta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}