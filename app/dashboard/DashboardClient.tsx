'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaWhatsapp, FaSyncAlt, FaSearch, FaExternalLinkAlt, FaSort, FaSortUp, FaSortDown, FaMagic, FaEye } from 'react-icons/fa';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';
import OutreachModal from './OutreachModal';
import GuionModal from './GuionModal';

interface Lead {
  id: string;
  empresa: string;
  categoria: string;
  categorias: string[];
  estado_lead: string;
  telefono: string;
  website: string;
  email: string;
  ubicacion: string;
  sector: string;
  capacidad_estimada: number;
  web_status: string;
  score: number;
  redes: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  guion: string;
  raw_data: string;
  created_at: string;
  _lastOutreach: { resultado: string; fecha_contacto: string } | null;
}

const sectoresAraucania: Record<string, { label: string; ciudades: { value: string; label: string }[] }> = {
  temuco: { label: 'Temuco y alrededores', ciudades: [
    { value: 'Temuco', label: 'Temuco' }, { value: 'Padre Las Casas', label: 'Padre Las Casas' },
    { value: 'Vilcún', label: 'Vilcún' }, { value: 'Freire', label: 'Freire' },
    { value: 'Pitrufquén', label: 'Pitrufquén' }, { value: 'Nueva Imperial', label: 'Nueva Imperial' },
    { value: 'Cholchol', label: 'Cholchol' }, { value: 'Galvarino', label: 'Galvarino' },
  ]},
  lacustre: { label: 'Zona Lacustre', ciudades: [
    { value: 'Villarrica', label: 'Villarrica' }, { value: 'Pucón', label: 'Pucón' },
    { value: 'Lican Ray', label: 'Lican Ray' }, { value: 'Caburgua', label: 'Caburgua' },
    { value: 'Curarrehue', label: 'Curarrehue' }, { value: 'Coñaripe', label: 'Coñaripe' },
  ]},
  sur: { label: 'Zona Sur', ciudades: [
    { value: 'Loncoche', label: 'Loncoche' }, { value: 'Gorbea', label: 'Gorbea' },
    { value: 'Toltén', label: 'Toltén' }, { value: 'Teodoro Schmidt', label: 'Teodoro Schmidt' },
  ]},
  costa: { label: 'Costa Araucanía', ciudades: [
    { value: 'Carahue', label: 'Carahue' }, { value: 'Puerto Saavedra', label: 'Puerto Saavedra' },
  ]},
  norte: { label: 'Zona Norte (Malleco)', ciudades: [
    { value: 'Victoria', label: 'Victoria' }, { value: 'Curacautín', label: 'Curacautín' },
    { value: 'Lautaro', label: 'Lautaro' }, { value: 'Collipulli', label: 'Collipulli' },
    { value: 'Angol', label: 'Angol' }, { value: 'Lonquimay', label: 'Lonquimay' },
  ]},
  lagos: { label: 'Zona Lagos', ciudades: [
    { value: 'Panguipulli', label: 'Panguipulli' }, { value: 'Lanco', label: 'Lanco' },
    { value: 'Mariquina', label: 'Mariquina' },
  ]},
};

// Templates WhatsApp con propuesta de valor real por categoría
const whatsappTemplates: Record<string, string> = {
  productoras: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Somos el recinto outdoor más grande del sur de Chile: 3 hectáreas planas, 5.000+ personas, luz trifásica T1. Vi que {empresa} produce eventos en {ciudad}. Si tus clientes necesitan espacio masivo que ningún salón techado puede dar, acá somos la opción. ¿Conversamos?',
  corporativo: 'Hola, soy Alberto del Parque Hípico La Montaña. Vi que {empresa} está en {ciudad}. Hacemos team building, cenas de fin de año y convenciones al aire libre a una escala que ningún hotel de la zona ofrece: 3 hectáreas, 400+ estacionamientos, libertad total de montaje. ¿Les tinca hacer algo distinto este año?',
  matrimonios: 'Hola, soy Alberto del Parque Hípico La Montaña. Vi el trabajo de {empresa} en {ciudad}. Para matrimonios sin límites de espacio: 3 hectáreas planas donde entra cualquier montaje que la novia imagine. Sin vecinos que reclamen por la música, con estacionamiento para todos. ¿Quieren venir a ver el lugar?',
  cumpleanos: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi que {empresa} organiza celebraciones en {ciudad}. Para cumpleaños y fiestas donde el espacio no es problema: inflables gigantes, food trucks, juegos infantiles, todo cabe en 3 hectáreas. ¿Te gustaría conocer el parque?',
  municipal: 'Hola, soy Alberto del Parque Hípico La Montaña. Vi el trabajo de {empresa} en {ciudad}. Para ferias costumbristas, eventos masivos y encuentros que necesitan espacio real: 3 hectáreas planas, cancha de carreras certificada, 5.000+ personas. Infraestructura lista. ¿Conversamos?',
};

