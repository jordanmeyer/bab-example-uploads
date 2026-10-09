import { joinData, parseCsv, summarize, exportCsv, summaryExportRows, HEADERS, MAX_BYTES } from '../app/model.js';
import Papa from 'papaparse';
import {maturitySales,earlyReturns,laterReturns} from '../app/examples.js';
const sh = HEADERS.sales.join(','), rh = HEADERS.returns.join(',');
const sales = `${sh}\nA,2026-01-03,Canvas tote,Email,10,20.00\nB,2026-02-02,Travel mug,Search,5,30.00`;
const returns = `${rh}\nR1,A,2026-02-02,2\nR2,A,2026-03-01,1\nR3,B,2026-03-01,1`;
let failures = 0, count = 0;
const equal = (actual, expected) => { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw Error(`expected ${JSON.stringify(expected)}, observed ${JSON.stringify(actual)}`); };
function check(name, fn) {
  count++; const li = document.createElement('li');
  try { fn(); li.textContent = `PASS — ${name}`; li.className = 'pass'; }
  catch (error) { failures++; li.textContent = `FAIL — ${name}: ${error.message}`; li.className = 'fail'; }
  document.getElementById('results').append(li);
}
function rejects(name, s, r = returns, match = '') { check(name, () => { let error; try { joinData(s, r); } catch (e) { error = e; } if (!error || !error.message.includes(match)) throw Error(`expected rejection ${match}, observed ${error?.message || 'accepted'}`); }); }
const data = joinData(sales, returns);
check('Independent $350 gross − $90 returns = $260 net; 4 / 15 units', () => equal(summarize(data).totals, {units:15,returnedUnits:4,grossCents:35000,refundCents:9000,netCents:26000}));
check('Partial returns do not duplicate gross sales: two joined rows', () => equal(data.rows.length, 2));
check('January receives both later returns: $200 − $60 = $140', () => equal(summarize(data,{month:'2026-01'}).totals.netCents, 14000));
check('Product + channel filter: B = $150 − $30 = $120', () => equal(summarize(data,{product:'Travel mug',channel:'Search'}).totals.netCents, 12000));
check('Empty selection returns zero totals and no groups', () => equal(summarize(data,{product:'absent'}), {rows:[],totals:{units:0,returnedUnits:0,grossCents:0,refundCents:0,netCents:0},groups:[],months:[]}));
check('Header-only returns retain every sale at full value', () => equal(summarize(joinData(sales,rh)).totals.netCents,35000));
check('Exact cents: 3 × $0.10 less 1 × $0.10 = $0.20', () => equal(summarize(joinData(`${sh}\nA,2026-01-01,P,C,3,0.10`,`${rh}\nR,A,2026-01-02,1`)).totals.netCents,20));
check('Zero-price units still contribute to returned-unit counts', () => equal(summarize(joinData(sales.replace('20.00','0.00'),returns)).totals,{units:15,returnedUnits:4,grossCents:15000,refundCents:3000,netCents:12000}));
check('BOM, CRLF, commas and escaped quotes parse safely', () => equal(parseCsv(`\uFEFF${sh}\r\nA,2026-01-01,"Canvas, ""tote""",Email,1,2.00\r\n`, 'sales')[0].product,'Canvas, "tote"'));
check('Formula-looking product remains literal; CSV export escapes it', () => { const csv=exportCsv([{product:'=1+1',net:2}]); equal(Papa.parse(csv,{header:true}).data[0].product,"'=1+1"); });
check('All groups sum exactly to the overall totals', () => equal(summarize(data,{group:'channel'}).groups.reduce((sum,d)=>sum+d.netCents,0),26000));
check('Tied gross values share competition rank', () => { const d=joinData(sales.replace('5,30.00','10,20.00'),rh);equal(summarize(d).groups.map(d=>d.grossRank),[1,1]); });
rejects('Duplicate sales line is rejected',`${sales}\nA,2026-01-04,P,C,1,1.00`,returns,'duplicate');
rejects('Duplicate return event is rejected',sales,`${returns}\nR1,A,2026-03-02,1`,'duplicate');
rejects('Unmatched return is rejected',sales,returns.replace('R1,A','R1,Z'),'unmatched');
rejects('Cumulative over-return is rejected',sales,returns.replace('R1,A,2026-02-02,2','R1,A,2026-02-02,10'),'returns 11');
rejects('Return before sale is rejected',sales,returns.replace('2026-02-02,2','2026-01-01,2'),'predates');
rejects('Malformed quotation is rejected',`${sh}\nA,2026-01-01,"unclosed,Email,1,2.00`,rh,'malformed');
rejects('Missing header is rejected',sales.replace(',channel',''),returns,'malformed');
rejects('Extra field is rejected',`${sales},extra`,returns,'malformed');
rejects('Blank units are not coerced to zero',sales.replace('10,20.00',',20.00'),returns,'units');
rejects('Fractional units are rejected',sales.replace('10,20.00','1.5,20.00'),returns,'units');
rejects('Negative price is rejected',sales.replace('20.00','-20.00'),returns,'price');
rejects('Three decimal places are rejected',sales.replace('20.00','20.001'),returns,'price');
rejects('Exponent syntax is rejected',sales.replace('20.00','2e1'),returns,'price');
rejects('Impossible calendar date is rejected',sales.replace('2026-01-03','2026-02-30'),returns,'real date');
rejects('Invalid calendar month is rejected',sales.replace('2026-01-03','2026-99-03'),returns,'real date');
rejects('Empty sales file is rejected',sh,rh,'at least one');
check('Upper bounds remain exact: 10,000 lines × 10,000 units × $10,000', () => {const large=`${sh}\n`+Array.from({length:10000},(_,i)=>`L${i},2026-01-01,P,C,10000,10000.00`).join('\n');equal(summarize(joinData(large,rh)).totals.grossCents,100000000000000);});
rejects('10,001 rows are rejected',`${sh}\n`+Array.from({length:10001},(_,i)=>`L${i},2026-01-01,P,C,1,1.00`).join('\n'),rh,'10,000 rows');
rejects('Byte limit is checked before parsing', 'x'.repeat(MAX_BYTES+1),rh,'5 MiB');
check('Joint product/channel groups retain the interaction: same product in two channels remains separate',()=>{const paired=joinData(`${sales}\nC,2026-02-03,Canvas tote,Search,2,20.00`,`${returns}\nR4,C,2026-03-02,1`);const groups=summarize(paired,{group:'pair'}).groups;equal(groups.length,3);equal(groups.find(r=>r.product==='Canvas tote'&&r.channel==='Search').netCents,2000);equal(groups.find(r=>r.product==='Canvas tote'&&r.channel==='Email').netCents,14000);equal(groups.reduce((sum,r)=>sum+r.netCents,0),28000);});
check('Same June sale matures from 20% / $160 to 50% / $100 with the July return',()=>{const early=joinData(maturitySales,earlyReturns),late=joinData(maturitySales,laterReturns);equal([early.observedThrough,late.observedThrough],['2026-06-10','2026-07-05']);equal([summarize(early).totals.netCents,summarize(late).totals.netCents],[16000,10000]);equal([early.rows[0].month,late.rows[0].month],['2026-06','2026-06']);equal([early.rows[0].returnedUnits/early.rows[0].units,late.rows[0].returnedUnits/late.rows[0].units],[.2,.5]);});
check('Two raw return events survive aggregation but the sale joins once',()=>{const late=joinData(maturitySales,laterReturns);equal(late.returnEvents.map(e=>[e.return_id,e.units]),[['MR1',2],['MR2',3]]);equal(late.rows.map(r=>[r.line_id,r.grossCents,r.returnedUnits,r.netCents]),[['M1',20000,5,10000]]);});
check('Filtered summary exports retain source, observation date, time basis and exact cents',()=>{const rows=summaryExportRows(data,{month:'2026-01',product:'Canvas tote',channel:'Email',group:'channel'},{sales:'sales-reviewed.csv',returns:'=returns.csv'});equal(rows,[{sales_file:'sales-reviewed.csv',returns_file:'=returns.csv',source_sales_lines:2,source_return_events:3,time_basis:'original_sale_month',observed_through:'2026-03-01',sale_month_filter:'2026-01',product_filter:'Canvas tote',channel_filter:'Email',group_by:'channel',group:'Email',gross_usd:'200.00',returned_usd:'60.00',net_usd:'140.00',sold_units:10,returned_units:3,unit_return_rate:.3,gross_rank:1,net_rank:1}]);equal(Papa.parse(exportCsv(rows),{header:true}).data[0].returns_file,"'=returns.csv");});
const status=document.getElementById('status');status.textContent=`${count-failures}/${count} passed; ${failures} failed.`;status.className=failures?'fail':'pass';
