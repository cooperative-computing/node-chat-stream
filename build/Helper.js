"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Chat_1 = __importDefault(require("./Models/Chat"));
var ChatList_1 = __importDefault(require("./Models/ChatList"));
var Helper = {
    sendResponse: function (res, data) {
        res.statusCode = 200;
        res.json({ data: data });
    },
    sendNotFoundResponse: function (res, name) {
        res.statusCode = 200;
        res.json({ data: [], error: 'Not found any ' + name + '!' });
    },
    errorResponse: function (res, msg) {
        res.statusCode = 400;
        res.json({ status: 'failed', error: msg });
    },
    messageResponse: function (res, message) {
        res.statusCode = 200;
        res.json({ status: 'success', message: message });
    },
    addChat: function (chat) {
        var chatMessage = new Chat_1.default({ text: chat.text, sender: chat.sender, chat_list_id: chat.chat_list_id });
        chatMessage.save();
    },
    sendPaginationResponse: function (res, records, params) {
        if (params === void 0) { params = {}; }
        res.statusCode = 200;
        var response = __assign(__assign({}, params), { data: records.docs, totalDocs: records.totalDocs, limit: records.limit, page: records.page, totalPages: records.totalPages, pagingCounter: records.pagingCounter, hasPrevPage: records.hasPrevPage, hasNextPage: records.hasNextPage, prevPage: records.prevPage, nextPage: records.nextPage });
        res.json(response);
    },
    sendMultiUserMsg: function (room, clients, event) {
        var allIds = room.receivers;
        allIds.splice(allIds.indexOf(event.sender), 1); // removed sender
        allIds.forEach(function (item) {
            if (item && clients[item]) {
                var channelName_1 = room.chat_type == 'user-group' ? 'group-message' : 'multi-user-message';
                clients[item].forEach(function (cli) { return cli.emit(channelName_1, event); });
            }
        });
    },
    userToUserChat: function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var sender, receiver, query, chat_list, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sender = event.sender;
                    receiver = event.receiver;
                    query = {};
                    if (!(sender && receiver)) return [3 /*break*/, 2];
                    query = Helper.userToUserQuery(sender, receiver);
                    return [4 /*yield*/, ChatList_1.default.findOne(query)];
                case 1:
                    chat_list = _a.sent();
                    if (!chat_list) {
                        data = { chat_type: 'user-user', created_by: sender, receivers: [receiver] };
                        chat_list = new ChatList_1.default(data);
                        chat_list.save();
                    }
                    event.chat_list_id = chat_list._id;
                    Helper.addChat(event);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); },
    userToUserQuery: function (sender, receiver) {
        return { $or: [{ chat_type: 'user-user', created_by: sender, receivers: [receiver] }, { chat_type: 'user-user', created_by: receiver, receivers: [sender] }] };
    }
};
exports.default = Helper;
