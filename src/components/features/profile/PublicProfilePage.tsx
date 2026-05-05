import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card';
import { Lock, UserCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { useAuthStore } from '../../../store/authStore';

export function PublicProfilePage() {
  const { user } = useAuthStore();
  const isPro = user?.plan === 'pro';

  if (!isPro) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)]">
        <Card className="max-w-md w-full border-none shadow-lg text-center p-6">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-4">
              <Lock size={32} />
            </div>
            <CardTitle className="text-2xl font-display font-bold">Profile Locked</CardTitle>
            <CardDescription className="text-sm">
              Public Profiles are an exclusive feature for Pro members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6 text-sm">
              Upgrade to customize your public profile, share your verified edge history, and showcase your achievements.
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
        <h2 className="font-display text-3xl font-bold tracking-tight">Public Profile</h2>
        <p className="text-slate-500 text-sm">Manage how others see you on the platform</p>
      </div>
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="text-accent-default" size={20} /> Your Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm italic">Profile customization options coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
