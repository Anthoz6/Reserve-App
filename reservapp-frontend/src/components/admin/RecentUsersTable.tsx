// Componente de tabla de usuarios recientes
import RoleBadge from './RoleBadge';
import { User } from '@/types/user';

export interface RecentUsersTableProps {
  users: User[];
}

export default function RecentUsersTable({ users }: RecentUsersTableProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow border">
      <h3 className="font-semibold mb-2">Usuarios recientes</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground">
            <th className="text-left py-1">Nombre</th>
            <th className="text-left py-1">Email</th>
            <th className="text-left py-1">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t last:border-b">
              <td className="py-1">{user.name}</td>
              <td className="py-1">{user.email}</td>
              <td className="py-1">
                <RoleBadge role={user.role.role} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
