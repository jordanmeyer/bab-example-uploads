// A bounded invented case: one sale observed before and after a later return.
export const maturitySales='line_id,sale_date,product,channel,units,unit_price_usd\nM1,2026-06-01,Canvas tote,Email,10,20.00';
export const earlyReturns='return_id,line_id,return_date,units\nMR1,M1,2026-06-10,2';
export const laterReturns=earlyReturns+'\nMR2,M1,2026-07-05,3';
