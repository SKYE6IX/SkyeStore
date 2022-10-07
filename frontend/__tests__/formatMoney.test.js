import formatMoney from '../lib/formatMoney'  
describe('format money function', ()=>{
    it('works with fractional dollars', ()=>{
        expect(formatMoney(1)).toEqual('$0.01');
        expect(formatMoney(9)).toEqual('$0.09');
        expect(formatMoney(150)).toEqual('$1.50');
    });

    it('Leave of cent when its whole dollar', ()=>{
        expect(formatMoney(5000)).toEqual('$50');
        expect(formatMoney(5000000)).toEqual('$50,000');
    });
    
})