import React from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  note?: string;
}

const StatCard = ({ icon, title, value, note }: StatCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-md">{icon}</div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-semibold text-card-foreground">
          {value}
          {note && <span className="text-xs text-amber-500 ml-2">({note})</span>}
        </div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </Card>
  );
};

// Optimizamos con React.memo para evitar re-renderizados innecesarios
export default React.memo(StatCard);
