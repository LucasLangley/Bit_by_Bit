import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import styles from './styles.module.css';

// --- FUNÇÕES AUXILIARES ---
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

// --- PRESETS ---
const PRESETS = {
  gameboy: { pixelResolution: 160, palette: 'gameboy', ditheringType: 'ordered', colorMetric: 'rgb', scanlines: false, contrast: 120, saturation: 10 },
  nes: { pixelResolution: 128, palette: 'nes', ditheringType: 'none', colorMetric: 'cielab', scanlines: true, contrast: 110, saturation: 120 },
  c64: { pixelResolution: 160, palette: 'c64', ditheringType: 'floyd', colorMetric: 'rgb', scanlines: true, contrast: 100, saturation: 100 },
  clean: { pixelResolution: 256, palette: 'pico8', ditheringType: 'none', colorMetric: 'cielab', scanlines: false, contrast: 100, saturation: 100 },
};

const ImageConverter = () => {
  // Estado principal das configurações
  const [settings, setSettings] = useState({
    pixelResolution: 128, palette: 'nes', ditheringType: 'floyd', colorMetric: 'cielab',
    scanlines: true, contrast: 100, saturation: 100,
  });
  // Estados separados para UI e dados
  const [originalImage, setOriginalImage] = useState(null);
  const [convertedImage, setConvertedImage] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [customPalette, setCustomPalette] = useState(['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF']);
  const [newColor, setNewColor] = useState('#000000');

  const canvasRef = useRef(null);
  const workerRef = useRef(null);

  // Efeito para carregar/salvar configurações no localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('pixelArtConverterSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) { console.error("Falha ao carregar configurações.", e); }
  }, []);

  useEffect(() => {
    localStorage.setItem('pixelArtConverterSettings', JSON.stringify(settings));
  }, [settings]);

  // Efeito para inicializar o worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('./conversion.worker.js', import.meta.url), { type: 'module' });

    // ######### CORREÇÃO CRÍTICA ESTÁ AQUI #########
    // A lógica para receber a mensagem do worker foi restaurada.
    workerRef.current.onmessage = (event) => {
      const { status, imageData, message } = event.data;
      if (status === 'success') {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        tempCtx.putImageData(imageData, 0, 0);

        const mainCanvas = canvasRef.current;
        const mainCtx = mainCanvas.getContext('2d');
        const finalWidth = parseInt(mainCanvas.dataset.finalWidth, 10);
        const finalHeight = parseInt(mainCanvas.dataset.finalHeight, 10);
        
        mainCanvas.width = finalWidth;
        mainCanvas.height = finalHeight;
        mainCtx.imageSmoothingEnabled = false;
        mainCtx.drawImage(tempCanvas, 0, 0, finalWidth, finalHeight);

        setConvertedImage(mainCanvas.toDataURL('image/png'));
      } else {
        console.error("Erro retornado pelo Web Worker:", message);
        alert("Ocorreu um erro durante a conversão.");
      }
      setIsConverting(false); // <-- A linha que faltava para parar o "Convertendo..."
    };

    workerRef.current.onerror = (error) => {
      console.error("Erro fatal no Worker:", error);
      alert("Não foi possível iniciar o processo de conversão.");
      setIsConverting(false); // <-- E aqui também
    };

    return () => workerRef.current.terminate();
  }, []);

  const debouncedSettings = useDebounce(settings, 250);
  const debouncedCustomPalette = useDebounce(customPalette, 250);

  // Efeito principal que dispara a conversão
  useEffect(() => {
    if (!originalImage || !workerRef.current) return;
    setIsConverting(true);
    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      ctx.filter = `contrast(${debouncedSettings.contrast}%) saturate(${debouncedSettings.saturation}%)`;
      
      const smallWidth = debouncedSettings.pixelResolution;
      const smallHeight = Math.round(smallWidth * (img.height / img.width));
      canvas.dataset.finalWidth = img.width;
      canvas.dataset.finalHeight = img.height;
      canvas.width = smallWidth;
      canvas.height = smallHeight;
      ctx.drawImage(img, 0, 0, smallWidth, smallHeight);
      const imageData = ctx.getImageData(0, 0, smallWidth, smallHeight);
      
      workerRef.current.postMessage({
        imageData, width: smallWidth, height: smallHeight,
        settings: {
          ...debouncedSettings,
          customPalette: debouncedSettings.palette === 'custom' ? debouncedCustomPalette.map(hexToRgb) : null
        },
      });
    };
  }, [originalImage, debouncedSettings, debouncedCustomPalette]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 2000;
        if (img.width > MAX_DIM || img.height > MAX_DIM) {
          if (window.confirm(`Sua imagem é muito grande (${img.width}x${img.height}). Deseja redimensioná-la para ${MAX_DIM}px para melhor performance?`)) {
            const tempCanvas = document.createElement('canvas');
            const aspect = img.width / img.height;
            if (img.width > img.height) {
              tempCanvas.width = MAX_DIM;
              tempCanvas.height = MAX_DIM / aspect;
            } else {
              tempCanvas.height = MAX_DIM;
              tempCanvas.width = MAX_DIM * aspect;
            }
            tempCanvas.getContext('2d').drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            setOriginalImage(tempCanvas.toDataURL());
          } else {
            setOriginalImage(e.target.result);
          }
        } else {
          setOriginalImage(e.target.result);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  const handleCopyToClipboard = () => {
    if (!canvasRef.current || !convertedImage) return;
    canvasRef.current.toBlob((blob) => {
      navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
        .then(() => alert("Imagem copiada para a área de transferência!"))
        .catch(err => console.error("Falha ao copiar imagem:", err));
    });
  };
  
  const handleAddColor = () => {
    if (customPalette.length >= 16) {
      alert("A paleta customizada pode ter no máximo 16 cores.");
      return;
    }
    if (customPalette.includes(newColor)) {
      alert("Esta cor já existe na paleta.");
      return;
    }
    setCustomPalette([...customPalette, newColor]);
  };
  
  const handleRemoveColor = (colorToRemove) => {
    setCustomPalette(customPalette.filter(c => c !== colorToRemove));
  };
  
  const handleClear = () => {
    setOriginalImage(null);
    setConvertedImage(null);
    const fileInput = document.getElementById('file-upload');
    if(fileInput) fileInput.value = '';
  };
  
  const handleFileChange = (e) => handleFile(e.target.files[0]);
  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);
  
