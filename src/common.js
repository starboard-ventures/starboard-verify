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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getBuildInfo = exports.createFormData = exports.writeMetaFile = exports.fetchVerify = void 0;
var node_fetch_1 = require("node-fetch");
var path_1 = require("path");
var fs_1 = require("fs");
var form_data_1 = require("form-data");
var types_1 = require("./types");
function fetchVerify(_a) {
    var baseURL = _a.baseURL, contractAddress = _a.contractAddress, body = _a.body, network = _a.network;
    return __awaiter(this, void 0, void 0, function () {
        var host;
        return __generator(this, function (_b) {
            host = baseURL || network === 'Calibration' ? types_1.NetworkHost.Calibration : types_1.NetworkHost.Mainnet;
            return [2 /*return*/, (0, node_fetch_1["default"])("".concat(host, "/api/v1/contract/").concat(contractAddress, "/verify"), {
                    method: "POST",
                    body: body
                })];
        });
    });
}
exports.fetchVerify = fetchVerify;
function writeMetaFile(meta, contractName) {
    return __awaiter(this, void 0, void 0, function () {
        var out;
        return __generator(this, function (_a) {
            out = path_1["default"].join(process.cwd(), "".concat(contractName, "_Metadata.json"));
            fs_1["default"].writeFileSync(out, meta);
            console.log('Metadata generated successfully at:', out);
            return [2 /*return*/];
        });
    });
}
exports.writeMetaFile = writeMetaFile;
function createFormData(contractName, buildInfo) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var contractMeta, formData;
        return __generator(this, function (_c) {
            contractMeta = (_a = buildInfo[contractName]) === null || _a === void 0 ? void 0 : _a.metadata;
            formData = new form_data_1["default"]();
            formData.append('metadata.json', Buffer.from(contractMeta), 'metadata.json');
            Object.entries((_b = JSON.parse(contractMeta)) === null || _b === void 0 ? void 0 : _b.sources).map(function (_a) {
                var k = _a[0], v = _a[1];
                formData.append(k, Buffer.from(v.content), k);
            });
            return [2 /*return*/, formData];
        });
    });
}
exports.createFormData = createFormData;
function getBuildInfo(contractName, artifacts) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var allNames, fn, _b, pathName, conName, buildInfo, info;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, artifacts.getAllFullyQualifiedNames()];
                case 1:
                    allNames = _c.sent();
                    fn = allNames.find(function (s) { return s.split(':').pop() === contractName; });
                    _b = (_a = fn) === null || _a === void 0 ? void 0 : _a.split(':'), pathName = _b[0], conName = _b[1];
                    return [4 /*yield*/, artifacts.getBuildInfo(fn)];
                case 2:
                    buildInfo = _c.sent();
                    info = buildInfo === null || buildInfo === void 0 ? void 0 : buildInfo.output.contracts[pathName];
                    return [2 /*return*/, info];
            }
        });
    });
}
exports.getBuildInfo = getBuildInfo;
