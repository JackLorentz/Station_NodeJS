var socket = io.connect('/');

socket.on('login_alert', (message)=>{
    alert(message);
});