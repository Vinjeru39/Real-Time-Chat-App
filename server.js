const path = require("path");
const http = require("http");

const express = require("express");
const dotenv = require("dotenv");
const expressHandlebars = require("express-handlebars");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const morgan = require("morgan");
const socketio = require("socket.io");

const connectDB = require("./config/db");
const formatMessage = require("./utils/messages");
const User = require("./models/User");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

dotenv.config({ path: "./config/config.env" });
require("./config/passport")(passport);

connectDB();

//body-parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//express-session middelware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//morgan middleware if development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Handlebars middleware
app.engine("handlebars", expressHandlebars());
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

// const botName = "ChatCord Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ userId, recepientId, room }) => {
    if (getCurrentUser(socket.id)) {
      userLeave(socket.id);
      const initialRoom = Object.keys(socket.rooms)[1];
      socket.leave(initialRoom);
    }

    let dbUser;
    try {
      dbUser = await User.findById(userId);
    } catch (err) {
      return res.json("Server error");
    }

    let recepient;
    try {
      recepient = await User.findById(recepientId);
    } catch (err) {
      return res.json("Server error");
    }

    const user = userJoin(socket.id, userId, dbUser.displayName, room);
    socket.join(user.room);

    //display the recepient-info
    socket.emit("recepientInfo", {
      userImage: recepient.image,
      userName: recepient.displayName,
    });

    //Broadcast when a user connects
    // socket.broadcast
    //   .to(user.room)
    //   .emit(
    //     "message",
    //     formatMessage(botName, `${user.displayName} has joined the chat`)
    //   );
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.displayName, msg));
  });

  //Runs when client disconnects
  // socket.on("disconnect", () => {
  //   const user = userLeave(socket.id);

  //   if (user) {
  //     io.to(user.room).emit(
  //       "message",
  //       formatMessage(botName, `${user.displayName} has left the chat`)
  //     );
  //   }
  // });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
