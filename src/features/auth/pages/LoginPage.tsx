import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Stethoscope } from 'lucide-react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { env } from '@/lib/env';

const schema = z.object({
  email: z.string().min(1, 'Informe seu e-mail'),
  password: z.string().min(1, 'Informe sua senha'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      setSession(response.accessToken, response.user);
      toast.success(`Bem-vindo, ${response.user.name}!`);
      navigate('/app/home', { replace: true });
    } catch (error) {
      toast.error('Credenciais inválidas. Tente novamente.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white p-10">
        <div className="max-w-md space-y-6">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-12 h-12" />
            <h1 className="text-4xl font-bold">{env.APP_NAME}</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Gestão completa de procedimentos médicos. Digitalize seus registros e
            tenha insights precisos sobre sua prática.
          </p>
          <div className="space-y-2 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span>Cadastro de pacientes e médicos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span>Registro detalhado de procedimentos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span>Dashboard com indicadores em tempo real</span>
            </div>
          </div>
          <div className="pt-4 border-t border-blue-700 text-xs text-blue-300">
            v{env.APP_VERSION}
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="md:hidden flex justify-center mb-4">
              <Stethoscope className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Bem-vindo</h2>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="text-center">
            
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary underline"
            >
              Esqueci minha senha
            </a>
          </div>

          {env.USE_MOCKS && (
            <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-100">
              <strong>Modo de desenvolvimento:</strong> Use qualquer e-mail/senha para
              acessar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}