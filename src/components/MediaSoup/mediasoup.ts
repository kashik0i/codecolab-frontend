import io from 'socket.io-client';
import { Device } from 'mediasoup-client';

const socket = io('http://localhost:3000');
const device = new Device();

export async function createTransport() {
    const data = await fetch('/api/create-transport').then((res) => res.json());
    const transport = device.createSendTransport(data);
    transport.on('connect', ({ dtlsParameters }, callback, errback) => {
        socket.emit('transport-connect', dtlsParameters, callback, errback);
    });
    return transport;
}

export async function createProducer(transport) {
    const data = await fetch('/api/create-producer').then((res) => res.json());
    const producer = await transport.produce(data);
    return producer;
}

export async function createConsumer(transport, producerId) {
    const data = await fetch(`/api/create-consumer?producerId=${producerId}`).then((res) => res.json());
    const consumer = await transport.consume(data);
    return consumer;
}
