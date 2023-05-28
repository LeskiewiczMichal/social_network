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
const models_1 = require("../models");
const createFakeMessages = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageOne: MessageOneProps, messageTwo: MessageTwoProps, messageThree: MessageThreeProps, messageIds, senderId, receiverId, userThreeId, } = props;
    const defaultMessageOne = Object.assign({ _id: messageIds.one, body: 'Testing message number one', sender: senderId, receiver: receiverId }, MessageOneProps);
    const defaultMessageTwo = Object.assign({ _id: messageIds.two, body: 'Testing message number two', sender: senderId, receiver: receiverId }, MessageTwoProps);
    const defaultMessageThree = Object.assign({ _id: messageIds.three, body: 'Testing message number three', sender: userThreeId, receiver: userThreeId }, MessageThreeProps);
    const messageOne = new models_1.Message(defaultMessageOne);
    const messageTwo = new models_1.Message(defaultMessageTwo);
    const messageThree = new models_1.Message(defaultMessageThree);
    yield messageOne.save();
    yield messageTwo.save();
    yield messageThree.save();
    return {
        one: Object.assign(Object.assign({}, defaultMessageOne), { _id: messageIds.one.toString(), sender: senderId.toString(), receiver: receiverId.toString() }),
        two: Object.assign(Object.assign({}, defaultMessageTwo), { _id: messageIds.two.toString(), sender: senderId.toString(), receiver: receiverId.toString() }),
        three: Object.assign(Object.assign({}, defaultMessageThree), { _id: messageIds.three.toString(), sender: userThreeId.toString(), receiver: userThreeId.toString() }),
    };
});
exports.default = createFakeMessages;
