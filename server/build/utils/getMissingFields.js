"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMissingFields = void 0;
const getMissingFields = (req, requiredFields) => {
    const givenFields = requiredFields.filter(field => !(req.body[field] === undefined));
    const missingFields = requiredFields.filter(field => !givenFields.includes(field));
    return missingFields;
};
exports.getMissingFields = getMissingFields;
