import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    category: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    provider: string;
  };
  isGuest?: boolean;
  onClickAction?: (e: React.MouseEvent) => void;
}

// Extraemos el componente ServiceCard de CustomerHome para reutilizarlo
const ServiceCard = ({ service, isGuest, onClickAction }: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={service.image}
          alt={service.title}
          className="rounded-lg w-full h-40 object-cover mb-4"
          width={400}
          height={160}
          priority
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background"
          onClick={isGuest ? onClickAction : undefined}
        >
          <Heart className="h-5 w-5" />
        </Button>
        <Badge className="absolute top-2 left-2">{service.category}</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{service.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{service.provider}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{service.rating}</span>
            <span className="text-xs text-muted-foreground">({service.reviews})</span>
          </div>
          <span className="font-bold text-lg">${service.price.toFixed(2)}</span>
        </div>
        {isGuest ? (
          <Button className="w-full mt-4" onClick={onClickAction}>
            Reservar
          </Button>
        ) : (
          <Link href={`/dashboard/customer/services?id=${service.id}`}>
            <Button className="w-full mt-4">Reservar</Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

// Optimizamos con React.memo para evitar re-renderizados innecesarios
export default React.memo(ServiceCard);
