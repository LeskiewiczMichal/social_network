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
exports.getAllUsers = exports.getUser = exports.deleteUser = exports.updateUserData = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.find();
        if (!users) {
            return res.status(404).json({ message: 'Users not found' });
        }
        return res.json({ users });
    }
    catch (error) {
        return (0, utils_1.handleError)(res, 'Something went wrong on the server', 500);
    }
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        return (0, utils_1.handleError)(res, 'Something went wrong on the server', 500);
    }
});
exports.getUser = getUser;
const updateUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.firstName) {
            user.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            user.lastName = req.body.lastName;
        }
        if (req.body.birthday) {
            user.birthday = req.body.birthday;
        }
        yield user.save();
        return res.json({ message: 'Update successfull', user });
    }
    catch (error) {
        return (0, utils_1.handleError)(res, 'Something went wrong on the server', 500);
    }
});
exports.updateUserData = updateUserData;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        yield models_1.User.deleteOne({ _id: user.id });
        return res.json({ message: 'User deleted succesfully' });
    }
    catch (error) {
        return (0, utils_1.handleError)(res, 'Something went wrong on the server', 500);
    }
});
exports.deleteUser = deleteUser;