import { useState, useEffect } from 'react';

// Este hook recebe um valor e um tempo de atraso (delay)
// Ele só retorna o valor mais recente após o tempo de atraso ter passado sem novas alterações
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor debounced depois do delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar (ex: usuário continua movendo o slider)
    // Isso reinicia o processo de "espera"
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda novamente apenas se o valor ou o delay mudar

  return debouncedValue;
}