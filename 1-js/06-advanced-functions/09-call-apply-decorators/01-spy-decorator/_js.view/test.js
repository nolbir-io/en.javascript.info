describe("spy", function() {
  it("o'z mulkiga chaqiruvlarni yozib oladi", function() {
    function work() {}

    work = spy(work);
    assert.deepEqual(work.calls, []);

    work(1, 2);
    assert.deepEqual(work.calls, [
      [1, 2]
    ]);

    work(3, 4);
    assert.deepEqual(work.calls, [
      [1, 2],
      [3, 4]
    ]);
  });

  it("funksiyalarni shaffof tarzda o‘rab oladi", function() {

    let sum = sinon.spy((a, b) => a + b);

    let wrappedSum = spy(sum);

    assert.equal(wrappedSum(1, 2), 3);
    assert(sum.calledWith(1, 2));
  });


  it("usullarni shaffof tarzda o'rab oladi", function() {

    let calc = {
      sum: sinon.spy((a, b) => a + b)
    };

    calc.wrappedSum = spy(calc.sum);

    assert.equal(calc.wrappedSum(1, 2), 3);
    assert(calc.sum.calledWith(1, 2));
    assert(calc.sum.calledOn(calc));
  });

});
