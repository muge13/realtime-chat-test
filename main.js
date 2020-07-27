const express=require("express");
const socketio=require("socket.io");
const Sentiment = require('sentiment');

const app = express();
const sentiment = new Sentiment();

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res)=> {
    res.render('index');
})

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port: ${process.env.PORT || 3000}`);
});
const io = socketio(server)

io.on('connection', socket => {
    console.log("New user connected");
    socket.username = "Anonymous"

    socket.on('change_username', data => {
        socket.username = data.username;
        console.log(`Anonymous registered as ${socket.username}`);
    });
    socket.on('new_message', data => {
        let sentimentScore = sentiment.analyze(data.message);
        console.log(sentimentScore);
        console.log(`${socket.username}:${sentimentScore.score}|${data.message}`);
        
        io.sockets.emit('receive_message', {message: data.message, username: socket.username})
    });
    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: socket.username})
    })
})