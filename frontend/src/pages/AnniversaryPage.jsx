import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaSave, FaSpinner, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AnniversaryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isJaime = user === 'jaime';

  const [text, setText] = useState('');
  const [savedText, setSavedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchText();
  }, []);

  const fetchText = async () => {
    try {
      const res = await fetch(`${API_URL}/api/anniversary`);
      const data = await res.json();
      setSavedText(data.text || '');
      setText(data.text || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/anniversary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedText(data.text);
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setText(savedText);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 page-transition-enter-active">
      <div className="max-w-3xl w-full mx-auto z-10">
        {/* Back button */}
        <button
          onClick={() => navigate('/home')}
          className="glass-panel px-4 py-2 flex items-center gap-2 mb-8 hover:bg-white/50 w-fit"
        >
          <FaArrowLeft /> Volver
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaHeart className="text-3xl text-pink-500 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">1er Aniversario</h1>
            <FaHeart className="text-3xl text-pink-500 animate-pulse" />
          </div>
          <p className="text-lg opacity-70 font-medium">
            {isJaime
              ? 'Este espacio es tuyo, Jaime. Escríbele algo bonito a Maialen.'
              : 'Jaime tiene algo que decirte 💌'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <FaSpinner className="animate-spin text-4xl mx-auto text-[var(--accent-color)]" />
          </div>
        ) : (
          <div className="glass-panel p-6 md:p-10 relative">

            {/* Decorative hearts */}
            <div className="absolute top-4 right-6 opacity-10 text-6xl pointer-events-none select-none">💖</div>
            <div className="absolute bottom-4 left-6 opacity-10 text-4xl pointer-events-none select-none">💕</div>

            {/* JAIME VIEW: Editor */}
            {isJaime && (
              <>
                {!isEditing && savedText === '' && (
                  <div className="text-center py-12">
                    <p className="text-xl opacity-60 mb-6">Todavía no has escrito nada...</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary text-lg px-8 py-3"
                    >
                      <FaEdit /> Escribir carta
                    </button>
                  </div>
                )}

                {!isEditing && savedText !== '' && (
                  <div>
                    <div className="prose max-w-none">
                      <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium text-[var(--text-color)] opacity-90" style={{ fontFamily: 'Nunito, sans-serif', lineHeight: '2' }}>
                        {savedText}
                      </p>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                      >
                        <FaEdit /> Editar
                      </button>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div>
                    <label className="block text-sm font-bold mb-3 opacity-70 uppercase tracking-widest">
                      Tu carta para Maialen
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="input-field"
                      style={{ minHeight: '400px', fontSize: '1.1rem', lineHeight: '1.9', resize: 'vertical' }}
                      placeholder="Escribe aquí tu carta... Puedes tomarte el tiempo que necesites."
                      autoFocus
                    />
                    <div className="mt-6 flex gap-4 flex-col sm:flex-row">
                      <button
                        onClick={handleCancel}
                        className="btn-primary bg-gray-200 text-gray-800 hover:bg-gray-300 flex-1 py-3"
                        style={{ backgroundColor: 'rgba(255,255,255,0.8)', color: 'var(--text-color)' }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving || text.trim() === ''}
                        className="btn-primary flex-1 py-3 text-lg"
                      >
                        {saving ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <><FaSave /> Guardar</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {saved && (
                  <div className="mt-4 text-center text-green-600 font-bold animate-fade-in">
                    ✓ Carta guardada ✨
                  </div>
                )}
              </>
            )}

            {/* MAIALEN VIEW: Read only */}
            {!isJaime && (
              <>
                {savedText === '' ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-6">💌</div>
                    <p className="text-xl font-semibold opacity-70">
                      Jaime aún está escribiendo algo para ti...
                    </p>
                    <p className="text-sm opacity-50 mt-2">Vuelve pronto 🌸</p>
                  </div>
                ) : (
                  <div>
                    {/* Decorative header for Maialen */}
                    <div className="text-center mb-8 pb-6 border-b border-[var(--border-color)]">
                      <span className="text-4xl">💌</span>
                      <p className="text-sm font-bold uppercase tracking-widest opacity-50 mt-2">de Jaime, con todo el amor</p>
                    </div>
                    <p
                      className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium text-[var(--text-color)] opacity-90"
                      style={{ fontFamily: 'Nunito, sans-serif', lineHeight: '2.1' }}
                    >
                      {savedText}
                    </p>
                    <div className="mt-10 text-center opacity-40 text-2xl select-none">
                      ♡ ♡ ♡
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnniversaryPage;
