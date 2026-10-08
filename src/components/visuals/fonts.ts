/**
 * Font stacks for the illustrations.
 *
 * Manrope has no Gujarati glyphs, so Gujarati text names the faces the
 * platforms actually ship: Noto Sans Gujarati on Android, Nirmala UI and Shruti
 * on Windows, Gujarati Sangam MN on Apple devices. No webfont is loaded for it:
 * a few words inside an illustration are not worth a font request, and every
 * phone a patient holds here already has one of these.
 */
export const GU = "'Noto Sans Gujarati', 'Nirmala UI', 'Shruti', 'Gujarati Sangam MN', sans-serif";

/** The mono labels, as a style attribute — SVG presentation attributes cannot read var(). */
export const MONO = 'font-family: var(--font-mono)';
