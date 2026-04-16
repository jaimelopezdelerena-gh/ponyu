import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaCamera, FaSpinner, FaFilter } from 'react-icons/fa';
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

const RANDOM_PLACEHOLDERS = [
  "Ej: Viaje a París",
  "Ej: Tarde pelis y manta",
  "Ej: Cena en el italiano",
  "Ej: Cuando nos perdimos en el bosque",
  "Ej: Primer aniversario",
  "Ej: Cumpleaños sorpresa",
  "Ej: Paseo por la playa al atardecer",
  "Ej: Noche de juegos de mesa",
];

const MemoriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState('Todos');
  const [placeholder, setPlaceholder] = useState(RANDOM_PLACEHOLDERS[0]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('Nosotros');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [extraPhotos, setExtraPhotos] = useState([]);

  useEffect(() => {
    fetchMemories();
    setPlaceholder(RANDOM_PLACEHOLDERS[Math.floor(Math.random() * RANDOM_PLACEHOLDERS.length)]);
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/memories`);
      const data = await res.json();
      setMemories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenForm = () => {
    if (!showForm) {
      setPlaceholder(RANDOM_PLACEHOLDERS[Math.floor(Math.random() * RANDOM_PLACEHOLDERS.length)]);
    }
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('creator', user);
    formData.append('category', category);
    if (coverPhoto) formData.append('coverPhoto', coverPhoto);
    if (extraPhotos) {
      for (let i = 0; i < extraPhotos.length; i++) {
        formData.append('photos', extraPhotos[i]);
      }
    }

    try {
      const res = await fetch(`${API_URL}/api/memories`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setShowForm(false);
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setCategory('Nosotros');
        setCoverPhoto(null);
        setExtraPhotos([]);
        fetchMemories();
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredMemories = filterCat === 'Todos' ? memories : memories.filter(m => m.category === filterCat);

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
          <h1 className="text-4xl font-bold">Nuestros Recuerdos</h1>
          <button 
            onClick={handleOpenForm}
            className="btn-primary"
          >
            {showForm ? 'Cerrar' : <><FaPlus /> Nuevo Recuerdo</>}
          </button>
        </div>

        {/* Categorías de filtrado */}
        {!showForm && (
          <div className="glass-panel p-4 mb-8 flex flex-wrap gap-2 items-center justify-center">
            <span className="font-bold mr-2"><FaFilter className="inline" /> Filtrar:</span>
            <button 
              onClick={() => setFilterCat('Todos')}
              className={`px-4 py-1 rounded-full text-sm font-bold transition ${filterCat === 'Todos' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              Todos
            </button>
            {Object.keys(CATEGORIES).map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-4 py-1 rounded-full text-sm font-bold transition text-white ${CATEGORIES[cat].color} ${filterCat === cat ? 'ring-4 ring-offset-2 ring-[var(--accent-color)]' : 'opacity-80 hover:opacity-100'}`}
              >
                {CATEGORIES[cat].label}
              </button>
            ))}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-panel p-8 mb-8 space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Guardar un Recuerdo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Título del recuerdo</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder={placeholder} />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold mb-1">Categoría</label>
                <div 
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="input-field cursor-pointer flex justify-between items-center bg-white hover:border-[var(--accent-color)] transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${CATEGORIES[category]?.color || 'bg-gray-500'}`}></span>
                    <span className="font-semibold">{CATEGORIES[category]?.label || category}</span>
                  </div>
                  <span className={`text-gray-400 transform transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}>▼</span>
                </div>
                
                {showCategoryDropdown && (
                  <div className="absolute z-20 top-full left-0 mt-2 w-full bg-white border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    {Object.keys(CATEGORIES).map(cat => (
                      <div 
                        key={cat}
                        onClick={() => { setCategory(cat); setShowCategoryDropdown(false); }}
                        className={`p-4 cursor-pointer flex items-center gap-3 transition-colors hover:bg-gray-50 ${category === cat ? 'bg-gray-100' : ''}`}
                      >
                        <span className={`w-3 h-3 rounded-full ${CATEGORIES[cat].color}`}></span>
                        <span className="font-semibold">{CATEGORIES[cat].label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Fecha inicio</label>
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Fecha fin (opcional)</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Foto de Portada</label>
                <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center hover:bg-white/30 transition cursor-pointer h-32 flex flex-col justify-center overflow-hidden">
                  <input type="file" required accept="image/*" onChange={(e) => setCoverPhoto(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {coverPhoto ? (
                    <img src={URL.createObjectURL(coverPhoto)} alt="Preview Portada" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <FaCamera className="text-2xl mx-auto mb-1 opacity-50" />
                      <span className="opacity-70 text-sm truncate px-2">Subir Portada</span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Fotos adicionales (opcional)</label>
                <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center hover:bg-white/30 transition cursor-pointer h-32 flex flex-col justify-center overflow-hidden">
                  <input type="file" multiple accept="image/*" onChange={(e) => setExtraPhotos(Array.from(e.target.files))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {extraPhotos && extraPhotos.length > 0 ? (
                    <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1 bg-white/20">
                      {extraPhotos.slice(0,4).map((f, i) => (
                        <div key={i} className="relative w-full h-full overflow-hidden rounded-md">
                          <img src={URL.createObjectURL(f)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          {i === 3 && extraPhotos.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold">
                              +{extraPhotos.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <FaCamera className="text-2xl mx-auto mb-1 opacity-50" />
                      <span className="opacity-70 text-sm truncate px-2">Subir más fotos</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">¿Qué pasó?</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="input-field h-32" placeholder="Escribe aquí los detalles del recuerdo..."></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg">
              {loading ? <FaSpinner className="animate-spin text-2xl mx-auto" /> : 'Guardar'}
            </button>
          </form>
        )}

        {/* List of Memories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <div 
              key={mem._id} 
              onClick={() => setSelectedMemory(mem)}
              className="glass-panel overflow-hidden group flex flex-col cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-2xl"
            >
              {mem.coverPhoto && (
                <div className="h-56 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${mem.coverPhoto.startsWith('data:') ? mem.coverPhoto : `${API_URL}/uploads/${mem.coverPhoto}`})` }}>
                  {mem.category && (
                     <div className={`absolute top-4 right-4 ${CATEGORIES[mem.category]?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                       {CATEGORIES[mem.category]?.label || mem.category}
                     </div>
                  )}
                  {mem.photos && mem.photos.length > 0 && (
                     <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                       +{mem.photos.length} fotos
                     </div>
                  )}
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white/40">
                <div>
                  <h3 className="text-xl font-bold mb-1 truncate">{mem.title}</h3>
                  <p className="text-xs font-semibold text-gray-500 font-mono">
                    {new Date(mem.startDate).toLocaleDateString()}
                    {mem.endDate && ` - ${new Date(mem.endDate).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-color)]">
                    Leer más
                  </span>
                  <span className="text-xs font-bold text-gray-400 capitalize">
                    {mem.creator}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filteredMemories.length === 0 && !showForm && (
            <p className="opacity-70 col-span-full">Aún no hay recuerdos guardados en esta categoría.</p>
          )}
        </div>

        {/* Detalles del Recuerdo Modal */}
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMemory(null)}>
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedMemory(null)} className="absolute top-4 right-4 bg-white/80 hover:bg-white text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow z-10 transition">
                ✕
              </button>
              
              {selectedMemory.coverPhoto && (
                <div className="h-80 w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedMemory.coverPhoto.startsWith('data:') ? selectedMemory.coverPhoto : `${API_URL}/uploads/${selectedMemory.coverPhoto}`})` }}>
                  {selectedMemory.category && (
                     <div className={`absolute top-4 left-4 ${CATEGORIES[selectedMemory.category]?.color || 'bg-gray-500'} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
                       {CATEGORIES[selectedMemory.category]?.label || selectedMemory.category}
                     </div>
                  )}
                </div>
              )}
              
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-4xl font-bold mb-2">{selectedMemory.title}</h2>
                  <div className="flex items-center gap-4 text-sm font-semibold text-gray-500 font-mono">
                    <span>
                      {new Date(selectedMemory.startDate).toLocaleDateString()}
                      {selectedMemory.endDate && ` - ${new Date(selectedMemory.endDate).toLocaleDateString()}`}
                    </span>
                    <span>•</span>
                    <span className="capitalize text-[var(--accent-color)]">Subido por {selectedMemory.creator}</span>
                  </div>
                </div>
                
                <p className="text-gray-800 leading-relaxed mb-8 whitespace-pre-wrap text-lg">
                  {selectedMemory.description}
                </p>

                {selectedMemory.photos && selectedMemory.photos.length > 0 && (
                  <div>
                    <h4 className="text-xl font-bold mb-4 border-b pb-2">Galería de Fotos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedMemory.photos.map((photoStr, idx) => (
                        <div key={idx} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow">
                          <img src={photoStr.startsWith('data:') ? photoStr : `${API_URL}/uploads/${photoStr}`} alt={`Extra foto ${idx+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoriesPage;
