'use client';

import styles from './RaceCard.module.css';
import { Race } from '@/lib/types/carreras';

interface RaceCardProps {
  race: Race;
}

/**
 * Componente RaceCard
 * 
 * Tarjeta individual que muestra:
 * - Nombre de la carrera
 * - Horario
 * - Estado (badge de color)
 * - Distancia
 * - Lista de caballos participantes
 * - Notas sobre premios
 * 
 * Diseño: borde amarillo, fondo blanco, sombra suave
 */
export default function RaceCard({ race }: RaceCardProps) {
  const getStatusColor = (status: Race['status']) => {
    switch (status) {
      case 'confirmada':
        return '#00AA00'; // Verde
      case 'programada':
        return '#FF9900'; // Naranja
      case 'suspendida':
        return '#FF0000'; // Rojo
      default:
        return '#999999';
    }
  };

  const getStatusLabel = (status: Race['status']) => {
    const labels: Record<Race['status'], string> = {
      confirmada: 'Confirmada',
      programada: 'Programada',
      suspendida: 'Suspendida',
    };
    return labels[status];
  };

  return (
    <div className={styles.card}>
      {/* Header con nombre y estado */}
      <div className={styles.cardHeader}>
        <h3 className={styles.raceName}>{race.name}</h3>
        <div
          className={styles.badge}
          style={{ backgroundColor: getStatusColor(race.status) }}
        >
          {getStatusLabel(race.status)}
        </div>
      </div>

      {/* Hora y distancia */}
      <div className={styles.raceMetaTop}>
        <div className={styles.timeBlock}>
          <span className={styles.icon}>🕐</span>
          <span className={styles.time}>{race.time}</span>
        </div>
        {race.distance && (
          <div className={styles.distanceBlock}>
            <span className={styles.icon}>📏</span>
            <span className={styles.distance}>{race.distance}</span>
          </div>
        )}
      </div>

      {/* Participantes */}
      <div className={styles.participantsSection}>
        <h4 className={styles.participantsTitle}>🐴 Participantes</h4>
        <ul className={styles.participantsList}>
          {race.participants.map((participant, idx) => (
            <li key={idx} className={styles.participantItem}>
              <span className={styles.horseName}>{participant.horseName}</span>
              {participant.corral && (
                <span className={styles.corral}>Corral {participant.corral}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Notas sobre premios */}
      {race.notes && (
        <div className={styles.notesSection}>
          <p className={styles.notes}>{race.notes}</p>
        </div>
      )}
    </div>
  );
}