// Em src/components/ImageConverter/index.jsx

return (
    <div className={styles.appContainer}>
      <aside className={styles.sidebar}>
        {/* === SIDEBAR DE CONTROLES === */}
        <div className={styles.sidebarHeader}>
          <h2>Controles</h2>
          <button onClick={handleClear} className={styles.clearButton} title="Limpar imagem e recomeçar">Limpar</button>
        </div>
        <div className={styles.presetGroup}>
          <h3>Estilos Prontos</h3>
          <div className={styles.presetButtons}>
            <button onClick={() => setSettings(s => ({...s, ...PRESETS.gameboy}))}>Game Boy</button>
            <button onClick={() => setSettings(s => ({...s, ...PRESETS.nes}))}>NES</button>
            <button onClick={() => setSettings(s => ({...s, ...PRESETS.c64}))}>C64</button>
            <button onClick={() => setSettings(s => ({...s, ...PRESETS.clean}))}>Pixel Limpo</button>
          </div>
        </div>
        <div className={styles.controlGroup}>
          <label>Resolução Pixel (Largura): {settings.pixelResolution}px</label>
          <input type="range" min="32" max="256" step="8"
            value={settings.pixelResolution}
            onChange={e => setSettings(s=>({...s, pixelResolution: parseInt(e.target.value)}))}
          />
        </div>
        <div className={styles.controlGroup}>
          <label>Contraste: {settings.contrast}%</label>
          <input type="range" min="50" max="200"
            value={settings.contrast}
            onChange={e => setSettings(s=>({...s, contrast: parseInt(e.target.value)}))}
          />
        </div>
        <div className={styles.controlGroup}>
          <label>Saturação: {settings.saturation}%</label>
          <input type="range" min="0" max="200"
            value={settings.saturation}
            onChange={e => setSettings(s=>({...s, saturation: parseInt(e.target.value)}))}
          />
        </div>
        <div className={styles.controlGroup}>
          <label>Paleta de Cores</label>
          <select value={settings.palette} onChange={e => setSettings(s=>({...s, palette: e.target.value}))}>
            <option value="custom">🎨 Customizada</option>
            <option value="nes">NES</option>
            <option value="c64">Commodore 64</option>
            <option value="masterSystem">Master System</option>
            <option value="gameboy">Game Boy</option>
            <option value="pico8">PICO-8</option>
            <option value="grayscale">Escala de Cinza</option>
            <option value="fullColor">Cores Reduzidas</option>
          </select>
        </div>
        {settings.palette === 'custom' && (
          <div className={styles.customPaletteEditor}>
            <div className={styles.colorInput}>
              <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} />
              <input type="text" value={newColor} onChange={e => setNewColor(e.target.value)} />
              <button onClick={handleAddColor}>+</button>
            </div>
            <div className={styles.paletteColors}>
              {customPalette.map(color => (
                <div key={color}
                  className={styles.colorSwatch}
                  style={{backgroundColor: color}}
                  onClick={() => handleRemoveColor(color)}
                  title={`Remover ${color}`}
                />
              ))}
            </div>
          </div>
        )}
        <div className={styles.controlGroup}>
          <label title="Floyd-Steinberg cria gradientes suaves. Bayer cria padrões repetitivos.">
            Algoritmo de Dithering (?)
          </label>
          <select
            value={settings.ditheringType}
            onChange={e => setSettings(s=>({...s, ditheringType: e.target.value}))}
            disabled={settings.palette === 'fullColor' || settings.palette === 'custom'}
          >
            <option value="floyd">Floyd-Steinberg</option>
            <option value="ordered">Bayer (Estruturado)</option>
            <option value="none">Nenhum</option>
          </select>
        </div>
        <div className={styles.controlGroup}>
          <label title="CIELAB é mais preciso para a percepção humana, RGB é mais rápido.">
            Métrica de Cor (?)
          </label>
          <select
            value={settings.colorMetric}
            onChange={e => setSettings(s=>({...s, colorMetric: e.target.value}))}
            disabled={settings.palette === 'fullColor'}
          >
            <option value="cielab">CIELAB</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
        <div className={styles.controlGroup}>
          <label className={styles.toggleLabel}>
            Efeito Scanlines
            <input type="checkbox"
              checked={settings.scanlines}
              onChange={e => setSettings(s=>({...s, scanlines: e.target.checked}))}
            />
          </label>
        </div>
      </aside>
  
      <main className={styles.mainContent}>
        {/* Se não houver imagem, mostra apenas a zona de upload */}
        {!originalImage && (
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>Arraste e solte uma imagem aqui</p>
            <p>ou</p>
            <label htmlFor="file-upload" className={styles.uploadButton}>
              Escolher Arquivo
            </label>
            <input id="file-upload" type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{display: 'none'}}
            />
          </div>
        )}
  
        {/* Se houver imagem, mostra comparação lado a lado */}
        {originalImage && (
          <div className={styles.comparisonContainer}>
            <div className={styles.imageBox}>
              <h2>Original</h2>
              <img src={originalImage} alt="Original" />
            </div>
  
            <div className={styles.imageBox}>
              <h2>Resultado</h2>
              {isConverting && <div className={styles.loading}>Convertendo...</div>}
              {!isConverting && !convertedImage && (
                <div className={styles.placeholder}>Ajuste os controles</div>
              )}
              {convertedImage && (
                <>
                  <div className={settings.scanlines ? styles.scanlines : ''}>
                    <img src={convertedImage} alt="Convertida" />
                  </div>
                  <div className={styles.outputActions}>
                    <button onClick={handleCopyToClipboard} className={styles.actionButton}>
                      <span className={styles.icon}>📋</span> Copiar
                    </button>
                    <a href={convertedImage} download="resultado-8bit.png"
                      className={`${styles.actionButton} ${styles.primary}`}
                    >
                      <span className={styles.icon}>⬇️</span> Download
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
  
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}  

export default ImageConverter;