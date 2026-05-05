import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Bet } from '../types';
import { useAuthStore } from '../store/authStore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Download, Search, HardDrive } from 'lucide-react';
import { Input } from './ui/input';
import { exportToCSV } from '../lib/utils';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

export function GameLogPage() {
  const { firebaseUser } = useAuthStore();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!firebaseUser) return;

    setLoading(true);
    const betsRef = collection(db, 'bets');
    const q = query(
      betsRef, 
      where('userId', '==', firebaseUser.uid), 
      orderBy('loggedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const betData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bet[];
      setBets(betData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bets');
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  const handleExport = () => {
    const exportData = bets.map(b => ({
      Date: new Date(b.loggedAt?.toDate?.() || Date.now()).toLocaleString(),
      Stake: b.stake,
      Odds: b.odds,
      Result: b.result || 'Pending'
    }));
    exportToCSV(exportData, 'bet-history');
  };

  const filteredBets = bets.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Game Log</h1>
          <p className="text-slate-500">History and verification of your previous signals</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 self-start sm:self-auto">
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <Input 
                placeholder="Search bet ID..." 
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filteredBets.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <HardDrive size={24} />
              </div>
              <h3 className="text-lg font-semibold">No history found</h3>
              <p className="text-slate-500 text-sm">Your logged bets will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[200px]">Date</TableHead>
                  <TableHead>Bet ID</TableHead>
                  <TableHead>Stake</TableHead>
                  <TableHead>Odds</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBets.map((bet) => (
                  <TableRow key={bet.id}>
                    <TableCell className="font-medium text-slate-600">
                      {new Date(bet.loggedAt?.toDate?.() || Date.now()).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">
                      {bet.id}
                    </TableCell>
                    <TableCell>{bet.stake}u</TableCell>
                    <TableCell>{bet.odds}</TableCell>
                    <TableCell className="text-right">
                      {bet.result === 'WIN' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">WIN</Badge>}
                      {bet.result === 'LOSS' && <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">LOSS</Badge>}
                      {bet.result === 'PUSH' && <Badge variant="outline">PUSH</Badge>}
                      {!bet.result && <Badge variant="secondary">PENDING</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
