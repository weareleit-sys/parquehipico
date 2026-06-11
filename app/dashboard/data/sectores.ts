import { leadCategoryDefinitions } from '@/lib/lead-categories';

export const sectoresAraucania: Record<string, { label: string; ciudades: { value: string; label: string }[] }> = {
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
  externo: { label: 'Fuera de zona / revisar', ciudades: [
    { value: 'Fuera de zona', label: 'Fuera de zona' },
  ]},
};

export const whatsappTemplates: Record<string, string> = Object.fromEntries(
  leadCategoryDefinitions.map(category => [category.value, category.template])
);
