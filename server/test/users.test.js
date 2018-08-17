const expect=require('expect');
var {Users}=require('./../utils/users');

var users= new Users();

beforeEach(()=>{
  users.users=[{
    id:'123',
    name:'nipun',
    room: 'room1'
  },{
    id:'124',
    name:'abhishek',
    room: 'room2'
  },{
    id:'125',
    name:'chikoo',
    room: 'room1'
  }];
});

describe('User',()=>{
  it('should add a new user',()=>{
    var users= new Users();
    var user={
      id:"123",
      name:"nipun",
      room:"any room"
    };
    var resUser=users.addUser(user.id,user.name,user.room);
    expect(users.users).toEqual([user]);
    expect(resUser).toEqual(user);
  });
  it('should return user names for room1',()=>{
    var names=users.getUsersArray('room1');
    expect(names).toEqual(['nipun','chikoo']);
  });
  it('should return user names for room2',()=>{
    var names=users.getUsersArray('room2');
    expect(names).toEqual(['abhishek']);
  });
  it('should remove user by id',()=>{
    var saveUser=users.users[0];
    var user=users.removeUser('123');
    expect(user).toEqual(saveUser);
    expect(users.users.length).toBe(2);

  });
  it('should not remove user with invalid id',()=>{
    var user=users.removeUser('1');
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });
  it('should return user data by id',()=>{
    var user=users.getUser(users.users[0].id);
    expect(user).toEqual(users.users[0]);
  });
  it('should not return user data by invalid id',()=>{
    var user=users.getUser('1');
    expect(user).toNotExist();
  });
});
