"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const usersController_1 = require("../controllers/usersController");
const router = express_1.default.Router();
router.post('/', usersController_1.createAccount);
router.post('/login', passport_1.default.authenticate('local', { session: false }), usersController_1.login);
exports.default = router;
