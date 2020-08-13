"use strict";
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
var socketio_file_upload_1 = __importDefault(require("socketio-file-upload"));
//Models
var ChatList_1 = __importDefault(require("./Models/ChatList"));
var Helper_1 = __importDefault(require("./Helper"));
var Socket_IO = function (socket) {
    var clients = [];
    //setup event listener
    socket.on("connection", function (client) { return __awaiter(void 0, void 0, void 0, function () {
        var uploader;
        return __generator(this, function (_a) {
            console.log("- connected  to socket -");
            uploader = new socketio_file_upload_1.default();
            uploader.dir = "./uploads";
            uploader.listen(client);
            // Do something when a file is saved:
            uploader.on("saved", function (event) {
                console.log("saved ", event.file);
            });
            // Error handler:
            uploader.on("error", function (event) {
                console.log("Error from uploader", event);
            });
            client.on("node-chat-join", function (e) { return __awaiter(void 0, void 0, void 0, function () {
                var user_id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Helper_1.default.getUserId(e)];
                        case 1:
                            user_id = _a.sent();
                            if (!user_id)
                                return [2 /*return*/, false];
                            client.user_id = user_id;
                            if (clients[user_id]) {
                                clients[user_id].push(client);
                            }
                            else {
                                clients[user_id] = [client];
                            }
                            console.log("node-chat-join complete");
                            return [2 /*return*/];
                    }
                });
            }); });
            client.on("disconnect", function () {
                if (!client.user_id || !clients[client.user_id])
                    return false;
                var targetClients = clients[client.user_id];
                for (var i = 0; i < targetClients.length; ++i) {
                    if (targetClients[i] == client) {
                        targetClients.splice(i, 1);
                    }
                }
            });
            // user to user start
            client.on("message", function (event) { return __awaiter(void 0, void 0, void 0, function () {
                var targetId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("message ", event);
                            targetId = event.receiver;
                            if (targetId && clients[targetId]) {
                                clients[targetId].forEach(function (cli) {
                                    cli.emit("message", event);
                                });
                            }
                            return [4 /*yield*/, Helper_1.default.userToUserChat(event)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // user to user end
            // user to multi user start
            client.on("multi-user-message", function (event) { return __awaiter(void 0, void 0, void 0, function () {
                var room;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ChatList_1.default.findOne({ _id: event.chat_list_id })];
                        case 1:
                            room = _a.sent();
                            if (room._id) {
                                Helper_1.default.sendMultiUserMsg(room, clients, event);
                                Helper_1.default.addChat(event); //save chat to the database
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            // user to multi user end
            client.on("group-message", function (data) { return __awaiter(void 0, void 0, void 0, function () {
                var room;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ChatList_1.default.findOne({ _id: data.chat_list_id })];
                        case 1:
                            room = _a.sent();
                            if (room._id) {
                                Helper_1.default.sendMultiUserMsg(room, clients, data);
                                Helper_1.default.addChat(data); //save chat to the database
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
};
exports.default = Socket_IO;
