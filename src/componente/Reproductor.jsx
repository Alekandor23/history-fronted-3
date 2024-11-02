import { useState, useEffect, useRef } from 'react';

const Reproductor = ({ onClose, paragraphs, setCurrentParagraphIndex, currentParagraphIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const sintesis = window.speechSynthesis;
  const remainingTextRef = useRef('');
  const currentCharIndexRef = useRef(0);

  useEffect(() => {
    if (!paragraphs || paragraphs.length === 0 || !('speechSynthesis' in window)) {
      console.error("No hay párrafos o síntesis de voz no soportada.");
      return;
    }

    const startReadingFromParagraph = (index) => {
      if (index >= paragraphs.length) return;

      const selectedText = paragraphs[index];
      remainingTextRef.current = selectedText;
      currentCharIndexRef.current = 0; // Reiniciar el índice al leer un nuevo párrafo

      const newUtterance = new SpeechSynthesisUtterance(selectedText);
      newUtterance.lang = 'es-MX';
      newUtterance.volume = 1;
      newUtterance.rate = 1;
      newUtterance.pitch = 1;

      newUtterance.onboundary = (event) => {
        if (event.charIndex > currentCharIndexRef.current) {
          currentCharIndexRef.current = event.charIndex; // Actualiza el índice leído
        }
      };

      newUtterance.onend = () => {
        const nextIndex = index + 1;
        if (nextIndex < paragraphs.length) {
          setCurrentParagraphIndex(nextIndex);
          startReadingFromParagraph(nextIndex);
        } else {
          setIsPlaying(false);
        }
      };

      setUtterance(newUtterance);
      sintesis.cancel();
      sintesis.speak(newUtterance);
      setIsPlaying(true);
    };

    startReadingFromParagraph(currentParagraphIndex);

    return () => {
      sintesis.cancel();
    };
  }, [paragraphs, currentParagraphIndex, setCurrentParagraphIndex]);

  const togglePlay = () => {
    if (!utterance) return;

    if (isPlaying) {
      sintesis.pause();
      setIsPlaying(false);
    } else {
      sintesis.resume();
      setIsPlaying(true);
    }
  };

  const toggleOnClose = () => {
    sintesis.cancel();
    onClose();
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);

    if (utterance) {
      sintesis.cancel(); // Cancelar la lectura actual

      // Obtener el texto restante a partir del índice de caracteres actual
      const remainingText = remainingTextRef.current.slice(currentCharIndexRef.current);
      
      // Crear una nueva utterance con el texto restante
      const newUtterance = new SpeechSynthesisUtterance(remainingText);
      newUtterance.lang = 'es-MX';
      newUtterance.volume = newVolume; // Aplicar nuevo volumen
      newUtterance.rate = 1;
      newUtterance.pitch = 1;

      // Agregar un manejador para el evento onboundary
      newUtterance.onboundary = (event) => {
        if (event.charIndex > currentCharIndexRef.current) {
          currentCharIndexRef.current = event.charIndex; // Actualizar el índice de caracteres leídos
        }
      };

      // Establecer el evento onend para manejar la transición a la siguiente lectura
      newUtterance.onend = () => {
        const nextIndex = currentParagraphIndex + 1;
        if (nextIndex < paragraphs.length) {
          setCurrentParagraphIndex(nextIndex);
          startReadingFromParagraph(nextIndex); // Continuar con el siguiente párrafo
        } else {
          setIsPlaying(false);
        }
      };

      sintesis.speak(newUtterance); // Reanudar con la nueva utterance
      setUtterance(newUtterance);
      setIsPlaying(true); // Actualizar estado de reproducción
    }
  };

  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <div className="player-container">
      <div className="player-header">
        {/* <i className="bi bi-x-square" onClick={toggleOnClose}></i> */}
      </div>
      <div className="player-controls">
        <i className="bi bi-rewind" onClick={() => setCurrentParagraphIndex(Math.max(currentParagraphIndex - 1, 0))}></i>
        {isPlaying ? (
          <i className="bi bi-pause" onClick={togglePlay}></i>
        ) : (
          <i className="bi bi-play-circle" onClick={togglePlay}></i>
        )}
        <i className="bi bi-fast-forward" onClick={() => setCurrentParagraphIndex(Math.min(currentParagraphIndex + 1, paragraphs.length - 1))}></i>
      </div>
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={handleVolumeChange}
          style={{ width: '100%' }} // Full width
        />
      </div>
      <style jsx>{`
        .player-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .player-controls {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Reproductor;
