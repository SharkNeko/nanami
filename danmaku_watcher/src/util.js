"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localDate = exports.toCsvField = void 0;
function toCsvField(content) {
    let quoteFlag = false;
    if (content.includes(`"`)) {
        content = content.replaceAll('"', '""');
        quoteFlag = true;
    }
    if (content.includes(',')) {
        quoteFlag = true;
    }
    if (quoteFlag) {
        content = `"${content}"`;
    }
    return content;
}
exports.toCsvField = toCsvField;
function localDate(v) {
    const d = new Date(v || Date.now());
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString();
}
exports.localDate = localDate;
