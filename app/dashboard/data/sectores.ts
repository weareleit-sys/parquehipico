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
};

export const whatsappTemplates: Record<string, string> = {
  productoras: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Somos el recinto outdoor más grande del sur de Chile: 3 hectáreas planas, 5.000+ personas, luz trifásica T1. Vi que {empresa} produce eventos en {ciudad}. Si tus clientes necesitan espacio masivo que ningún salón techado puede dar, acá somos la opción. ¿Conversamos?',
  corporativo: 'Hola, soy Alberto del Parque Hípico La Montaña. Vi que {empresa} está en {ciudad}. Hacemos team building, cenas de fin de año y convenciones al aire libre a una escala que ningún hotel de la zona ofrece: 3 hectáreas, 400+ estacionamientos, libertad total de montaje. ¿Les tinca hacer algo distinto este año?',
  matrimonios: 'Hola, soy Alberto del Parque Hípico La Montaña. Vi el trabajo de {empresa} en {ciudad}. Para matrimonios sin límites de espacio: 3 hectáreas planas donde entra cualquier montaje que la novia imagine. Sin vecinos que reclamen por la música, con estacionamiento para todos. ¿Quieren venir a ver el lugar?',
  cumpleanos: 'Hola, soy Alberto del Parque Hípico La Montaña en Villarrica. Vi que {empresa} organiza celebraciones en {ciudad}. Para cumpleaños y fiestas donde el espacio no es problema: inflables gigantes, food trucks, juegos infantiles, todo cabe en 3 hectáreas. ¿Te gustaría conocer el parque?',
  municipal: 'Hola, soy Alberto del Parque Hípico La Montaña. Vi el trabajo de {empresa} en {ciudad}. Para ferias costumbristas, eventos masivos y encuentros que necesitan espacio real: 3 hectáreas planas, cancha de carreras certificada, 5.000+ personas. Infraestructura lista. ¿Conversamos?',
};
