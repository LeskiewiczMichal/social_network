"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.post('/', usersController_1.createAccount);
router.post('/login', usersController_1.login);
router.post('/authenticate', middleware_1.verifyToken, usersController_1.authenticateUser);
exports.default = router;
