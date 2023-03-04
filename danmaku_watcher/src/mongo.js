"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeMongo = exports.initMongo = exports.db = void 0;
const mongodb_1 = require("mongodb");
// mongo
const mongourl = 'mongodb://root:example@localhost:27017';
const biliDbName = 'bili_';
let client;
exports.db = {
    bili: null
};
async function initMongo(roomID) {
    client = new mongodb_1.MongoClient(mongourl);
    await client.connect();
    exports.db.bili = client.db(biliDbName + roomID);
}
exports.initMongo = initMongo;
function closeMongo() {
    if (client) {
        client.close();
    }
}
exports.closeMongo = closeMongo;
