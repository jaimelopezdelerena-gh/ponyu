import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBookOpen, FaGift, FaPlane, FaSignOutAlt, FaHeart } from 'react-icons/fa';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const engagementDate = new Date('2025-04-20T00:00:00');
  const today = new Date();
  const diffTime = Math.abs(today - engagementDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options = [
    {
      title: 'Recuerdos',
      description: 'Nuestra colección de momentos especiales.',
      icon: <FaBookOpen className="text-4xl mb-4" />,
      path: '/recuerdos',
    },
    {
      title: 'Regalos',
      description: 'Nuestros regalitos bonitos y alguna pista jiji.',
      icon: <FaGift className="text-4xl mb-4" />,
      path: '/regalos',
    },
    {
      title: 'Planes',
      description: 'Próximas salidas, quedadas, viajes, y cualquier aventura nuestra (Modo eco).',
      icon: <FaPlane className="text-4xl mb-4" />,
      path: '/planes',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 page-transition-enter-active">
      {/* Top Bar Area */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3 capitalize mb-2">
            ¡Hola {user}!
          </h1>
          <div className="inline-block bg-white/40 px-4 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
            <span className="font-bold text-gray-700 tracking-wide text-sm flex items-center gap-2">
              <FaHeart className="text-pink-500" />
              Días juntos: <span className="text-[var(--accent-color)]">{diffDays}</span>
            </span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/config')}
            className="glass-panel px-4 py-2 flex items-center gap-2 hover:bg-white/50 transition-colors font-bold"
          >
            ⚙️ Ajustes
          </button>
          <button 
            onClick={handleLogout}
            className="glass-panel px-4 py-2 flex items-center gap-2 hover:bg-white/50 transition-colors"
          >
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl z-10">
        {options.map((option, idx) => (
          <div 
            key={idx}
            onClick={() => navigate(option.path)}
            className="glass-panel p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {option.icon}
            <h2 className="text-2xl font-bold mb-3">{option.title}</h2>
            <p className="opacity-80">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
