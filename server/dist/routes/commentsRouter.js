"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsController_1 = require("../controllers/commentsController");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.use(middleware_1.verifyToken);
router.post('/:postId', commentsController_1.addComment);
router.get('/:postId', commentsController_1.getAllComments);
router.post('/:commentId/likes', commentsController_1.likeComment);
router.delete('/:commentId/likes', commentsController_1.dislikeComment);
router.put('/:commentId', commentsController_1.updateComment);
router.delete('/:commentId', commentsController_1.deleteComment);
exports.default = router;
