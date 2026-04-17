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
    <div className="min-h-screen flex flex-col items-center py-8 md:py-12 px-4 page-transition-enter-active">
      {/* Top Bar Area */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-10 md:mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 capitalize mb-2">
            ¡Hola {user}!
          </h1>
          <div className="inline-block bg-white/40 px-4 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
            <span className="font-bold text-gray-700 tracking-wide text-sm flex items-center gap-2">
              <FaHeart className="text-pink-500" />
              Días juntos: <span className="text-[var(--accent-color)]">{diffDays}</span>
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/config')}
            className="glass-panel px-4 py-2 flex items-center gap-2 hover:bg-white/50 transition-colors font-bold text-sm"
          >
            Ajustes
          </button>
          <button 
            onClick={handleLogout}
            className="glass-panel px-4 py-2 flex items-center gap-2 hover:bg-white/50 transition-colors text-sm"
          >
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </div>

      {/* Main 3 options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl z-10">
        {options.map((option, idx) => (
          <div 
            key={idx}
            onClick={() => navigate(option.path)}
            className="glass-panel p-6 md:p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {option.icon}
            <h2 className="text-xl md:text-2xl font-bold mb-3">{option.title}</h2>
            <p className="opacity-80 text-sm md:text-base">{option.description}</p>
          </div>
        ))}
      </div>

      {/* Special Anniversary card */}
      <div className="w-full max-w-5xl mt-6 z-10">
        <div
          onClick={() => navigate('/aniversario')}
          className="cursor-pointer group relative overflow-hidden rounded-3xl p-0.5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #f9a8d4, #c084fc, #f472b6, #fb7185)',
          }}
        >
          <div className="rounded-[calc(1.5rem-2px)] bg-white/85 backdrop-blur-xl px-8 py-6 md:px-10 md:py-7 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">💍</div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Especial</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#be185d' }}>Primer Aniversario</h2>
              </div>
            </div>
            <div
              className="px-5 py-2 rounded-full font-bold text-sm text-white whitespace-nowrap transition-all duration-300 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}
            >
              {user === 'jaime' ? 'Escribir →' : 'Ver carta →'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
