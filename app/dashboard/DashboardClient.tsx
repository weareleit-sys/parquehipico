'use client';

import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaSyncAlt, FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';
import OutreachModal from './OutreachModal';

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
}

const sectoresAraucania: Record<string, { label: string; ciudades: { value: string; label: string }[] }> = {
  temuco: {
    label: 'Temuco y alrededores',
    ciudades: [
      { value: 'Temuco', label: 'Temuco' },
      { value: 'Padre Las Casas', label: 'Padre Las Casas' },
      { value: 'Vilcún', label: 'Vilcún' },
      { value: 'Freire', label: 'Freire' },
      { value: 'Pitrufquén', label: 'Pitrufquén' },
      { value: 'Nueva Imperial', label: 'Nueva Imperial' },
      { value: 'Cholchol', label: 'Cholchol' },
      { value: 'Galvarino', label: 'Galvarino' },
    ]
  },
  lacustre: {
    label: 'Zona Lacustre',
    ciudades: [
      { value: 'Villarrica', label: 'Villarrica' },
      { value: 'Pucón', label: 'Pucón' },
      { value: 'Lican Ray', label: 'Lican Ray' },
      { value: 'Caburgua', label: 'Caburgua' },
      { value: 'Curarrehue', label: 'Curarrehue' },
      { value: 'Coñaripe', label: 'Coñaripe' },
    ]
  },
  sur: {
    label: 'Zona Sur',
    ciudades: [
      { value: 'Loncoche', label: 'Loncoche' },
      { value: 'Gorbea', label: 'Gorbea' },
      { value: 'Toltén', label: 'Toltén' },
      { value: 'Teodoro Schmidt', label: 'Teodoro Schmidt' },
    ]
  },
  costa: {
    label: 'Costa Araucanía',
    ciudades: [
      { value: 'Carahue', label: 'Carahue' },
      { value: 'Puerto Saavedra', label: 'Puerto Saavedra' },
    ]
  },
  norte: {
    label: 'Zona Norte (Malleco)',
    ciudades: [
      { value: 'Victoria', label: 'Victoria' },
      { value: 'Curacautín', label: 'Curacautín' },
      { value: 'Lautaro', label: 'Lautaro' },
      { value: 'Collipulli', label: 'Collipulli' },
      { value: 'Angol', label: 'Angol' },
      { value: 'Lonquimay', label: 'Lonquimay' },
    ]
  },
  lagos: {
    label: 'Zona Lagos',
    ciudades: [
      { value: 'Panguipulli', label: 'Panguipulli' },
      { value: 'Lanco', label: 'Lanco' },
      { value: 'Mariquina', label: 'Mariquina' },
    ]
  },
};

interface DashboardClientProps {
  initialLeads: Lead[];
}

