/**
 * Sound Effects Manager
 * Micro-interacciones auditivas para reforzar acciones del usuario
 * 
 * Uso:
 * import { playSuccessSound } from '@/features/shared/utils/sound-effects';
 * playSuccessSound();
 */

// Nota: Los sonidos están deshabilitados por defecto.
// Para habilitarlos, descarga archivos de audio y actualiza las rutas.

export const playSuccessSound = () => {
  // Descomenta para habilitar sonido de éxito
  /*
  const audio = new Audio('/sounds/success.mp3');
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Audio play prevented:', e));
  */
};

export const playClickSound = () => {
  // Descomenta para habilitar sonido de click
  /*
  const audio = new Audio('/sounds/click.mp3');
  audio.volume = 0.2;
  audio.play().catch(e => console.log('Audio play prevented:', e));
  */
};

export const playNotificationSound = () => {
  // Descomenta para habilitar sonido de notificación
  /*
  const audio = new Audio('/sounds/notification.mp3');
  audio.volume = 0.25;
  audio.play().catch(e => console.log('Audio play prevented:', e));
  */
};

// Vibración háptica para dispositivos móviles (funciona en navegadores modernos)
export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    };
    navigator.vibrate(patterns[type]);
  }
};
