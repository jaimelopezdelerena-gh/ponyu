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
  const [selectedGift, setSelectedGift] = useState(null);
  
  const isGiver = user === activeTab; // Si Jaime está en "De Jaime", él da. Si Maialen en "De Maialen", ella da.
  
  const colorClassBg = activeTab === 'maialen' ? 'bg-[#a855f7]' : 'bg-[var(--accent-color)]';
  const colorClassBorder = activeTab === 'maialen' ? 'border-l-[#a855f7]' : 'border-l-[var(--accent-color)]';
  const colorClassText = activeTab === 'maialen' ? 'text-[#a855f7]' : 'text-[var(--accent-color)]';

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
    formData.append('isClue', !isGiver);
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
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'jaime' ? 'bg-[var(--accent-color)] text-white' : 'hover:bg-white/50'}`}
            >
              De Jaime
            </button>
            <button 
              onClick={() => setActiveTab('maialen')} 
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'maialen' ? 'bg-[var(--accent-color)] text-white' : 'hover:bg-white/50'}`}
            >
              De Maialen
            </button>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancelar' : <><FaPlus /> {isGiver ? 'Añadir Regalo' : 'Dejar una Pista'}</>}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-panel p-8 mb-8 space-y-6 animate-fade-in border-l-4 border-l-[var(--accent-color)]">
            <h2 className="text-2xl font-bold mb-4">
              {isGiver ? `Guardar un regalo en la caja fuerte` : `Añadir una pequeña pista flotante para los regalos de ${activeTab}`}
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-1">Título {!isGiver ? 'de la pista' : 'del regalo'}</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Ej: Zapatillas nuevas..." />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">{!isGiver ? 'Imagen de la pista (opcional)' : 'Foto de portada del regalo'}</label>
              <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center hover:bg-white/30 transition cursor-pointer h-32 flex flex-col justify-center overflow-hidden">
                <input type="file" accept="image/*" onChange={(e) => setCoverPhoto(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {coverPhoto ? (
                  <img src={URL.createObjectURL(coverPhoto)} alt="Preview Portada" className="absolute inset-0 w-full h-full object-contain bg-black/5" />
                ) : (
                  <>
                    <FaCamera className="text-2xl mx-auto mb-1 opacity-50" />
                    <span className="opacity-70 text-sm truncate px-2">Subir imagen</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Detalles / Texto {!isGiver && 'de la pista'}</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="input-field h-32" placeholder="Escribe aquí los detalles..."></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg">
              {loading ? <FaSpinner className="animate-spin text-2xl mx-auto" /> : (!isGiver ? 'Lanzar Pista secreta' : 'Guardar Regalo')}
            </button>
          </form>
        )}

        {/* List of Gifts / Clues */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts[activeTab]?.map((item) => (
            <div 
              key={item._id} 
              onClick={() => setSelectedGift(item)}
              className={`${item.isClue ? `bg-white/80 p-6 rounded-3xl rounded-tl-none shadow-xl border-l-[6px] ${colorClassBorder} relative` : 'glass-panel overflow-hidden relative border-2 border-transparent hover:border-[var(--accent-color)]'} cursor-pointer transform transition-transform hover:-translate-y-1`}
            >
              {item.isClue ? (
                <>
                  <div className={`absolute top-4 right-4 ${colorClassBg} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}>
                    PISTA
                  </div>
                  <h3 className="text-xl font-bold pr-20">{item.title}</h3>
                </>
              ) : (
                <>
                  {item.coverPhoto && (
                    <div className="h-48 w-full bg-contain bg-center bg-no-repeat bg-black/5" style={{ backgroundImage: `url(${item.coverPhoto.startsWith('data:') ? item.coverPhoto : `${API_URL}/uploads/${item.coverPhoto}`})` }}></div>
                   )}
                   <div className="p-6">
                     <h3 className="text-xl font-bold mb-2 truncate">{item.title}</h3>
                     <div className="mt-4 flex items-center justify-between">
                       <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">Detalles</span>
                       <span className="text-xs font-semibold text-gray-500 capitalize">Por {item.creator}</span>
                     </div>
                   </div>
                </>
              )}
            </div>
          ))}
          {gifts[activeTab]?.length === 0 && !showForm && (
            <p className="opacity-70 col-span-full">Aún no hay regalos ni pistas en esta sección.</p>
          )}
        </div>

        {/* Detalles del Regalo / Pista Modal */}
        {selectedGift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedGift(null)}>
            <div className={`bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative ${selectedGift.isClue ? `border-8 ${colorClassBorder}` : ''}`} onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedGift(null)} className="absolute top-4 right-4 bg-black/20 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow z-10 transition">
                ✕
              </button>
              
              {selectedGift.coverPhoto && (
                <div className="h-64 w-full bg-contain bg-center bg-no-repeat bg-black/10 relative" style={{ backgroundImage: `url(${selectedGift.coverPhoto.startsWith('data:') ? selectedGift.coverPhoto : `${API_URL}/uploads/${selectedGift.coverPhoto}`})` }}>
                  {selectedGift.isClue && (
                     <div className={`absolute top-4 left-4 ${colorClassBg} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-2`}>
                       PISTA
                     </div>
                  )}
                </div>
              )}
              
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">{selectedGift.title}</h2>
                  {!selectedGift.isClue && (
                    <div className={`text-sm font-semibold capitalize ${colorClassText}`}>
                      Subido en secreto por {selectedGift.creator}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg bg-gray-50 p-6 rounded-xl border border-gray-100">
                  {selectedGift.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftsPage;
