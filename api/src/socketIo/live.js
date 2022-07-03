

const {
  userJoin,
} = require('../utilities/users');



exports.io = async (http) => {
  try {
    const { Server } = require("socket.io");
    const io = new Server(http, {
      cors: '*'
    });
    io.on('connection', async (socket) => {




      try {


        socket.on('chat message', (roomID) => {
          console.log('user :', roomID)
          io
            //  .to('hello')
            .emit(roomID, roomID);
        });
  
        socket.on('update-center-time', (roomID) => {
          io
            .emit(roomID+'-center-time', roomID);
        });

        socket.on('book-slot', (roomID, date, data) => {
          io
            .emit(roomID+'-book-slot',  date);

            io
            .emit(roomID+'-notifications', data);

        });

        socket.on('cancel-appointment', (roomID) => {
          

            io
            .emit(roomID+'-notifications');

        });

        socket.on('notification', (roomID, data) => {
          
          console.log(data,"live notification-----------------------------------------------------------------------------------"+roomID, "live notification")
          io
          .emit(roomID+'-notifications', data);

      });

      socket.on('enquiry-chat', (roomID, data) => {
          
        console.log(data,"live notification-----------------------------------------------------------------------------------"+roomID, "live notification")
        io
        .emit(roomID+'enquiry-chat', data);

    });


    socket.on('center-chat', (roomID, data) => {
      console.log("lchar-----------------------------------------------------------------------------------"+roomID, "live notification")
     
      io
      .emit(roomID+'-center-chat', data);

  });

  socket.on('admin-center-chat', (roomID) => {
          
    io
    .emit(roomID+'admin-center-chat');

});



        


      } catch (error) {
        socket.on('disconnect', () => {
          //console.log('user disconnected');
        });
      }
    });
  } catch (error) {
    socket.on('disconnect', () => {
      console.log('user disconnected ', error);
    });
  }


}
