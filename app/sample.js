import { exportCsv } from './model.js';
// Entirely invented, deterministic classroom data. No customer records.
export function sampleFiles() {
  const products = [['Weekender tote', 89], ['Studio tumbler', 32], ['Everyday tee', 28], ['Desk organizer', 54]];
  const channels = ['Paid social', 'Organic search', 'Email'];
  const sales = [], returns = [];
  for (let month = 1; month <= 3; month++) {
    products.forEach(([product, price], p) => channels.forEach((channel, c) => {
      for (let batch = 0; batch < 4; batch++) {
        const line_id = `S${String(sales.length + 1).padStart(3, '0')}`;
        const units = 6 + ((p * 5 + c * 3 + batch) % 8) + (p === 0 && c === 0 ? month * 5 : month);
        sales.push({ line_id, sale_date: `2026-0${month}-${String(3 + batch * 6).padStart(2, '0')}`, product, channel, units, unit_price_usd: `${price}.00` });
        const rate = p === 0 && c === 0 ? .62 : p === 2 && c === 0 ? .30 : c === 2 ? .04 : .12;
        const count = Math.floor(units * rate);
        if (count) {
          const chunks = count > 3 ? [2, count - 2] : [count];
          chunks.forEach((n, i) => returns.push({ return_id: `R${String(returns.length + 1).padStart(3, '0')}`, line_id, return_date: `2026-0${month + 1}-${i ? '28' : '15'}`, units: n }));
        }
      }
    }));
  }
  return { sales: exportCsv(sales), returns: exportCsv(returns) };
}
