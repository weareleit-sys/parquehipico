'use client';

import React from 'react';
import { FaWhatsapp, FaSearch, FaExternalLinkAlt, FaMagic, FaEye, FaInstagram, FaFacebook } from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa';
import type { Lead } from './hooks/useLeads';
import {
  getEstadoColor,
  getEstadoBadge,
  getCategoryEmoji,
  getRelativeTime,
} from './components/LeadRow';
import { sectoresAraucania } from './data/sectores';

interface LeadCardProps {
  lead: Lead;
  isNew: boolean;
  wasContacted: boolean;
  findingContact: boolean;
  whatsappLink: string;
  onOpenOutreach: () => void;
  onOpenGuion: () => void;
  onFindContact: () => void;
  onWhatsAppClick: () => void;
}

const getSectorLabel = (s: string) => sectoresAraucania[s]?.label || s || '—';

export default function LeadCard({
  lead, isNew, wasContacted, findingContact,
  whatsappLink, onOpenOutreach, onOpenGuion, onFindContact, onWhatsAppClick,
}: LeadCardProps) {
  const lastTime = getRelativeTime(lead._lastOutreach?.fecha_contacto || null);
  const lastResult = lead._lastOutreach?.resultado;

  const lastContactLabel = (() => {
    if (!lastTime) return null;
    if (lastTime === 'ahora') return 'Contactado hoy';
    if (lastTime.startsWith('hace')) return `Contactado ${lastTime}`;
    return `Contactado ${lastTime}`;
  })();

  return (
    <div className={`bg-slate-900 rounded-2xl border border-slate-800 border-l-2 ${getEstadoColor(lead.estado_lead)} p-5 flex flex-col gap-4 hover:bg-slate-800/60 transition-all`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-base leading-tight truncate">{lead.empresa}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {getCategoryEmoji(lead.categoria)} {lead.categoria} · {lead.ubicacion?.split(',')[0] || '—'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getEstadoBadge(lead.estado_lead)}`}>
            {lead.estado_lead.replace('_', ' ')}
          </span>
          {isNew && !wasContacted && (
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">Nuevo</span>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {lead.telefono && (
          <p className={`text-sm font-mono font-semibold ${lead.web_status === 'fijo' ? 'text-amber-400' : 'text-slate-300'}`}>
            {lead.web_status === 'fijo' ? '📞 ' : '📱 '}{lead.telefono}
          </p>
        )}
        {lead.email && (
          <p className="text-xs text-pink-400 font-mono truncate">{lead.email}</p>
        )}
        {!lead.telefono && !lead.email && (
          <p className="text-xs text-slate-600 italic">Sin datos de contacto</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {lead.website && (
          <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 text-xs flex items-center gap-1 font-bold">
            web <FaExternalLinkAlt className="text-[9px]" />
          </a>
        )}
        {lead.instagram && (
          <a href={`https://instagram.com/${lead.instagram.replace('@','').replace('instagram.com/','')}`} target="_blank" rel="noopener noreferrer"
            className="text-slate-500 hover:text-pink-400 transition-colors"><FaInstagram /></a>
        )}
        {lead.facebook && (
          <a href={lead.facebook.startsWith('http') ? lead.facebook : `https://facebook.com/${lead.facebook}`} target="_blank" rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-400 transition-colors"><FaFacebook /></a>
        )}
        {lead.tiktok && (
          <a href={lead.tiktok.startsWith('http') ? lead.tiktok : `https://tiktok.com/@${lead.tiktok.replace('@','')}`} target="_blank" rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-400 transition-colors"><FaTiktok /></a>
        )}
        <span className="text-xs text-slate-600 ml-auto">{getSectorLabel(lead.sector)}</span>
      </div>

      <div className="text-xs text-slate-500 border-t border-slate-800 pt-3">
        {lastContactLabel ? (
          <span title={lastResult || ''}>
            {lastResult === 'agendado' && '📅 '}
            {lastResult === 'rechazo' && '❌ '}
            {lastContactLabel}
          </span>
        ) : (
          <span className="text-slate-600">Sin contacto aún</span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {lead.telefono ? (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={onWhatsAppClick}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs shadow transition-all">
            <FaWhatsapp /> WhatsApp
          </a>
        ) : (
          <button onClick={onFindContact} disabled={findingContact}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all disabled:opacity-50">
            <FaSearch /> {findingContact ? 'Buscando...' : 'Buscar contacto'}
          </button>
        )}
        <button onClick={onOpenGuion}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all"
          title={lead.guion ? 'Ver mensaje' : 'Generar mensaje'}>
          {lead.guion ? <FaEye className="text-[10px]" /> : <FaMagic className="text-[10px]" />}
        </button>
        <button onClick={onOpenOutreach}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600 transition-all capitalize">
          {lead.estado_lead.replace('_', ' ')}
        </button>
      </div>
    </div>
  );
}
