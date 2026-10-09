import Papa from 'papaparse';
import * as aq from 'arquero';

export const HEADERS = {
  sales: ['line_id', 'sale_date', 'product', 'channel', 'units', 'unit_price_usd'],
  returns: ['return_id', 'line_id', 'return_date', 'units'],
};
export const MAX_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 10000;

function date(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '2000-01-01' || value > '2099-12-31' || Number.isNaN(Date.parse(`${value}T00:00:00Z`)) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) throw Error(`${label}: use a real date in YYYY-MM-DD, 2000–2099.`);
  return value;
}
function units(value, label) {
  if (!/^[1-9]\d{0,4}$/.test(value) || Number(value) > 10000) throw Error(`${label}: units must be a whole number from 1 to 10,000.`);
  return Number(value);
}
function text(value, label) {
  if (!value || value.length > 100 || /[\x00-\x1f]/.test(value)) throw Error(`${label}: use 1–100 characters without control characters.`);
  return value;
}
export function parseCsv(csv, kind) {
  if (new TextEncoder().encode(csv).length > MAX_BYTES) throw Error(`${kind}: file exceeds 5 MiB.`);
  const parsed = Papa.parse(csv.replace(/^\uFEFF/, ''), { header: true, skipEmptyLines: 'greedy', dynamicTyping: false });
  if (parsed.errors.length) throw Error(`${kind}: malformed CSV. ${parsed.errors[0].message}`);
  const fields = parsed.meta.fields || [];
  if (fields.length !== HEADERS[kind].length || new Set(fields).size !== fields.length || HEADERS[kind].some(field => !fields.includes(field))) throw Error(`${kind}: headers must be exactly ${HEADERS[kind].join(', ')}.`);
  if (parsed.data.length > MAX_ROWS) throw Error(`${kind}: limit is 10,000 rows.`);
  if (kind === 'sales' && !parsed.data.length) throw Error('sales: at least one sale is required. A header-only returns file is valid.');
  const ids = new Set();
  return parsed.data.map((input, index) => {
    const row = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, value.trim()]));
    const label = `${kind} data row ${index + 1}`;
    const id = text(row[kind === 'sales' ? 'line_id' : 'return_id'], label);
    if (ids.has(id)) throw Error(`${label}: duplicate ${kind === 'sales' ? 'line_id' : 'return_id'} “${id}”.`);
    ids.add(id);
    const result = { line_id: text(row.line_id, label), units: units(row.units, label) };
    if (kind === 'returns') return { ...result, return_id: id, return_date: date(row.return_date, label) };
    if (!/^(0|[1-9]\d{0,4})(\.\d{1,2})?$/.test(row.unit_price_usd)) throw Error(`${label}: price must be USD 0–10,000 with at most two decimal places; no currency symbols.`);
    const [whole, fraction = ''] = row.unit_price_usd.split('.');
    const priceCents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
    if (priceCents > 1000000) throw Error(`${label}: price exceeds USD 10,000.`);
    return { ...result, sale_date: date(row.sale_date, label), product: text(row.product, label), channel: text(row.channel, label), priceCents, grossCents: result.units * priceCents, month: row.sale_date.slice(0, 7) };
  });
}
export function joinData(salesCsv, returnsCsv) {
  const sales = parseCsv(salesCsv, 'sales');
  const returns = parseCsv(returnsCsv, 'returns');
  const salesById = new Map(sales.map(row => [row.line_id, row]));
  for (const row of returns) {
    const sale = salesById.get(row.line_id);
    if (!sale) throw Error(`returns: unmatched line_id “${row.line_id}”. Import its sale too.`);
    if (row.return_date < sale.sale_date) throw Error(`returns: “${row.return_id}” predates its sale.`);
  }
  // Aggregate before joining so partial returns never multiply a sales row.
  const returned = aq.from(returns.length ? returns : [{ line_id: null, units: 0 }])
    .groupby('line_id').rollup({ returnedUnits: aq.op.sum('units') });
  const joined = aq.from(sales).join_left(returned, 'line_id')
    .derive({ returnedUnits: d => d.returnedUnits || 0 })
    .derive({ refundCents: d => d.returnedUnits * d.priceCents, netUnits: d => d.units - d.returnedUnits })
    .derive({ netCents: d => d.grossCents - d.refundCents }).objects();
  const over = joined.find(row => row.returnedUnits > row.units);
  if (over) throw Error(`returns: “${over.line_id}” returns ${over.returnedUnits} units but sold ${over.units}.`);
  return { rows: joined, returnCount: returns.length, observedThrough: [...sales.map(d => d.sale_date), ...returns.map(d => d.return_date)].sort().at(-1) };
}
const sums = { units: aq.op.sum('units'), returnedUnits: aq.op.sum('returnedUnits'), grossCents: aq.op.sum('grossCents'), refundCents: aq.op.sum('refundCents'), netCents: aq.op.sum('netCents') };
const zero = { units: 0, returnedUnits: 0, grossCents: 0, refundCents: 0, netCents: 0 };
export function summarize(dataset, { month = '', product = '', channel = '', group = 'product' } = {}) {
  const table = aq.from(dataset.rows).filter(aq.escape(d => (!month || d.month === month) && (!product || d.product === product) && (!channel || d.channel === channel)));
  const rows = table.objects();
  if (!rows.length) return { rows: [], totals: { ...zero }, groups: [], months: [] };
  const groups = table.groupby(group === 'pair' ? ['product', 'channel'] : [group]).rollup(sums).objects()
    .map(d => ({ ...d, label: group === 'pair' ? `${d.product} · ${d.channel}` : d[group] }));
  // Competition ranking: ties share the first occupied rank.
  for (const [value, rank] of [['grossCents', 'grossRank'], ['netCents', 'netRank']]) {
    const ranks = new Map();
    groups.map(d => d[value]).sort((a, b) => b - a).forEach((amount, i) => { if (!ranks.has(amount)) ranks.set(amount, i + 1); });
    groups.forEach(d => d[rank] = ranks.get(d[value]));
  }
  groups.sort((a, b) => b.refundCents - a.refundCents || a.label.localeCompare(b.label));
  return { rows, totals: table.rollup(sums).object(), groups, months: table.groupby('month').rollup(sums).orderby('month').objects() };
}
export function exportCsv(rows) {
  return Papa.unparse(rows, { escapeFormulae: true });
}
