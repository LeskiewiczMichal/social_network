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
exports.getNotifications = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.user;
        const { limit, offset, sortOrder, type, excludeType } = req.query;
        const dbQuery = models_1.Notification.find()
            .where({ receiver: userId })
            .sort({ createdAt: 1 })
            .populate('sender');
        if (limit) {
            dbQuery.limit(parseInt(limit, 10));
        }
        if (offset) {
            dbQuery.skip(parseInt(offset, 10));
        }
        if (sortOrder) {
            dbQuery.sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });
        }
        if (type) {
            dbQuery.where({ type });
        }
        if (excludeType) {
            dbQuery.where({ type: { $ne: excludeType } });
        }
        const notifications = (yield dbQuery.exec());
        return res.json({ notifications });
    }
    catch (err) {
        return (0, utils_1.handleError)(err, res);
    }
});
exports.getNotifications = getNotifications;
