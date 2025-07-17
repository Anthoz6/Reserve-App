// Componente de estadísticas de usuarios (total, por rol)
import RoleBadge from './RoleBadge';

export interface AdminStatsProps {
  total: number;
  byRole: { [role: string]: number };
}

export default function AdminStats({ total, byRole }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-card rounded-xl p-6 shadow border flex flex-col items-center">
        <span className="text-3xl font-bold">{total}</span>
        <span className="text-muted-foreground">Usuarios totales</span>
      </div>
      {Object.entries(byRole).map(([role, count]) => (
        <div key={role} className="bg-card rounded-xl p-6 shadow border flex flex-col items-center">
          <span className="text-2xl font-semibold">{count}</span>
          <RoleBadge role={role} />
        </div>
      ))}
    </div>
  );
} 