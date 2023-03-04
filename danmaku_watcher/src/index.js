"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tiny_bilibili_ws_1 = require("tiny-bilibili-ws");
const mongo_1 = require("./mongo");
const msgResolver_1 = require("./msgResolver");
// const ROOM_ID = 13308358 // 甜药
// const ROOM_ID = 21919321 // Hiiro
// const ROOM_ID = 1017 // 散人
// const ROOM_ID = 2347971 // My
const ROOM_ID = 21452505; // 七海
let liveTCP;
async function main() {
    const res = await (0, tiny_bilibili_ws_1.getLongRoomId)(ROOM_ID);
    await (0, mongo_1.initMongo)(ROOM_ID);
    console.log('mongo init success');
    const roomID = res.data.room_id;
    liveTCP = createLiveTCP(roomID);
    liveTCP.tcpSocket.on('close', () => {
        console.log('Restart TCP');
        liveTCP.tcpSocket.destroy();
        liveTCP = createLiveTCP(roomID);
    });
}
function createLiveTCP(roomID) {
    const liveTCP = new tiny_bilibili_ws_1.KeepLiveTCP(roomID);
    listenOnLive(liveTCP);
    return liveTCP;
}
function listenOnLive(liveTCP) {
    liveTCP.on('msg', async (msg) => {
        const cmd = msg.data?.cmd;
        console.log('cmd', cmd);
        if (cmd) {
            try {
                const doc = (0, msgResolver_1.resolveMsg)(msg.data);
                if (doc) {
                    await mongo_1.db.bili?.collection(cmd).insertOne(doc);
                    console.log('insert', cmd);
                }
            }
            catch (error) {
                console.error('inser error', error, msg.data);
            }
        }
        else {
            console.error('no cmd');
        }
    });
}
try {
    main();
}
finally {
    (0, mongo_1.closeMongo)();
}
