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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const models_1 = require("../models");
const types_1 = require("../types");
const utils_1 = require("../utils");
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const { friendId, limit, offset, sortOrder } = req.query;
        if (!userId || !friendId) {
            throw new types_1.ErrorTypes.BadRequestError('No user id or friend id provided');
        }
        const dbQuery = models_1.Message.find()
            .or([
            { sender: userId, receiver: friendId },
            { sender: friendId, receiver: userId },
        ])
            .sort({ createdAt: 1 });
        if (limit) {
            dbQuery.limit(parseInt(limit, 10));
        }
        if (offset) {
            dbQuery.skip(parseInt(offset, 10));
        }
        if (sortOrder) {
            dbQuery.sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });
        }
        const messages = (yield dbQuery.exec());
        return res.json({ messages });
    }
    catch (err) {
        return (0, utils_1.handleError)(err, res);
    }
});
exports.getMessages = getMessages;
