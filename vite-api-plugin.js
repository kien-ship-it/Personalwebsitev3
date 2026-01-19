/**
 * Vite plugin to handle API routes locally during development.
 * This allows the same API handlers to work both locally and when deployed to Vercel.
 */
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import { loadEnv } from 'vite';
function createMockResponse(rawRes) {
    var res = {
        statusCode: 200,
        _headers: {},
        _body: null,
        _isStreaming: false,
        _streamEnded: false,
        _rawRes: rawRes || null,
        status: function (code) {
            this.statusCode = code;
            return this;
        },
        json: function (data) {
            this._body = data;
            this._headers['Content-Type'] = 'application/json';
        },
        setHeader: function (name, value) {
            this._headers[name] = value;
            if (this._rawRes && !this._rawRes.headersSent) {
                this._rawRes.setHeader(name, value);
            }
        },
        write: function (chunk) {
            if (!this._isStreaming && this._rawRes) {
                this._isStreaming = true;
                this._rawRes.statusCode = this.statusCode;
                for (var _i = 0, _a = Object.entries(this._headers); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], value = _b[1];
                    if (!this._rawRes.headersSent) {
                        this._rawRes.setHeader(key, value);
                    }
                }
            }
            if (this._rawRes) {
                return this._rawRes.write(chunk);
            }
            return false;
        },
        end: function (chunk) {
            this._streamEnded = true;
            if (this._rawRes) {
                if (chunk) {
                    this._rawRes.end(chunk);
                }
                else {
                    this._rawRes.end();
                }
            }
        },
    };
    return res;
}
function parseBody(req) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var body = '';
                    req.on('data', function (chunk) {
                        body += chunk.toString();
                    });
                    req.on('end', function () {
                        try {
                            resolve(body ? JSON.parse(body) : {});
                        }
                        catch (_a) {
                            resolve({});
                        }
                    });
                    req.on('error', reject);
                })];
        });
    });
}
export function viteApiPlugin() {
    return {
        name: 'vite-api-plugin',
        config: function (_, _a) {
            var mode = _a.mode;
            // Load environment variables from .env.local into process.env
            var env = loadEnv(mode, process.cwd(), '');
            for (var _i = 0, _b = Object.entries(env); _i < _b.length; _i++) {
                var _c = _b[_i], key = _c[0], value = _c[1];
                if (process.env[key] === undefined) {
                    process.env[key] = value;
                }
            }
        },
        configureServer: function (server) {
            var _this = this;
            server.middlewares.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var url, body, _a, mockReq, mockRes, chatHandler, embedHandler, _i, _b, _c, key, value, error_1;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            url = req.url || '';
                            // Only handle /api routes
                            if (!url.startsWith('/api/')) {
                                return [2 /*return*/, next()];
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 12, , 13]);
                            if (!(req.method === 'POST')) return [3 /*break*/, 3];
                            return [4 /*yield*/, parseBody(req)];
                        case 2:
                            _a = _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = {};
                            _e.label = 4;
                        case 4:
                            body = _a;
                            mockReq = {
                                method: req.method || 'GET',
                                headers: req.headers,
                                body: body,
                                socket: { remoteAddress: (_d = req.socket) === null || _d === void 0 ? void 0 : _d.remoteAddress },
                            };
                            mockRes = createMockResponse(res);
                            if (!(url === '/api/chat' || url.startsWith('/api/chat?'))) return [3 /*break*/, 7];
                            return [4 /*yield*/, import('./api/chat')];
                        case 5:
                            chatHandler = (_e.sent()).default;
                            return [4 /*yield*/, chatHandler(mockReq, mockRes)];
                        case 6:
                            _e.sent();
                            return [3 /*break*/, 11];
                        case 7:
                            if (!(url === '/api/embed' || url.startsWith('/api/embed?'))) return [3 /*break*/, 10];
                            return [4 /*yield*/, import('./api/embed')];
                        case 8:
                            embedHandler = (_e.sent()).default;
                            return [4 /*yield*/, embedHandler(mockReq, mockRes)];
                        case 9:
                            _e.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ error: 'API route not found' }));
                            return [2 /*return*/];
                        case 11:
                            // Only send non-streaming responses here
                            // Streaming responses are handled directly via write/end
                            if (!mockRes._isStreaming && !mockRes._streamEnded) {
                                res.statusCode = mockRes.statusCode;
                                for (_i = 0, _b = Object.entries(mockRes._headers); _i < _b.length; _i++) {
                                    _c = _b[_i], key = _c[0], value = _c[1];
                                    res.setHeader(key, value);
                                }
                                res.end(JSON.stringify(mockRes._body));
                            }
                            return [3 /*break*/, 13];
                        case 12:
                            error_1 = _e.sent();
                            console.error('API handler error:', error_1);
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ error: 'Internal server error' }));
                            return [3 /*break*/, 13];
                        case 13: return [2 /*return*/];
                    }
                });
            }); });
        },
    };
}
