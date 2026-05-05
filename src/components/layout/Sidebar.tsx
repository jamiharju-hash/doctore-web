import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Rss, 
  History, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Trophy,
  UserCircle,
  Lock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import { auth } from '../../lib/firebase';
import { Button } from '../ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Rss, label: 'Signals', path: '/signals' },
  { icon: History, label: 'Game Log', path: '/game-log' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard', isPro: true },
  { icon: UserCircle, label: 'Public Profile', path: '/profile', isPro: true },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  return (
    <aside 
      className={cn(
        "flex flex-col border-r bg-bg-surface transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <span className="font-display text-xl font-bold tracking-tight text-accent-default">
            Doctore AI
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
              isActive 
                ? "bg-accent-default/10 text-accent-default" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={cn(item.isPro && !isActive && "text-amber-500")} />
                {!collapsed && (
                  <span className="flex-1 flex justify-between items-center">
                    {item.label}
                    {item.isPro && (
                      <span className="text-[9px] uppercase font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm ml-2">
                        Pro
                      </span>
                    )}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 px-3 text-slate-600 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
