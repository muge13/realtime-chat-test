(function connect() {
    let socket = io.connect('http://localhost:3000');
    if (typeof (Storage) !== "undefined") {
        if (localStorage.testUsername) {
            socket.emit('change_username', { username: localStorage.testUsername })
            $(".card-header").text(localStorage.testUsername)
        }
    }
    $("#usernameBtn").click(function () {
        console.log($("#username").val())
        socket.emit('change_username', { username: $("#username").val() })
        $(".card-header").text($("#username").val())
        localStorage.testUsername = $("#username").val()
        $("#username").val('');
    });
    $('#messageBtn').click(function () {
        send_message();
    });
    $('#message').keypress(function (e) {
        socket.emit('typing');
        if (e.which == 13) {
            send_message();
        }
    });
    socket.on('typing', data => {
        $(".info").text = data.username + " is typing..."
        setTimeout(() => { $(".info").textContent = '' }, 5000)
    })
    socket.on('receive_message', data => {
        console.log(data)
        $("#message-list").append(`<li class="list-group-item">${data.username}:${data.message}</li>`);
    });
    function send_message(){
        console.log($('#message').val());
        socket.emit('new_message', { message: $('#message').val() })
        $('#message').val("")
    }


})()