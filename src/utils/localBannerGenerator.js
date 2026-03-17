const toAbsoluteAssetUrl = (imagePath) => {
  if (!imagePath) return null
  if (/^https?:\/\//i.test(imagePath)) return imagePath

  const base = typeof window !== 'undefined' ? window.location.origin : ''
  if (!base) return imagePath

  if (imagePath.startsWith('/')) return `${base}${imagePath}`
  return `${base}/${imagePath}`
}

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Unable to load model image for banner.'))
    img.src = src
  })

const fitCoverRect = ({ srcWidth, srcHeight, dstWidth, dstHeight }) => {
  const srcRatio = srcWidth / srcHeight
  const dstRatio = dstWidth / dstHeight

  if (srcRatio > dstRatio) {
    const drawHeight = dstHeight
    const drawWidth = drawHeight * srcRatio
    const dx = (dstWidth - drawWidth) / 2
    return { dx, dy: 0, drawWidth, drawHeight }
  }

  const drawWidth = dstWidth
  const drawHeight = drawWidth / srcRatio
  const dy = (dstHeight - drawHeight) / 2
  return { dx: 0, dy, drawWidth, drawHeight }
}

const wrapText = (ctx, text, maxWidth, maxLines) => {
  if (!text) return []

  const words = text.trim().split(/\s+/)
  const lines = []
  let line = ''

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    const width = ctx.measureText(test).width
    if (width <= maxWidth) {
      line = test
      continue
    }

    if (line) lines.push(line)
    line = word

    if (lines.length >= maxLines - 1) break
  }

  if (line && lines.length < maxLines) lines.push(line)
  return lines
}

const tl = (x, y, size, color, fontFamily, fontWeight, extras = {}) => ({
  x,
  y,
  size,
  color,
  fontFamily,
  fontWeight,
  ...extras,
})

