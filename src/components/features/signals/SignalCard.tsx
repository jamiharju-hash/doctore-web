import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Badge } from '../../ui/badge';
import { Signal } from '../../../types';
import { TrendingUp, Clock, Target } from 'lucide-react';
import { Button } from '../../ui/button';

interface SignalCardProps {
  signal: Signal;
  onSelect?: (id: string) => void;
  className?: string;
}

export const SignalCard: FC<SignalCardProps> = ({ signal, onSelect, className }) => {
  const navigate = useNavigate();
  const isPositive = signal.edge > 0;

  const handleClick = () => {
    if (onSelect) {
      onSelect(signal.id);
    } else {
      navigate(`/signals/${signal.id}`);
    }
  };

  return (
    <div 
      className={cn(
        "group relative bg-bg-surface p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-accent-default cursor-pointer overflow-hidden",
        className
      )}
      onClick={handleClick}
    >
      {/* Decorative accent for high edge */}
      {signal.edge >= 0.05 && (
        <div className="absolute top-0 left-0 w-1 h-full bg-accent-default" />
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display font-bold text-lg leading-tight group-hover:text-accent-default transition-colors">
            {signal.game}
          </h3>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
            <Clock size={12} /> {new Date(signal.createdAt?.toDate?.() || Date.now()).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Badge 
          variant={signal.status === 'OPEN' ? 'secondary' : 'outline'}
          className={cn(
            "text-[10px] uppercase tracking-wider font-bold",
            signal.status === 'OPEN' ? "bg-emerald-100 text-emerald-700" : "text-slate-400"
          )}
        >
          {signal.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Market</p>
          <p className="text-sm font-semibold">{signal.market}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">AI Prob</p>
          <p className="text-sm font-semibold">{(signal.probability * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="flex items-end justify-between pt-4 border-t border-slate-100">
        <div>
          <div className="flex items-center gap-1 text-emerald-600">
            <TrendingUp size={16} />
            <span className="text-sm font-bold">{(signal.edge * 100).toFixed(2)}% Edge</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Recommended Stake: {signal.kellyStake}u</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end text-slate-900">
            <Target size={16} className="text-accent-default" />
            <span className="text-lg font-display font-bold">{signal.odds}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Odds</p>
        </div>
      </div>

      <Button variant="ghost" className="w-full mt-4 h-8 text-xs font-bold text-accent-default group-hover:bg-accent-default/5">
        View Breakdown
      </Button>
    </div>
  );
}
