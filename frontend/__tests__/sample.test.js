// Learning about test basic
function add(a, b){
    return a + b
}
describe("sample test 101", () => {
  it("work as expected", () => {
    //we run our test statement to see if our test will pass
    expect(1).toEqual(1);
  });

  it('add sum of number', ()=>{
    expect(add(2,2)).toBe(4)
  })
});
