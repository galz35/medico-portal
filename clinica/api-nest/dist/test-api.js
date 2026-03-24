"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function testSSO() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.s7jS-H8...';
    try {
        const res = await axios_1.default.post('http://localhost:3001/api/auth/sso-login', { token: 'invalid-token' });
        console.log(res.data);
    }
    catch (err) {
        console.log('Status:', err.response?.status);
        console.log('Data:', JSON.stringify(err.response?.data, null, 2));
    }
}
testSSO();
//# sourceMappingURL=test-api.js.map