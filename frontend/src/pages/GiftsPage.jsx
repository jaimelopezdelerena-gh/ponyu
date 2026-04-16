import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaCamera, FaSpinner, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GiftsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gifts, setGifts] = useState({ jaime: [], maialen: [] });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(user || 'jaime'); // Vista de Jaime o Maialen
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isClue, setIsClue] = useState(false);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const resJ = await fetch(`${API_URL}/api/gifts?category=jaime`);
      const dataJ = await resJ.json();
      
      const resM = await fetch(`${API_URL}/api/gifts?category=maialen`);
      const dataM = await resM.json();

      setGifts({ jaime: dataJ, maialen: dataM });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('creator', user);
    formData.append('category', activeTab);
    formData.append('isClue', isClue);
    if (coverPhoto) formData.append('coverPhoto', coverPhoto);

    try {
      const res = await fetch(`${API_URL}/api/gifts`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setShowForm(false);
        setTitle('');
        setDescription('');
        setIsClue(false);
        setCoverPhoto(null);
        fetchGifts();
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
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold">Nuestros Regalos</h1>
          <div className="glass-panel p-2 flex gap-2">
            <button 
              onClick={() => setActiveTab('jaime')} 
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'jaime' ? 'bg-orange-400 text-white' : 'hover:bg-white/50 text-orange-800'}`}
            >
              Para Jaime
            </button>
            <button 
              onClick={() => setActiveTab('maialen')} 
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'maialen' ? 'bg-purple-400 text-white' : 'hover:bg-white/50 text-purple-800'}`}
            >
              Para Maialen
            </button>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancelar' : <><FaPlus /> Añadir a sección</>}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-panel p-8 mb-8 space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">
              Añadir algo para la sección de {activeTab === 'jaime' ? 'Jaime' : 'Maialen'}
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isClue} onChange={(e) => setIsClue(e.target.checked)} className="w-5 h-5" />
                <span className="font-bold text-[var(--accent-color)] flex items-center gap-2"><FaSearch /> Es una PISTA para el próximo regalo</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Título {isClue ? 'de la pista' : 'del regalo'}</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Ej: Zapatillas nuevas..." />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">{isClue ? 'Imagen de la pista (opcional)' : 'Foto de portada del regalo'}</label>
              <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center hover:bg-white/30 transition cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => setCoverPhoto(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <FaCamera className="text-3xl mx-auto mb-2 opacity-50" />
                <span className="opacity-70">{coverPhoto ? coverPhoto.name : 'Sube o arrastra una imagen'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Detalles / Texto {isClue && 'de la pista'}</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="input-field h-32" placeholder="Escribe aquí los detalles..."></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg">
              {loading ? <FaSpinner className="animate-spin text-2xl mx-auto" /> : (isClue ? 'Lanzar Pista secreta' : 'Guardar Regalo')}
            </button>
          </form>
        )}

        {/* List of Gifts / Clues */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts[activeTab]?.map((item) => (
            <div key={item._id} className={`glass-panel overflow-hidden relative ${item.isClue ? 'border-4 border-dashed border-[var(--accent-color)]' : ''}`}>
              {item.isClue && (
                <div className="absolute top-4 right-4 bg-[var(--accent-color)] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <FaSearch /> PISTA 🤫
                </div>
              )}
              {item.coverPhoto && (
                <div className={`h-48 w-full bg-cover bg-center ${item.isClue ? 'blur-[2px] transition hover:blur-none cursor-pointer' : ''}`} style={{ backgroundImage: `url(${item.coverPhoto.startsWith('data:') ? item.coverPhoto : `${API_URL}/uploads/${item.coverPhoto}`})` }}></div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-90">{item.description}</p>
                <div className="mt-4 text-xs font-semibold text-gray-500">
                  Subido por {item.creator}
                </div>
              </div>
            </div>
          ))}
          {gifts[activeTab]?.length === 0 && !showForm && (
            <p className="opacity-70 col-span-full">Aún no hay nada en esta sección.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftsPage;
