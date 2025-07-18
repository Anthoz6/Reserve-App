import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const ActionCard = ({ title, description, icon, href }: ActionCardProps) => {
  return (
    <Link href={href}>
      <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <div className="p-2 bg-primary/10 rounded-md w-fit mb-4">{icon}</div>
        <h3 className="font-medium text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-auto pt-4 flex justify-end">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>
    </Link>
  );
};

// Optimizamos con React.memo para evitar re-renderizados innecesarios
export default React.memo(ActionCard);
