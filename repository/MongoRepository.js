"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Repository_1 = require("./Repository");
var DocumentToEntityTransformer_1 = require("../query-builder/transformer/DocumentToEntityTransformer");
var FindOptionsUtils_1 = require("../find-options/FindOptionsUtils");
var mongodb_1 = require("mongodb");
/**
 * Repository used to manage mongodb documents of a single entity type.
 */
var MongoRepository = (function (_super) {
    __extends(MongoRepository, _super);
    function MongoRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // todo: implement join from find options too
    // -------------------------------------------------------------------------
    // Overridden Methods
    // -------------------------------------------------------------------------
    /**
     * Raw SQL query execution is not supported by MongoDB.
     * Calling this method will return an error.
     */
    MongoRepository.prototype.query = function (query, parameters) {
        throw new Error("Queries aren't supported by MongoDB.");
    };
    /**
     * Transactions are not supported by MongoDB.
     * Calling this method will return an error.
     */
    MongoRepository.prototype.transaction = function (runInTransaction) {
        throw new Error("Transactions aren't supported by MongoDB.");
    };
    /**
     * Using Query Builder with MongoDB is not supported yet.
     * Calling this method will return an error.
     */
    MongoRepository.prototype.createQueryBuilder = function (alias, queryRunnerProvider) {
        throw new Error("Query Builder is not supported by MongoDB.");
    };
    /**
     * Finds entities that match given find options or conditions.
     */
    MongoRepository.prototype.find = function (optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, cursor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions);
                        return [4 /*yield*/, this.createEntityCursor(query)];
                    case 1:
                        cursor = _a.sent();
                        if (FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions)) {
                            if (optionsOrConditions.skip)
                                cursor.skip(optionsOrConditions.skip);
                            if (optionsOrConditions.take)
                                cursor.limit(optionsOrConditions.take);
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [2 /*return*/, cursor.toArray()];
                }
            });
        });
    };
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    MongoRepository.prototype.findAndCount = function (optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, cursor, _a, results, count;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = this.convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions);
                        return [4 /*yield*/, this.createEntityCursor(query)];
                    case 1:
                        cursor = _b.sent();
                        if (FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions)) {
                            if (optionsOrConditions.skip)
                                cursor.skip(optionsOrConditions.skip);
                            if (optionsOrConditions.take)
                                cursor.limit(optionsOrConditions.take);
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [4 /*yield*/, Promise.all([
                                cursor.toArray(),
                                this.queryRunner.count(this.metadata.table.name, query),
                            ])];
                    case 2:
                        _a = _b.sent(), results = _a[0], count = _a[1];
                        return [2 /*return*/, [results, parseInt(count)]];
                }
            });
        });
    };
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     */
    MongoRepository.prototype.findByIds = function (ids, optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, cursor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.convertFindManyOptionsOrConditionsToMongodbQuery(optionsOrConditions) || {};
                        query["_id"] = { $in: ids };
                        return [4 /*yield*/, this.createEntityCursor(query)];
                    case 1:
                        cursor = _a.sent();
                        if (FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions)) {
                            if (optionsOrConditions.skip)
                                cursor.skip(optionsOrConditions.skip);
                            if (optionsOrConditions.take)
                                cursor.limit(optionsOrConditions.take);
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [4 /*yield*/, cursor.toArray()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Finds first entity that matches given conditions and/or find options.
     */
    MongoRepository.prototype.findOne = function (optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, cursor, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.convertFindOneOptionsOrConditionsToMongodbQuery(optionsOrConditions);
                        return [4 /*yield*/, this.createEntityCursor(query)];
                    case 1:
                        cursor = _a.sent();
                        if (FindOptionsUtils_1.FindOptionsUtils.isFindOneOptions(optionsOrConditions)) {
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [4 /*yield*/, cursor.limit(1).toArray()];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0 ? result[0] : undefined];
                }
            });
        });
    };
    /**
     * Finds entity by given id.
     * Optionally find options or conditions can be applied.
     */
    MongoRepository.prototype.findOneById = function (id, optionsOrConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var query, cursor, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.convertFindOneOptionsOrConditionsToMongodbQuery(optionsOrConditions) || {};
                        query["_id"] = id;
                        return [4 /*yield*/, this.createEntityCursor(query)];
                    case 1:
                        cursor = _a.sent();
                        if (FindOptionsUtils_1.FindOptionsUtils.isFindOneOptions(optionsOrConditions)) {
                            if (optionsOrConditions.order)
                                cursor.sort(this.convertFindOptionsOrderToOrderCriteria(optionsOrConditions.order));
                        }
                        return [4 /*yield*/, cursor.limit(1).toArray()];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0 ? result[0] : undefined];
                }
            });
        });
    };
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     */
    MongoRepository.prototype.createCursor = function (query) {
        return this.queryRunner.cursor(this.metadata.table.name, query);
    };
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     * This returns modified version of cursor that transforms each result into Entity model.
     */
    MongoRepository.prototype.createEntityCursor = function (query) {
        var cursor = this.createCursor(query);
        var repository = this;
        cursor.toArray = function (callback) {
            if (callback) {
                mongodb_1.Cursor.prototype.toArray.call(this, function (error, results) {
                    if (error) {
                        callback(error, results);
                        return;
                    }
                    var transformer = new DocumentToEntityTransformer_1.DocumentToEntityTransformer();
                    return callback(error, transformer.transformAll(results, repository.metadata));
                });
            }
            else {
                return mongodb_1.Cursor.prototype.toArray.call(this).then(function (results) {
                    var transformer = new DocumentToEntityTransformer_1.DocumentToEntityTransformer();
                    return transformer.transformAll(results, repository.metadata);
                });
            }
        };
        cursor.next = function (callback) {
            if (callback) {
                mongodb_1.Cursor.prototype.next.call(this, function (error, result) {
                    if (error || !result) {
                        callback(error, result);
                        return;
                    }
                    var transformer = new DocumentToEntityTransformer_1.DocumentToEntityTransformer();
                    return callback(error, transformer.transform(result, repository.metadata));
                });
            }
            else {
                return mongodb_1.Cursor.prototype.next.call(this).then(function (result) {
                    if (!result)
                        return result;
                    var transformer = new DocumentToEntityTransformer_1.DocumentToEntityTransformer();
                    return transformer.transform(result, repository.metadata);
                });
            }
        };
        return cursor;
    };
    /**
     * Execute an aggregation framework pipeline against the collection.
     */
    MongoRepository.prototype.aggregate = function (pipeline, options) {
        return this.queryRunner.aggregate(this.metadata.table.name, pipeline, options);
    };
    /**
     * Perform a bulkWrite operation without a fluent API.
     */
    MongoRepository.prototype.bulkWrite = function (operations, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.bulkWrite(this.metadata.table.name, operations, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Count number of matching documents in the db to a query.
     */
    MongoRepository.prototype.count = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.count(this.metadata.table.name, query || {}, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Creates an index on the db and collection.
     */
    MongoRepository.prototype.createCollectionIndex = function (fieldOrSpec, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.createCollectionIndex(this.metadata.table.name, fieldOrSpec, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     */
    MongoRepository.prototype.createCollectionIndexes = function (indexSpecs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.createCollectionIndexes(this.metadata.table.name, indexSpecs)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Delete multiple documents on MongoDB.
     */
    MongoRepository.prototype.deleteMany = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.deleteMany(this.metadata.table.name, query, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Delete a document on MongoDB.
     */
    MongoRepository.prototype.deleteOne = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.deleteOne(this.metadata.table.name, query, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     */
    MongoRepository.prototype.distinct = function (key, query, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.distinct(this.metadata.table.name, key, query, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Drops an index from this collection.
     */
    MongoRepository.prototype.dropCollectionIndex = function (indexName, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.dropCollectionIndex(this.metadata.table.name, indexName, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Drops all indexes from the collection.
     */
    MongoRepository.prototype.dropCollectionIndexes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.dropCollectionIndexes(this.metadata.table.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoRepository.prototype.findOneAndDelete = function (query, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.findOneAndDelete(this.metadata.table.name, query, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoRepository.prototype.findOneAndReplace = function (query, replacement, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.findOneAndReplace(this.metadata.table.name, query, replacement, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoRepository.prototype.findOneAndUpdate = function (query, update, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.findOneAndUpdate(this.metadata.table.name, query, update, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Execute a geo search using a geo haystack index on a collection.
     */
    MongoRepository.prototype.geoHaystackSearch = function (x, y, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.geoHaystackSearch(this.metadata.table.name, x, y, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Execute the geoNear command to search for items in the collection.
     */
    MongoRepository.prototype.geoNear = function (x, y, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.geoNear(this.metadata.table.name, x, y, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Run a group command across a collection.
     */
    MongoRepository.prototype.group = function (keys, condition, initial, reduce, finalize, command, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.group(this.metadata.table.name, keys, condition, initial, reduce, finalize, command, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve all the indexes on the collection.
     */
    MongoRepository.prototype.collectionIndexes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.collectionIndexes(this.metadata.table.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieve all the indexes on the collection.
     */
    MongoRepository.prototype.collectionIndexExists = function (indexes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.collectionIndexExists(this.metadata.table.name, indexes)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves this collections index info.
     */
    MongoRepository.prototype.collectionIndexInformation = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.collectionIndexInformation(this.metadata.table.name, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     */
    MongoRepository.prototype.initializeOrderedBulkOp = function (options) {
        return this.queryRunner.initializeOrderedBulkOp(this.metadata.table.name, options);
    };
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     */
    MongoRepository.prototype.initializeUnorderedBulkOp = function (options) {
        return this.queryRunner.initializeUnorderedBulkOp(this.metadata.table.name, options);
    };
    /**
     * Inserts an array of documents into MongoDB.
     */
    MongoRepository.prototype.insertMany = function (docs, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.insertMany(this.metadata.table.name, docs, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Inserts a single document into MongoDB.
     */
    MongoRepository.prototype.insertOne = function (doc, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.insertOne(this.metadata.table.name, doc, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns if the collection is a capped collection.
     */
    MongoRepository.prototype.isCapped = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.isCapped(this.metadata.table.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get the list of all indexes information for the collection.
     */
    MongoRepository.prototype.listCollectionIndexes = function (options) {
        return this.queryRunner.listCollectionIndexes(this.metadata.table.name, options);
    };
    /**
     * Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.
     */
    MongoRepository.prototype.mapReduce = function (map, reduce, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.mapReduce(this.metadata.table.name, map, reduce, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Return N number of parallel cursors for a collection allowing parallel reading of entire collection.
     * There are no ordering guarantees for returned results.
     */
    MongoRepository.prototype.parallelCollectionScan = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.parallelCollectionScan(this.metadata.table.name, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    MongoRepository.prototype.reIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.reIndex(this.metadata.table.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    MongoRepository.prototype.rename = function (newName, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.rename(this.metadata.table.name, newName, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Replace a document on MongoDB.
     */
    MongoRepository.prototype.replaceOne = function (query, doc, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.replaceOne(this.metadata.table.name, query, doc, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get all the collection statistics.
     */
    MongoRepository.prototype.stats = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.stats(this.metadata.table.name, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Update multiple documents on MongoDB.
     */
    MongoRepository.prototype.updateMany = function (query, update, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.updateMany(this.metadata.table.name, query, update, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Update a single document on MongoDB.
     */
    MongoRepository.prototype.updateOne = function (query, update, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queryRunner.updateOne(this.metadata.table.name, query, update, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Object.defineProperty(MongoRepository.prototype, "queryRunner", {
        // -------------------------------------------------------------------------
        // Protected Methods
        // -------------------------------------------------------------------------
        // todo: extra these methods into separate class
        get: function () {
            return this.connection.driver.queryRunner;
        },
        enumerable: true,
        configurable: true
    });
    MongoRepository.prototype.convertFindManyOptionsOrConditionsToMongodbQuery = function (optionsOrConditions) {
        if (!optionsOrConditions)
            return undefined;
        return FindOptionsUtils_1.FindOptionsUtils.isFindManyOptions(optionsOrConditions) ? optionsOrConditions.where : optionsOrConditions;
    };
    MongoRepository.prototype.convertFindOneOptionsOrConditionsToMongodbQuery = function (optionsOrConditions) {
        if (!optionsOrConditions)
            return undefined;
        return FindOptionsUtils_1.FindOptionsUtils.isFindOneOptions(optionsOrConditions) ? optionsOrConditions.where : optionsOrConditions;
    };
    MongoRepository.prototype.convertFindOptionsOrderToOrderCriteria = function (order) {
        var orderCriteria = {};
        Object.keys(order).forEach(function (key) { return orderCriteria[key] = [key, order[key].toLowerCase()]; });
        return orderCriteria;
    };
    return MongoRepository;
}(Repository_1.Repository));
exports.MongoRepository = MongoRepository;

//# sourceMappingURL=MongoRepository.js.map
