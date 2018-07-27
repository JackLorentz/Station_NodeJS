var socket = io.connect('/');

socket.on('msg', (message)=>{
    alert(message);
});