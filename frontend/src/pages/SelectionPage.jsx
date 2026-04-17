import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SelectionPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (user) => {
    login(user);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden page-transition-enter-active">
      {/* Title */}
      <div className="z-10 text-center max-w-lg w-full mb-14">
        <h1
          className="mb-5 drop-shadow-md"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.8rem, 10vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Nuestras Cositas
        </h1>
        <p className="text-lg md:text-xl opacity-75 font-semibold tracking-wide">¿Quién eres?</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl z-10">
        {/* Jaime */}
        <button
          onClick={() => handleSelect('jaime')}
          className="flex-1 group cursor-pointer"
        >
          <div
            className="relative overflow-hidden rounded-3xl p-0.5 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #fdba74, #f97316, #ea580c)' }}
          >
            <div className="rounded-[calc(1.5rem-2px)] bg-orange-50/95 backdrop-blur-xl px-8 py-10 flex flex-col items-center gap-3">
              {/* Avatar circle */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg mb-1 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
              >
                J
              </div>
              <h2 className="text-3xl font-black text-orange-800">Jaime</h2>
              {/* Animated underline */}
              <div className="w-12 h-1 rounded-full bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </div>
          </div>
        </button>

        {/* Maialen */}
        <button
          onClick={() => handleSelect('maialen')}
          className="flex-1 group cursor-pointer"
        >
          <div
            className="relative overflow-hidden rounded-3xl p-0.5 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #d8b4fe, #a855f7, #7c3aed)' }}
          >
            <div className="rounded-[calc(1.5rem-2px)] bg-purple-50/95 backdrop-blur-xl px-8 py-10 flex flex-col items-center gap-3">
              {/* Avatar circle */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg mb-1 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
              >
                M
              </div>
              <h2 className="text-3xl font-black text-purple-800">Maialen</h2>
              {/* Animated underline */}
              <div className="w-12 h-1 rounded-full bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SelectionPage;
