import { http } from './http';
import { env } from '@/lib/env';
import type { MenuItem } from '@/types';

export const menuService = {
  getMyMenus: async (): Promise<MenuItem[]> => {
    // TODO(api): Integrar com endpoint GET /me/menus
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockMenuItems;
    }

    const { data } = await http.get<MenuItem[]>('/me/menus');
    return data;
  },
};

// Mock menu items - estrutura para portal médico
const mockMenuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    to: '/app/home',
    icon: 'LayoutDashboard',
  },
  {
    id: 'import',
    label: 'Importar Dados',
    to: '/app/import',
    icon: 'Upload',
  },
  {
    id: 'procedimentos',
    label: 'Procedimentos',
    icon: 'Stethoscope',
    children: [
      {
        id: 'procedimentos-lista',
        label: 'Listar',
        to: '/app/procedimentos',
        icon: 'List',
      },
      {
        id: 'procedimentos-novo',
        label: 'Novo Registro',
        to: '/app/procedimentos/novo',
        icon: 'PlusCircle',
      },
    ],
  },
  {
    id: 'pacientes',
    label: 'Pacientes',
    icon: 'Users',
    children: [
      {
        id: 'pacientes-lista',
        label: 'Listar',
        to: '/app/pacientes',
        icon: 'List',
      },
      {
        id: 'pacientes-novo',
        label: 'Novo Paciente',
        to: '/app/pacientes/novo',
        icon: 'UserPlus',
      },
    ],
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: 'Settings',
    roles: ['ADMIN'],
    children: [
      {
        id: 'medicos',
        label: 'Médicos',
        to: '/app/medicos',
        icon: 'UserCog',
      },
      {
        id: 'tipos-procedimento',
        label: 'Tipos de Procedimento',
        to: '/app/tipos-procedimento',
        icon: 'FolderCog',
      },
    ],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    to: '/app/relatorios',
    icon: 'FileText',
  },
];