export default function DashboardClient({ initialLeads }: DashboardClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeState, setActiveState] = useState('todos');
  const [activeSector, setActiveSector] = useState('todos');

  // Búsqueda Gemini
  const [searchCategory, setSearchCategory] = useState('productoras');
  const [searchLocation, setSearchLocation] = useState('Temuco');
  const [searchSector, setSearchSector] = useState('temuco');
  const [searchLimit, setSearchLimit] = useState(10);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [searchMessage, setSearchMessage] = useState('');
  const [newLeads, setNewLeads] = useState<Lead[]>([]); // leads de la última búsqueda

  // Modal de Outreach
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<Lead | null>(null);

  const fetchLeads = React.useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (activeCategory !== 'todos') queryParams.append('categoria', activeCategory);
      if (activeState !== 'todos') queryParams.append('estado', activeState);
      if (activeSector !== 'todos') queryParams.append('sector', activeSector);
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await fetch(`/api/leads/list?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  }, [activeCategory, activeState, activeSector, searchTerm]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchStatus('running');
    setSearchMessage(`Buscando ${searchCategory} en ${searchLocation}...`);

    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria: searchCategory,
          ubicacion: searchLocation,
          sector: searchSector,
          limit: searchLimit
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const found = data.leads || [];
        setNewLeads(found);
        setSearchStatus('done');
        setSearchMessage(`${found.length} leads encontrados en ${searchLocation}`);
        fetchLeads();
      } else {
        setSearchStatus('error');
        setSearchMessage(data.error || 'Error en la búsqueda');
      }
    } catch (err) {
      setSearchStatus('error');
      setSearchMessage('Error de red al buscar');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = (lead: Lead) => {
    if (!lead.telefono) return '#';
    const cleanPhone = lead.telefono.replace(/\D/g, '');
    const msg = `Hola, soy Alberto del Parque Hípico La Montaña. Tenemos 3 hectáreas planas con capacidad para 5.000+ personas y luz trifásica. ¿Tienen algún evento que necesite locación en la Araucanía?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'productoras': return '🎪';
      case 'corporativo': return '🏢';
      case 'matrimonios': return '💒';
      case 'municipal': return '🏛️';
      case 'cumpleanos': return '🎂';
      default: return '📍';
    }
  };

  const getSectorLabel = (sectorKey: string) => {
    return sectoresAraucania[sectorKey]?.label || sectorKey || '—';
  };

  const getSocialLinks = (lead: Lead) => {
    const links: { icon: React.ReactNode; url: string; color: string }[] = [];
    if (lead.instagram) links.push({ icon: <FaInstagram className="text-sm" />, url: `https://instagram.com/${lead.instagram.replace('@','').replace('instagram.com/','')}`, color: 'hover:text-pink-400' });
    if (lead.facebook) links.push({ icon: <FaFacebook className="text-sm" />, url: lead.facebook.startsWith('http') ? lead.facebook : `https://facebook.com/${lead.facebook}`, color: 'hover:text-blue-400' });
    if (lead.tiktok) links.push({ icon: <FaTiktok className="text-sm" />, url: lead.tiktok.startsWith('http') ? lead.tiktok : `https://tiktok.com/@${lead.tiktok.replace('@','')}`, color: 'hover:text-cyan-400' });
    return links;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-slate-800 pb-6">
        <div>
          <span className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">Parque Hípico La Montaña</span>
          <h1 className="text-4xl font-extrabold text-white mt-1 tracking-tight">Panel de Leads & Outreach</h1>
          <p className="text-slate-400 text-sm mt-1">Busca empresas en la Araucanía, por sector y categoría. Contacta por WhatsApp, Instagram, Facebook o TikTok.</p>
        </div>
        <button onClick={fetchLeads} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all">
          <FaSyncAlt className={loading ? 'animate-spin' : ''} />
          Actualizar Vista
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* PANEL LATERAL */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl p-6 border border-slate-800 h-fit space-y-6">
          <div className="flex items-center gap-3">
            <FaSearch className="text-amber-500 text-xl" />
            <h3 className="text-lg font-bold text-white">Buscar Leads</h3>
          </div>

          <form onSubmit={handleStartSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Categoría</label>
              <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors text-sm">
                <option value="productoras">🎪 Productoras de Eventos</option>
                <option value="corporativo">🏢 Corporativo / Empresas</option>
                <option value="matrimonios">💒 Wedding Planners / Bodas</option>
                <option value="cumpleanos">🎂 Cumpleaños / Celebraciones</option>
                <option value="municipal">🏛️ Municipalidades / Ferias</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Sector</label>
              <select value={searchSector} onChange={(e) => {
                setSearchSector(e.target.value);
                const ciudades = sectoresAraucania[e.target.value]?.ciudades;
                if (ciudades && ciudades.length > 0) setSearchLocation(ciudades[0].value);
              }} className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors text-sm">
                {Object.entries(sectoresAraucania).map(([key, sec]) => (
                  <option key={key} value={key}>{sec.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ciudad</label>
              <select value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors text-sm">
                {(sectoresAraucania[searchSector]?.ciudades || []).map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Cantidad</label>
              <input type="number" min={1} max={20} value={searchLimit}
                onChange={(e) => setSearchLimit(parseInt(e.target.value) || 5)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors text-sm" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50">
              <FaSearch />
              {loading ? 'Buscando...' : 'Buscar Leads'}
            </button>
          </form>

          {/* Estado de búsqueda */}
          {searchStatus && (
            <div className={`rounded-xl p-4 border space-y-2 ${searchStatus === 'error' ? 'bg-red-950/30 border-red-900' : searchStatus === 'done' ? 'bg-emerald-950/30 border-emerald-900' : 'bg-slate-950 border-slate-800'}`}>
              <p className="text-xs font-bold text-slate-300">{searchMessage}</p>
            </div>
          )}

          {/* Resultados de última búsqueda */}
          {newLeads.length > 0 && searchStatus === 'done' && (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 max-h-96 overflow-y-auto">
              <p className="text-xs font-bold text-amber-500 uppercase">Encontrados</p>
              {newLeads.map((lead, i) => (
                <div key={i} className="text-xs text-slate-300 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                  <p className="text-white font-semibold">{lead.empresa}</p>
                  <p className="text-slate-500">{lead.ubicacion} {lead.telefono ? `· ${lead.telefono}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TABLA */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* FILTROS */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="relative w-full">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por empresa o ubicación..."
                className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-xl outline-none focus:border-amber-500 transition-colors text-sm" />
              <FaSearch className="absolute left-3 top-3 text-slate-500" />
            </div>

            <div className="flex flex-wrap gap-2">
              {['todos', 'productoras', 'corporativo', 'matrimonios', 'cumpleanos', 'municipal'].map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase border ${activeCategory === cat ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'}`}>
                  {cat === 'todos' ? 'Todas' : `${getCategoryEmoji(cat)} ${cat}`}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {['todos', 'temuco', 'lacustre', 'sur', 'costa', 'norte', 'lagos'].map((sec) => (
                <button key={sec} onClick={() => setActiveSector(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase border ${activeSector === sec ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'}`}>
                  {sec === 'todos' ? 'Todos los Sectores' : sectoresAraucania[sec]?.label || sec}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {['todos', 'nuevo', 'en_proceso', 'contactado', 'agendado', 'descartado'].map((st) => (
                <button key={st} onClick={() => setActiveState(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase border ${activeState === st ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'}`}>
                  {st === 'todos' ? 'Todos los Estados' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* TABLA */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Empresa</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Sector</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Ciudad</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Redes</th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Contacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No hay leads. Usa el panel lateral para buscar empresas en la Araucanía.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                      const isNew = newLeads.some(nl => nl.empresa === lead.empresa);
                      const socials = getSocialLinks(lead);
                      return (
                        <tr key={lead.id} className={`${isNew ? 'bg-amber-500/5 border-l-2 border-l-amber-500' : ''} hover:bg-slate-800/30 transition-all`}>
                          {/* Empresa */}
                          <td className="px-4 py-4">
                            <div>
                              <span className="text-white font-semibold text-sm block">{lead.empresa}</span>
                              <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                {lead.telefono && <span className="font-mono text-slate-400">{lead.telefono}</span>}
                                {lead.website && (
                                  <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer"
                                    className="text-amber-500 hover:text-amber-400 flex items-center gap-1">
                                    web <FaExternalLinkAlt className="text-[9px]" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>
                          {/* Sector */}
                          <td className="px-4 py-4 text-xs text-slate-400">
                            {getSectorLabel(lead.sector)}
                          </td>
                          {/* Categoría */}
                          <td className="px-4 py-4 text-sm text-slate-300">
                            <span className="capitalize">{getCategoryEmoji(lead.categoria)} {lead.categoria}</span>
                          </td>
                          {/* Ciudad */}
                          <td className="px-4 py-4 text-sm text-slate-400">{lead.ubicacion || '—'}</td>
                          {/* Redes Sociales */}
                          <td className="px-4 py-4 text-center">
                            <div className="flex justify-center gap-3">
                              {socials.length === 0 ? (
                                <span className="text-xs text-slate-600">—</span>
                              ) : (
                                socials.map((s, i) => (
                                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                                    className={`text-slate-500 ${s.color} transition-colors`} title={s.url}>
                                    {s.icon}
                                  </a>
                                ))
                              )}
                            </div>
                          </td>
                          {/* Estado */}
                          <td className="px-4 py-4 text-center">
                            <button onClick={() => setSelectedLeadForOutreach(lead)}
                              className="bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize">
                              {lead.estado_lead.replace('_', ' ')}
                            </button>
                          </td>
                          {/* WhatsApp */}
                          <td className="px-4 py-4 text-right">
                            {lead.telefono ? (
                              <a href={getWhatsAppLink(lead)} target="_blank" rel="noopener noreferrer"
                                onClick={() => {
                                  fetch('/api/outreach/log', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ lead_id: lead.id, resultado: 'contactado', nuevo_estado_lead: 'contactado' })
                                  }).then(() => fetchLeads());
                                }}
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-lg transition-all">
                                <FaWhatsapp className="text-sm" /> WhatsApp
                              </a>
                            ) : (
                              <span className="text-xs text-slate-600">Sin teléfono</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {selectedLeadForOutreach && (
        <OutreachModal lead={selectedLeadForOutreach} isOpen={true}
          onClose={() => setSelectedLeadForOutreach(null)} onSaved={fetchLeads} />
      )}
    </div>
  );
}
