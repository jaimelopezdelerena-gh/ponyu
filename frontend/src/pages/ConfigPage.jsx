import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ConfigPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [memRes, giftRes, planRes] = await Promise.all([
        fetch(`${API_URL}/api/memories`),
        fetch(`${API_URL}/api/gifts`),
        fetch(`${API_URL}/api/plans`)
      ]);
      const [memData, giftData, planData] = await Promise.all([
        memRes.json(), giftRes.json(), planRes.json()
      ]);
      setMemories(memData);
      setGifts(giftData);
      setPlans(planData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar esto? No se puede deshacer.')) return;
    
    try {
      await fetch(`${API_URL}/api/${type}/${id}`, {
        method: 'DELETE'
      });
      fetchData(); // Refresh lists
    } catch (err) {
      console.error('Error al borrar:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8 page-transition-enter-active">
      <div className="max-w-4xl w-full mx-auto z-10">
        <button 
          onClick={() => navigate('/home')}
          className="glass-panel px-4 py-2 flex items-center gap-2 mb-8 hover:bg-white/50 w-fit"
        >
          <FaArrowLeft /> Volver
        </button>
        
        <h1 className="text-4xl font-bold mb-8">⚙️ Configuración y Gestión</h1>
        
        {loading ? (
          <div className="text-center py-12"><FaSpinner className="animate-spin text-4xl mx-auto text-[var(--accent-color)]" /></div>
        ) : (
          <div className="space-y-8">
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Mis Recuerdos</h2>
              <div className="space-y-2">
                {memories.map(m => (
                  <div key={m._id} className="flex justify-between items-center bg-white/40 p-3 rounded-lg">
                    <div>
                      <span className="font-bold">{m.title}</span> <span className="text-sm opacity-70">({m.creator})</span>
                    </div>
                    {m.creator === user && (
                      <button onClick={() => handleDelete('memories', m._id)} className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-md transition"><FaTrash /></button>
                    )}
                  </div>
                ))}
                {memories.length === 0 && <p className="opacity-50">No hay recuerdos.</p>}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Regalos / Pistas</h2>
              <div className="space-y-2">
                {gifts.map(g => (
                  <div key={g._id} className="flex justify-between items-center bg-white/40 p-3 rounded-lg">
                    <div>
                      <span className="font-bold">{g.title} {g.isClue && '🔍 (Pista)'}</span> <span className="text-sm opacity-70">({g.creator})</span>
                    </div>
                    {g.creator === user && (
                      <button onClick={() => handleDelete('gifts', g._id)} className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-md transition"><FaTrash /></button>
                    )}
                  </div>
                ))}
                {gifts.length === 0 && <p className="opacity-50">No hay regalos registrados.</p>}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Planes Siguientes</h2>
              <div className="space-y-2">
                {plans.map(p => (
                  <div key={p._id} className="flex justify-between items-center bg-white/40 p-3 rounded-lg">
                    <div>
                      <span className="font-bold">{p.title}</span> <span className="text-sm opacity-70">({p.creator})</span>
                    </div>
                    {p.creator === user && (
                      <button onClick={() => handleDelete('plans', p._id)} className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-md transition"><FaTrash /></button>
                    )}
                  </div>
                ))}
                {plans.length === 0 && <p className="opacity-50">No hay planes propuestos.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPage;
