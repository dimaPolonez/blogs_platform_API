"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexMiddleware = void 0;
const json_middlware_1 = require("./json.middlware");
exports.indexMiddleware = {
    JSON_PARSER: json_middlware_1.parserMiddleware
};
