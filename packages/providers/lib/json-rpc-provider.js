"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_signer_1 = require("@ethersproject/abstract-signer");
var bignumber_1 = require("@ethersproject/bignumber");
var bytes_1 = require("@ethersproject/bytes");
var properties_1 = require("@ethersproject/properties");
var strings_1 = require("@ethersproject/strings");
var web_1 = require("@ethersproject/web");
var logger_1 = require("@ethersproject/logger");
var _version_1 = require("./_version");
var logger = new logger_1.Logger(_version_1.version);
var base_provider_1 = require("./base-provider");
function timer(timeout) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}
function getResult(payload) {
    if (payload.error) {
        // @TODO: not any
        var error = new Error(payload.error.message);
        error.code = payload.error.code;
        error.data = payload.error.data;
        throw error;
    }
    return payload.result;
}
function getLowerCase(value) {
    if (value) {
        return value.toLowerCase();
    }
    return value;
}
var _constructorGuard = {};
var JsonRpcSigner = /** @class */ (function (_super) {
    __extends(JsonRpcSigner, _super);
    function JsonRpcSigner(constructorGuard, provider, addressOrIndex) {
        var _newTarget = this.constructor;
        var _this = this;
        logger.checkNew(_newTarget, JsonRpcSigner);
        _this = _super.call(this) || this;
        if (constructorGuard !== _constructorGuard) {
            throw new Error("do not call the JsonRpcSigner constructor directly; use provider.getSigner");
        }
        properties_1.defineReadOnly(_this, "provider", provider);
        if (addressOrIndex == null) {
            addressOrIndex = 0;
        }
        if (typeof (addressOrIndex) === "string") {
            properties_1.defineReadOnly(_this, "_address", _this.provider.formatter.address(addressOrIndex));
            properties_1.defineReadOnly(_this, "_index", null);
        }
        else if (typeof (addressOrIndex) === "number") {
            properties_1.defineReadOnly(_this, "_index", addressOrIndex);
            properties_1.defineReadOnly(_this, "_address", null);
        }
        else {
            logger.throwArgumentError("invalid address or index", "addressOrIndex", addressOrIndex);
        }
        return _this;
    }
    JsonRpcSigner.prototype.connect = function (provider) {
        return logger.throwError("cannot alter JSON-RPC Signer connection", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "connect"
        });
    };
    JsonRpcSigner.prototype.connectUnchecked = function () {
        return new UncheckedJsonRpcSigner(_constructorGuard, this.provider, this._address || this._index);
    };
    JsonRpcSigner.prototype.getAddress = function () {
        var _this = this;
        if (this._address) {
            return Promise.resolve(this._address);
        }
        return this.provider.send("eth_accounts", []).then(function (accounts) {
            if (accounts.length <= _this._index) {
                logger.throwError("unknown account #" + _this._index, logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                    operation: "getAddress"
                });
            }
            return _this.provider.formatter.address(accounts[_this._index]);
        });
    };
    JsonRpcSigner.prototype.sendUncheckedTransaction = function (transaction) {
        var _this = this;
        transaction = properties_1.shallowCopy(transaction);
        var fromAddress = this.getAddress().then(function (address) {
            if (address) {
                address = address.toLowerCase();
            }
            return address;
        });
        // The JSON-RPC for eth_sendTransaction uses 90000 gas; if the user
        // wishes to use this, it is easy to specify explicitly, otherwise
        // we look it up for them.
        if (transaction.gasLimit == null) {
            var estimate = properties_1.shallowCopy(transaction);
            estimate.from = fromAddress;
            transaction.gasLimit = this.provider.estimateGas(estimate);
        }
        return Promise.all([
            properties_1.resolveProperties(transaction),
            fromAddress
        ]).then(function (results) {
            var tx = results[0];
            var hexTx = _this.provider.constructor.hexlifyTransaction(tx);
            hexTx.from = results[1];
            return _this.provider.send("eth_sendTransaction", [hexTx]).then(function (hash) {
                return hash;
            }, function (error) {
                if (error.responseText) {
                    // See: JsonRpcProvider.sendTransaction (@TODO: Expose a ._throwError??)
                    if (error.responseText.indexOf("insufficient funds") >= 0) {
                        logger.throwError("insufficient funds", logger_1.Logger.errors.INSUFFICIENT_FUNDS, {
                            transaction: tx
                        });
                    }
                    if (error.responseText.indexOf("nonce too low") >= 0) {
                        logger.throwError("nonce has already been used", logger_1.Logger.errors.NONCE_EXPIRED, {
                            transaction: tx
                        });
                    }
                    if (error.responseText.indexOf("replacement transaction underpriced") >= 0) {
                        logger.throwError("replacement fee too low", logger_1.Logger.errors.REPLACEMENT_UNDERPRICED, {
                            transaction: tx
                        });
                    }
                }
                throw error;
            });
        });
    };
    JsonRpcSigner.prototype.signTransaction = function (transaction) {
        return logger.throwError("signing transactions is unsupported", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "signTransaction"
        });
    };
    JsonRpcSigner.prototype.sendTransaction = function (transaction) {
        var _this = this;
        return this.sendUncheckedTransaction(transaction).then(function (hash) {
            return web_1.poll(function () {
                return _this.provider.getTransaction(hash).then(function (tx) {
                    if (tx === null) {
                        return undefined;
                    }
                    return _this.provider._wrapTransaction(tx, hash);
                });
            }, { onceBlock: _this.provider }).catch(function (error) {
                error.transactionHash = hash;
                throw error;
            });
        });
    };
    JsonRpcSigner.prototype.signMessage = function (message) {
        var _this = this;
        var data = ((typeof (message) === "string") ? strings_1.toUtf8Bytes(message) : message);
        return this.getAddress().then(function (address) {
            // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
            return _this.provider.send("eth_sign", [address.toLowerCase(), bytes_1.hexlify(data)]);
        });
    };
    JsonRpcSigner.prototype.unlock = function (password) {
        var provider = this.provider;
        return this.getAddress().then(function (address) {
            return provider.send("personal_unlockAccount", [address.toLowerCase(), password, null]);
        });
    };
    return JsonRpcSigner;
}(abstract_signer_1.Signer));
exports.JsonRpcSigner = JsonRpcSigner;
var UncheckedJsonRpcSigner = /** @class */ (function (_super) {
    __extends(UncheckedJsonRpcSigner, _super);
    function UncheckedJsonRpcSigner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UncheckedJsonRpcSigner.prototype.sendTransaction = function (transaction) {
        var _this = this;
        return this.sendUncheckedTransaction(transaction).then(function (hash) {
            return {
                hash: hash,
                nonce: null,
                gasLimit: null,
                gasPrice: null,
                data: null,
                value: null,
                chainId: null,
                confirmations: 0,
                from: null,
                wait: function (confirmations) { return _this.provider.waitForTransaction(hash, confirmations); }
            };
        });
    };
    return UncheckedJsonRpcSigner;
}(JsonRpcSigner));
var allowedTransactionKeys = {
    chainId: true, data: true, gasLimit: true, gasPrice: true, nonce: true, to: true, value: true
};
var JsonRpcProvider = /** @class */ (function (_super) {
    __extends(JsonRpcProvider, _super);
    function JsonRpcProvider(url, network) {
        var _newTarget = this.constructor;
        var _this = this;
        logger.checkNew(_newTarget, JsonRpcProvider);
        var getNetwork = properties_1.getStatic((_newTarget), "getNetwork");
        // One parameter, but it is a network name, so swap it with the URL
        if (typeof (url) === "string") {
            if (network === null) {
                var checkNetwork = getNetwork(url);
                network = checkNetwork;
                url = null;
            }
        }
        if (network) {
            // The network has been specified explicitly, we can use it
            _this = _super.call(this, network) || this;
        }
        else {
            // The network is unknown, query the JSON-RPC for it
            var ready = new Promise(function (resolve, reject) {
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var chainId, error_1, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                chainId = null;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 8]);
                                return [4 /*yield*/, this.send("eth_chainId", [])];
                            case 2:
                                chainId = _a.sent();
                                return [3 /*break*/, 8];
                            case 3:
                                error_1 = _a.sent();
                                _a.label = 4;
                            case 4:
                                _a.trys.push([4, 6, , 7]);
                                return [4 /*yield*/, this.send("net_version", [])];
                            case 5:
                                chainId = _a.sent();
                                return [3 /*break*/, 7];
                            case 6:
                                error_2 = _a.sent();
                                return [3 /*break*/, 7];
                            case 7: return [3 /*break*/, 8];
                            case 8:
                                if (chainId != null) {
                                    try {
                                        return [2 /*return*/, resolve(getNetwork(bignumber_1.BigNumber.from(chainId).toNumber()))];
                                    }
                                    catch (error) { }
                                }
                                reject(logger.makeError("could not detect network", logger_1.Logger.errors.NETWORK_ERROR));
                                return [2 /*return*/];
                        }
                    });
                }); }, 0);
            });
            _this = _super.call(this, ready) || this;
        }
        // Default URL
        if (!url) {
            url = "http:/" + "/localhost:8545";
        }
        if (typeof (url) === "string") {
            _this.connection = Object.freeze({
                url: url
            });
        }
        else {
            _this.connection = Object.freeze(properties_1.shallowCopy(url));
        }
        _this._nextId = 42;
        return _this;
    }
    JsonRpcProvider.prototype.getSigner = function (addressOrIndex) {
        return new JsonRpcSigner(_constructorGuard, this, addressOrIndex);
    };
    JsonRpcProvider.prototype.getUncheckedSigner = function (addressOrIndex) {
        return this.getSigner(addressOrIndex).connectUnchecked();
    };
    JsonRpcProvider.prototype.listAccounts = function () {
        var _this = this;
        return this.send("eth_accounts", []).then(function (accounts) {
            return accounts.map(function (a) { return _this.formatter.address(a); });
        });
    };
    JsonRpcProvider.prototype.send = function (method, params) {
        var _this = this;
        var request = {
            method: method,
            params: params,
            id: (this._nextId++),
            jsonrpc: "2.0"
        };
        this.emit("debug", {
            action: "request",
            request: properties_1.deepCopy(request),
            provider: this
        });
        return web_1.fetchJson(this.connection, JSON.stringify(request), getResult).then(function (result) {
            _this.emit("debug", {
                action: "response",
                request: request,
                response: result,
                provider: _this
            });
            return result;
        }, function (error) {
            _this.emit("debug", {
                action: "response",
                error: error,
                request: request,
                provider: _this
            });
            throw error;
        });
    };
    JsonRpcProvider.prototype.perform = function (method, params) {
        switch (method) {
            case "getBlockNumber":
                return this.send("eth_blockNumber", []);
            case "getGasPrice":
                return this.send("eth_gasPrice", []);
            case "getBalance":
                return this.send("eth_getBalance", [getLowerCase(params.address), params.blockTag]);
            case "getTransactionCount":
                return this.send("eth_getTransactionCount", [getLowerCase(params.address), params.blockTag]);
            case "getCode":
                return this.send("eth_getCode", [getLowerCase(params.address), params.blockTag]);
            case "getStorageAt":
                return this.send("eth_getStorageAt", [getLowerCase(params.address), params.position, params.blockTag]);
            case "sendTransaction":
                return this.send("eth_sendRawTransaction", [params.signedTransaction]).catch(function (error) {
                    if (error.responseText) {
                        // "insufficient funds for gas * price + value"
                        if (error.responseText.indexOf("insufficient funds") > 0) {
                            logger.throwError("insufficient funds", logger_1.Logger.errors.INSUFFICIENT_FUNDS, {});
                        }
                        // "nonce too low"
                        if (error.responseText.indexOf("nonce too low") > 0) {
                            logger.throwError("nonce has already been used", logger_1.Logger.errors.NONCE_EXPIRED, {});
                        }
                        // "replacement transaction underpriced"
                        if (error.responseText.indexOf("replacement transaction underpriced") > 0) {
                            logger.throwError("replacement fee too low", logger_1.Logger.errors.REPLACEMENT_UNDERPRICED, {});
                        }
                    }
                    throw error;
                });
            case "getBlock":
                if (params.blockTag) {
                    return this.send("eth_getBlockByNumber", [params.blockTag, !!params.includeTransactions]);
                }
                else if (params.blockHash) {
                    return this.send("eth_getBlockByHash", [params.blockHash, !!params.includeTransactions]);
                }
                return logger.throwArgumentError("invalid block tag or block hash", "params", params);
            case "getTransaction":
                return this.send("eth_getTransactionByHash", [params.transactionHash]);
            case "getTransactionReceipt":
                return this.send("eth_getTransactionReceipt", [params.transactionHash]);
            case "call": {
                var hexlifyTransaction = properties_1.getStatic(this.constructor, "hexlifyTransaction");
                return this.send("eth_call", [hexlifyTransaction(params.transaction, { from: true }), params.blockTag]);
            }
            case "estimateGas": {
                var hexlifyTransaction = properties_1.getStatic(this.constructor, "hexlifyTransaction");
                return this.send("eth_estimateGas", [hexlifyTransaction(params.transaction, { from: true })]);
            }
            case "getLogs":
                if (params.filter && params.filter.address != null) {
                    params.filter.address = getLowerCase(params.filter.address);
                }
                return this.send("eth_getLogs", [params.filter]);
            default:
                break;
        }
        return logger.throwError(method + " not implemented", logger_1.Logger.errors.NOT_IMPLEMENTED, { operation: method });
    };
    JsonRpcProvider.prototype._startPending = function () {
        if (this._pendingFilter != null) {
            return;
        }
        var self = this;
        var pendingFilter = this.send("eth_newPendingTransactionFilter", []);
        this._pendingFilter = pendingFilter;
        pendingFilter.then(function (filterId) {
            function poll() {
                self.send("eth_getFilterChanges", [filterId]).then(function (hashes) {
                    if (self._pendingFilter != pendingFilter) {
                        return null;
                    }
                    var seq = Promise.resolve();
                    hashes.forEach(function (hash) {
                        // @TODO: This should be garbage collected at some point... How? When?
                        self._emitted["t:" + hash.toLowerCase()] = "pending";
                        seq = seq.then(function () {
                            return self.getTransaction(hash).then(function (tx) {
                                self.emit("pending", tx);
                                return null;
                            });
                        });
                    });
                    return seq.then(function () {
                        return timer(1000);
                    });
                }).then(function () {
                    if (self._pendingFilter != pendingFilter) {
                        self.send("eth_uninstallFilter", [filterId]);
                        return;
                    }
                    setTimeout(function () { poll(); }, 0);
                    return null;
                }).catch(function (error) { });
            }
            poll();
            return filterId;
        }).catch(function (error) { });
    };
    JsonRpcProvider.prototype._stopPending = function () {
        this._pendingFilter = null;
    };
    // Convert an ethers.js transaction into a JSON-RPC transaction
    //  - gasLimit => gas
    //  - All values hexlified
    //  - All numeric values zero-striped
    // NOTE: This allows a TransactionRequest, but all values should be resolved
    //       before this is called
    JsonRpcProvider.hexlifyTransaction = function (transaction, allowExtra) {
        // Check only allowed properties are given
        var allowed = properties_1.shallowCopy(allowedTransactionKeys);
        if (allowExtra) {
            for (var key in allowExtra) {
                if (allowExtra[key]) {
                    allowed[key] = true;
                }
            }
        }
        properties_1.checkProperties(transaction, allowed);
        var result = {};
        // Some nodes (INFURA ropsten; INFURA mainnet is fine) do not like leading zeros.
        ["gasLimit", "gasPrice", "nonce", "value"].forEach(function (key) {
            if (transaction[key] == null) {
                return;
            }
            var value = bytes_1.hexValue(transaction[key]);
            if (key === "gasLimit") {
                key = "gas";
            }
            result[key] = value;
        });
        ["from", "to", "data"].forEach(function (key) {
            if (transaction[key] == null) {
                return;
            }
            result[key] = bytes_1.hexlify(transaction[key]);
        });
        return result;
    };
    return JsonRpcProvider;
}(base_provider_1.BaseProvider));
exports.JsonRpcProvider = JsonRpcProvider;