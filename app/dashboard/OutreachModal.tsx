import React, { useEffect, useState } from 'react';
import type { Lead } from './hooks/useLeads';

interface OutreachModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  token: string;
}

const resultToState: Record<string, string> = {
  pendiente: 'en_proceso',
  contactado: 'contactado',
  respondio: 'respondio',
  agendado: 'agendado',
  rechazo: 'rechazo',
};

export default function OutreachModal({ lead, isOpen, onClose, onSaved, token }: OutreachModalProps) {
  const [loading, setLoading] = useState(false);
  const [notas, setNotas] = useState('');
  const [resultado, setResultado] = useState('contactado');
  const [nuevoEstado, setNuevoEstado] = useState(
    lead.estado_lead && lead.estado_lead !== 'nuevo' ? lead.estado_lead : 'contactado'
  );

  useEffect(() => {
    setNuevoEstado(resultToState[resultado] || 'contactado');
  }, [resultado]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      if (token) headers.set('Authorization', `Bearer ${token}`);
      const response = await fetch('/api/outreach/log', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          lead_id: lead.id,
          contactado_por: 'Alberto',
          canal: 'whatsapp',
          resultado,
          notas,
          nuevo_estado_lead: nuevoEstado,
        }),
      });

      if (response.ok) {
        onSaved();
        onClose();
      } else {
        const errData = await response.json();
        alert(`Error al registrar seguimiento: ${errData.error || 'Intenta de nuevo'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Estado / seguimiento</h3>
            <p className="text-sm text-slate-400 mt-1">{lead.empresa}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Que paso con este contacto
            </label>
            <select
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 outline-none focus:border-amber-500 transition-colors"
            >
              <option value="pendiente">Queda pendiente</option>
              <option value="contactado">Mensaje enviado / contactado</option>
              <option value="respondio">Respondio / interesado</option>
              <option value="agendado">Reunion o visita agendada</option>
              <option value="rechazo">Sin interes / rechazo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Dejar contacto en seccion
            </label>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 outline-none focus:border-amber-500 transition-colors"
            >
              <option value="nuevo">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="contactado">Contactado</option>
              <option value="respondio">Interesado</option>
              <option value="agendado">Agendado</option>
              <option value="rechazo">Sin interes</option>
              <option value="descartado">Descartado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Notas / comentarios
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Ej: pidio cotizacion, llamar el viernes, no era la persona correcta..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-400 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-slate-900 bg-amber-500 rounded-lg hover:bg-amber-400 transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar estado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
