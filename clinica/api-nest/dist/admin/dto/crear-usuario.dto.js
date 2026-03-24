"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearUsuarioDto = exports.Pais = exports.Rol = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var Rol;
(function (Rol) {
    Rol["PACIENTE"] = "PACIENTE";
    Rol["MEDICO"] = "MEDICO";
    Rol["ADMIN"] = "ADMIN";
})(Rol || (exports.Rol = Rol = {}));
var Pais;
(function (Pais) {
    Pais["NI"] = "NI";
    Pais["CR"] = "CR";
    Pais["HN"] = "HN";
})(Pais || (exports.Pais = Pais = {}));
class CrearUsuarioDto {
}
exports.CrearUsuarioDto = CrearUsuarioDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CrearUsuarioDto.prototype, "carnet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CrearUsuarioDto.prototype, "nombreCompleto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrearUsuarioDto.prototype, "correo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Rol }),
    (0, class_validator_1.IsEnum)(Rol),
    __metadata("design:type", String)
], CrearUsuarioDto.prototype, "rol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Pais }),
    (0, class_validator_1.IsEnum)(Pais),
    __metadata("design:type", String)
], CrearUsuarioDto.prototype, "pais", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CrearUsuarioDto.prototype, "password", void 0);
//# sourceMappingURL=crear-usuario.dto.js.map