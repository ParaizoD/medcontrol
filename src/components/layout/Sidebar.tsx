import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Settings,
  FileText,
  List,
  PlusCircle,
  UserPlus,
  UserCog,
  FolderCog,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { menuService } from '@/services/menu.service';
import type { MenuItem } from '@/types';

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Stethoscope,
  Users,
  Settings,
  FileText,
  List,
  PlusCircle,
  UserPlus,
  UserCog,
  FolderCog,
  Upload,
};

export default function Sidebar() {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, toggleSidebarCollapsed } =
    useUIStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const items = await menuService.getMyMenus();
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to load menu:', error);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const hasAccess = (item: MenuItem): boolean => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some((role) => user?.roles.includes(role));
  };

  const isActive = (path?: string): boolean => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!hasAccess(item)) return null;

    const Icon = item.icon ? iconMap[item.icon] : null;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const active = isActive(item.to);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpand(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              level > 0 && 'ml-4'
            )}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-5 h-5" />}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
            {!sidebarCollapsed &&
              (isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ))}
          </button>

          {!sidebarCollapsed && isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.to || '#'}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          active && 'bg-primary text-primary-foreground hover:bg-primary/90',
          level > 0 && 'ml-4'
        )}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {!sidebarCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r transition-all duration-300',
          'md:relative md:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {!sidebarCollapsed && (
              <h1 className="text-lg font-semibold">MedControl</h1>
            )}
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                } else {
                  toggleSidebarCollapsed();
                }
              }}
              className="p-2 hover:bg-accent rounded-lg"
            >
              {sidebarOpen && window.innerWidth < 768 ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>
      </aside>
    </>
  );
}
