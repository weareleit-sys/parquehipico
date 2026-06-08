'use client';

import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaCopy, FaMagic, FaCheck, FaTimes } from 'react-icons/fa';

interface Lead {
  id: string;
  empresa: string;
  website: string;
  telefono: string;
  guion: string;
  raw_data: string;
}

interface GuionModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  getWhatsAppLink: (lead: Lead, guion: string) => string;
}

export default function GuionModal({ lead, isOpen, onClose, onSaved, getWhatsAppLink }: GuionModalProps) {
  const [guion, setGuion] = useState(lead.guion || '');
  const [perfil, setPerfil] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  // Extraer perfil del raw_data si existe
  useEffect(() => {
    if (lead.raw_data) {
      try {
        const raw = JSON.parse(lead.raw_data);
        if (raw.perfil_ia) setPerfil(raw.perfil_ia);
      } catch {}
    }
    setGuion(lead.guion || '');
  }, [lead]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads/generar-guion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id })
      });
      const data = await res.json();
      if (data.success) {
        setGuion(data.guion);
        setPerfil(data.perfil || '');
        setEditing(false);
        onSaved();
      } else {
        setError(data.error || 'Error al generar');
      }
    } catch {
      setError('Error de red');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(guion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = async () => {
    try {
      await fetch('/api/leads/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, guion })
      });
      setEditing(false);
      onSaved();
    } catch {
      setError('Error al guardar');
    }
  };

  if (!isOpen) return null;

  const wapLink = lead.telefono ? getWhatsAppLink(lead, guion) : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">{lead.empresa}</h3>
            {lead.website && (
              <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 hover:text-amber-400">
                {lead.website}
              </a>
            )}
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl"><FaTimes /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Perfil del negocio */}
          {perfil && (
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Qué hace esta empresa</p>
              <p className="text-sm text-slate-300 leading-relaxed">{perfil}</p>
            </div>
          )}

          {/* Guion */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Mensaje WhatsApp</p>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-xs text-slate-500 hover:text-amber-400">Editar</button>
              )}
            </div>
            {editing ? (
              <div className="space-y-3">
                <textarea
                  value={guion}
                  onChange={e => setGuion(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-sm outline-none focus:border-amber-500 resize-none"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setGuion(lead.guion); setEditing(false); }} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancelar</button>
                  <button onClick={handleSaveEdit} className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold">Guardar</button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4">
                <p className="text-sm text-emerald-100 leading-relaxed whitespace-pre-wrap">{guion}</p>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-400 bg-red-950/30 rounded-lg p-3">{error}</p>}

          {/* Acciones */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-bold py-2 px-4 rounded-xl text-xs border border-purple-600/30 transition-all disabled:opacity-50"
            >
              <FaMagic className="text-xs" />
              {loading ? 'Pensando...' : 'Regenerar'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-3 rounded-xl text-xs border border-slate-700 transition-all"
              >
                {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy className="text-xs" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>

              {lead.telefono && (
                <a
                  href={wapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-lg transition-all"
                >
                  <FaWhatsapp /> Enviar
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
