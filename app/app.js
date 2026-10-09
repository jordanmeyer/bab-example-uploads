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
const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits:0 }).format(cents / 100);
const unitMoney = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const dateName = value => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
const axisMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });
const number = value => value.toLocaleString('en-US');
const rate = (a, b) => b ? `${(100 * a / b).toFixed(1)}%` : 'n/a';
const monthName = value => new Date(`${value}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const sample = sampleFiles();
await Promise.all([document.fonts.load("400 18px 'EB Garamond'"),document.fonts.load("400 14px 'Open Sans'"),document.fonts.load("600 14px 'Open Sans'")]);
const colors = duke();
let dataset, view, page = 0, importVersion = 0;
const quality = echarts.init($('quality-chart'), echartsTheme());
let trend;
const resize = new ResizeObserver(() => { quality.resize(); trend?.resize(); });
resize.observe($('quality-chart')); resize.observe($('trend-chart'));
window.addEventListener('pagehide', event => { if (!event.persisted) { resize.disconnect(); quality.dispose(); trend?.dispose(); } });

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
  $('coverage').textContent = `Observed through ${dateName(dataset.observedThrough)}. Returns are assigned to the original sales cohort; later cohorts may still receive returns.`;
  render();
}
function renderRows() {
  const start = page * 20;
  table('rows-body', view.rows.slice(start, start + 20).map(d => [d.line_id, dateName(d.sale_date), d.product, d.channel, number(d.units), number(d.returnedUnits), unitMoney(d.priceCents), money(d.netCents)]));
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
  $('truncation').textContent = `${groups.length>12?`Chart shows 12 of ${number(groups.length)} groups. `:''}${groups.length>100?`Table shows 100 of ${number(groups.length)} groups. `:''}`;
  const label = d => d.label.length > 25 ? `${d.label.slice(0, 24)}…` : d.label;
  $('quality-chart').style.height = `${Math.max(280, plotted.length * 48 + 65)}px`;
  quality.resize();
  quality.setOption({ animation: false, aria: { enabled: true, label: { description: 'Gross revenue split into net and returned revenue, in USD. Rounded dollar values appear in the following summary table; exports retain cents.' } }, tooltip: { trigger: 'axis', renderMode: 'richText', valueFormatter: value => money(Math.round(value * 100)), confine: true }, grid: { left: 8, right: 18, top: 14, bottom: 24, containLabel: true }, xAxis: { type: 'value', splitNumber: 3, axisLabel: { formatter: value => axisMoney.format(value), fontSize: 10, hideOverlap: true }, splitLine: { lineStyle: { color: colors.panel } } }, yAxis: { type: 'category', inverse: true, data: plotted.map(label), axisTick: { show: false }, axisLine: { show: false }, axisLabel: { fontSize: 11, width: 120, overflow: 'truncate' } }, series: [{ name: 'Kept (net)', type: 'bar', stack: 'revenue', barMaxWidth: 24, data: plotted.map(d => d.netCents / 100), itemStyle: { color: colors.navy } }, { name: 'Returned', type: 'bar', stack: 'revenue', data: plotted.map(d => d.refundCents / 100), itemStyle: { color: colors.copper } }] }, true);
  const leader = groups[0];
  $('insight').textContent = leader ? `${leader.label} gives back ${money(leader.refundCents)} (${rate(leader.refundCents, leader.grossCents)} of its gross sales). Its revenue rank moves from #${leader.grossRank} before returns to #${leader.netRank} after returns among the ${groups.length} matching groups. This is revenue, not profit.` : 'No matching groups to compare.';
  table('summary-body', groups.slice(0, 100).map(d => [d.label, money(d.grossCents), money(d.refundCents), money(d.netCents), rate(d.returnedUnits, d.units), `#${d.grossRank} → #${d.netRank}`]));
  if(trend) trend.setOption({ animation: false, aria: { enabled: true, label: { description: 'Gross and net sales in USD by original sale month. Open Read monthly values below for rounded dollar totals.' } }, tooltip: { trigger: 'axis', renderMode: 'richText', confine: true, valueFormatter: value => money(Math.round(value * 100)) }, legend: { bottom: 0, data: ['Gross sales', 'Net sales'] }, grid: { left: 8, right: 14, top: 20, bottom: 45, containLabel: true }, xAxis: { type: 'category', data: months.map(d => monthName(d.month)), axisTick: { show: false } }, yAxis: { type: 'value', splitNumber: 3, axisLabel: { fontSize: 10, formatter: value => axisMoney.format(value), hideOverlap: true }, splitLine: { lineStyle: { color: colors.panel } } }, series: [{ name: 'Gross sales', type: 'line', symbol: 'circle', symbolSize: 8, data: months.map(d => d.grossCents / 100), itemStyle: { color: colors.copper }, lineStyle: { type: 'dashed', color: colors.copper, width: 2 } }, { name: 'Net sales', type: 'line', symbol: 'rect', symbolSize: 8, data: months.map(d => d.netCents / 100), itemStyle: { color: colors.navy }, lineStyle: { color: colors.navy, width: 3 } }] }, true);
  table('monthly-body', months.map(d => [monthName(d.month), money(d.grossCents), money(d.refundCents), money(d.netCents), rate(d.returnedUnits, d.units)]));
  renderMatrix();
  renderRows();
}
function renderMatrix() {
  const pairs=summarize(dataset,{month:$('month').value,product:$('product').value,channel:$('channel').value,group:'pair'}).groups;
  const allProducts=[...new Set(pairs.map(d=>d.product))],allChannels=[...new Set(pairs.map(d=>d.channel))];
  const products=allProducts.slice(0,12),channels=allChannels.slice(0,8);
  $('matrix-limit').textContent=allProducts.length>12||allChannels.length>8?`Showing ${products.length} of ${allProducts.length} products and ${channels.length} of ${allChannels.length} channels, ordered by largest returned-revenue group. Filter to inspect other combinations; summary export includes all groups.`:'';
  const head=document.createElement('thead'),header=document.createElement('tr');
  ['Product',...channels].forEach(label=>{const th=document.createElement('th');th.scope='col';th.textContent=label;header.append(th);});head.append(header);
  const body=document.createElement('tbody');
  products.forEach(product=>{const row=document.createElement('tr'),name=document.createElement('th');name.scope='row';name.textContent=product;row.append(name);channels.forEach(channel=>{const cell=document.createElement('td'),pair=pairs.find(d=>d.product===product&&d.channel===channel);if(pair){const button=document.createElement('button');button.className='matrix-cell';button.textContent=`${rate(pair.returnedUnits,pair.units)} · ${number(pair.returnedUnits)} / ${number(pair.units)} units`;button.setAttribute('aria-label',`${product}, ${channel}: ${button.textContent}. Filter this combination`);button.onclick=()=>{$('product').value=product;$('channel').value=channel;render();};cell.append(button);}else cell.textContent='No sales';row.append(cell);});body.append(row);});
  $('matrix').replaceChildren(head,body);
}
function showView(name) {
  document.querySelectorAll('[data-view]').forEach(button=>{const active=button.dataset.view===name;button.setAttribute('aria-pressed',active);button.classList.toggle('secondary',!active);});
  for(const key of ['revenue','patterns','audit']) $(`${key}-view`).hidden=key!==name;
  if(name==='patterns'&&!trend) {trend=echarts.init($('trend-chart'),echartsTheme());render();}
  quality.resize();trend?.resize();
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.view)));
$('filters').addEventListener('submit', event => event.preventDefault());
['month', 'product', 'channel', 'group'].forEach(id => $(id).addEventListener('change', render));
$('clear').addEventListener('click', () => { ['month', 'product', 'channel'].forEach(id => $(id).value = ''); render(); });
$('reset').addEventListener('click', () => { importVersion++; load(joinData(sample.sales, sample.returns), 'Synthetic sample'); $('import-form').reset(); message(`Sample restored. ${number(dataset.rows.length)} invented sales lines and ${number(dataset.returnCount)} return events are ready to explore.`); });
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
// Reconcile browser-restored selects before displaying any returning results.
window.addEventListener('pageshow',()=>requestAnimationFrame(()=>{render();}));
message('Explore the synthetic sample, or import two local CSV files. Nothing is uploaded or saved.');

document.querySelector('a[href="#file-contract"]').addEventListener('click',()=>{$('file-contract').open=true;});
