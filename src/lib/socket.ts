import {io, Socket} from "socket.io-client";

export class SocketClient {
    private _socket: Socket;

    constructor() {
        this._socket = io('http://localhost:3000',{
            reconnectionDelay: 1000,
            reconnection: true,
            // reconnectionAttemps: 10,
            transports: ['websocket'],
            agent: false,
            upgrade: false,
            rejectUnauthorized: false
        });
        this._socket.on('connect', () => {
            console.log('Connected');

            this._socket.emit('events', {test: 'test'});
            this._socket.emit('identity', 0, response =>
                console.log('Identity:', response),
            );
        });
        this._socket.on('events', function (data) {
            console.log('event', data);
        });
        this._socket.on('exception', function (data) {
            console.log('event', data);
        });
        this._socket.on('disconnect', function () {
            console.log('Disconnected');
        });
    }

}