import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaSpinner, FaMapMarkedAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PlansPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_URL}/api/plans`);
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      description,
      date,
      estimatedBudget: Number(estimatedBudget),
      creator: user
    };

    try {
      const res = await fetch(`${API_URL}/api/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowForm(false);
        setTitle('');
        setDescription('');
        setDate('');
        setEstimatedBudget('');
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col p-8 page-transition-enter-active">
      <div className="max-w-5xl w-full mx-auto z-10">
        <button 
          onClick={() => navigate('/home')}
          className="glass-panel px-4 py-2 flex items-center gap-2 mb-8 hover:bg-white/50 w-fit"
        >
          <FaArrowLeft /> Volver
        </button>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3"><FaMapMarkedAlt /> Nuestros Planes</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cerrar Formulario' : <><FaPlus /> Proponer Plan</>}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-panel p-8 mb-8 space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">¿A dónde vamos la próxima vez?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Título / Destino</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Ej: Finde rural en Asturias" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Presupuesto Estimado (€)</label>
                <input type="number" required value={estimatedBudget} onChange={(e) => setEstimatedBudget(e.target.value)} className="input-field" placeholder="Ej: 150" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Fecha aproximada</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input-field w-full md:w-1/2" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Comentarios / Detalles</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="input-field h-32" placeholder="Ideas sobre qué hacer, dónde alojarnos..."></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg">
              {loading ? <FaSpinner className="animate-spin text-2xl mx-auto" /> : 'Añadir a la lista de planes'}
            </button>
          </form>
        )}

        {/* List of Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan._id} 
              onClick={() => setSelectedPlan(plan)}
              className="glass-panel p-6 border-l-4 border-l-[var(--accent-color)] hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold truncate pr-4">{plan.title}</h3>
                <span className="font-mono bg-[var(--accent-color)] text-white px-2 py-1 rounded-md text-sm shadow">
                  ~ {plan.estimatedBudget} €
                </span>
              </div>
              <p className="text-sm opacity-70 mb-4 font-mono font-bold">
                🗓 {new Date(plan.date).toLocaleDateString()}
              </p>
              <div className="mt-4 flex items-center justify-between">
                 <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">Detalles</span>
                 <span className="text-xs font-semibold text-gray-500 capitalize">Por {plan.creator}</span>
              </div>
            </div>
          ))}
          {plans.length === 0 && !showForm && (
            <p className="opacity-70 col-span-full">Aún no hay planes propuestos. ¡La aventura os espera!</p>
          )}
        </div>

        {/* Detalles del Plan Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedPlan(null)}>
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative border-t-8 border-[var(--accent-color)]" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow z-10 transition">
                ✕
              </button>
              
              <div className="p-8">
                <div className="mb-6 border-b pb-4">
                  <h2 className="text-3xl font-bold mb-3 pr-8">{selectedPlan.title}</h2>
                  <div className="flex items-center gap-4 text-sm font-semibold text-gray-500 font-mono">
                    <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md">🗓 {new Date(selectedPlan.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 bg-[var(--accent-color)]/10 text-[var(--accent-color)] px-3 py-1 rounded-md">💰 ~ {selectedPlan.estimatedBudget} €</span>
                  </div>
                </div>
                
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg mb-8 bg-orange-50 p-6 rounded-xl">
                  {selectedPlan.description}
                </p>
                
                <div className="text-sm font-semibold capitalize text-gray-400 text-right">
                  Plan propuesto por {selectedPlan.creator}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansPage;
