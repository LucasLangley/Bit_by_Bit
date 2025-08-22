// --- FUNÇÃO AUXILIAR ---
// Converte HEX -> RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
   ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
};

// --- PALETAS DE CORES ---
const PALETTES = {
  grayscale: [
    [0, 0, 0], [55, 55, 55], [110, 110, 110], [165, 165, 165], [220, 220, 220], [255, 255, 255]
  ],
  gameboy: [
    [15, 56, 15], [48, 98, 48], [139, 172, 15], [155, 188, 15]
  ],
  nes: [
    [124, 124, 124], [0, 0, 252], [0, 0, 188], [68, 40, 188], [148, 0, 132], [168, 0, 32],
    [168, 16, 0], [136, 20, 0], [80, 48, 0], [0, 120, 0], [0, 104, 0], [0, 88, 0],
    [0, 64, 88], [0, 0, 0], [188, 188, 188], [0, 120, 248], [0, 88, 248], [104, 68, 252],
    [216, 0, 204], [228, 0, 88], [248, 56, 0], [228, 92, 16], [172, 124, 0], [0, 184, 0],
    [0, 168, 0], [0, 168, 68], [0, 136, 136], [0, 0, 0], [248, 248, 248], [60, 188, 252],
    [104, 136, 252], [152, 120, 248], [248, 120, 248], [248, 88, 152], [248, 120, 88],
    [252, 160, 68], [248, 184, 0], [184, 248, 24], [88, 216, 84], [88, 248, 152],
    [0, 232, 216], [120, 120, 120]
  ],
  pico8: [
    [0, 0, 0], [29, 43, 83], [126, 37, 83], [0, 135, 81], [171, 82, 54], [95, 87, 79],
    [194, 195, 199], [255, 241, 232], [255, 0, 77], [255, 163, 0], [255, 236, 39],
    [0, 228, 54], [41, 173, 255], [131, 118, 156], [255, 119, 168], [255, 204, 170]
  ],
  c64: [
    [0, 0, 0], [255, 255, 255], [136, 0, 0], [170, 255, 238], [204, 68, 204],
    [0, 204, 85], [0, 0, 170], [238, 238, 119], [221, 136, 85], [102, 68, 0],
    [255, 119, 119], [51, 51, 51], [119, 119, 119], [170, 255, 102],
    [0, 136, 255], [187, 187, 187]
  ],
  masterSystem: [
    [0, 0, 0], [0, 0, 252], [132, 0, 0], [252, 0, 252], [0, 252, 0],
    [0, 252, 252], [252, 252, 0], [252, 252, 252], [0, 0, 0], [0, 0, 252],
    [252, 0, 0], [252, 0, 252], [0, 252, 0], [0, 252, 252], [252, 252, 0],
    [252, 252, 252]
  ],
  rpgClassic: [
    [34, 32, 52], [69, 40, 60], [102, 57, 49], [143, 86, 59], [215, 123, 186], [231, 168, 179],
    [161, 102, 102], [52, 101, 36], [87, 138, 56], [161, 210, 131], [57, 63, 73], [86, 96, 110],
    [139, 155, 180], [194, 194, 209], [250, 255, 176], [242, 211, 171]
  ],
  darkFantasy: [
    [26, 27, 38], [42, 47, 68], [65, 72, 104], [86, 95, 137], [122, 162, 247],
    [61, 42, 75], [91, 61, 112], [140, 106, 163], [46, 77, 93], [61, 110, 117],
    [224, 175, 104], [255, 158, 100], [247, 118, 142]
  ],
  lofi: [
    [37, 33, 46],   [68, 57, 86],   [138, 111, 105], [217, 145, 161],
    [73, 88, 124],  [100, 138, 117], [167, 189, 164], [227, 216, 179],
    [212, 138, 106], [161, 91, 72],  [184, 91, 91],   [96, 51, 74],
    [240, 225, 244], [148, 114, 168], [100, 78, 120],  [52, 46, 66]
  ],
};

// --- MATEMÁTICA DE CORES ---
function rgbToLab(rgb) {
  let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722);
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
}

const colorDistance = (c1, c2, metric) => {
  if (metric === 'cielab') {
    const lab1 = rgbToLab(c1);
    const lab2 = rgbToLab(c2);
    return Math.sqrt(
      Math.pow(lab1[0] - lab2[0], 2) +
      Math.pow(lab1[1] - lab2[1], 2) +
      Math.pow(lab1[2] - lab2[2], 2)
    );
  }
  return (c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2;
};

const findClosestColor = (pixel, palette, metric) => {
  let closest = palette[0];
  let minDistance = Infinity;
  for (const color of palette) {
    const distance = colorDistance(pixel, color, metric);
    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }
  return closest;
};

// --- MATRIZ BAYER ---
const bayerMatrix = [
  [1, 9, 3, 11],
  [13, 5, 15, 7],
  [4, 12, 2, 10],
  [16, 8, 14, 6]
];

// --- WORKER PRINCIPAL ---
self.onmessage = (event) => {
  try {
    const { imageData, width, height, settings } = event.data;
    const { palette, ditheringType, colorMetric } = settings;

    // Suporte a paleta customizada
    let currentPalette;
    if (palette === 'custom' && settings.customPalette?.length > 0) {
      currentPalette = settings.customPalette;
    } else if (PALETTES[palette]) {
      currentPalette = PALETTES[palette];
    } else {
      currentPalette = null;
    }

    const data = new Uint8ClampedArray(imageData.data);
    const originalData = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const oldPixel = [data[i], data[i + 1], data[i + 2]];
        let newPixel;

        if (currentPalette) {
          if (ditheringType === 'ordered') {
            const threshold = (bayerMatrix[y % 4][x % 4] - 1) / 16;
            const ditheredPixel = [
              Math.min(255, oldPixel[0] + threshold * 32),
              Math.min(255, oldPixel[1] + threshold * 32),
              Math.min(255, oldPixel[2] + threshold * 32)
            ];
            newPixel = findClosestColor(ditheredPixel, currentPalette, colorMetric);
          } else {
            newPixel = findClosestColor(oldPixel, currentPalette, colorMetric);
          }
        } else {
          const factor = 48;
          newPixel = [
            Math.round(oldPixel[0] / factor) * factor,
            Math.round(oldPixel[1] / factor) * factor,
            Math.round(oldPixel[2] / factor) * factor,
          ];
        }

        originalData[i] = newPixel[0];
        originalData[i + 1] = newPixel[1];
        originalData[i + 2] = newPixel[2];

        if (ditheringType === 'floyd' && currentPalette) {
          const errR = oldPixel[0] - newPixel[0];
          const errG = oldPixel[1] - newPixel[1];
          const errB = oldPixel[2] - newPixel[2];

          const points = [
            { x: x + 1, y: y, f: 7 / 16 },
            { x: x - 1, y: y + 1, f: 3 / 16 },
            { x: x, y: y + 1, f: 5 / 16 },
            { x: x + 1, y: y + 1, f: 1 / 16 }
          ];
          points.forEach(p => {
            if (p.x >= 0 && p.x < width && p.y >= 0 && p.y < height) {
              const di = (p.y * width + p.x) * 4;
              data[di] += errR * p.f;
              data[di + 1] += errG * p.f;
              data[di + 2] += errB * p.f;
            }
          });
        }
      }
    }

    postMessage({ status: 'success', imageData });
  } catch (error) {
    postMessage({ status: 'error', message: error.message });
  }
};