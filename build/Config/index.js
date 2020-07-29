"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatConfig = { db_url: '' };
var SetChatConfig = function (config) {
    ChatConfig.db_url = config.db_url ? config.db_url : '';
};
var Config = {
    ChatConfig: ChatConfig,
    SetChatConfig: SetChatConfig
};
exports.default = Config;
