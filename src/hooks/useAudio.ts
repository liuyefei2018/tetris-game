import { useCallback, useRef } from 'react';

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playRotate = useCallback(() => {
    playTone(400, 0.1, 'sine');
  }, [playTone]);

  const playMove = useCallback(() => {
    playTone(200, 0.05, 'sine');
  }, [playTone]);

  const playDrop = useCallback(() => {
    playTone(100, 0.1, 'square');
  }, [playTone]);

  const playClear = useCallback((lines: number) => {
    const baseFreq = 440;
    for (let i = 0; i < lines; i++) {
      setTimeout(() => {
        playTone(baseFreq + i * 110, 0.15, 'square');
      }, i * 80);
    }
  }, [playTone]);

  const playLevelUp = useCallback(() => {
    playTone(523.25, 0.15, 'square');
    setTimeout(() => playTone(659.25, 0.15, 'square'), 100);
    setTimeout(() => playTone(783.99, 0.2, 'square'), 200);
  }, [playTone]);

  const playGameOver = useCallback(() => {
    playTone(440, 0.3, 'sawtooth');
    setTimeout(() => playTone(330, 0.3, 'sawtooth'), 300);
    setTimeout(() => playTone(220, 0.5, 'sawtooth'), 600);
  }, [playTone]);

  const playHardDrop = useCallback(() => {
    playTone(150, 0.08, 'square');
  }, [playTone]);

  return {
    playRotate,
    playMove,
    playDrop,
    playHardDrop,
    playClear,
    playLevelUp,
    playGameOver
  };
}