// Mensajes rotativos para la barra de progreso
const searchPhases = [
  'Consultando Google Maps...',
  'Rastreando páginas amarillas...',
  'Verificando teléfonos...',
  'Buscando redes sociales...',
  'Analizando resultados...',
  'Guardando en base de datos...',
];

type SortField = 'empresa' | 'categoria' | 'ubicacion' | 'created_at' | 'estado_lead';
type SortDir = 'asc' | 'desc';

interface DashboardClientProps { initialLeads: Lead[]; }

export default function DashboardClient({ initialLeads }: DashboardClientProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  // Helper para todas las llamadas API
  const apiFetch = (url: string, options?: RequestInit) => {
    const separator = url.includes('?') ? '&' : '?';
    return fetch(`${url}${token ? `${separator}token=${token}` : ''}`, options);
  };

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeState, setActiveState] = useState('pendientes');
  const [activeSector, setActiveSector] = useState('todos');

  const [searchCategory, setSearchCategory] = useState('productoras');
  const [searchLocation, setSearchLocation] = useState('Temuco');
  const [searchSector, setSearchSector] = useState('temuco');
  const [searchLimit, setSearchLimit] = useState(10);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [searchStats, setSearchStats] = useState<any>(null);
  const [searchPhaseIdx, setSearchPhaseIdx] = useState(0);
  const [newLeads, setNewLeads] = useState<Lead[]>([]);
  const phaseInterval = useRef<NodeJS.Timeout | null>(null);

  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<Lead | null>(null);
  const [selectedLeadForGuion, setSelectedLeadForGuion] = useState<Lead | null>(null);
  const [findingContactId, setFindingContactId] = useState<string | null>(null);

  // Ordenamiento
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Rotar mensajes durante búsqueda
  useEffect(() => {
    if (searchStatus === 'running') {
      phaseInterval.current = setInterval(() => {
        setSearchPhaseIdx(prev => (prev + 1) % searchPhases.length);
      }, 3000);
    } else {
      if (phaseInterval.current) clearInterval(phaseInterval.current);
    }
    return () => { if (phaseInterval.current) clearInterval(phaseInterval.current); };
  }, [searchStatus]);

  const handleFindContact = async (leadId: string) => {
    setFindingContactId(leadId);
    try {
      const res = await apiFetch('/api/leads/find-contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId })
      });
      if ((await res.json()).success) fetchLeads();
    } catch (err) { console.error(err); }
    finally { setFindingContactId(null); }
  };

  const fetchLeads = React.useCallback(async () => {
    try {
      const q = new URLSearchParams();
      if (activeCategory !== 'todos') q.append('categoria', activeCategory);
      if (activeState !== 'todos' && activeState !== 'pendientes') q.append('estado', activeState);
      if (activeState === 'pendientes') { q.append('estado', 'nuevo'); /* ampliar después */ }
      if (activeSector !== 'todos') q.append('sector', activeSector);
      if (searchTerm) q.append('search', searchTerm);
      q.append('page', page.toString());
      q.append('limit', '25');
      const res = await apiFetch(`/api/leads/list?${q.toString()}`);
      if (res.ok) { const d = await res.json(); setLeads(d.leads || []); setTotalLeads(d.total || 0); setTotalPages(d.totalPages || 0); }
    } catch (err) { console.error(err); }
  }, [activeCategory, activeState, activeSector, searchTerm, page]);

  useEffect(() => {
    setPage(1);
    fetchLeads();
  }, [activeCategory, activeState, activeSector, searchTerm]);

  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchStatus('running');
    setSearchPhaseIdx(0);
    setSearchMessage(`Buscando ${searchCategory} en ${searchLocation}...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);

    try {
      const res = await apiFetch('/api/leads/search', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoria: searchCategory, ubicacion: searchLocation, sector: searchSector, limit: searchLimit }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (res.ok && data.success) {
        setNewLeads(data.leads || []);
        setSearchStats(data.stats || null);
        setSearchStatus('done');
        setSearchMessage(`${data.total} empresas encontradas en ${searchLocation}`);
        fetchLeads();
      } else {
        setSearchStatus('error');
        setSearchMessage(data.error || 'Error en la búsqueda');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setSearchStatus('running');
        setSearchMessage('Búsqueda sigue en servidor. Recargá en unos segundos para ver resultados.');
        setLoading(false);
        return;
      }
      setSearchStatus('error');
      setSearchMessage('Error de red al buscar');
    } finally { setLoading(false); }
  };

  const getWhatsAppLink = (lead: Lead, customGuion?: string) => {
    if (!lead.telefono) return '#';
    // Si hay múltiples teléfonos separados por coma, elegir el WhatsApp (prefiere +56 9)
    const phones = lead.telefono.split(/[,;\/]\s*/);
    let bestPhone = phones[0];
    for (const p of phones) {
      const d = p.replace(/\D/g, '');
      if (d.startsWith('569') || (d.startsWith('9') && d.length <= 9)) {
        bestPhone = p; break;
      }
    }
    let digits = bestPhone.replace(/\D/g, '');
    if (digits.startsWith('569')) { /* ok */ }
    else if (digits.startsWith('9') && digits.length <= 9) { digits = '56' + digits; }
    else if (digits.length === 8) { digits = '569' + digits; }
    else if (!digits.startsWith('56')) { digits = '56' + digits; }
    const template = whatsappTemplates[lead.categoria] || whatsappTemplates.productoras;
    const ciudad = lead.ubicacion?.split(',')[0]?.trim() || 'la Araucanía';
    const defaultMsg = template.replace('{empresa}', lead.empresa).replace('{ciudad}', ciudad);
    const msg = customGuion || lead.guion || defaultMsg;
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) { case 'productoras': return '🎪'; case 'corporativo': return '🏢'; case 'matrimonios': return '💒'; case 'municipal': return '🏛️'; case 'cumpleanos': return '🎂'; default: return '📍'; }
  };

  const getSectorLabel = (s: string) => sectoresAraucania[s]?.label || s || '—';

  const getSocialLinks = (lead: Lead) => {
    const links: { icon: React.ReactNode; url: string; color: string }[] = [];
    if (lead.instagram) links.push({ icon: <FaInstagram className="text-sm" />, url: `https://instagram.com/${lead.instagram.replace('@','').replace('instagram.com/','')}`, color: 'hover:text-pink-400' });
    if (lead.facebook) links.push({ icon: <FaFacebook className="text-sm" />, url: lead.facebook.startsWith('http') ? lead.facebook : `https://facebook.com/${lead.facebook}`, color: 'hover:text-blue-400' });
    if (lead.tiktok) links.push({ icon: <FaTiktok className="text-sm" />, url: lead.tiktok.startsWith('http') ? lead.tiktok : `https://tiktok.com/@${lead.tiktok.replace('@','')}`, color: 'hover:text-cyan-400' });
    return links;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'nuevo': return 'border-l-blue-500';
      case 'en_proceso': return 'border-l-amber-500';
      case 'contactado': return 'border-l-amber-500';
      case 'respondio': return 'border-l-emerald-500';
      case 'agendado': return 'border-l-purple-500';
      case 'rechazo': return 'border-l-red-500';
      case 'descartado': return 'border-l-slate-600';
      default: return 'border-l-transparent';
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'nuevo': return 'bg-blue-500/20 text-blue-400';
      case 'en_proceso': return 'bg-amber-500/20 text-amber-400';
      case 'contactado': return 'bg-amber-500/20 text-amber-400';
      case 'respondio': return 'bg-emerald-500/20 text-emerald-400';
      case 'agendado': return 'bg-purple-500/20 text-purple-400';
      case 'rechazo': return 'bg-red-500/20 text-red-400';
      case 'descartado': return 'bg-slate-700/50 text-slate-400';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  const getRelativeTime = (dateStr: string | null) => {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `hace ${mins} min`;
    if (hours < 24) return `hace ${hours}h`;
    if (days < 30) return `hace ${days}d`;
    return new Date(dateStr).toLocaleDateString('es-CL');
  };

  const getOutreachResultLabel = (r: string) => {
    switch (r) { case 'contactado': return '📱 Contactado'; case 'respondio': return '💬 Respondió'; case 'agendado': return '📅 Agendado'; case 'rechazo': return '❌ Rechazo'; default: return '⏳ Pendiente'; }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="text-slate-600 ml-1" />;
    return sortDir === 'asc' ? <FaSortUp className="text-amber-500 ml-1" /> : <FaSortDown className="text-amber-500 ml-1" />;
  };

  // Ordenar leads
  const sortedLeads = [...leads].sort((a, b) => {
    let va: any = a[sortField] || '';
    let vb: any = b[sortField] || '';
    if (sortField === 'estado_lead') {
      const order = ['nuevo','en_proceso','contactado','agendado','descartado'];
      va = order.indexOf(va); vb = order.indexOf(vb);
    }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Determinar si un lead está en la última búsqueda y si ya fue contactado
  const getNewLeadStatus = (lead: Lead) => {
    const isNew = newLeads.some(nl => nl.empresa === lead.empresa);
    const wasContacted = !!lead._lastOutreach;
    return { isNew, wasContacted };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">Parque Hípico La Montaña</span>
          <h1 className="text-4xl font-extrabold text-white mt-1 tracking-tight">Contactos</h1>
          <p className="text-slate-400 text-sm mt-1">Busca empresas en la Araucanía, por sector y categoría. Contacta por WhatsApp, Instagram, Facebook o TikTok.</p>
        </div>
        <button onClick={fetchLeads} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all">
          <FaSyncAlt className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* SIDEBAR */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 border border-slate-800 h-fit space-y-6">
          <div className="flex items-center gap-3">
            <FaSearch className="text-amber-500 text-xl" />            <h3 className="text-lg font-bold text-white">Buscar empresas</h3>
          </div>
          <form onSubmit={handleStartSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Categoría</label>
              <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm">
                <option value="productoras">🎪 Productoras de Eventos</option>
                <option value="corporativo">🏢 Corporativo / Empresas</option>
                <option value="matrimonios">💒 Wedding Planners / Bodas</option>
                <option value="cumpleanos">🎂 Cumpleaños / Celebraciones</option>
                <option value="municipal">🏛️ Municipalidades / Ferias</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sector</label>
              <select value={searchSector} onChange={e => { setSearchSector(e.target.value); const c = sectoresAraucania[e.target.value]?.ciudades; if (c?.length) setSearchLocation(c[0].value); }} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm">
                {Object.entries(sectoresAraucania).map(([k, s]) => (<option key={k} value={k}>{s.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ciudad</label>
              <select value={searchLocation} onChange={e => setSearchLocation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm">
                {(sectoresAraucania[searchSector]?.ciudades || []).map(c => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Resultados</label>
              <input type="number" min={1} max={20} value={searchLimit} onChange={e => setSearchLimit(parseInt(e.target.value) || 5)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50">
              <FaSearch />               {loading ? 'Buscando...' : 'Buscar empresas'}
            </button>
          </form>

          {/* BARRA DE PROGRESO ANIMADA */}
          {searchStatus === 'running' && (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 animate-pulse rounded-full" style={{ width: '100%', animation: 'shimmer 2s infinite' }} />
              </div>
              <p className="text-xs text-amber-400 font-medium text-center">{searchPhases[searchPhaseIdx]}</p>
              <style jsx>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
            </div>
          )}

          {searchStatus === 'done' && (
            <div className="bg-emerald-950/30 rounded-xl p-4 border border-emerald-900 space-y-2">
              <p className="text-xs font-bold text-emerald-400">{searchMessage}</p>
              {searchStats && (
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-900 rounded-lg p-2 text-center">
                    <p className="text-emerald-400 font-bold">{searchStats.withWhatsApp}</p>
                    <p className="text-slate-500">WhatsApp</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2 text-center">
                    <p className="text-amber-400 font-bold">{searchStats.withPhone - searchStats.withWhatsApp}</p>
                    <p className="text-slate-500">Fijo</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2 text-center">
                    <p className="text-blue-400 font-bold">{searchStats.withWebsite}</p>
                    <p className="text-slate-500">Con web</p>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2 text-center">
                    <p className="text-pink-400 font-bold">{searchStats.withEmail}</p>
                    <p className="text-slate-500">Con email</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {searchStatus === 'error' && (
            <div className="bg-red-950/30 rounded-xl p-4 border border-red-900">
              <p className="text-xs font-bold text-red-400">{searchMessage}</p>
            </div>
          )}

          {newLeads.length > 0 && searchStatus === 'done' && (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 max-h-80 overflow-y-auto">
              <p className="text-xs font-bold text-amber-500 uppercase">Encontrados</p>
              {newLeads.map((lead, i) => (
                <div key={i} className="text-xs border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                  <p className="text-white font-semibold">{lead.empresa}</p>
                  <p className="text-slate-500">{lead.ubicacion} {lead.telefono ? `· ${lead.telefono}` : ''}</p>
                  {lead._lastOutreach && (
                    <span className="inline-block mt-1 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">Ya contactado</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TABLA */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="relative w-full">
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar por empresa o ubicación..." className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-xl outline-none focus:border-amber-500 text-sm" />
              <FaSearch className="absolute left-3 top-3 text-slate-500" />
            </div>
            <div className="flex flex-wrap gap-2">
              {['todos','productoras','corporativo','matrimonios','cumpleanos','municipal'].map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${activeCategory===c?'bg-amber-500 text-slate-950 border-amber-500':'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'}`}>
                  {c==='todos'?'Todas':`${getCategoryEmoji(c)} ${c}`}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {['todos','temuco','lacustre','sur','costa','norte','lagos'].map(s => (
                <button key={s} onClick={() => setActiveSector(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${activeSector===s?'bg-blue-500 text-white border-blue-500':'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'}`}>
                  {s==='todos'?'Todos los Sectores':sectoresAraucania[s]?.label||s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {['pendientes', 'contactado', 'respondio', 'agendado', 'rechazo', 'todos'].map(st => (
                <button key={st} onClick={() => setActiveState(st)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${activeState===st?'bg-emerald-500 text-white border-emerald-500':'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'}`}>
                  {st==='todos'?'Todos':st==='pendientes'?'🔵 Pendientes':st.replace('_',' ')}
                </button>
              ))}
            </div>
          </div>

          {/* TABLA CON HEADERS CLICKEABLES */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('empresa')}>
                      <span className="inline-flex items-center">Empresa {getSortIcon('empresa')}</span>
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Sector</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('categoria')}>
                      <span className="inline-flex items-center">Cat {getSortIcon('categoria')}</span>
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('ubicacion')}>
                      <span className="inline-flex items-center">Ciudad {getSortIcon('ubicacion')}</span>
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Redes</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-white transition-colors" onClick={() => handleSort('estado_lead')}>
                      <span className="inline-flex items-center">Estado {getSortIcon('estado_lead')}</span>
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Último contacto</th>
                    <th className="px-4 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Contacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sortedLeads.length === 0 ? (
                    <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">                        No hay contactos. Usa el panel lateral para buscar empresas en la Araucanía.</td></tr>
                  ) : (
                    sortedLeads.map(lead => {
                      const { isNew, wasContacted } = getNewLeadStatus(lead);
                      const socials = getSocialLinks(lead);
                      const lastTime = getRelativeTime(lead._lastOutreach?.fecha_contacto || null);
                      const lastResult = lead._lastOutreach?.resultado;
                      return (
                        <tr key={lead.id} className={`border-l-2 ${getEstadoColor(lead.estado_lead)} hover:bg-slate-800/30 transition-all`}>
                          <td className="px-4 py-4">
                            <div>
                              <span className="text-white font-semibold text-sm block">
                                {lead.empresa}
                                {isNew && !wasContacted && <span className="ml-2 inline-block text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">Nuevo</span>}
                                {isNew && wasContacted && <span className="ml-2 inline-block text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">Ya contactado</span>}
                              </span>
                              <div className="flex gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                                {lead.telefono && (
                                  <span className={`font-mono ${lead.web_status === 'fijo' ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {lead.web_status === 'fijo' ? '📞 ' : ''}{lead.telefono}
                                  </span>
                                )}
                                {lead.email && <span className="text-pink-400 font-mono text-[11px]">{lead.email}</span>}
                                {lead.website && (
                                  <a href={lead.website.startsWith('http')?lead.website:`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 flex items-center gap-1">web <FaExternalLinkAlt className="text-[9px]"/></a>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-400">{getSectorLabel(lead.sector)}</td>
                          <td className="px-4 py-4 text-sm text-slate-300"><span className="capitalize">{getCategoryEmoji(lead.categoria)} {lead.categoria}</span></td>
                          <td className="px-4 py-4 text-sm text-slate-400">{lead.ubicacion || '—'}</td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex justify-center gap-3">
                              {socials.length === 0 ? <span className="text-xs text-slate-600">—</span> : socials.map((s,i) => (
                                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className={`text-slate-500 ${s.color} transition-colors`}>{s.icon}</a>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button onClick={() => setSelectedLeadForOutreach(lead)} className="bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize">{lead.estado_lead.replace('_',' ')}</button>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-400">
                            {lastTime ? (
                              <span title={lastResult ? getOutreachResultLabel(lastResult) : ''} className="cursor-help">
                                {lastResult === 'agendado' && '📅 '}
                                {lastResult === 'rechazo' && '❌ '}
                                {lastTime === 'ahora' ? 'Contactado hoy' :
                                 lastTime.startsWith('hace') ? `Contactado ${lastTime.replace('hace ', 'hace ')}` :
                                 `Contactado ${lastTime}`}
                              </span>
                            ) : <span className="text-slate-600">Sin contacto aún</span>}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <button onClick={() => setSelectedLeadForGuion(lead)}
                                  className={`text-xs font-bold flex items-center gap-1 px-2 py-1.5 rounded-lg border transition-all ${lead.guion ? 'text-purple-400 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20' : 'text-purple-400 hover:text-purple-300 bg-purple-500/10 border-purple-500/20'}`}
                                  title={lead.guion ? 'Ver guion personalizado' : 'Generar guion con IA'}>
                                  {lead.guion ? <FaEye className="text-[10px]" /> : <FaMagic className="text-[10px]" />}
                                  Mensaje
                                </button>
                              {lead.website && (
                                <a href={lead.website.startsWith('http')?lead.website:`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 text-xs font-bold flex items-center gap-1 bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-700">web <FaExternalLinkAlt className="text-[9px]"/></a>
                              )}
                              {lead.telefono ? (
                                <a href={getWhatsAppLink(lead)} target="_blank" rel="noopener noreferrer" onClick={() => { apiFetch('/api/outreach/log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lead_id:lead.id,resultado:'contactado',nuevo_estado_lead:'contactado'})}).then(()=>fetchLeads()); }} className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs shadow-lg transition-all"><FaWhatsapp className="text-xs"/> WhatsApp</a>
                              ) : (
                                <button onClick={() => handleFindContact(lead.id)} disabled={findingContactId===lead.id} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all disabled:opacity-50"><FaSearch className="text-xs"/> {findingContactId===lead.id?'Buscando...':'Buscar contacto'}</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/50">
                <span className="text-xs text-slate-500">{totalLeads} contactos · Página {page} de {totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-30 transition-all">← Anterior</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-30 transition-all">Siguiente →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedLeadForOutreach && (
        <OutreachModal lead={selectedLeadForOutreach} isOpen={true} onClose={() => setSelectedLeadForOutreach(null)} onSaved={fetchLeads} />
      )}
      {selectedLeadForGuion && (
        <GuionModal lead={selectedLeadForGuion} isOpen={true} onClose={() => setSelectedLeadForGuion(null)} onSaved={fetchLeads} getWhatsAppLink={getWhatsAppLink} token={token} />
      )}
    </div>
  );
}
