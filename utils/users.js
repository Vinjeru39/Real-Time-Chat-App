const users = [];

//Join user to chat
function userJoin(socketid, userId, displayName, room) {
  const user = { socketid, userId, displayName, room };
  users.push(user);
  return user;
}

//GEt the current user
function getCurrentUser(socketid) {
  return users.find((user) => user.socketid === socketid);
}

//User leaves caht
function userLeave(socketid) {
  const index = users.findIndex((user) => user.socketid === socketid);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
