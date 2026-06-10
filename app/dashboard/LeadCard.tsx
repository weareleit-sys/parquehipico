'use client';

import React from 'react';
import { FaWhatsapp, FaSearch, FaMagic, FaExternalLinkAlt, FaEllipsisV } from 'react-icons/fa';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';

interface Lead {
  id: string; empresa: string; categoria: string; estado_lead: string;
  telefono: string; website: string; ubicacion: string; sector: string;
  instagram: string; facebook: string; tiktok: string; guion: string;
  _lastOutreach: { resultado: string; fecha_contacto: string } | null;
}

interface Props {
  lead: Lead;
  getEstadoColor: (e: string) => string;
  getEstadoBadge: (e: string) => string;
  getCategoryEmoji: (c: string) => string;
  getSectorLabel: (s: string) => string;
  getRelativeTime: (d: string | null) => string | null;
  getWhatsAppLink: (l: Lead, g?: string) => string;
  onGuion: (l: Lead) => void;
  onOutreach: (l: Lead) => void;
  onFindContact: (id: string) => void;
  onWhatsAppClick: () => void;
  findingContactId: string | null;
}

export default function LeadCard({
  lead, getEstadoColor, getEstadoBadge, getCategoryEmoji, getSectorLabel,
  getRelativeTime, getWhatsAppLink, onGuion, onOutreach, onFindContact,
  onWhatsAppClick, findingContactId
}: Props) {
  const socials: { icon: React.ReactNode; url: string; color: string }[] = [];
  if (lead.instagram) socials.push({ icon: <FaInstagram className="text-sm" />, url: `https://instagram.com/${lead.instagram.replace('@','').replace('instagram.com/','')}`, color: 'hover:text-pink-400' });
  if (lead.facebook) socials.push({ icon: <FaFacebook className="text-sm" />, url: lead.facebook.startsWith('http') ? lead.facebook : `https://facebook.com/${lead.facebook}`, color: 'hover:text-blue-400' });
  if (lead.tiktok) socials.push({ icon: <FaTiktok className="text-sm" />, url: lead.tiktok.startsWith('http') ? lead.tiktok : `https://tiktok.com/@${lead.tiktok.replace('@','')}`, color: 'hover:text-cyan-400' });

  const lastTime = getRelativeTime(lead._lastOutreach?.fecha_contacto || null);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 border-l-2 overflow-hidden shadow-lg hover:shadow-xl transition-all" style={{ borderLeftColor: lead.estado_lead === 'nuevo' ? '#3b82f6' : lead.estado_lead === 'agendado' ? '#a855f7' : lead.estado_lead === 'rechazo' ? '#ef4444' : lead.estado_lead === 'respondio' ? '#10b981' : lead.estado_lead === 'contactado' ? '#f59e0b' : '#475569' }}>
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-white leading-tight">{lead.empresa}</h3>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${getEstadoBadge(lead.estado_lead)}`}>
              {lead.estado_lead.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
            <span>{getCategoryEmoji(lead.categoria)} {lead.categoria}</span><span>·</span>
            <span>{lead.ubicacion || getSectorLabel(lead.sector)}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          {lead.telefono ? (
            <a href={getWhatsAppLink(lead)} target="_blank" rel="noopener noreferrer" onClick={onWhatsAppClick}
              className="text-lg font-bold text-emerald-400 hover:text-emerald-300 transition-colors block">{lead.telefono}</a>
          ) : <span className="text-lg text-slate-600">Sin teléfono</span>}
          {lead.website && (
            <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
              className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 break-all">{lead.website} <FaExternalLinkAlt className="text-[9px]" /></a>
          )}
        </div>
        {socials.length > 0 && (
          <div className="flex gap-3 text-lg">
            {socials.map((s, i) => (<a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className={`text-slate-500 ${s.color} transition-colors`}>{s.icon}</a>))}
          </div>
        )}
        <div className="text-xs text-slate-500">
          {lastTime ? <span>{lastTime === 'ahora' ? 'Contactado hoy' : `Contactado ${lastTime}`}</span> : <span className="text-slate-600">Sin contacto aún</span>}
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-800">
          {lead.telefono ? (
            <a href={getWhatsAppLink(lead)} target="_blank" rel="noopener noreferrer" onClick={onWhatsAppClick}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg transition-all"><FaWhatsapp /> WhatsApp</a>
          ) : (
            <button onClick={() => onFindContact(lead.id)} disabled={findingContactId === lead.id}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50"><FaSearch /> {findingContactId === lead.id ? 'Buscando...' : 'Buscar contacto'}</button>
          )}
          <button onClick={() => onGuion(lead)} className="flex items-center justify-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-bold py-3 px-3 rounded-xl text-sm border border-purple-600/30 transition-all" title="Mensaje"><FaMagic className="text-xs" /></button>
          <button onClick={() => onOutreach(lead)} className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-3 px-3 rounded-xl text-sm border border-slate-700 transition-all" title="Estado"><FaEllipsisV className="text-xs" /></button>
        </div>
      </div>
    </div>
  );
}
