import dgram, { IncomingPacket, SocketAsPromised } from "dgram-as-promised";
// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.log("Logs from your program will appear here!");
// const udpSocket: dgram.Socket = dgram.createSocket("udp4");
// udpSocket.bind(2053, "127.0.0.1");
// // Uncomment this block to pass the first stage
// //
// // const udpSocket: dgram.Socket = dgram.createSocket("udp4");
// // udpSocket.bind(2053, "127.0.0.1");
// //
// // udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
// //     try {
// //         console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
// //         const response = Buffer.from("");
// //         udpSocket.send(response, remoteAddr.port, remoteAddr.address);
// //     } catch (e) {
// //         console.log(`Error sending data: ${e}`);
// //     }
// // });
// udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
//     try {
//         console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
//         const response = Buffer.from("");
//         udpSocket.send(response, remoteAddr.port, remoteAddr.address);
//     } catch (e) {
//         console.log(`Error sending data: ${e}`);
//     }
// });
const udpSocket: SocketAsPromised = dgram.createSocket("udp4");

udpSocket
  .bind(2053, "127.0.0.1")
  .then((bind) => console.log("Socket is connected to port 2053 : " + JSON.stringify(bind)))
  .catch((err) => console.log("Error while connecting to socket " + JSON.stringify(err)));

async function listener(listen: IncomingPacket) {
  console.log(`Received message: ${listen.msg.toString()}`);
  console.log(`Received ${JSON.stringify(listen.rinfo.size)} bytes`);

  const byte = await udpSocket.send(listen.msg, 0, listen.rinfo.size, listen.rinfo.port, listen.rinfo.address);
  console.log(`Message is sent (${JSON.stringify(byte)} bytes)`);
}
for await (const packet of udpSocket) {
  listener(packet as IncomingPacket);
  // Close socket if Ctrl-D is in the message
  if (packet.msg.indexOf(4) !== -1) {
    await udpSocket.close();
  }
}

// udpSocket.recv().then((data) => listener(data as IncomingPacket));
