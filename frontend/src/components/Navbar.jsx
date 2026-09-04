import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Calendar, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="bg-sky-700 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6" />
        <span className="text-xl font-bold tracking-wide">MediTurnos</span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-sm bg-sky-800 px-3 py-1.5 rounded-full">
          <User className="h-4 w-4" />
          <span>{user.first_name || user.username} ({user.rol})</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-1 text-sm bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition"
        >
          <LogOut className="h-4 w-4" />
          <span>Salir</span>
        </button>
      </div>
    </nav>
  );
};
