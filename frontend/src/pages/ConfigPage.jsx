import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaSpinner, FaEdit, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = {
  Comida: { color: 'bg-red-500', label: 'Comida' },
  Nosotros: { color: 'bg-pink-500', label: 'Nosotros' },
  Quedada: { color: 'bg-orange-500', label: 'Quedada' },
  Lugar: { color: 'bg-blue-500', label: 'Lugar' },
  Juego: { color: 'bg-purple-500', label: 'Juego' },
  Otro: { color: 'bg-gray-500', label: 'Otro' }
};

const ConfigPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [plans, setPlans] = useState([]);

  // Edit Modal State
  const [editingMemory, setEditingMemory] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategories, setEditCategories] = useState([]);
  const [savingEdit, setSavingEdit] = useState(false);

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

  const openEditModal = (mem) => {
    setEditingMemory(mem);
    setEditTitle(mem.title);
    setEditDescription(mem.description);
    setEditCategories(mem.categories || (mem.category ? [mem.category] : []));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    const formData = new FormData();
    formData.append('title', editTitle);
    formData.append('description', editDescription);
    formData.append('categories', JSON.stringify(editCategories));
    
    try {
      const res = await fetch(`${API_URL}/api/memories/${editingMemory._id}`, {
        method: 'PUT',
        body: formData
      });
      if (res.ok) {
        setEditingMemory(null);
        fetchData();
      }
    } catch(err) {
      console.error(err);
    }
    setSavingEdit(false);
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
                  <div key={m._id} className="flex justify-between items-center bg-white/40 p-3 rounded-lg hover:bg-white/60 transition">
                    <div>
                      <span className="font-bold">{m.title}</span> <span className="text-sm opacity-70">({m.creator})</span>
                    </div>
                    {m.creator === user && (
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(m)} className="text-blue-500 hover:text-blue-700 bg-blue-100 p-2 rounded-md transition"><FaEdit /></button>
                        <button onClick={() => handleDelete('memories', m._id)} className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-md transition"><FaTrash /></button>
                      </div>
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
                  <div key={g._id} className="flex justify-between items-center bg-white/40 p-3 rounded-lg hover:bg-white/60 transition">
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
                  <div key={p._id} className="flex justify-between items-center bg-white/40 p-3 rounded-lg hover:bg-white/60 transition">
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

        {/* Modal de Edición de Recuerdos */}
        {editingMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setEditingMemory(null)}>
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-6">✏️ Editar Recuerdo</h2>
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Título</label>
                    <input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="input-field border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Categorías</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(CATEGORIES).map(cat => (
                        <button 
                          type="button"
                          key={cat}
                          onClick={() => {
                              if (editCategories.includes(cat)) {
                                  if (editCategories.length > 1) {
                                      setEditCategories(editCategories.filter(c => c !== cat));
                                  }
                              } else {
                                  setEditCategories([...editCategories, cat]);
                              }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${editCategories.includes(cat) ? CATEGORIES[cat].color + ' text-white ring-2 ring-[var(--accent-color)]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {CATEGORIES[cat].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">¿Qué pasó?</label>
                    <textarea required value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="input-field h-32 border-gray-300"></textarea>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setEditingMemory(null)} className="btn-primary bg-gray-200 text-gray-800 hover:bg-gray-300 w-full py-3">Cancelar</button>
                    <button type="submit" disabled={savingEdit} className="btn-primary w-full py-3 flex justify-center items-center gap-2">
                      {savingEdit ? <FaSpinner className="animate-spin" /> : <><FaSave /> Guardar Cambios</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConfigPage;
