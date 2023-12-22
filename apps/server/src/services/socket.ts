import { Server } from "socket.io";
import { Redis } from "ioredis";

const pub = new Redis({
  host: "redis-dce2952-chat-adi.a.aivencloud.com",
  port: 17294,
  username: "default",
  password: "AVNS_U84J0XDMLp7uTF4LiI1",
});

const sub = new Redis({
  host: "redis-dce2952-chat-adi.a.aivencloud.com",
  port: 17294,
  username: "default",
  password: "AVNS_U84J0XDMLp7uTF4LiI1",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init socket service..");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    io.on("connect", async (socket) => {
      console.log("New socket connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message rec.", message);

        // publish this message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on('message', (channel, message)=> {
      if(channel === 'MESSAGES'){
        io.emit('message', message)
      }
    })
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