export const BANNER_STYLE_PRESETS = [
  {
    key: 'studio-classic',
    label: 'Studio Classic',
    layout: {
      companyName: { x: 56, y: 72, size: 26, color: '#e2e8f0', fontFamily: 'Georgia, serif', fontWeight: 700 },
      shootType: { x: 56, y: 120, size: 22, color: '#38bdf8', fontFamily: 'Georgia, serif', fontWeight: 700 },
      title: { x: 56, y: 210, size: 58, color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 700 },
      cast: { x: 56, y: 360, size: 24, color: '#cbd5e1', fontFamily: 'Arial, sans-serif', fontWeight: 500 },
      director: { x: 56, y: 650, size: 24, color: '#93c5fd', fontFamily: 'Arial, sans-serif', fontWeight: 600 },
    },
  },
  {
    key: 'bottom-cinema',
    label: 'Bottom Cinema',
    layout: {
      companyName: { x: 54, y: 506, size: 24, color: '#e2e8f0', fontFamily: 'Times New Roman, serif', fontWeight: 600 },
      shootType: { x: 54, y: 544, size: 21, color: '#fca5a5', fontFamily: 'Times New Roman, serif', fontWeight: 700 },
      title: { x: 54, y: 610, size: 60, color: '#ffffff', fontFamily: 'Times New Roman, serif', fontWeight: 700 },
      cast: { x: 54, y: 654, size: 21, color: '#f8fafc', fontFamily: 'Trebuchet MS, sans-serif', fontWeight: 500 },
      director: { x: 54, y: 698, size: 20, color: '#fecaca', fontFamily: 'Trebuchet MS, sans-serif', fontWeight: 600 },
    },
  },
  {
    key: 'disco-flare',
    label: 'Disco Flare',
    layout: {
      companyName: { x: 108, y: 98, size: 24, color: '#312e81', fontFamily: 'Comic Sans MS, cursive', fontWeight: 700, bgColor: 'rgba(250, 245, 255, 0.85)', bgPaddingX: 10, bgPaddingY: 5 },
      shootType: { x: 108, y: 142, size: 20, color: '#6d28d9', fontFamily: 'Comic Sans MS, cursive', fontWeight: 700 },
      title: { x: 108, y: 254, size: 60, color: '#faf5ff', fontFamily: 'Comic Sans MS, cursive', fontWeight: 800, bgColor: 'rgba(79, 70, 229, 0.45)', bgPaddingX: 13, bgPaddingY: 7 },
      cast: { x: 108, y: 404, size: 22, color: '#ddd6fe', fontFamily: 'Verdana, sans-serif', fontWeight: 700 },
      director: { x: 108, y: 694, size: 20, color: '#c4b5fd', fontFamily: 'Verdana, sans-serif', fontWeight: 700 },
    },
  },
  {
    key: 'edge-blast-nw',
    label: 'Edge Blast NW',
    layout: {
      companyName: tl(28, 54, 21, '#fef3c7', 'Impact, Haettenschweiler, Arial Black, sans-serif', 700, { bgColor: 'rgba(120, 53, 15, 0.58)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(30, 92, 17, '#fcd34d', 'Impact, Haettenschweiler, Arial Black, sans-serif', 700),
      title: tl(24, 170, 74, '#fff7ed', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(194, 65, 12, 0.4)', bgPaddingX: 14, bgPaddingY: 9, bgRadius: 12 }),
      cast: tl(36, 664, 20, '#fed7aa', 'Trebuchet MS, sans-serif', 700, { bgColor: 'rgba(124, 45, 18, 0.4)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      director: tl(920, 706, 18, '#fdba74', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'edge-blast-ne',
    label: 'Edge Blast NE',
    layout: {
      companyName: tl(950, 52, 20, '#dbeafe', 'Arial, sans-serif', 700, { bgColor: 'rgba(30, 64, 175, 0.56)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(970, 90, 16, '#93c5fd', 'Arial, sans-serif', 700),
      title: tl(840, 168, 72, '#eff6ff', 'Arial, sans-serif', 800, { bgColor: 'rgba(29, 78, 216, 0.4)', bgPaddingX: 14, bgPaddingY: 9, bgRadius: 12 }),
      cast: tl(34, 704, 17, '#bfdbfe', 'Verdana, sans-serif', 600),
      director: tl(970, 706, 17, '#93c5fd', 'Verdana, sans-serif', 700, { bgColor: 'rgba(15, 23, 42, 0.45)', bgPaddingX: 9, bgPaddingY: 5, bgRadius: 9 }),
    },
  },
  {
    key: 'corner-jump-1',
    label: 'Corner Jump 1',
    layout: {
      companyName: tl(34, 58, 18, '#e2e8f0', 'Courier New, monospace', 700, { bgColor: 'rgba(15, 23, 42, 0.62)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(1020, 60, 18, '#67e8f9', 'Courier New, monospace', 700),
      title: tl(420, 360, 84, '#f8fafc', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(2, 6, 23, 0.46)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(36, 706, 17, '#cbd5e1', 'Verdana, sans-serif', 700),
      director: tl(928, 706, 17, '#93c5fd', 'Verdana, sans-serif', 700, { bgColor: 'rgba(15, 23, 42, 0.45)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
    },
  },
  {
    key: 'mag-corner-a',
    label: 'Mag Corner A',
    layout: {
      companyName: tl(982, 84, 18, '#f8fafc', 'Palatino Linotype, Book Antiqua, serif', 700, { bgColor: 'rgba(15, 23, 42, 0.62)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(986, 122, 16, '#cbd5e1', 'Palatino Linotype, Book Antiqua, serif', 700),
      title: tl(802, 232, 58, '#ffffff', 'Palatino Linotype, Book Antiqua, serif', 800, { bgColor: 'rgba(30, 41, 59, 0.45)', bgPaddingX: 12, bgPaddingY: 8, bgRadius: 12 }),
      cast: tl(38, 84, 18, '#e2e8f0', 'Trebuchet MS, sans-serif', 600),
      director: tl(40, 706, 16, '#93c5fd', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'frame-pop-1',
    label: 'Frame Pop 1',
    layout: {
      companyName: tl(52, 64, 18, '#111827', 'Verdana, sans-serif', 700, { bgColor: 'rgba(251, 191, 36, 0.9)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(980, 64, 18, '#111827', 'Verdana, sans-serif', 700, { bgColor: 'rgba(34, 197, 94, 0.86)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      title: tl(134, 292, 94, '#ffffff', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(59, 130, 246, 0.45)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 15 }),
      cast: tl(52, 706, 16, '#e5e7eb', 'Trebuchet MS, sans-serif', 700),
      director: tl(960, 706, 16, '#e5e7eb', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'frame-pop-2',
    label: 'Frame Pop 2',
    layout: {
      companyName: tl(52, 706, 16, '#111827', 'Verdana, sans-serif', 700, { bgColor: 'rgba(244, 114, 182, 0.9)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(960, 706, 16, '#111827', 'Verdana, sans-serif', 700, { bgColor: 'rgba(96, 165, 250, 0.88)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      title: tl(140, 164, 96, '#fff1f2', 'Comic Sans MS, cursive', 800, { bgColor: 'rgba(190, 24, 93, 0.42)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 15 }),
      cast: tl(52, 82, 18, '#f9a8d4', 'Trebuchet MS, sans-serif', 700),
      director: tl(970, 82, 18, '#93c5fd', 'Trebuchet MS, sans-serif', 700),
    },
  },
   {
    key: 'poster-stack-1',
    label: 'Poster Stack 1',
    layout: {
      companyName: tl(44, 60, 18, '#e5e7eb', 'Courier New, monospace', 700, { bgColor: 'rgba(31, 41, 55, 0.62)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(44, 96, 16, '#9ca3af', 'Courier New, monospace', 700),
      title: tl(42, 164, 68, '#f9fafb', 'Courier New, monospace', 800, { bgColor: 'rgba(17, 24, 39, 0.42)', bgPaddingX: 13, bgPaddingY: 8, bgRadius: 12 }),
      cast: tl(42, 644, 19, '#d1d5db', 'Verdana, sans-serif', 700),
      director: tl(42, 708, 16, '#9ca3af', 'Verdana, sans-serif', 700),
    },
  },
  {
    key: 'poster-stack-2',
    label: 'Poster Stack 2',
    layout: {
      companyName: tl(978, 60, 18, '#e5e7eb', 'Courier New, monospace', 700, { bgColor: 'rgba(31, 41, 55, 0.62)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(1014, 96, 16, '#9ca3af', 'Courier New, monospace', 700),
      title: tl(820, 164, 68, '#f9fafb', 'Courier New, monospace', 800, { bgColor: 'rgba(17, 24, 39, 0.42)', bgPaddingX: 13, bgPaddingY: 8, bgRadius: 12 }),
      cast: tl(950, 644, 19, '#d1d5db', 'Verdana, sans-serif', 700),
      director: tl(954, 708, 16, '#9ca3af', 'Verdana, sans-serif', 700),
    },
  },
  {
    key: 'edge-blast-se',
    label: 'Edge Blast SE',
    layout: {
      companyName: tl(930, 468, 22, '#f5f3ff', 'Trebuchet MS, sans-serif', 700, { bgColor: 'rgba(88, 28, 135, 0.55)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(948, 506, 18, '#e9d5ff', 'Trebuchet MS, sans-serif', 700),
      title: tl(820, 588, 68, '#faf5ff', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(126, 34, 206, 0.37)', bgPaddingX: 14, bgPaddingY: 9, bgRadius: 12 }),
      cast: tl(38, 52, 20, '#ddd6fe', 'Verdana, sans-serif', 700),
      director: tl(950, 716, 16, '#c4b5fd', 'Verdana, sans-serif', 700),
    },
  },
  {
    key: 'edge-blast-sw',
    label: 'Edge Blast SW',
    layout: {
      companyName: tl(28, 460, 22, '#ecfdf5', 'Gill Sans, Trebuchet MS, sans-serif', 700, { bgColor: 'rgba(5, 150, 105, 0.55)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(34, 498, 18, '#a7f3d0', 'Gill Sans, Trebuchet MS, sans-serif', 700),
      title: tl(22, 586, 70, '#f0fdf4', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(16, 185, 129, 0.37)', bgPaddingX: 14, bgPaddingY: 9, bgRadius: 12 }),
      cast: tl(900, 66, 19, '#bbf7d0', 'Arial, sans-serif', 600),
      director: tl(32, 716, 16, '#6ee7b7', 'Arial, sans-serif', 700),
    },
  },
  {
    key: 'corner-jump-2',
    label: 'Corner Jump 2',
    layout: {
      companyName: tl(998, 58, 18, '#ffe4e6', 'Comic Sans MS, cursive', 700, { bgColor: 'rgba(190, 24, 93, 0.58)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(36, 58, 18, '#f9a8d4', 'Comic Sans MS, cursive', 700),
      title: tl(360, 216, 78, '#fff1f2', 'Comic Sans MS, cursive', 800, { bgColor: 'rgba(136, 19, 55, 0.4)', bgPaddingX: 15, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(980, 706, 16, '#fbcfe8', 'Trebuchet MS, sans-serif', 700),
      director: tl(30, 706, 16, '#fda4af', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'corner-jump-3',
    label: 'Corner Jump 3',
    layout: {
      companyName: tl(40, 690, 16, '#ecfeff', 'Arial, sans-serif', 700),
      shootType: tl(1020, 690, 16, '#67e8f9', 'Arial, sans-serif', 700),
      title: tl(340, 140, 88, '#f0f9ff', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(8, 47, 73, 0.45)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(40, 60, 18, '#bae6fd', 'Verdana, sans-serif', 600, { bgColor: 'rgba(3, 105, 161, 0.38)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      director: tl(930, 60, 18, '#7dd3fc', 'Verdana, sans-serif', 700, { bgColor: 'rgba(12, 74, 110, 0.42)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
    },
  },
  {
    key: 'upper-band-max',
    label: 'Upper Band Max',
    layout: {
      companyName: tl(30, 50, 20, '#fef9c3', 'Times New Roman, serif', 700, { bgColor: 'rgba(113, 63, 18, 0.58)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(410, 50, 20, '#fde68a', 'Times New Roman, serif', 700, { bgColor: 'rgba(146, 64, 14, 0.48)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      title: tl(30, 124, 82, '#fff7ed', 'Times New Roman, serif', 800, { bgColor: 'rgba(194, 65, 12, 0.38)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(30, 704, 16, '#fed7aa', 'Trebuchet MS, sans-serif', 600),
      director: tl(1004, 704, 16, '#fdba74', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'lower-band-max',
    label: 'Lower Band Max',
    layout: {
      companyName: tl(34, 456, 20, '#e0e7ff', 'Verdana, sans-serif', 700, { bgColor: 'rgba(30, 64, 175, 0.56)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(430, 456, 20, '#93c5fd', 'Verdana, sans-serif', 700, { bgColor: 'rgba(29, 78, 216, 0.46)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      title: tl(30, 540, 84, '#eff6ff', 'Verdana, sans-serif', 800, { bgColor: 'rgba(37, 99, 235, 0.37)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(34, 96, 18, '#bfdbfe', 'Arial, sans-serif', 600),
      director: tl(1010, 96, 18, '#93c5fd', 'Arial, sans-serif', 700),
    },
  },
  {
    key: 'x-cross-neon',
    label: 'X Cross Neon',
    layout: {
      companyName: tl(46, 62, 18, '#f5d0fe', 'Impact, Haettenschweiler, Arial Black, sans-serif', 700),
      shootType: tl(1040, 62, 18, '#67e8f9', 'Impact, Haettenschweiler, Arial Black, sans-serif', 700),
      title: tl(248, 320, 92, '#ffffff', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(91, 33, 182, 0.34)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 15 }),
      cast: tl(46, 708, 16, '#f0abfc', 'Trebuchet MS, sans-serif', 700, { bgColor: 'rgba(76, 29, 149, 0.4)', bgPaddingX: 9, bgPaddingY: 5, bgRadius: 9 }),
      director: tl(930, 708, 16, '#67e8f9', 'Trebuchet MS, sans-serif', 700, { bgColor: 'rgba(14, 116, 144, 0.4)', bgPaddingX: 9, bgPaddingY: 5, bgRadius: 9 }),
    },
  },
  {
    key: 'x-cross-pastel',
    label: 'X Cross Pastel',
    layout: {
      companyName: tl(44, 62, 18, '#fdf2f8', 'Comic Sans MS, cursive', 700, { bgColor: 'rgba(190, 24, 93, 0.54)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(1016, 62, 18, '#fbcfe8', 'Comic Sans MS, cursive', 700),
      title: tl(286, 340, 86, '#fff1f2', 'Comic Sans MS, cursive', 800, { bgColor: 'rgba(219, 39, 119, 0.35)', bgPaddingX: 15, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(44, 706, 16, '#f9a8d4', 'Verdana, sans-serif', 700),
      director: tl(936, 706, 16, '#f472b6', 'Verdana, sans-serif', 700),
    },
  },
  {
    key: 'x-cross-acid',
    label: 'X Cross Acid',
    layout: {
      companyName: tl(40, 66, 18, '#f7fee7', 'Impact, Haettenschweiler, Arial Black, sans-serif', 700, { bgColor: 'rgba(77, 124, 15, 0.6)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(1028, 66, 18, '#d9f99d', 'Impact, Haettenschweiler, Arial Black, sans-serif', 700),
      title: tl(270, 326, 90, '#ecfccb', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(101, 163, 13, 0.37)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(40, 704, 16, '#bef264', 'Trebuchet MS, sans-serif', 700),
      director: tl(936, 704, 16, '#a3e635', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'mag-corner-b',
    label: 'Mag Corner B',
    layout: {
      companyName: tl(34, 84, 18, '#f8fafc', 'Georgia, serif', 700, { bgColor: 'rgba(30, 41, 59, 0.6)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(34, 122, 16, '#93c5fd', 'Georgia, serif', 700),
      title: tl(44, 236, 60, '#ffffff', 'Georgia, serif', 800, { bgColor: 'rgba(29, 78, 216, 0.33)', bgPaddingX: 12, bgPaddingY: 8, bgRadius: 12 }),
      cast: tl(968, 84, 17, '#bfdbfe', 'Trebuchet MS, sans-serif', 600),
      director: tl(940, 706, 16, '#93c5fd', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'mag-corner-c',
    label: 'Mag Corner C',
    layout: {
      companyName: tl(42, 706, 16, '#fef2f2', 'Times New Roman, serif', 700),
      shootType: tl(950, 706, 16, '#fecaca', 'Times New Roman, serif', 700),
      title: tl(330, 126, 82, '#fff1f2', 'Times New Roman, serif', 800, { bgColor: 'rgba(159, 18, 57, 0.36)', bgPaddingX: 15, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(44, 86, 18, '#fda4af', 'Verdana, sans-serif', 700),
      director: tl(940, 86, 18, '#fb7185', 'Verdana, sans-serif', 700),
    },
  },
  {
    key: 'stagger-zig-1',
    label: 'Stagger Zig 1',
    layout: {
      companyName: tl(40, 70, 20, '#ecfeff', 'Lucida Sans Unicode, Lucida Grande, sans-serif', 700, { bgColor: 'rgba(8, 47, 73, 0.56)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(440, 130, 18, '#67e8f9', 'Lucida Sans Unicode, Lucida Grande, sans-serif', 700),
      title: tl(180, 300, 72, '#f0f9ff', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(14, 116, 144, 0.35)', bgPaddingX: 14, bgPaddingY: 9, bgRadius: 12 }),
      cast: tl(640, 430, 21, '#a5f3fc', 'Trebuchet MS, sans-serif', 700),
      director: tl(972, 704, 16, '#67e8f9', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'stagger-zig-2',
    label: 'Stagger Zig 2',
    layout: {
      companyName: tl(978, 70, 19, '#f5d0fe', 'Segoe UI Black, Arial Black, sans-serif', 700, { bgColor: 'rgba(88, 28, 135, 0.56)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(620, 130, 18, '#e879f9', 'Segoe UI Black, Arial Black, sans-serif', 700),
      title: tl(318, 284, 74, '#faf5ff', 'Segoe UI Black, Arial Black, sans-serif', 800, { bgColor: 'rgba(147, 51, 234, 0.35)', bgPaddingX: 14, bgPaddingY: 9, bgRadius: 12 }),
      cast: tl(86, 436, 21, '#f0abfc', 'Trebuchet MS, sans-serif', 700),
      director: tl(36, 706, 16, '#e879f9', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'stagger-zig-3',
    label: 'Stagger Zig 3',
    layout: {
      companyName: tl(40, 706, 16, '#f7fee7', 'Verdana, sans-serif', 700),
      shootType: tl(340, 644, 18, '#d9f99d', 'Verdana, sans-serif', 700),
      title: tl(160, 512, 78, '#ecfccb', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(77, 124, 15, 0.35)', bgPaddingX: 14, bgPaddingY: 9, bgRadius: 12 }),
      cast: tl(770, 176, 21, '#bef264', 'Trebuchet MS, sans-serif', 700),
      director: tl(980, 70, 17, '#a3e635', 'Trebuchet MS, sans-serif', 700, { bgColor: 'rgba(63, 98, 18, 0.45)', bgPaddingX: 9, bgPaddingY: 5, bgRadius: 9 }),
    },
  },
  {
    key: 'stagger-zig-4',
    label: 'Stagger Zig 4',
    layout: {
      companyName: tl(948, 708, 16, '#ffedd5', 'Georgia, serif', 700),
      shootType: tl(700, 644, 18, '#fdba74', 'Georgia, serif', 700),
      title: tl(520, 514, 78, '#fff7ed', 'Georgia, serif', 800, { bgColor: 'rgba(194, 65, 12, 0.35)', bgPaddingX: 14, bgPaddingY: 9, bgRadius: 12 }),
      cast: tl(92, 176, 20, '#fed7aa', 'Trebuchet MS, sans-serif', 700),
      director: tl(30, 72, 17, '#fb923c', 'Trebuchet MS, sans-serif', 700, { bgColor: 'rgba(124, 45, 18, 0.45)', bgPaddingX: 9, bgPaddingY: 5, bgRadius: 9 }),
    },
  },
  {
    key: 'poster-stack-3',
    label: 'Poster Stack 3',
    layout: {
      companyName: tl(472, 58, 20, '#fefce8', 'Palatino Linotype, Book Antiqua, serif', 700, { bgColor: 'rgba(133, 77, 14, 0.58)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(504, 98, 16, '#fde68a', 'Palatino Linotype, Book Antiqua, serif', 700),
      title: tl(260, 188, 80, '#fffbeb', 'Palatino Linotype, Book Antiqua, serif', 800, { bgColor: 'rgba(180, 83, 9, 0.34)', bgPaddingX: 15, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(40, 706, 16, '#fcd34d', 'Trebuchet MS, sans-serif', 700),
      director: tl(964, 706, 16, '#fbbf24', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'poster-stack-4',
    label: 'Poster Stack 4',
    layout: {
      companyName: tl(472, 708, 16, '#f3f4f6', 'Arial, sans-serif', 700),
      shootType: tl(486, 672, 16, '#d1d5db', 'Arial, sans-serif', 700),
      title: tl(210, 600, 84, '#f9fafb', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(55, 65, 81, 0.36)', bgPaddingX: 15, bgPaddingY: 10, bgRadius: 14 }),
      cast: tl(38, 80, 18, '#e5e7eb', 'Trebuchet MS, sans-serif', 700),
      director: tl(968, 80, 18, '#9ca3af', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'frame-pop-3',
    label: 'Frame Pop 3',
    layout: {
      companyName: tl(540, 52, 20, '#052e16', 'Impact, Haettenschweiler, Arial Black, sans-serif', 700, { bgColor: 'rgba(190, 242, 100, 0.9)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(560, 92, 18, '#14532d', 'Impact, Haettenschweiler, Arial Black, sans-serif', 700),
      title: tl(140, 220, 92, '#ecfccb', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(77, 124, 15, 0.42)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 15 }),
      cast: tl(52, 706, 16, '#bef264', 'Trebuchet MS, sans-serif', 700),
      director: tl(958, 706, 16, '#a3e635', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'frame-pop-4',
    label: 'Frame Pop 4',
    layout: {
      companyName: tl(540, 706, 16, '#4c0519', 'Georgia, serif', 700, { bgColor: 'rgba(254, 205, 211, 0.9)', bgPaddingX: 10, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(560, 670, 16, '#9f1239', 'Georgia, serif', 700),
      title: tl(180, 590, 92, '#fff1f2', 'Georgia, serif', 800, { bgColor: 'rgba(190, 24, 93, 0.4)', bgPaddingX: 16, bgPaddingY: 10, bgRadius: 15 }),
      cast: tl(44, 84, 18, '#f9a8d4', 'Trebuchet MS, sans-serif', 700),
      director: tl(954, 84, 18, '#fda4af', 'Trebuchet MS, sans-serif', 700),
    },
  },
  {
    key: 'full-corner-chaos',
    label: 'Full Corner Chaos',
    layout: {
      companyName: tl(20, 40, 16, '#f8fafc', 'Courier New, monospace', 700, { bgColor: 'rgba(15, 23, 42, 0.66)', bgPaddingX: 9, bgPaddingY: 6, bgRadius: 10 }),
      shootType: tl(1080, 40, 16, '#67e8f9', 'Courier New, monospace', 700, { bgColor: 'rgba(8, 47, 73, 0.56)', bgPaddingX: 9, bgPaddingY: 6, bgRadius: 10 }),
      title: tl(190, 360, 102, '#ffffff', 'Impact, Haettenschweiler, Arial Black, sans-serif', 800, { bgColor: 'rgba(2, 6, 23, 0.5)', bgPaddingX: 17, bgPaddingY: 11, bgRadius: 16 }),
      cast: tl(20, 718, 14, '#cbd5e1', 'Verdana, sans-serif', 700, { bgColor: 'rgba(30, 41, 59, 0.5)', bgPaddingX: 8, bgPaddingY: 5, bgRadius: 9 }),
      director: tl(1010, 718, 14, '#93c5fd', 'Verdana, sans-serif', 700, { bgColor: 'rgba(30, 64, 175, 0.46)', bgPaddingX: 8, bgPaddingY: 5, bgRadius: 9 }),
    },
  },
]

const DEFAULT_BANNER_PRESET_KEY = BANNER_STYLE_PRESETS[0].key
const BANNER_PRESET_MAP = BANNER_STYLE_PRESETS.reduce((accumulator, preset) => {
  accumulator[preset.key] = preset
  return accumulator
}, {})

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.max(0, Math.min(radius, Math.floor(Math.min(width, height) / 2)))
  if (r === 0) {
    ctx.fillRect(x, y, width, height)
    return
  }

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}

export const generateLocalProductionBanner = async ({
  companyName,
  title,
  shootType,
  directorName,
  modelImageUrl,
  modelNames,
  bannerPreset,
  bannerLayout = {},
}) => {
  try {
    const width = 1280
    const height = 720
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return { ok: false, error: 'Canvas context is unavailable.' }
    }

    const fallbackBg = '#0f172a'
    ctx.fillStyle = fallbackBg
    ctx.fillRect(0, 0, width, height)

    const absoluteImageUrl = toAbsoluteAssetUrl(modelImageUrl)
    if (absoluteImageUrl) {
      try {
        const img = await loadImage(absoluteImageUrl)
        const fitted = fitCoverRect({
          srcWidth: img.width,
          srcHeight: img.height,
          dstWidth: width,
          dstHeight: height,
        })
        ctx.drawImage(img, fitted.dx, fitted.dy, fitted.drawWidth, fitted.drawHeight)
      } catch {
        // keep fallback background when image fails
      }
    }

    const vignette = ctx.createLinearGradient(0, 0, 0, height)
    vignette.addColorStop(0, 'rgba(2, 6, 23, 0.18)')
    vignette.addColorStop(0.55, 'rgba(2, 6, 23, 0.55)')
    vignette.addColorStop(1, 'rgba(2, 6, 23, 0.88)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, width, height)

    const selectedPreset = BANNER_PRESET_MAP[bannerPreset] || BANNER_PRESET_MAP[DEFAULT_BANNER_PRESET_KEY]
    const activeLayout = {
      ...(selectedPreset?.layout || {}),
      ...(bannerLayout || {}),
    }

    const getPosition = (key, fallbackX, fallbackY) => ({
      x: Number.isFinite(activeLayout?.[key]?.x) ? activeLayout[key].x : fallbackX,
      y: Number.isFinite(activeLayout?.[key]?.y) ? activeLayout[key].y : fallbackY,
    })

    const getTextStyle = (key, fallback) => ({
      size: Number.isFinite(activeLayout?.[key]?.size) ? activeLayout[key].size : fallback.size,
      color: typeof activeLayout?.[key]?.color === 'string' ? activeLayout[key].color : fallback.color,
      fontFamily: typeof activeLayout?.[key]?.fontFamily === 'string'
        ? activeLayout[key].fontFamily
        : fallback.fontFamily,
      fontWeight: Number.isFinite(activeLayout?.[key]?.fontWeight)
        ? activeLayout[key].fontWeight
        : fallback.fontWeight,
      bgColor: typeof activeLayout?.[key]?.bgColor === 'string' ? activeLayout[key].bgColor : null,
      bgPaddingX: Number.isFinite(activeLayout?.[key]?.bgPaddingX) ? activeLayout[key].bgPaddingX : 0,
      bgPaddingY: Number.isFinite(activeLayout?.[key]?.bgPaddingY) ? activeLayout[key].bgPaddingY : 0,
      bgRadius: Number.isFinite(activeLayout?.[key]?.bgRadius) ? activeLayout[key].bgRadius : 8,
    })

    const applyFont = (style) => {
      ctx.fillStyle = style.color
      ctx.font = `${style.fontWeight} ${style.size}px ${style.fontFamily}`
    }

    const drawTextBlock = ({ lines, x, y, lineHeight, style }) => {
      lines.forEach((line, index) => {
        const textY = y + index * lineHeight
        const textWidth = ctx.measureText(line).width
        const top = textY - style.size

        if (style.bgColor) {
          const padX = style.bgPaddingX
          const padY = style.bgPaddingY
          ctx.fillStyle = style.bgColor
          drawRoundedRect(
            ctx,
            x - padX,
            top - padY,
            textWidth + padX * 2,
            style.size + padY * 2,
            style.bgRadius,
          )
        }

        ctx.fillStyle = style.color
        ctx.fillText(line, x, textY)
      })
    }

    const companyPos = getPosition('companyName', 56, 72)
    const typePos = getPosition('shootType', 56, 120)
    const titlePos = getPosition('title', 56, 210)
    const castPos = getPosition('cast', 56, 360)
    const directorPos = getPosition('director', 56, 650)

    const companyStyle = getTextStyle('companyName', { size: 26, color: '#e2e8f0', fontFamily: 'Georgia, serif', fontWeight: 700 })
    const typeStyle = getTextStyle('shootType', { size: 22, color: '#38bdf8', fontFamily: 'Georgia, serif', fontWeight: 700 })
    const titleStyle = getTextStyle('title', { size: 58, color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 700 })
    const castStyle = getTextStyle('cast', { size: 24, color: '#cbd5e1', fontFamily: 'Arial, sans-serif', fontWeight: 500 })
    const directorStyle = getTextStyle('director', { size: 24, color: '#93c5fd', fontFamily: 'Arial, sans-serif', fontWeight: 600 })

    applyFont(companyStyle)
    drawTextBlock({
      lines: [companyName || 'Independent Studio'],
      x: companyPos.x,
      y: companyPos.y,
      lineHeight: Math.max(20, Math.round(companyStyle.size * 1.12)),
      style: companyStyle,
    })

    applyFont(typeStyle)
    drawTextBlock({
      lines: [(shootType || 'Production').toUpperCase()],
      x: typePos.x,
      y: typePos.y,
      lineHeight: Math.max(18, Math.round(typeStyle.size * 1.12)),
      style: typeStyle,
    })

    applyFont(titleStyle)
    const titleMaxWidth = Math.max(220, width - titlePos.x - 56)
    const titleLines = wrapText(ctx, title || 'Untitled Shoot', titleMaxWidth, 2)
    drawTextBlock({
      lines: titleLines,
      x: titlePos.x,
      y: titlePos.y,
      lineHeight: Math.max(32, Math.round(titleStyle.size * 1.14)),
      style: titleStyle,
    })

    const castLine = (modelNames || []).length > 0
      ? `Cast: ${(modelNames || []).join(', ')}`
      : 'Cast: N/A'
    applyFont(castStyle)
    const castMaxWidth = Math.max(220, width - castPos.x - 56)
    const castLines = wrapText(ctx, castLine, castMaxWidth, 2)
    drawTextBlock({
      lines: castLines,
      x: castPos.x,
      y: castPos.y,
      lineHeight: Math.max(22, Math.round(castStyle.size * 1.18)),
      style: castStyle,
    })

    applyFont(directorStyle)
    drawTextBlock({
      lines: [`Director: ${directorName || 'Owner'}`],
      x: directorPos.x,
      y: directorPos.y,
      lineHeight: Math.max(20, Math.round(directorStyle.size * 1.12)),
      style: directorStyle,
    })

    const dataUrl = canvas.toDataURL('image/png')
    return {
      ok: true,
      result: {
        coverImageUrl: dataUrl,
        coverMimeType: 'image/png',
      },
    }
  } catch (error) {
    return {
      ok: false,
      error: error?.message || 'Local banner generation failed.',
    }
  }
}
