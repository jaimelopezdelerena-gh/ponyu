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
            <div key={plan._id} className="glass-panel p-6 border-l-4 border-l-[var(--accent-color)] hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <span className="font-mono bg-[var(--accent-color)] text-white px-2 py-1 rounded-md text-sm">
                  ~ {plan.estimatedBudget} €
                </span>
              </div>
              <p className="text-sm opacity-70 mb-4 font-mono font-bold">
                🗓 {new Date(plan.date).toLocaleDateString()}
              </p>
              <p className="opacity-90">{plan.description}</p>
              <div className="mt-4 text-xs font-semibold text-[var(--accent-color)] opacity-80 capitalize">
                Propuesto por {plan.creator}
              </div>
            </div>
          ))}
          {plans.length === 0 && !showForm && (
            <p className="opacity-70 col-span-full">Aún no hay planes propuestos. ¡La aventura os espera!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
