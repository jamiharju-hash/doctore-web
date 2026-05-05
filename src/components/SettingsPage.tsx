import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Save, Shield, Database, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [kellyFraction, setKellyFraction] = useState(user?.kellyFraction?.toString() || '0.1');
  const [minEdge, setMinEdge] = useState((user?.minEdge || 0.02 * 100).toString());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setMessage(null);

    try {
      const userRef = doc(db, 'users', user.uid);
      const updates = {
        kellyFraction: parseFloat(kellyFraction),
        minEdge: parseFloat(minEdge) / 100
      };

      await updateDoc(userRef, updates);
      setUser({ ...user, ...updates });
      setMessage({ type: 'success', text: 'Settings updated successfully' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">Account Settings</h2>
        <p className="text-slate-500">Configure your model parameters and account preferences</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-accent-default mb-1">
              <Shield size={18} />
              <CardTitle className="text-lg">Risk Management</CardTitle>
            </div>
            <CardDescription>Adjust your stake sizing parameters used in calculations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Kelly Fraction</label>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  max="1"
                  value={kellyFraction}
                  onChange={(e) => setKellyFraction(e.target.value)}
                />
                <p className="text-xs text-slate-400 italic">0.1 = Quarter Kelly, 1.0 = Full Kelly</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Min Edge Detection (%)</label>
                <Input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={minEdge}
                  onChange={(e) => setMinEdge(e.target.value)}
                />
                <p className="text-xs text-slate-400 italic">Signals below this edge will be hidden</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
             <div className="flex items-center gap-2 text-indigo-500 mb-1">
              <Database size={18} />
              <CardTitle className="text-lg">Data & Exports</CardTitle>
            </div>
            <CardDescription>Manage your logged betting data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
              <div>
                <p className="text-sm font-bold">Export Game Log</p>
                <p className="text-xs text-slate-500">Download your entire history as a CSV file</p>
              </div>
              <Button variant="outline" size="sm">Export CSV</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
             <div className="flex items-center gap-2 text-amber-500 mb-1">
              <Bell size={18} />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>Control how you receive signal alerts</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between border rounded-lg p-4 bg-slate-50/50">
             <div className="space-y-1">
               <p className="text-sm font-bold opacity-50 italic">Push Notifications (Phase 2)</p>
               <p className="text-xs text-slate-400">Receive browser alerts for new hot signals</p>
             </div>
             <Badge variant="outline">Coming Soon</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        {message && (
          <span className={cn(
            "text-sm font-medium animate-in fade-in slide-in-from-right-2",
            message.type === 'success' ? "text-emerald-600" : "text-red-600"
          )}>
            {message.text}
          </span>
        )}
        <Button 
          className="bg-accent-default hover:bg-accent-hover px-8"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Settings</>}
        </Button>
      </div>
    </div>
  );
}
