import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from '@/lib/guards';
import LoginPage from '@/features/auth/pages/LoginPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/features/home/pages/HomePage';
import ImportPage from '@/features/import/pages/ImportPage';

// Placeholder pages - TODO: implement
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold">{title}</h1>
    <div className="bg-muted p-8 rounded-2xl text-center">
      <p className="text-muted-foreground">Esta página está em desenvolvimento.</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/app',
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'home',
            element: <HomePage />,
          },
          // Import
          {
            path: 'import',
            element: <ImportPage />,
          },
          // Procedimentos
          {
            path: 'procedimentos',
            element: <PlaceholderPage title="Procedimentos" />,
          },
          {
            path: 'procedimentos/novo',
            element: <PlaceholderPage title="Novo Procedimento" />,
          },
          // Pacientes
          {
            path: 'pacientes',
            element: <PlaceholderPage title="Pacientes" />,
          },
          {
            path: 'pacientes/novo',
            element: <PlaceholderPage title="Novo Paciente" />,
          },
          {
            path: 'pacientes/:id',
            element: <PlaceholderPage title="Detalhes do Paciente" />,
          },
          // Cadastros
          {
            path: 'medicos',
            element: <PlaceholderPage title="Médicos" />,
          },
          {
            path: 'tipos-procedimento',
            element: <PlaceholderPage title="Tipos de Procedimento" />,
          },
          // Relatórios
          {
            path: 'relatorios',
            element: <PlaceholderPage title="Relatórios" />,
          },
          // Perfil
          {
            path: 'perfil',
            element: <PlaceholderPage title="Meu Perfil" />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <LoginPage />,
  },
]);
