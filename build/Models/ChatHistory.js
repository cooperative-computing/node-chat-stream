"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var Schema = mongoose_1.default.Schema;
var ChatHistorySchema = new Schema({
    chat_list_id: {
        type: Schema.Types.ObjectId,
        ref: "chat_stream_chat_list",
    },
    userId: {
        type: String,
    },
}, {
    timestamps: true,
});
ChatHistorySchema.plugin(mongoose_paginate_v2_1.default);
var ChatHistory = mongoose_1.default.model("chat_stream_chat_history", ChatHistorySchema);
exports.default = ChatHistory;
