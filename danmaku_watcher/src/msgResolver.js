"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMsg = void 0;
const util_1 = require("./util");
const ignoreMsgList = [
    'STOP_LIVE_ROOM_LIST',
    'NOTICE_MSG',
    'ONLINE_RANK_TOP3',
    'LIVE_INTERACTIVE_GAME',
    'INTERACT_WORD',
    'RECOMMEND_CARD',
    'GOTO_BUY_FLOW',
    'ENTRY_EFFECT'
];
function resolveMsg(data) {
    if (ignoreMsgList.includes(data.cmd)) {
        return;
    }
    let doc;
    const cmd = data.cmd;
    if (cmd === 'DANMU_MSG') {
        doc = resolveDanmuData(data);
    }
    else if (cmd === 'LIVE') {
        doc = resolveLiveData(data);
    }
    else if (cmd === 'PREPARING') {
        doc = resolvePreparing(data);
    }
    else if (cmd === 'AREA_RANK_CHANGED') {
        doc = resolveAreaRankChanged(data);
    }
    else {
        doc = resolveDefault(data);
    }
    if (doc && !doc.localDate) {
        doc.localDate = (0, util_1.localDate)();
    }
    return doc;
}
exports.resolveMsg = resolveMsg;
function resolveDanmuData(data) {
    const dmInfo = data.info;
    const senderInfo = dmInfo[2];
    const cardInfo = dmInfo[3];
    const senderLiveLevelInfo = dmInfo[4];
    const sendTime = dmInfo[0][4];
    const dmJson = JSON.parse(dmInfo[0][15].extra);
    const senderUid = senderInfo[0];
    const senderName = senderInfo[1];
    const cardLevel = cardInfo[0];
    const cardName = cardInfo[1];
    const cardLiver = cardInfo[2];
    const cardRoomId = cardInfo[3];
    const cardLiverUid = cardInfo[12];
    const senderLiveLevel = senderLiveLevelInfo[0];
    return {
        localDate: (0, util_1.localDate)(sendTime),
        content: dmJson.content,
        senderName: senderName,
        senderUid: senderUid,
        card: {
            level: cardLevel,
            name: cardName,
            liver: cardLiver,
            roomid: cardRoomId,
            liverUid: cardLiverUid
        },
        dm_type: dmJson.dm_type,
        mode: dmJson.mode,
        color: '#' + (dmJson.color).toString(16),
        font_size: dmJson.font_size,
        senderLiveLevel: senderLiveLevel,
        player_mode: dmJson.player_mode,
        show_player_type: dmJson.show_player_type,
        is_audited: dmJson.is_audited,
        recommend_score: dmJson.recommend_score,
    };
}
function resolveLiveData(data) {
    if (data.live_time) {
        const doc = {
            live_platform: data.live_platform,
            live_model: data.live_model,
            localDate: (0, util_1.localDate)(data.live_time * 1000)
        };
        return doc;
    }
}
function resolvePreparing(data) {
    return {
        localDate: (0, util_1.localDate)()
    };
}
function resolveSendGift(msg) {
}
function resolveAreaRankChanged(data) {
    return {
        rank_name: data.data.rank_name,
        rank: data.data.rank,
        localDate: (0, util_1.localDate)(data.data.timestamp * 1000),
        action_type: data.data.action_type
    };
}
function resolveDefault(data) {
    return data.data;
}
