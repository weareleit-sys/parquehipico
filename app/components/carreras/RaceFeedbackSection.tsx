'use client';

import { useState } from 'react';
import styles from './RaceFeedbackSection.module.css';

/**
 * Componente RaceFeedbackSection
 * 
 * Sistema de valoración (1-5 estrellas) y comentarios sobre las carreras.
 * Los datos se guardan en localStorage para demostrar interactividad.
 * 
 * TODO: Conectar a /api/feedback para guardar en Prisma + PostgreSQL
 * TODO: Implementar autenticación opcional para vincular feedback a usuario
 */
export default function RaceFeedbackSection() {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    // Guardar en localStorage para persistencia local
    const feedbackData = {
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    const storedFeedback = localStorage.getItem('raceFeedback');
    const feedbackList = storedFeedback ? JSON.parse(storedFeedback) : [];
    feedbackList.push(feedbackData);
    localStorage.setItem('raceFeedback', JSON.stringify(feedbackList));

    // Mostrar confirmación
    setSubmitted(true);
    setRating(0);
    setComment('');

    // Ocultarconfirmación después de 5 segundos
    setTimeout(() => setSubmitted(false), 5000);

    // TODO: Aquí enviar a backend
    // const response = await fetch('/api/feedback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(feedbackData),
    // });
    // if (response.ok) { setSubmitted(true); }
  };

  return (
    <section className={styles.feedbackSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>¿Qué te parecieron las carreras?</h2>
        <p className={styles.subtitle}>
          Tu opinión nos ayuda a mejorar cada jornada
        </p>
      </div>

      {submitted ? (
        <div className={styles.successMessage}>
          <div className={styles.successContent}>
            <span className={styles.successIcon}>✅</span>
            <h3>¡Gracias por tu opinión!</h3>
            <p>Hemos registrado tu calificación y comentario</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.feedbackForm}>
          {/* Sección de estrellas */}
          <div className={styles.ratingSection}>
            <label className={styles.ratingLabel}>
              Calificación <span className={styles.required}>*</span>
            </label>
            <div className={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starButton} ${
                    (hoveredRating || rating) >= star ? styles.active : ''
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  ⭐
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <span className={styles.ratingText}>
                {rating || hoveredRating} de 5 estrellas
              </span>
            )}
          </div>

          {/* Sección de comentario */}
          <div className={styles.commentSection}>
            <label htmlFor="comment" className={styles.commentLabel}>
              Comentario <span className={styles.optional}>(opcional)</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos qué te gustó o qué podemos mejorar..."
              className={styles.textarea}
              rows={4}
              maxLength={500}
            />
            <div className={styles.charCounter}>
              {comment.length}/500 caracteres
            </div>
          </div>

          {/* Botón submit */}
          <button type="submit" className={styles.submitButton}>
            📤 Enviar Opinión
          </button>
        </form>
      )}
    </section>
  );
}

/**
 * Futuro modelo Prisma sugerido:
 *
 * model RaceFeedback {
 *   id        Int       @id @default(autoincrement())
 *   rating    Int       @db.SmallInt // 1-5
 *   comment   String?   @db.Text
 *   userId    String?   // Opcional, si implementamos auth
 *   user      User?     @relation(fields: [userId], references: [id])
 *   createdAt DateTime  @default(now())
 *
 *   @@map("race_feedback")
 * }
 *
 * API Endpoint sugerido:
 * POST /api/feedback
 * Body: { rating: number, comment?: string, userId?: string }
 * Response: { success: boolean, message: string }
 *
 * GET /api/feedback/stats
 * Response: { averageRating: number, totalFeedback: number, distribution: Record<number, number> }
 */




