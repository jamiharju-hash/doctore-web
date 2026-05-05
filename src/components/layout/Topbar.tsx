import React, { useState } from 'react';
import { Bell, User, Search, ChevronDown, Activity, Menu, Check } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import { Input } from '../ui/input';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '../ui/dropdown-menu';

export function Topbar() {
  const { user } = useAuthStore();
  const [currentSport, setCurrentSport] = useState('MLB');

  return (
    <header className="h-16 border-b bg-bg-surface flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "gap-2 font-medium bg-slate-50 border-slate-200 h-9")}>
            <Activity size={16} className="text-accent-default" />
            {currentSport}
            <ChevronDown size={14} className="text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuLabel>Select Sport</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCurrentSport('MLB')} className="justify-between">
              MLB {currentSport === 'MLB' && <Check size={16} className="text-accent-default" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentSport('NBA')} className="justify-between">
              NBA {currentSport === 'NBA' && <Check size={16} className="text-accent-default" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentSport('NFL')} className="justify-between">
              NFL {currentSport === 'NFL' && <Check size={16} className="text-accent-default" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="relative w-64 md:w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Search games or tools..." 
            className="pl-10 h-9 bg-slate-50 border-none ring-offset-bg-surface focus-visible:ring-accent-default"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative text-slate-600")}>
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-1 p-2 max-h-80 overflow-y-auto">
              <div className="p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer">
                <p className="text-sm font-semibold">New high-edge signal detected</p>
                <p className="text-xs text-slate-500 mt-1">LAD @ NYM has a +4.2% edge on the Moneyline.</p>
                <p className="text-[10px] text-slate-400 mt-2">10 mins ago</p>
              </div>
              <div className="p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer opacity-70">
                <p className="text-sm font-semibold">Daily summary ready</p>
                <p className="text-xs text-slate-500 mt-1">Check out your updated bankroll metrics for yesterday.</p>
                <p className="text-[10px] text-slate-400 mt-2">2 hours ago</p>
              </div>
              <div className="p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer opacity-70">
                <p className="text-sm font-semibold">Line movement alert</p>
                <p className="text-xs text-slate-500 mt-1">SEA @ HOU run line moved heavily against the model.</p>
                <p className="text-[10px] text-slate-400 mt-2">4 hours ago</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-accent-default text-xs font-semibold cursor-pointer">
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.email || 'Guest User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.plan || 'Free Account'}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent-default flex items-center justify-center text-white">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
