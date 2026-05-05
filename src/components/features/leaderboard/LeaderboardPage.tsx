import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Lock, Trophy } from 'lucide-react';
import { Button } from '../../ui/button';
import { useAuthStore } from '../../../store/authStore';

export function LeaderboardPage() {
  const { user } = useAuthStore();
  const isPro = user?.plan === 'pro';

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
        <Card className="max-w-md w-full border-none shadow-lg text-center p-6">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Lock size={32} />
            </div>
            <CardTitle className="text-2xl font-display font-bold">Pro Feature</CardTitle>
            <CardDescription className="text-sm">
              The Doctore AI Leaderboard is exclusive to Pro members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6 text-sm">
              Upgrade to see how your edge detection and bankroll growth compares to the top bettors on the platform.
            </p>
            <Button className="w-full bg-accent-default hover:bg-accent-hover font-bold">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">Leaderboard</h2>
        <p className="text-slate-500 text-sm">Compete with the best on Doctore AI</p>
      </div>
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} /> Top Bettors (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm italic">Leaderboard content coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
