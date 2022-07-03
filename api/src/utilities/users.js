const users = [];

// Join user to chat
function userJoin(id,room) {

 

  const user = { id, room};



  return user;
}


// // Get current user
// function getCurrentUser(id) {
//   return users.find(user => user.auth_key === id);
// }

// // User leaves chat
// function userLeave(id) {
//   const index = users.findIndex(user => user.auth_key === id);

//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }

// /*leave signle room*/
// function userLeaveRoom(room, id) {
//   const index = users.findIndex(user => user.auth_key === id && user.room == room);

//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }






// // Get room users
// function getRoomUsers(room = null) {
//   if (room == null) {
//      return users;
//   }
//   else {
   
//     return users.filter(user => user.room === room);
//   }
// }

// function getVoiceRoomUsers(channel_type = null) {

   
//     return users.filter(user => user.channel_type === channel_type);
  
// }

// function getSignleRoomUsers(room = null) {
 
//     return users.filter(user => user.room === room);
// }


module.exports = {
  userJoin,
  // getCurrentUser,
  // userLeave,
  // getRoomUsers
};