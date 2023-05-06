"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleNotFound = (props) => {
    const { res, data, message } = props;
    if (!data) {
        return res.status(404).json({ error: message });
    }
};
exports.default = handleNotFound;
