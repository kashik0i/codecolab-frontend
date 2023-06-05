<script lang="ts">
    import { onMount } from 'svelte';
    import { createTransport, createProducer, createConsumer } from './mediasoup';

    let producer;
    let consumer;

    onMount(async () => {
        const transport = await createTransport();
        producer = await createProducer(transport);
        consumer = await createConsumer(transport, producer.id);
        consumer.on('track', (track) => {
            const videoElement = document.getElementById('video');
            videoElement.srcObject = new MediaStream([track]);
            videoElement.play();
        });
    });
</script>

<video id="video" autoplay></video>
