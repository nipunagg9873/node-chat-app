const expect=require('expect');
const validation=require('./../utils/validation')

describe('isRealString',()=>{
  it('should reject non string values',()=>{
    expect(validation.isRealString(23)).toBe(false);
  });

  it('should reject strings with only spaces',()=>{
    expect(validation.isRealString('   ')).toBe(false);
  });

  it('should allow strings with non spaced characters',()=>{
    expect(validation.isRealString('  f ')).toBe(true);
  });
});
