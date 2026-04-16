import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart } from 'react-icons/fa';

const SelectionPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (user) => {
    login(user);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden page-transition-enter-active">
      <div className="z-10 text-center max-w-lg w-full mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-md flex items-center justify-center gap-4">
          Nuestras Cositas
        </h1>
        <p className="text-xl opacity-90 font-medium">¿Quién eres hoy?</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl z-10">
        <button 
          onClick={() => handleSelect('jaime')}
          className="flex-1 group cursor-pointer"
        >
          <div className="glass-panel p-8 h-full flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-orange-400 bg-orange-50/80">
            <h2 className="text-3xl font-bold text-orange-800 mb-2">Jaime</h2>
            <div className="w-16 h-1 bg-orange-400 rounded-full mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <p className="text-orange-950/70 text-center">Entrar como Jaime</p>
          </div>
        </button>

        <button 
          onClick={() => handleSelect('maialen')}
          className="flex-1 group cursor-pointer"
        >
          <div className="glass-panel p-8 h-full flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-purple-400 bg-purple-50/80">
            <h2 className="text-3xl font-bold text-purple-800 mb-2">Maialen</h2>
            <div className="w-16 h-1 bg-purple-400 rounded-full mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <p className="text-purple-950/70 text-center">Entrar como Maialen</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SelectionPage;
