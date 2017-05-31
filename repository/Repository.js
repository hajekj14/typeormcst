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
var QueryBuilder_1 = require("../query-builder/QueryBuilder");
var PlainObjectToNewEntityTransformer_1 = require("../query-builder/transformer/PlainObjectToNewEntityTransformer");
var PlainObjectToDatabaseEntityTransformer_1 = require("../query-builder/transformer/PlainObjectToDatabaseEntityTransformer");
var FindOptionsUtils_1 = require("../find-options/FindOptionsUtils");
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
var SubjectOperationExecutor_1 = require("../persistence/SubjectOperationExecutor");
var SubjectBuilder_1 = require("../persistence/SubjectBuilder");
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
var Repository = (function () {
    function Repository() {
    }
    Object.defineProperty(Repository.prototype, "target", {
        // -------------------------------------------------------------------------
        // Public Methods
        // -------------------------------------------------------------------------
        /**
         * Returns object that is managed by this repository.
         * If this repository manages entity from schema,
         * then it returns a name of that schema instead.
         */
        get: function () {
            return this.metadata.target;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if entity has an id.
     * If entity contains compose ids, then it checks them all.
     */
    Repository.prototype.hasId = function (entity) {
        return this.metadata.hasId(entity);
    };
    /**
     * Gets entity mixed id.
     */
    Repository.prototype.getId = function (entity) {
        return this.metadata.getEntityIdMixedMap(entity);
    };
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    Repository.prototype.createQueryBuilder = function (alias, queryRunnerProvider) {
        return new QueryBuilder_1.QueryBuilder(this.connection, queryRunnerProvider || this.queryRunnerProvider)
            .select(alias)
            .from(this.metadata.target, alias);
    };
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     */
    Repository.prototype.create = function (plainEntityLikeOrPlainEntityLikes) {
        var _this = this;
        if (!plainEntityLikeOrPlainEntityLikes)
            return this.metadata.create();
        if (plainEntityLikeOrPlainEntityLikes instanceof Array)
            return plainEntityLikeOrPlainEntityLikes.map(function (plainEntityLike) { return _this.create(plainEntityLike); });
        return this.merge(this.metadata.create(), plainEntityLikeOrPlainEntityLikes);
    };
    /**
     * Merges multiple entities (or entity-like objects) into a given entity.
     */
    Repository.prototype.merge = function (mergeIntoEntity) {
        var _this = this;
        var entityLikes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            entityLikes[_i - 1] = arguments[_i];
        }
        var plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer_1.PlainObjectToNewEntityTransformer();
        entityLikes.forEach(function (object) { return plainObjectToEntityTransformer.transform(mergeIntoEntity, object, _this.metadata); });
        return mergeIntoEntity;
    };
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     *
     * Note that given entity-like object must have an entity id / primary key to find entity by.
     * Returns undefined if entity with given id was not found.
     */
    Repository.prototype.preload = function (entityLike) {
        return __awaiter(this, void 0, void 0, function () {
            var plainObjectToDatabaseEntityTransformer, transformedEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        plainObjectToDatabaseEntityTransformer = new PlainObjectToDatabaseEntityTransformer_1.PlainObjectToDatabaseEntityTransformer(this.connection.entityManager);
                        return [4 /*yield*/, plainObjectToDatabaseEntityTransformer.transform(entityLike, this.metadata)];
                    case 1:
                        transformedEntity = _a.sent();
                        if (transformedEntity)
                            return [2 /*return*/, this.merge(transformedEntity, entityLike)];
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    /**
     * Persists one or many given entities.
     */
    Repository.prototype.persist = function (entityOrEntities, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunnerProvider, transactionEntityManager, databaseEntityLoader, executor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if for some reason non empty entity was passed then return it back without having to do anything
                        if (!entityOrEntities)
                            return [2 /*return*/, entityOrEntities];
                        // if multiple entities given then go throw all of them and save them
                        if (entityOrEntities instanceof Array)
                            return [2 /*return*/, Promise.all(entityOrEntities.map(function (entity) { return _this.persist(entity); }))];
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 7]);
                        transactionEntityManager = this.connection.createEntityManagerWithSingleDatabaseConnection(queryRunnerProvider);
                        databaseEntityLoader = new SubjectBuilder_1.SubjectBuilder(this.connection, queryRunnerProvider);
                        return [4 /*yield*/, databaseEntityLoader.persist(entityOrEntities, this.metadata)];
                    case 2:
                        _a.sent();
                        executor = new SubjectOperationExecutor_1.SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunnerProvider);
                        return [4 /*yield*/, executor.execute(databaseEntityLoader.operateSubjects)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entityOrEntities];
                    case 4:
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunnerProvider.releaseReused()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     */
    Repository.prototype.update = function (conditionsOrFindOptions, partialEntity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(conditionsOrFindOptions)];
                    case 1:
                        entity = _a.sent();
                        if (!entity)
                            throw new Error("Cannot find entity to update by a given criteria");
                        Object.assign(entity, partialEntity);
                        return [4 /*yield*/, this.persist(entity, options)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates entity partially. Entity will be found by a given id.
     */
    Repository.prototype.updateById = function (id, partialEntity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(id)];
                    case 1:
                        entity = _a.sent();
                        if (!entity)
                            throw new Error("Cannot find entity to update by a id");
                        Object.assign(entity, partialEntity);
                        return [4 /*yield*/, this.persist(entity, options)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes one or many given entities.
     */
    Repository.prototype.remove = function (entityOrEntities, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunnerProvider, transactionEntityManager, databaseEntityLoader, executor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // if for some reason non empty entity was passed then return it back without having to do anything
                        if (!entityOrEntities)
                            return [2 /*return*/, entityOrEntities];
                        // if multiple entities given then go throw all of them and save them
                        if (entityOrEntities instanceof Array)
                            return [2 /*return*/, Promise.all(entityOrEntities.map(function (entity) { return _this.remove(entity); }))];
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 7]);
                        transactionEntityManager = this.connection.createEntityManagerWithSingleDatabaseConnection(queryRunnerProvider);
                        databaseEntityLoader = new SubjectBuilder_1.SubjectBuilder(this.connection, queryRunnerProvider);
                        return [4 /*yield*/, databaseEntityLoader.remove(entityOrEntities, this.metadata)];
                    case 2:
                        _a.sent();
                        executor = new SubjectOperationExecutor_1.SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunnerProvider);
                        return [4 /*yield*/, executor.execute(databaseEntityLoader.operateSubjects)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, entityOrEntities];
                    case 4:
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunnerProvider.releaseReused()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes entity by a given entity id.
     */
    Repository.prototype.removeById = function (id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(id)];
                    case 1:
                        entity = _a.sent();
                        if (!entity)
                            throw new Error("Cannot find entity to remove by a given id");
                        return [4 /*yield*/, this.remove(entity, options)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Counts entities that match given find options or conditions.
     */
    Repository.prototype.count = function (optionsOrConditions) {
        var qb = this.createQueryBuilder(FindOptionsUtils_1.FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || this.metadata.table.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getCount();
    };
    /**
     * Finds entities that match given find options or conditions.
     */
    Repository.prototype.find = function (optionsOrConditions) {
        var qb = this.createQueryBuilder(FindOptionsUtils_1.FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || this.metadata.table.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getMany();
    };
    /**
     * Finds entities that match given find options or conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    Repository.prototype.findAndCount = function (optionsOrConditions) {
        var qb = this.createQueryBuilder(FindOptionsUtils_1.FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || this.metadata.table.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getManyAndCount();
    };
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     */
    Repository.prototype.findByIds = function (ids, optionsOrConditions) {
        var qb = this.createQueryBuilder(FindOptionsUtils_1.FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || this.metadata.table.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions)
            .andWhereInIds(ids)
            .getMany();
    };
    /**
     * Finds first entity that matches given conditions.
     */
    Repository.prototype.findOne = function (optionsOrConditions) {
        var qb = this.createQueryBuilder(FindOptionsUtils_1.FindOptionsUtils.extractFindOneOptionsAlias(optionsOrConditions) || this.metadata.table.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindOneOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getOne();
    };
    /**
     * Finds entity by given id.
     * Optionally find options or conditions can be applied.
     */
    Repository.prototype.findOneById = function (id, optionsOrConditions) {
        var qb = this.createQueryBuilder(FindOptionsUtils_1.FindOptionsUtils.extractFindOneOptionsAlias(optionsOrConditions) || this.metadata.table.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindOneOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions)
            .andWhereInIds([id])
            .getOne();
    };
    /**
     * Executes a raw SQL query and returns a raw database results.
     * Raw query execution is supported only by relational databases (MongoDB is not supported).
     */
    Repository.prototype.query = function (query, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 6]);
                        return [4 /*yield*/, queryRunner.query(query, parameters)];
                    case 3: return [2 /*return*/, _a.sent()]; // await is needed here because we are using finally
                    case 4: return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided repository.
     *
     * Most important, you should execute all your database operations using provided repository instance,
     * all other operations would not be included in the transaction.
     * If you want to execute transaction and persist multiple different entity types, then
     * use EntityManager.transaction method instead.
     *
     * Transactions are supported only by relational databases (MongoDB is not supported).
     */
    Repository.prototype.transaction = function (runInTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner, transactionRepository, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        transactionRepository = new Repository();
                        transactionRepository["connection"] = this.connection;
                        transactionRepository["metadata"] = this.metadata;
                        transactionRepository["queryRunnerProvider"] = queryRunnerProvider;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 8, 12]);
                        return [4 /*yield*/, queryRunner.beginTransaction()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, runInTransaction(transactionRepository)];
                    case 4:
                        result = _a.sent();
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, result];
                    case 6:
                        err_1 = _a.sent();
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 7:
                        _a.sent();
                        throw err_1;
                    case 8: return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 9:
                        _a.sent();
                        if (!!this.queryRunnerProvider) return [3 /*break*/, 11];
                        return [4 /*yield*/, queryRunnerProvider.releaseReused()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clears all the data from the given table/collection (truncates/drops it).
     */
    Repository.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 6]);
                        return [4 /*yield*/, queryRunner.truncate(this.metadata.table.name)];
                    case 3: return [2 /*return*/, _a.sent()]; // await is needed here because we are using finally
                    case 4: return [4 /*yield*/, queryRunnerProvider.release(queryRunner)];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Repository;
}());
exports.Repository = Repository;

//# sourceMappingURL=Repository.js.map
