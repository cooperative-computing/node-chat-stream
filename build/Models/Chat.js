"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var Schema = mongoose_1.default.Schema;
var chatSchema = new Schema({
    text: {
        type: String
    },
    chat_list_id: {
        type: Schema.Types.ObjectId,
        ref: 'chat_stream_chat_list'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'chat_stream_users'
    }
}, {
    timestamps: true
});
chatSchema.plugin(mongoose_paginate_v2_1.default);
var Chat = mongoose_1.default.model('chat_stream_chat', chatSchema);
exports.default = Chat;
