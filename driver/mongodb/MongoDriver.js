"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var ConnectionIsNotSetError_1 = require("../error/ConnectionIsNotSetError");
var DriverPackageNotInstalledError_1 = require("../error/DriverPackageNotInstalledError");
var MongoQueryRunner_1 = require("./MongoQueryRunner");
var DriverOptionNotSetError_1 = require("../error/DriverOptionNotSetError");
var PlatformTools_1 = require("../../platform/PlatformTools");
/**
 * Organizes communication with MongoDB.
 */
var MongoDriver = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function MongoDriver(options, logger, mongodb) {
        // validate options to make sure everything is correct and driver will be able to establish connection
        this.validateOptions(options);
        // if mongodb package instance was not set explicitly then try to load it
        if (!mongodb)
            mongodb = this.loadDependencies();
        this.options = options;
        this.logger = logger;
        this.mongodb = mongodb;
    }
    // -------------------------------------------------------------------------
    // Public Overridden Methods
    // -------------------------------------------------------------------------
    /**
     * Performs connection to the database.
     */
    MongoDriver.prototype.connect = function () {
        var _this = this;
        return new Promise(function (ok, fail) {
            _this.mongodb.MongoClient.connect(_this.buildConnectionUrl(), _this.options.extra, function (err, database) {
                if (err)
                    return fail(err);
                _this.pool = database;
                var databaseConnection = {
                    id: 1,
                    connection: _this.pool,
                    isTransactionActive: false
                };
                _this.queryRunner = new MongoQueryRunner_1.MongoQueryRunner(databaseConnection, _this, _this.logger);
                ok();
            });
        });
    };
    /**
     * Closes connection with the database.
     */
    MongoDriver.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.pool)
                    throw new ConnectionIsNotSetError_1.ConnectionIsNotSetError("mongodb");
                return [2 /*return*/, new Promise(function (ok, fail) {
                        var handler = function (err) { return err ? fail(err) : ok(); };
                        _this.pool.close(handler);
                        _this.pool = undefined;
                    })];
            });
        });
    };
    /**
     * Creates a query runner used for common queries.
     */
    MongoDriver.prototype.createQueryRunner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.pool)
                    return [2 /*return*/, Promise.reject(new ConnectionIsNotSetError_1.ConnectionIsNotSetError("mongodb"))];
                return [2 /*return*/, this.queryRunner];
            });
        });
    };
    /**
     * Access to the native implementation of the database.
     */
    MongoDriver.prototype.nativeInterface = function () {
        return {
            driver: this.mongodb,
            connection: this.pool
        };
    };
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    MongoDriver.prototype.escapeQueryWithParameters = function (sql, parameters) {
        throw new Error("This operation is not supported by Mongodb driver.");
    };
    /**
     * Escapes a column name.
     */
    MongoDriver.prototype.escapeColumnName = function (columnName) {
        return columnName;
    };
    /**
     * Escapes an alias.
     */
    MongoDriver.prototype.escapeAliasName = function (aliasName) {
        return aliasName;
    };
    /**
     * Escapes a table name.
     */
    MongoDriver.prototype.escapeTableName = function (tableName) {
        return tableName;
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    MongoDriver.prototype.preparePersistentValue = function (value, columnMetadata) {
        if (value === null || value === undefined)
            return null;
        switch (columnMetadata.type) {
        }
        return value;
    };
    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    MongoDriver.prototype.prepareHydratedValue = function (value, columnMetadata) {
        switch (columnMetadata.type) {
        }
        // if (columnMetadata.isObjectId)
        //     return new ObjectID(value);
        return value;
    };
    // todo: make better abstraction
    MongoDriver.prototype.syncSchema = function (entityMetadatas) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createQueryRunner()];
                    case 1:
                        queryRunner = _a.sent();
                        promises = [];
                        return [4 /*yield*/, Promise.all(entityMetadatas.map(function (metadata) {
                                metadata.indices.forEach(function (index) {
                                    var columns = index.buildColumnsAsMap(1);
                                    var options = { name: index.name };
                                    promises.push(queryRunner.createCollectionIndex(metadata.table.name, columns, options));
                                });
                            }))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(promises)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Validate driver options to make sure everything is correct and driver will be able to establish connection.
     */
    MongoDriver.prototype.validateOptions = function (options) {
        if (!options.url) {
            if (!options.database)
                throw new DriverOptionNotSetError_1.DriverOptionNotSetError("database");
        }
    };
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    MongoDriver.prototype.loadDependencies = function () {
        try {
            return PlatformTools_1.PlatformTools.load("mongodb"); // try to load native driver dynamically
        }
        catch (e) {
            throw new DriverPackageNotInstalledError_1.DriverPackageNotInstalledError("MongoDB", "mongodb");
        }
    };
    /**
     * Builds connection url that is passed to underlying driver to perform connection to the mongodb database.
     */
    MongoDriver.prototype.buildConnectionUrl = function () {
        if (this.options.url)
            return this.options.url;
        return "mongodb://" + (this.options.host || "127.0.0.1") + ":" + (this.options.port || "27017") + "/" + this.options.database;
    };
    return MongoDriver;
}());
exports.MongoDriver = MongoDriver;

//# sourceMappingURL=MongoDriver.js.map
