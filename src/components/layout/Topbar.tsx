import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, User, LogOut, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { Button } from '@/components/ui/button';

export default function Topbar() {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme, setSidebarOpen } = useUIStore();
  const { user, clear } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clear();
    toast.info('Você saiu do sistema');
    navigate('/login', { replace: true });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 hover:bg-accent rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search - placeholder */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg w-64">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title="Alternar tema"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">{user?.name || 'Usuário'}</div>
              <div className="text-xs text-muted-foreground">
                {user?.email || 'email@exemplo.com'}
              </div>
            </div>
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-popover border rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/app/perfil');
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Meu Perfil</span>
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
