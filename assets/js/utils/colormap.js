/**
 * Colormaps and domain coloring utilities for complex analysis visualizations.
 */

/* ---- Viridis colormap (perceptually uniform, colorblind-safe) ---- */
const VIRIDIS_DATA = [
    [0.267, 0.004, 0.329], [0.283, 0.141, 0.458], [0.254, 0.265, 0.530],
    [0.207, 0.372, 0.553], [0.164, 0.471, 0.558], [0.128, 0.567, 0.551],
    [0.135, 0.659, 0.518], [0.267, 0.749, 0.441], [0.478, 0.821, 0.318],
    [0.741, 0.873, 0.150], [0.993, 0.906, 0.144]
];

const PLASMA_DATA = [
    [0.050, 0.030, 0.528], [0.254, 0.014, 0.615], [0.417, 0.001, 0.658],
    [0.563, 0.052, 0.641], [0.694, 0.165, 0.564], [0.798, 0.280, 0.470],
    [0.881, 0.393, 0.383], [0.949, 0.517, 0.295], [0.988, 0.652, 0.198],
    [0.988, 0.809, 0.145], [0.940, 0.975, 0.131]
];

function interpolateColormap(data, t) {
    t = Math.max(0, Math.min(1, t));
    const n = data.length - 1;
    const idx = t * n;
    const lo = Math.floor(idx);
    const hi = Math.min(lo + 1, n);
    const f = idx - lo;
    return {
        r: Math.round(255 * (data[lo][0] * (1 - f) + data[hi][0] * f)),
        g: Math.round(255 * (data[lo][1] * (1 - f) + data[hi][1] * f)),
        b: Math.round(255 * (data[lo][2] * (1 - f) + data[hi][2] * f))
    };
}

function viridis(t) { return interpolateColormap(VIRIDIS_DATA, t); }
function plasma(t) { return interpolateColormap(PLASMA_DATA, t); }

/* ---- HSL to RGB conversion ---- */
function hslToRgb(h, s, l) {
    h = ((h % 1) + 1) % 1;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;
    const sector = Math.floor(h * 6);
    switch (sector % 6) {
        case 0: r = c; g = x; b = 0; break;
        case 1: r = x; g = c; b = 0; break;
        case 2: r = 0; g = c; b = x; break;
        case 3: r = 0; g = x; b = c; break;
        case 4: r = x; g = 0; b = c; break;
        case 5: r = c; g = 0; b = x; break;
    }
    return {
        r: Math.round(255 * (r + m)),
        g: Math.round(255 * (g + m)),
        b: Math.round(255 * (b + m))
    };
}

/**
 * Domain coloring: map a complex number to an RGB color.
 * - Argument → Hue (cyclic)
 * - Modulus → Lightness (with log-scale contours)
 * Phase plot style with enhanced contour rings.
 */
function domainColor(z) {
    if (!z || !isFinite(z.re) || !isFinite(z.im)) {
        return { r: 0, g: 0, b: 0 };
    }
    const arg = z.arg();
    const mod = z.abs();

    if (mod === 0) return { r: 0, g: 0, b: 0 };
    if (!isFinite(mod)) return { r: 255, g: 255, b: 255 };

    // Hue from argument (0 to 1)
    const hue = (arg + Math.PI) / (2 * Math.PI);

    // Lightness from log-modulus with contour rings
    const logMod = Math.log2(mod);
    const frac = logMod - Math.floor(logMod);
    const lightness = 0.45 + 0.12 * Math.cos(2 * Math.PI * frac);

    // Argument contour lines (every π/6)
    const argLines = Math.abs(Math.sin(6 * arg));
    const argDark = argLines < 0.08 ? 0.92 : 1.0;

    // Modulus contour lines (at integer values)
    const modFrac = mod - Math.floor(mod);
    const modLines = Math.min(modFrac, 1 - modFrac);
    const modDark = modLines < 0.03 ? 0.92 : 1.0;

    const finalLight = lightness * argDark * modDark;
    const sat = 0.85;

    return hslToRgb(hue, sat, finalLight);
}

/**
 * Render domain coloring to an ImageData buffer.
 * @param {ImageData} imageData - target buffer
 * @param {Function} func - Complex → Complex mapping
 * @param {number} xMin, xMax, yMin, yMax - viewport bounds
 */
function renderDomainColoring(imageData, func, xMin, xMax, yMin, yMax) {
    const w = imageData.width;
    const h = imageData.height;
    const data = imageData.data;

    for (let py = 0; py < h; py++) {
        const y = yMax - (py / h) * (yMax - yMin);
        for (let px = 0; px < w; px++) {
            const x = xMin + (px / w) * (xMax - xMin);
            const z = new Complex(x, y);
            let fz;
            try { fz = func(z); } catch (e) { fz = Complex.zero(); }
            const color = domainColor(fz);
            const idx = (py * w + px) * 4;
            data[idx] = color.r;
            data[idx + 1] = color.g;
            data[idx + 2] = color.b;
            data[idx + 3] = 255;
        }
    }
}

/**
 * Color by phase only (constant saturation/lightness).
 */
function phaseColor(z) {
    if (!z || z.abs() === 0) return { r: 0, g: 0, b: 0 };
    const hue = (z.arg() + Math.PI) / (2 * Math.PI);
    return hslToRgb(hue, 0.9, 0.5);
}

/**
 * Colormap for a real-valued scalar in [min, max].
 */
function scalarColor(val, min, max, cmap) {
    const t = (val - min) / (max - min);
    cmap = cmap || viridis;
    return cmap(t);
}
