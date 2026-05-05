import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../../lib/firebase';
import { Signal, SignalResult } from '../../../types';
import { useAuthStore } from '../../../store/authStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Skeleton } from '../../ui/skeleton';
import { Separator } from '../../ui/separator';
import { 
  ChevronLeft, 
  TrendingUp, 
  Target, 
  Dna, 
  History,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export function SignalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { firebaseUser, user } = useAuthStore();
  
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [stake, setStake] = useState('');
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const signalRef = doc(db, 'signals', id);
    
    const unsubscribe = onSnapshot(signalRef, (docSnap) => {
      if (docSnap.exists()) {
        setSignal({ id: docSnap.id, ...docSnap.data() } as Signal);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `signals/${id}`);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (signal) {
      setStake(signal.kellyStake.toString());
    }
  }, [signal]);

  const handleLogBet = async () => {
    if (!firebaseUser || !signal || !id) return;
    
    setLogging(true);
    try {
      const betId = `${firebaseUser.uid}_${id}`;
      await setDoc(doc(db, 'bets', betId), {
        userId: firebaseUser.uid,
        signalId: id,
        stake: parseFloat(stake),
        odds: signal.odds,
        result: null as SignalResult,
        loggedAt: serverTimestamp()
      });
      navigate('/game-log');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'bets');
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!signal) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold">Signal Not Found</h2>
        <Button onClick={() => navigate('/signals')} variant="link">Back to Signals</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/signals')}
        className="gap-2 text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={16} /> Back to Signals
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-accent-default border-accent-default/20">MLB PRE-GAME</Badge>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{signal.status}</Badge>
                </div>
                <CardTitle className="font-display text-3xl font-bold">{signal.game}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                   <History size={14} /> Created: {new Date(signal.createdAt?.toDate?.() || Date.now()).toLocaleString()}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-4xl font-display font-black text-accent-default">{signal.odds}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Market Odds</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Edge</span>
                </div>
                <p className="text-2xl font-display font-bold">{(signal.edge * 100).toFixed(2)}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-accent-default mb-1">
                  <Dna size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">AI Prob</span>
                </div>
                <p className="text-2xl font-display font-bold">{(signal.probability * 100).toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Target size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Market</span>
                </div>
                <p className="text-2xl font-display font-bold">{signal.market}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <MessageSquare size={18} className="text-slate-400" /> Model Insights
              </h4>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm/relaxed text-slate-600">
                The model identifies a significant outlier in the pitching metrics for this matchup. 
                Recent bullpen usage and home plate umpire tendencies suggest a slight bias towards 
                higher run totals than currently priced by the market. Recommended stake follows the 
                optimized {user?.kellyFraction || 0.1} Kelly criterion.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-accent-default/5 border-t-4 border-accent-default">
          <CardHeader>
            <CardTitle className="text-lg">Execution Panel</CardTitle>
            <CardDescription>Log your position for tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400">Stake Units</label>
              <Input 
                type="number" 
                step="0.01" 
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="bg-white border-slate-200"
              />
              <p className="text-[10px] text-slate-500 italic">Recommended based on settings: {signal.kellyStake}u</p>
            </div>
            
            <div className="pt-4 space-y-3">
              <div className="flex justify-between text-xs font-medium border-b pb-2 border-slate-200">
                <span className="text-slate-500">Projected Value</span>
                <span className="text-emerald-600">+{(signal.edge * parseFloat(stake || '0')).toFixed(3)}u</span>
              </div>
              <div className="flex justify-between text-xs font-medium border-b pb-2 border-slate-200">
                <span className="text-slate-500">Max Possible Loss</span>
                <span className="text-red-600">-{stake}u</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-accent-default hover:bg-accent-hover"
              onClick={handleLogBet}
              disabled={logging}
            >
              {logging ? 'Logging...' : 'Log & Verify Position'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
