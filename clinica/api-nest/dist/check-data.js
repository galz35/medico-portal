"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const db_service_1 = require("./database/db.service");
const fs = __importStar(require("fs"));
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const db = app.get(db_service_1.DbService);
    let output = '';
    try {
        output += '--- ROLES ---\n';
        const roles = await db.query('SELECT * FROM Roles');
        output += JSON.stringify(roles, null, 2) + '\n';
        output += '\n--- USER GUSTAVO? ---\n';
        const users = await db.query("SELECT * FROM Usuarios WHERE carnet = '500708' OR carnet = 'GUSTAVO.LIRA@CLARO.COM.NI'");
        output += JSON.stringify(users, null, 2) + '\n';
    }
    catch (err) {
        output += 'Error: ' + err.message + '\n';
    }
    finally {
        fs.writeFileSync('db-data-check.txt', output);
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=check-data.js.map