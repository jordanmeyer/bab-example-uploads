// Call after duke-tokens.css is loaded; chart libraries need literal values.
export function duke() {
  const css = getComputedStyle(document.documentElement);
  const color = name => css.getPropertyValue(`--duke-${name}`).trim();
  return { navy: color('navy-blue'), royal: color('royal-blue'), copper: color('copper'),
    teal: color('magnolia'), ironweed: color('ironweed'), paper: color('white'),
    panel: color('hatteras'), ink: color('cast-iron'), muted: color('graphite'),
    heading: 'Georgia, serif', body: 'Arial, sans-serif' };
}
