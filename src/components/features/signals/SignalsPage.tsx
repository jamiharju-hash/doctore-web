import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../../lib/firebase';
import { Signal, SignalStatus } from '../../../types';
import { SignalCard } from './SignalCard';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Skeleton } from '../../ui/skeleton';
import { Filter } from 'lucide-react';

export function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SignalStatus | 'ALL'>('OPEN');

  useEffect(() => {
    setLoading(true);
    const signalsRef = collection(db, 'signals');
    
    let q = query(signalsRef, orderBy('createdAt', 'desc'));
    
    if (filter !== 'ALL') {
      q = query(signalsRef, where('status', '==', filter), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const signalData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Signal[];
      setSignals(signalData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'signals');
    });

    return () => unsubscribe();
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Live Signals</h2>
          <p className="text-slate-500 text-sm">Real-time MLB edge detection signals</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm self-start">
          <Filter size={16} className="ml-2 text-slate-400" />
          <Tabs value={filter} onValueChange={(val) => setFilter(val as any)}>
            <TabsList className="bg-transparent border-none">
              <TabsTrigger value="ALL" className="text-xs data-[state=active]:bg-slate-100">All</TabsTrigger>
              <TabsTrigger value="OPEN" className="text-xs data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">Open</TabsTrigger>
              <TabsTrigger value="CLOSED" className="text-xs data-[state=active]:bg-slate-100">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : signals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-bg-surface rounded-xl border border-dashed border-slate-300">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Filter size={24} />
          </div>
          <h3 className="font-display font-semibold text-lg">No signals found</h3>
          <p className="text-slate-500 text-sm">Waiting for the model to generate new edges...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {signals.map(signal => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
}
