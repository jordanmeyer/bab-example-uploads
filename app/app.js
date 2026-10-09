import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, AriaComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { echartsTheme } from './theme/echarts.js';
import { duke } from './theme/tokens.js';
import { joinData, summarize, exportCsv, summaryExportRows, MAX_BYTES } from './model.js';
import { sampleFiles } from './sample.js';
import { maturitySales,earlyReturns,laterReturns } from './examples.js';

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
let dataset, source, eventsByLine, auditLineId, view, page = 0, importVersion = 0;
const sampleSource={label:'Synthetic sample',sales:'common-goods-sales.csv',returns:'common-goods-returns.csv'};
const filters=()=>Object.fromEntries(['month','product','channel','group'].map(id=>[id,$(id).value]));
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
function load(next, identity) {
  dataset = next;source=identity;auditLineId=null;eventsByLine=new Map();for(const event of dataset.returnEvents){if(!eventsByLine.has(event.line_id))eventsByLine.set(event.line_id,[]);eventsByLine.get(event.line_id).push(event);}
  $('dataset-name').textContent = source.label;
  $('source-files').textContent=`Sales: ${source.sales} (${number(dataset.rows.length)} ${dataset.rows.length===1?'line':'lines'})\nReturns: ${source.returns} (${number(dataset.returnCount)} ${dataset.returnCount===1?'event':'events'})`;
  $('dataset-meta').textContent = `${number(dataset.rows.length)} sales ${dataset.rows.length===1?'line':'lines'} · ${number(dataset.returnCount)} return ${dataset.returnCount===1?'event':'events'}`;
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
  [...$('rows-body').children].forEach((tr,i)=>{const row=view.rows[start+i],cell=document.createElement('td'),button=document.createElement('button');button.className='text-button';button.textContent=`Inspect ${row.line_id}`;button.onclick=()=>{auditLineId=row.line_id;renderRaw(row);$('raw-title').focus();};cell.append(button);tr.append(cell);});
  renderRaw(view.rows.find(row=>row.line_id===auditLineId)||view.rows.find(row=>(eventsByLine.get(row.line_id)||[]).length>1)||view.rows[0]);
}
function renderRaw(row) {
  $('raw-events').hidden=!row;if(!row)return;auditLineId=row.line_id;
  const events=eventsByLine.get(row.line_id)||[];
  $('raw-sale').textContent=`Sale ${row.line_id}: ${dateName(row.sale_date)}, ${row.product}, ${row.channel}; ${number(row.units)} units × ${unitMoney(row.priceCents)} = ${money(row.grossCents)} gross.`;
  table('event-body',events.slice(0,100).map(event=>[event.return_id,dateName(event.return_date),number(event.units)]));
  $('raw-join').textContent=`${events.length} return ${events.length===1?'event':'events'}${events.length>100?' (first 100 shown)':''}: ${events.length<=100?`${events.map(e=>e.units).join(' + ')||'0'} = `:''}${row.returnedUnits} returned units in total. Aggregate first, then join once: ${money(row.grossCents)} − ${money(row.refundCents)} = ${money(row.netCents)} net, in one joined sale row.${events.length>1?` Joining the raw events directly would repeat this sale ${events.length} times and inflate its gross to ${money(row.grossCents*events.length)}.`:''}`;
}
function render() {
  page = 0;
  view = summarize(dataset, filters());
  const { totals: t, groups, months } = view;
  $('gross').textContent = money(t.grossCents); $('refund').textContent = money(t.refundCents); $('net').textContent = money(t.netCents);
  $('units').textContent = `${number(t.units)} units across ${number(view.rows.length)} sales ${view.rows.length===1?'line':'lines'}`;
  $('rate').textContent = rate(t.returnedUnits, t.units); $('returned-units').textContent = `${number(t.returnedUnits)} of ${number(t.units)} units returned`;
  $('refund-share').textContent = `${rate(t.refundCents, t.grossCents)} of gross sales returned`;
  $('empty').hidden = !!view.rows.length;
  $('export').textContent=`Export ${$('group').selectedOptions[0].textContent.toLowerCase()} summary (${groups.length} ${groups.length===1?'group':'groups'})`;
  $('export-context').textContent=`Original sale-month cohorts · ${$('month').value?monthName($('month').value):'all months'} · ${$('product').value||'all products'} · ${$('channel').value||'all channels'}. CSV includes this scope, filenames and observed-through date; blank filter metadata means all.`;
  $('matrix-selection').textContent=`${$('product').value||'All products'} × ${$('channel').value||'all channels'} · ${$('month').value?monthName($('month').value):'all sale months'}: ${number(t.returnedUnits)} / ${number(t.units)} units returned (${rate(t.returnedUnits,t.units)}).`;
  $('export').disabled = !groups.length; $('export-rows').disabled = !view.rows.length;
  const plotted = groups.slice(0, 12);
  $('truncation').textContent = `${groups.length>12?`Chart shows 12 of ${number(groups.length)} groups. `:''}${groups.length>100?`Table shows 100 of ${number(groups.length)} groups. `:''}`;
  const label = d => d.label.length > 25 ? `${d.label.slice(0, 24)}…` : d.label;
  $('quality-chart').style.height = `${Math.max(280, plotted.length * 48 + 65)}px`;
  quality.resize();
  quality.setOption({ animation: false, aria: { enabled: true, label: { description: 'Gross revenue split into net and returned revenue, in USD. Rounded dollar values appear in the following summary table; exports retain cents.' } }, tooltip: { trigger: 'axis', renderMode: 'richText', valueFormatter: value => money(Math.round(value * 100)), confine: true }, grid: { left: 8, right: 18, top: 14, bottom: 24, containLabel: true }, xAxis: { type: 'value', splitNumber: 3, axisLabel: { formatter: value => axisMoney.format(value), fontSize: 10, hideOverlap: true }, splitLine: { lineStyle: { color: colors.panel } } }, yAxis: { type: 'category', inverse: true, data: plotted.map(label), axisTick: { show: false }, axisLine: { show: false }, axisLabel: { fontSize: 11, width: 120, overflow: 'truncate' } }, series: [{ name: 'Kept (net)', type: 'bar', stack: 'revenue', barMaxWidth: 24, data: plotted.map(d => d.netCents / 100), itemStyle: { color: colors.navy } }, { name: 'Returned', type: 'bar', stack: 'revenue', data: plotted.map(d => d.refundCents / 100), itemStyle: { color: colors.copper } }] }, true);
  const leader = groups[0];
  $('insight').textContent = groups.length===1?`One group selected: ${leader.label}. Retained revenue ${money(leader.netCents)}; ${number(leader.returnedUnits)} / ${number(leader.units)} units returned (${rate(leader.returnedUnits,leader.units)}). A rank comparison needs more than one group. This is revenue, not profit.`:leader ? `${leader.label} gives back ${money(leader.refundCents)} (${rate(leader.refundCents, leader.grossCents)} of its gross sales). Its revenue rank moves from #${leader.grossRank} before returns to #${leader.netRank} after returns among the ${groups.length} matching groups. This is revenue, not profit.` : 'No matching groups to compare.';
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
  products.forEach(product=>{const row=document.createElement('tr'),name=document.createElement('th');name.scope='row';name.textContent=product;row.append(name);channels.forEach(channel=>{const cell=document.createElement('td'),pair=pairs.find(d=>d.product===product&&d.channel===channel);if(pair){const button=document.createElement('button');button.className='matrix-cell';button.textContent=`${rate(pair.returnedUnits,pair.units)} · ${number(pair.returnedUnits)} / ${number(pair.units)} units`;button.setAttribute('aria-label',`${product}, ${channel}: ${button.textContent}. Filter this combination`);button.onclick=()=>{$('product').value=product;$('channel').value=channel;render();$('matrix-selection').focus();};cell.append(button);}else cell.textContent='No sales';row.append(cell);});body.append(row);});
  const caption=document.createElement('caption');caption.textContent='Returned / sold units · current filters';$('matrix').replaceChildren(caption,head,body);
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
$('reset').addEventListener('click', () => { importVersion++; load(joinData(sample.sales, sample.returns), sampleSource); $('import-form').reset(); message(`Sample restored. ${number(dataset.rows.length)} invented sales lines and ${number(dataset.returnCount)} return events are ready to explore.`); });
$('previous').addEventListener('click', () => { page--; renderRows(); });
$('next').addEventListener('click', () => { page++; renderRows(); });
$('download-sales').addEventListener('click', () => download('common-goods-sales.csv', sample.sales));
$('download-returns').addEventListener('click', () => download('common-goods-returns.csv', sample.returns));
$('export').addEventListener('click', () => download(`revenue-summary-by-${$('group').value}.csv`, exportCsv(summaryExportRows(dataset,filters(),source))));
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
    load(next, {label:'Your local files',sales:sales.name,returns:returns.name});
    message(`Imported ${number(next.rows.length)} sales ${next.rows.length===1?'line':'lines'} and ${number(next.returnCount)} return ${next.returnCount===1?'event':'events'}. All IDs matched. Files remain in this tab only.`);
  } catch (error) {
    if (version === importVersion) message(`${error.message} Previous data is unchanged.`, true);
  }
});
load(joinData(sample.sales, sample.returns), sampleSource);
// Reconcile browser-restored selects before displaying any returning results.
window.addEventListener('pageshow',()=>requestAnimationFrame(()=>{render();}));
message('Explore the synthetic sample, or import two local CSV files. Nothing is uploaded or saved.');

document.querySelector('a[href="#file-contract"]').addEventListener('click',()=>{$('file-contract').open=true;});

$('matrix-all').addEventListener('click',()=>{$('product').value='';$('channel').value='';render();$('matrix-selection').focus();});
for(const stage of ['early','later']) $(`maturity-${stage}`).addEventListener('click',()=>{importVersion++;const isEarly=stage==='early';load(joinData(maturitySales,isEarly?earlyReturns:laterReturns),{label:`Maturity example · ${stage} snapshot`,sales:'maturity-sales.csv',returns:`returns-as-of-${isEarly?'2026-06-10':'2026-07-05'}.csv`});$('import-form').reset();message(`${isEarly?'Early':'Later'} snapshot loaded. Same June sale; ${isEarly?'2 units returned by June 10.':'5 units returned by July 5.'} Restore sample to return to the eight cohorts.`);$('analysis').focus();});
