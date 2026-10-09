import { exportCsv } from './model.js';
// Entirely invented, deterministic classroom data. No customer records.
export function sampleFiles() {
  const products = [['Weekender tote', 89], ['Studio tumbler', 32], ['Everyday tee', 28], ['Desk organizer', 54]];
  const channels = ['Paid social', 'Organic search', 'Email'];
  const sales = [], returns = [];
  for (let month = 1; month <= 8; month++) {
    products.forEach(([product, price], p) => channels.forEach((channel, c) => {
      for (let batch = 0; batch < 4; batch++) {
        const line_id = `S${String(sales.length + 1).padStart(4, '0')}`;
        const units = 6 + ((month * 7 + p * 5 + c * 3 + batch * 11) % 12) + (p === 0 && c === 0 ? 10 + Math.floor(month / 2) : c === 1 ? 5 : 0);
        sales.push({ line_id, sale_date: `2026-0${month}-${String(3 + batch * 6).padStart(2, '0')}`, product, channel, units, unit_price_usd: `${price}.00` });
        // Deliberate interaction plus reproducible overlap and exceptions; no simulated customer claim.
        const noise = (((month * 73 + p * 37 + c * 19 + batch * 41) % 101) / 100 - .5) * .42;
        const base = p === 0 && c === 0 ? .43 : p === 2 && c === 0 ? .24 : c === 2 ? .08 : .14;
        const rate = Math.max(0, Math.min(.7, base + noise + (p === 2 && c === 2 && month === 5 ? .3 : 0)));
        const count = Math.floor(units * rate);
        if (count) {
          const chunks = count > 3 ? [2, count - 2] : [count];
          chunks.forEach((n, i) => returns.push({ return_id: `R${String(returns.length + 1).padStart(4, '0')}`, line_id, return_date: `2026-0${month + 1}-${i ? '28' : '15'}`, units: n }));
        }
      }
    }));
  }
  return { sales: exportCsv(sales), returns: exportCsv(returns) };
}
