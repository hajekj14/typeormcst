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
var QueryRunnerProviderAlreadyReleasedError_1 = require("../query-runner/error/QueryRunnerProviderAlreadyReleasedError");
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
var RepositoryAggregator_1 = require("../repository/RepositoryAggregator");
var NoNeedToReleaseEntityManagerError_1 = require("./error/NoNeedToReleaseEntityManagerError");
var Repository_1 = require("../repository/Repository");
var RepositoryNotTreeError_1 = require("../connection/error/RepositoryNotTreeError");
var QueryBuilder_1 = require("../query-builder/QueryBuilder");
var FindOptionsUtils_1 = require("../find-options/FindOptionsUtils");
var SubjectBuilder_1 = require("../persistence/SubjectBuilder");
var SubjectOperationExecutor_1 = require("../persistence/SubjectOperationExecutor");
var PlainObjectToNewEntityTransformer_1 = require("../query-builder/transformer/PlainObjectToNewEntityTransformer");
var PlainObjectToDatabaseEntityTransformer_1 = require("../query-builder/transformer/PlainObjectToDatabaseEntityTransformer");
var CustomRepositoryNotFoundError_1 = require("../repository/error/CustomRepositoryNotFoundError");
var index_1 = require("../index");
var AbstractRepository_1 = require("../repository/AbstractRepository");
var CustomRepositoryCannotInheritRepositoryError_1 = require("../repository/error/CustomRepositoryCannotInheritRepositoryError");
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
var EntityManager = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    /**
     * @param connection Connection to be used in this entity manager
     * @param queryRunnerProvider Custom query runner to be used for operations in this entity manager
     */
    function EntityManager(connection, queryRunnerProvider) {
        this.connection = connection;
        this.queryRunnerProvider = queryRunnerProvider;
        // -------------------------------------------------------------------------
        // Private properties
        // -------------------------------------------------------------------------
        /**
         * Stores temporarily user data.
         * Useful for sharing data with subscribers.
         */
        this.data = {};
        /**
         * Stores all registered repositories.
         */
        this.repositoryAggregators = [];
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Gets user data by a given key.
     * Used get stored data stored in a transactional entity manager.
     */
    EntityManager.prototype.getData = function (key) {
        return this.data[key];
    };
    /**
     * Sets value for the given key in user data.
     * Used to store data in a transactional entity manager which can be accessed in subscribers then.
     */
    EntityManager.prototype.setData = function (key, value) {
        this.data[key] = value;
        return this;
    };
    /**
     * Checks if entity has an id by its Function type or schema name.
     */
    EntityManager.prototype.hasId = function (targetOrEntity, maybeEntity) {
        var target = arguments.length === 2 ? targetOrEntity : targetOrEntity.constructor;
        var entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        var metadata = this.connection.getMetadata(target);
        return metadata.hasId(entity);
    };
    /**
     * Gets entity mixed id.
     */
    EntityManager.prototype.getId = function (targetOrEntity, maybeEntity) {
        var target = arguments.length === 2 ? targetOrEntity : targetOrEntity.constructor;
        var entity = arguments.length === 2 ? maybeEntity : targetOrEntity;
        var metadata = this.connection.getMetadata(target);
        return metadata.getEntityIdMixedMap(entity);
    };
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    EntityManager.prototype.createQueryBuilder = function (entityClass, alias, queryRunnerProvider) {
        var metadata = this.connection.getMetadata(entityClass);
        return new QueryBuilder_1.QueryBuilder(this.connection, queryRunnerProvider || this.queryRunnerProvider)
            .select(alias)
            .from(metadata.target, alias);
    };
    /**
     * Creates a new entity instance or instances.
     * Can copy properties from the given object into new entities.
     */
    EntityManager.prototype.create = function (entityClass, plainObjectOrObjects) {
        var _this = this;
        var metadata = this.connection.getMetadata(entityClass);
        if (!plainObjectOrObjects)
            return metadata.create();
        if (plainObjectOrObjects instanceof Array)
            return plainObjectOrObjects.map(function (plainEntityLike) { return _this.create(entityClass, plainEntityLike); });
        return this.merge(entityClass, metadata.create(), plainObjectOrObjects);
    };
    /**
     * Merges two entities into one new entity.
     */
    EntityManager.prototype.merge = function (entityClass, mergeIntoEntity) {
        var entityLikes = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            entityLikes[_i - 2] = arguments[_i];
        }
        var metadata = this.connection.getMetadata(entityClass);
        var plainObjectToEntityTransformer = new PlainObjectToNewEntityTransformer_1.PlainObjectToNewEntityTransformer();
        entityLikes.forEach(function (object) { return plainObjectToEntityTransformer.transform(mergeIntoEntity, object, metadata); });
        return mergeIntoEntity;
    };
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    EntityManager.prototype.preload = function (entityClass, entityLike) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, plainObjectToDatabaseEntityTransformer, transformedEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.connection.getMetadata(entityClass);
                        plainObjectToDatabaseEntityTransformer = new PlainObjectToDatabaseEntityTransformer_1.PlainObjectToDatabaseEntityTransformer(this.connection.manager);
                        return [4 /*yield*/, plainObjectToDatabaseEntityTransformer.transform(entityLike, metadata)];
                    case 1:
                        transformedEntity = _a.sent();
                        if (transformedEntity)
                            return [2 /*return*/, this.merge(entityClass, transformedEntity, entityLike)];
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    /**
     * Persists (saves) a given entity in the database.
     */
    EntityManager.prototype.save = function (targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        var _this = this;
        var target = (arguments.length > 1 && (targetOrEntity instanceof Function || typeof targetOrEntity === "string")) ? targetOrEntity : undefined;
        var entity = target ? maybeEntityOrOptions : targetOrEntity;
        var options = target ? maybeOptions : maybeEntityOrOptions;
        return Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var finalTarget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(entity instanceof Array)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(entity.map(function (e) {
                                var finalTarget = target ? target : e.constructor;
                                return _this.saveOne(finalTarget, e, options);
                            }))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        finalTarget = target ? target : entity.constructor;
                        return [4 /*yield*/, this.saveOne(finalTarget, entity, options)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, entity];
                }
            });
        }); });
    };
    /**
     * Persists (saves) a given entity in the database.
     *
     * @deprecated
     */
    EntityManager.prototype.persist = function (targetOrEntity, maybeEntity, options) {
        return this.save(targetOrEntity, maybeEntity, options);
    };
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     */
    EntityManager.prototype.update = function (target, conditionsOrFindOptions, partialEntity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(target, conditionsOrFindOptions)];
                    case 1:
                        entity = _a.sent();
                        if (!entity)
                            throw new Error("Cannot find entity to update by a given criteria");
                        Object.assign(entity, partialEntity);
                        return [4 /*yield*/, this.save(entity, options)];
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
    EntityManager.prototype.updateById = function (target, id, partialEntity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(target, id)];
                    case 1:
                        entity = _a.sent();
                        if (!entity)
                            throw new Error("Cannot find entity to update by a id");
                        Object.assign(entity, partialEntity);
                        return [4 /*yield*/, this.save(entity, options)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a given entity from the database.
     */
    EntityManager.prototype.remove = function (targetOrEntity, maybeEntityOrOptions, maybeOptions) {
        var _this = this;
        var target = (arguments.length > 1 && (targetOrEntity instanceof Function || typeof targetOrEntity === "string")) ? targetOrEntity : undefined;
        var entity = target ? maybeEntityOrOptions : targetOrEntity;
        var options = target ? maybeOptions : maybeEntityOrOptions;
        return Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var finalTarget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(entity instanceof Array)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(entity.map(function (e) {
                                var finalTarget = target ? target : e.constructor;
                                return _this.removeOne(finalTarget, e, options);
                            }))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        finalTarget = target ? target : entity.constructor;
                        return [4 /*yield*/, this.removeOne(finalTarget, entity, options)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, entity];
                }
            });
        }); });
    };
    /**
     * Removes entity by a given entity id.
     */
    EntityManager.prototype.removeById = function (targetOrEntity, id, options) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOneById(targetOrEntity, id)];
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
    EntityManager.prototype.count = function (entityClass, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils_1.FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getCount();
    };
    /**
     * Finds entities that match given find options or conditions.
     */
    EntityManager.prototype.find = function (entityClass, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils_1.FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getMany();
    };
    /**
     * Finds entities that match given find options and conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    EntityManager.prototype.findAndCount = function (entityClass, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils_1.FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getManyAndCount();
    };
    /**
     * Finds entities with ids.
     * Optionally find options or conditions can be applied.
     */
    EntityManager.prototype.findByIds = function (entityClass, ids, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils_1.FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name);
        FindOptionsUtils_1.FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
        ids = ids.map(function (id) {
            if (!metadata.hasMultiplePrimaryKeys && !(id instanceof Object)) {
                return metadata.createEntityIdMap([id]);
            }
            return id;
        });
        qb.andWhereInIds(ids);
        return qb.getMany();
    };
    /**
     * Finds first entity that matches given conditions.
     */
    EntityManager.prototype.findOne = function (entityClass, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils_1.FindOptionsUtils.extractFindOneOptionsAlias(optionsOrConditions) || metadata.name);
        return FindOptionsUtils_1.FindOptionsUtils.applyFindOneOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions).getOne();
    };
    /**
     * Finds entity with given id.
     * Optionally find options or conditions can be applied.
     */
    EntityManager.prototype.findOneById = function (entityClass, id, optionsOrConditions) {
        var metadata = this.connection.getMetadata(entityClass);
        var qb = this.createQueryBuilder(entityClass, FindOptionsUtils_1.FindOptionsUtils.extractFindOneOptionsAlias(optionsOrConditions) || metadata.name);
        if (metadata.hasMultiplePrimaryKeys && !(id instanceof Object)) {
            // const columnNames = this.metadata.getEntityIdMap({  });
            throw new Error("You have multiple primary keys in your entity, to use findOneById with multiple primary keys please provide " +
                "complete object with all entity ids, like this: { firstKey: value, secondKey: value }");
        }
        FindOptionsUtils_1.FindOptionsUtils.applyFindOneOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
        if (!metadata.hasMultiplePrimaryKeys && !(id instanceof Object)) {
            id = metadata.createEntityIdMap([id]);
        }
        qb.andWhereInIds([id]);
        return qb.getOne();
    };
    /**
     * Executes raw SQL query and returns raw database results.
     */
    EntityManager.prototype.query = function (query, parameters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
                            throw new QueryRunnerProviderAlreadyReleasedError_1.QueryRunnerProviderAlreadyReleasedError();
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
     * All database operations must be executed using provided entity manager.
     */
    EntityManager.prototype.transaction = function (runInTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunnerProvider, queryRunner, transactionEntityManager, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
                            throw new QueryRunnerProviderAlreadyReleasedError_1.QueryRunnerProviderAlreadyReleasedError();
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        transactionEntityManager = new EntityManager(this.connection, queryRunnerProvider);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 8, 12]);
                        return [4 /*yield*/, queryRunner.beginTransaction()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, runInTransaction(transactionEntityManager)];
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
     * Clears all the data from the given table (truncates/drops it).
     */
    EntityManager.prototype.clear = function (entityClass) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, queryRunnerProvider, queryRunner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.connection.getMetadata(entityClass);
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver);
                        return [4 /*yield*/, queryRunnerProvider.provide()];
                    case 1:
                        queryRunner = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 6]);
                        return [4 /*yield*/, queryRunner.truncate(metadata.tableName)];
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
     * Gets repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    EntityManager.prototype.getRepository = function (entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider)
            return this.obtainRepositoryAggregator(entityClassOrName).repository;
        return this.connection.getRepository(entityClassOrName);
    };
    /**
     * Gets tree repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    EntityManager.prototype.getTreeRepository = function (entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider) {
            var treeRepository = this.obtainRepositoryAggregator(entityClassOrName).treeRepository;
            if (!treeRepository)
                throw new RepositoryNotTreeError_1.RepositoryNotTreeError(entityClassOrName);
            return treeRepository;
        }
        return this.connection.getTreeRepository(entityClassOrName);
    };
    /**
     * Gets mongodb repository for the given entity class or name.
     */
    EntityManager.prototype.getMongoRepository = function (entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider)
            return this.obtainRepositoryAggregator(entityClassOrName).repository;
        return this.connection.getMongoRepository(entityClassOrName);
    };
    /**
     * Gets specific repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     *
     * @deprecated Don't use specific repository - it will be refactored or removed
     */
    EntityManager.prototype.getSpecificRepository = function (entityClassOrName) {
        // if single db connection is used then create its own repository with reused query runner
        if (this.queryRunnerProvider)
            return this.obtainRepositoryAggregator(entityClassOrName).specificRepository;
        return this.connection.getSpecificRepository(entityClassOrName);
    };
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    EntityManager.prototype.getCustomRepository = function (customRepository) {
        var entityRepositoryMetadataArgs = index_1.getMetadataArgsStorage().entityRepositories.find(function (repository) {
            return repository.target === (customRepository instanceof Function ? customRepository : customRepository.constructor);
        });
        if (!entityRepositoryMetadataArgs)
            throw new CustomRepositoryNotFoundError_1.CustomRepositoryNotFoundError(customRepository);
        var entityMetadata = entityRepositoryMetadataArgs.entity ? this.connection.getMetadata(entityRepositoryMetadataArgs.entity) : undefined;
        var entityRepositoryInstance = new entityRepositoryMetadataArgs.target(this, entityMetadata);
        // NOTE: dynamic access to protected properties. We need this to prevent unwanted properties in those classes to be exposed,
        // however we need these properties for internal work of the class
        if (entityRepositoryInstance instanceof AbstractRepository_1.AbstractRepository) {
            if (!entityRepositoryInstance["manager"])
                entityRepositoryInstance["manager"] = this;
        }
        if (entityRepositoryInstance instanceof Repository_1.Repository) {
            if (!entityMetadata)
                throw new CustomRepositoryCannotInheritRepositoryError_1.CustomRepositoryCannotInheritRepositoryError(customRepository);
            entityRepositoryInstance["manager"] = this;
            entityRepositoryInstance["metadata"] = entityMetadata;
        }
        return entityRepositoryInstance;
    };
    /**
     * Releases all resources used by entity manager.
     * This is used when entity manager is created with a single query runner,
     * and this single query runner needs to be released after job with entity manager is done.
     */
    EntityManager.prototype.release = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.queryRunnerProvider)
                    throw new NoNeedToReleaseEntityManagerError_1.NoNeedToReleaseEntityManagerError();
                return [2 /*return*/, this.queryRunnerProvider.releaseReused()];
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Performs a save operation for a single entity.
     */
    EntityManager.prototype.saveOne = function (target, entity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, queryRunnerProvider, transactionEntityManager, databaseEntityLoader, executor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.connection.getMetadata(target);
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 7]);
                        transactionEntityManager = this.connection.createEntityManagerWithSingleDatabaseConnection(queryRunnerProvider);
                        databaseEntityLoader = new SubjectBuilder_1.SubjectBuilder(this.connection, queryRunnerProvider);
                        return [4 /*yield*/, databaseEntityLoader.persist(entity, metadata)];
                    case 2:
                        _a.sent();
                        executor = new SubjectOperationExecutor_1.SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunnerProvider);
                        return [4 /*yield*/, executor.execute(databaseEntityLoader.operateSubjects)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 7];
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
     * Performs a remove operation for a single entity.
     */
    EntityManager.prototype.removeOne = function (target, entity, options) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, queryRunnerProvider, transactionEntityManager, databaseEntityLoader, executor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = this.connection.getMetadata(target);
                        queryRunnerProvider = this.queryRunnerProvider || new QueryRunnerProvider_1.QueryRunnerProvider(this.connection.driver, true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 7]);
                        transactionEntityManager = this.connection.createEntityManagerWithSingleDatabaseConnection(queryRunnerProvider);
                        databaseEntityLoader = new SubjectBuilder_1.SubjectBuilder(this.connection, queryRunnerProvider);
                        return [4 /*yield*/, databaseEntityLoader.remove(entity, metadata)];
                    case 2:
                        _a.sent();
                        executor = new SubjectOperationExecutor_1.SubjectOperationExecutor(this.connection, transactionEntityManager, queryRunnerProvider);
                        return [4 /*yield*/, executor.execute(databaseEntityLoader.operateSubjects)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 7];
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
     * Gets, or if does not exist yet, creates and returns a repository aggregator for a particular entity target.
     */
    EntityManager.prototype.obtainRepositoryAggregator = function (entityClassOrName) {
        if (this.queryRunnerProvider && this.queryRunnerProvider.isReleased)
            throw new QueryRunnerProviderAlreadyReleasedError_1.QueryRunnerProviderAlreadyReleasedError();
        var metadata = this.connection.getMetadata(entityClassOrName);
        var repositoryAggregator = this.repositoryAggregators.find(function (repositoryAggregate) { return repositoryAggregate.metadata === metadata; });
        if (!repositoryAggregator) {
            repositoryAggregator = new RepositoryAggregator_1.RepositoryAggregator(this.connection, this.connection.getMetadata(entityClassOrName), this.queryRunnerProvider);
            this.repositoryAggregators.push(repositoryAggregator); // todo: check isnt memory leak here?
        }
        return repositoryAggregator;
    };
    return EntityManager;
}());
exports.EntityManager = EntityManager;

//# sourceMappingURL=EntityManager.js.map
