import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, AriaComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { echartsTheme } from './theme/echarts.js';
import { duke } from './theme/tokens.js';
import { joinData, summarize, exportCsv, MAX_BYTES } from './model.js';
import { sampleFiles } from './sample.js';

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, AriaComponent, CanvasRenderer]);
const $ = id => document.getElementById(id);
const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const axisMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
const number = value => value.toLocaleString('en-US');
const rate = (a, b) => b ? `${(100 * a / b).toFixed(1)}%` : 'n/a';
const monthName = value => new Date(`${value}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const sample = sampleFiles();
const colors = duke();
let dataset, view, page = 0, importVersion = 0;
const quality = echarts.init($('quality-chart'), echartsTheme());
const trend = echarts.init($('trend-chart'), echartsTheme());
const resize = new ResizeObserver(() => { quality.resize(); trend.resize(); });
resize.observe($('quality-chart')); resize.observe($('trend-chart'));
window.addEventListener('pagehide', event => { if (!event.persisted) { resize.disconnect(); quality.dispose(); trend.dispose(); } });

function message(text, error = false) {
  $('notice').textContent = text;
  $('notice').classList.toggle('error', error);
}
function download(name, csv) {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function table(id, rows) {
  $(id).replaceChildren(...rows.map(cells => {
    const row = document.createElement('tr');
    cells.forEach(text => { const cell = document.createElement('td'); cell.textContent = text; row.append(cell); });
    return row;
  }));
}
function load(next, name) {
  dataset = next;
  $('dataset-name').textContent = name;
  $('dataset-meta').textContent = `${number(dataset.rows.length)} sales lines · ${number(dataset.returnCount)} return events`;
  for (const id of ['month', 'product', 'channel']) {
    $(id).replaceChildren(new Option(`All ${id === 'month' ? 'months' : `${id}s`}`, ''));
    [...new Set(dataset.rows.map(d => d[id]))].sort().forEach(value => $(id).add(new Option(id === 'month' ? monthName(value) : value, value)));
  }
  $('coverage').textContent = `Observed through ${dataset.observedThrough}. Returns are assigned to the original sales cohort; later cohorts may still receive returns.`;
  render();
}
function renderRows() {
  const start = page * 20;
  table('rows-body', view.rows.slice(start, start + 20).map(d => [d.line_id, d.sale_date, d.product, d.channel, number(d.units), number(d.returnedUnits), money(d.priceCents), money(d.netCents)]));
  $('page-info').textContent = view.rows.length ? `Lines ${start + 1}–${Math.min(start + 20, view.rows.length)} of ${number(view.rows.length)}` : '0 matching lines';
  $('previous').disabled = page === 0; $('next').disabled = start + 20 >= view.rows.length;
}
function render() {
  page = 0;
  view = summarize(dataset, Object.fromEntries(['month', 'product', 'channel', 'group'].map(id => [id, $(id).value])));
  const { totals: t, groups, months } = view;
  $('gross').textContent = money(t.grossCents); $('refund').textContent = money(t.refundCents); $('net').textContent = money(t.netCents);
  $('units').textContent = `${number(t.units)} units across ${number(view.rows.length)} sales lines`;
  $('rate').textContent = rate(t.returnedUnits, t.units); $('returned-units').textContent = `${number(t.returnedUnits)} of ${number(t.units)} units returned`;
  $('refund-share').textContent = `${rate(t.refundCents, t.grossCents)} of gross sales returned`;
  $('empty').hidden = !!view.rows.length;
  $('export').disabled = !groups.length; $('export-rows').disabled = !view.rows.length;
  const plotted = groups.slice(0, 12);
  const label = d => d.label.length > 25 ? `${d.label.slice(0, 24)}…` : d.label;
  $('quality-chart').style.height = `${Math.max(280, plotted.length * 48 + 65)}px`;
  quality.resize();
  quality.setOption({ animation: false, aria: { enabled: true, label: { description: 'Gross revenue split into net and returned revenue, in USD. Exact values appear in the following summary table.' } }, tooltip: { trigger: 'axis', renderMode: 'richText', valueFormatter: value => money(Math.round(value * 100)), confine: true }, grid: { left: 8, right: 18, top: 14, bottom: 24, containLabel: true }, xAxis: { type: 'value', splitNumber: 3, axisLabel: { formatter: value => axisMoney.format(value), fontSize: 10, hideOverlap: true }, splitLine: { lineStyle: { color: colors.panel } } }, yAxis: { type: 'category', inverse: true, data: plotted.map(label), axisTick: { show: false }, axisLine: { show: false }, axisLabel: { fontSize: 11, width: 120, overflow: 'truncate' } }, series: [{ name: 'Kept (net)', type: 'bar', stack: 'revenue', barMaxWidth: 24, data: plotted.map(d => d.netCents / 100), itemStyle: { color: colors.navy } }, { name: 'Returned', type: 'bar', stack: 'revenue', data: plotted.map(d => d.refundCents / 100), itemStyle: { color: colors.copper } }] }, true);
  const leader = groups[0];
  $('insight').textContent = leader ? `${leader.label} gives back ${money(leader.refundCents)} (${rate(leader.refundCents, leader.grossCents)} of its gross sales). Its revenue rank moves from #${leader.grossRank} before returns to #${leader.netRank} after returns among the ${groups.length} visible groups. This is revenue, not profit.` : 'No matching groups to compare.';
  table('summary-body', groups.slice(0, 100).map(d => [d.label, money(d.grossCents), money(d.refundCents), money(d.netCents), rate(d.returnedUnits, d.units), `#${d.grossRank} → #${d.netRank}`]));
  trend.setOption({ animation: false, aria: { enabled: true, label: { description: 'Gross and net sales in USD by original sale month. Open Read monthly values below for the exact data.' } }, tooltip: { trigger: 'axis', renderMode: 'richText', confine: true, valueFormatter: value => money(Math.round(value * 100)) }, legend: { bottom: 0, data: ['Gross sales', 'Net sales'] }, grid: { left: 8, right: 14, top: 20, bottom: 45, containLabel: true }, xAxis: { type: 'category', data: months.map(d => monthName(d.month)), axisTick: { show: false } }, yAxis: { type: 'value', splitNumber: 3, axisLabel: { fontSize: 10, formatter: value => axisMoney.format(value), hideOverlap: true }, splitLine: { lineStyle: { color: colors.panel } } }, series: [{ name: 'Gross sales', type: 'line', symbol: 'circle', symbolSize: 8, data: months.map(d => d.grossCents / 100), itemStyle: { color: colors.copper }, lineStyle: { type: 'dashed', color: colors.copper, width: 2 } }, { name: 'Net sales', type: 'line', symbol: 'rect', symbolSize: 8, data: months.map(d => d.netCents / 100), itemStyle: { color: colors.navy }, lineStyle: { color: colors.navy, width: 3 } }] }, true);
  table('monthly-body', months.map(d => [monthName(d.month), money(d.grossCents), money(d.refundCents), money(d.netCents), rate(d.returnedUnits, d.units)]));
  renderRows();
}
$('filters').addEventListener('submit', event => event.preventDefault());
['month', 'product', 'channel', 'group'].forEach(id => $(id).addEventListener('change', render));
$('clear').addEventListener('click', () => { ['month', 'product', 'channel'].forEach(id => $(id).value = ''); render(); });
$('reset').addEventListener('click', () => { importVersion++; load(joinData(sample.sales, sample.returns), 'Synthetic sample'); $('import-form').reset(); message('Sample restored. All 144 invented sales lines and 99 return events are ready to explore.'); });
$('previous').addEventListener('click', () => { page--; renderRows(); });
$('next').addEventListener('click', () => { page++; renderRows(); });
$('download-sales').addEventListener('click', () => download('common-goods-sales.csv', sample.sales));
$('download-returns').addEventListener('click', () => download('common-goods-returns.csv', sample.returns));
$('export').addEventListener('click', () => download('revenue-summary.csv', exportCsv(view.groups.map(d => ({ group: d.label, gross_usd: (d.grossCents / 100).toFixed(2), returned_usd: (d.refundCents / 100).toFixed(2), net_usd: (d.netCents / 100).toFixed(2), sold_units: d.units, returned_units: d.returnedUnits, unit_return_rate: rate(d.returnedUnits, d.units), gross_rank: d.grossRank, net_rank: d.netRank })))));
$('export-rows').addEventListener('click', () => download('joined-sales.csv', exportCsv(view.rows.map(d => ({ line_id: d.line_id, sale_date: d.sale_date, product: d.product, channel: d.channel, sold_units: d.units, returned_units: d.returnedUnits, unit_price_usd: (d.priceCents / 100).toFixed(2), gross_usd: (d.grossCents / 100).toFixed(2), returned_usd: (d.refundCents / 100).toFixed(2), net_usd: (d.netCents / 100).toFixed(2) })))));
$('import-form').addEventListener('submit', async event => {
  event.preventDefault();
  const version = ++importVersion;
  try {
    const sales = $('sales-file').files[0], returns = $('returns-file').files[0];
    if (!sales || !returns) throw Error('Choose both a sales CSV and a returns CSV.');
    if (sales.size > MAX_BYTES || returns.size > MAX_BYTES) throw Error('Each file must be 5 MiB or smaller.');
    message('Validating both files…');
    const texts = await Promise.all([sales.text(), returns.text()]);
    const next = joinData(...texts);
    if (version !== importVersion) return;
    load(next, 'Your local files');
    message(`Imported ${number(next.rows.length)} sales lines and ${number(next.returnCount)} return events. All IDs matched. Files remain in this tab only.`);
  } catch (error) {
    if (version === importVersion) message(`${error.message} Previous data is unchanged.`, true);
  }
});
load(joinData(sample.sales, sample.returns), 'Synthetic sample');
message('Explore the synthetic sample, or import two local CSV files. Nothing is uploaded or saved.');
