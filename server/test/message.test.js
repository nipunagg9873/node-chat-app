const expect=require('expect');

var {generateMessage,generateLocationMessage}=require('./../utils/message');


describe('generate message',()=>{
  it('should generate a message ',()=>{
    var from="test",text="test text";
    var message=generateMessage(from,text);

    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
    expect(typeof(message.createdAt)).toBe('number');
  });
});
describe('generate location message',()=>{
  it('should generate Location a message ',()=>{
    var from="test";
    var url="https://www.google.com/maps?q=1,2";
    var message=generateLocationMessage(from,1,2);

    expect(message.from).toBe(from);
    expect(message.url).toBe(url);
    expect(typeof(message.createdAt)).toBe('number');
  });
});
