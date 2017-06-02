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
var OracleDriver_1 = require("../driver/oracle/OracleDriver");
var RawSqlResultsToEntityTransformer_1 = require("./transformer/RawSqlResultsToEntityTransformer");
var SqlServerDriver_1 = require("../driver/sqlserver/SqlServerDriver");
var QueryRunnerProvider_1 = require("../query-runner/QueryRunnerProvider");
var PessimisticLockTransactionRequiredError_1 = require("./error/PessimisticLockTransactionRequiredError");
var NoVersionOrUpdateDateColumnError_1 = require("./error/NoVersionOrUpdateDateColumnError");
var OptimisticLockVersionMismatchError_1 = require("./error/OptimisticLockVersionMismatchError");
var OptimisticLockCanNotBeUsedError_1 = require("./error/OptimisticLockCanNotBeUsedError");
var PostgresDriver_1 = require("../driver/postgres/PostgresDriver");
var MysqlDriver_1 = require("../driver/mysql/MysqlDriver");
var LockNotSupportedOnGivenDriverError_1 = require("./error/LockNotSupportedOnGivenDriverError");
var JoinAttribute_1 = require("./JoinAttribute");
var RelationIdAttribute_1 = require("./relation-id/RelationIdAttribute");
var RelationCountAttribute_1 = require("./relation-count/RelationCountAttribute");
var QueryExpressionMap_1 = require("./QueryExpressionMap");
var RelationIdLoader_1 = require("./relation-id/RelationIdLoader");
var RelationIdMetadataToAttributeTransformer_1 = require("./relation-id/RelationIdMetadataToAttributeTransformer");
var RelationCountLoader_1 = require("./relation-count/RelationCountLoader");
var RelationCountMetadataToAttributeTransformer_1 = require("./relation-count/RelationCountMetadataToAttributeTransformer");
// todo: fix problem with long aliases eg getMaxIdentifierLength
// todo: fix replacing in .select("COUNT(post.id) AS cnt") statement
// todo: implement joinAlways in relations and relationId
// todo: implement @Select decorator
// todo: add quoting functions
// todo: .addCount and .addCountSelect()
// todo: add selectAndMap
// todo: tests for:
// todo: entityOrProperty can be target name. implement proper behaviour if it is.
// todo: think about subselect in joins syntax
// todo: create multiple representations of QueryBuilder: UpdateQueryBuilder, DeleteQueryBuilder
// qb.update() returns UpdateQueryBuilder
// qb.delete() returns DeleteQueryBuilder
// qb.select() returns SelectQueryBuilder
// todo: COMPLETELY COVER QUERY BUILDER WITH TESTS
// todo: SUBSELECT IMPLEMENTATION
// .whereSubselect(qb => qb.select().from().where())
// todo: also create qb.createSubQueryBuilder()
// todo: check in persistment if id exist on object and throw exception (can be in partial selection?)
// todo: STREAMING
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
var QueryBuilder = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function QueryBuilder(connection, queryRunnerProvider) {
        this.connection = connection;
        this.queryRunnerProvider = queryRunnerProvider;
        this.expressionMap = new QueryExpressionMap_1.QueryExpressionMap(connection);
    }
    Object.defineProperty(QueryBuilder.prototype, "alias", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Gets the main alias string used in this query builder.
         */
        get: function () {
            if (!this.expressionMap.mainAlias)
                throw new Error("Main alias is not set"); // todo: better exception
            return this.expressionMap.mainAlias.name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates SELECT query and selects given data.
     * Replaces all previous selections if they exist.
     */
    QueryBuilder.prototype.select = function (selection, selectionAliasName) {
        this.expressionMap.queryType = "select";
        if (selection instanceof Array) {
            this.expressionMap.selects = selection.map(function (selection) { return ({ selection: selection }); });
        }
        else if (selection) {
            this.expressionMap.selects = [{ selection: selection, aliasName: selectionAliasName }];
        }
        return this;
    };
    /**
     * Adds new selection to the SELECT query.
     */
    QueryBuilder.prototype.addSelect = function (selection, selectionAliasName) {
        if (selection instanceof Array) {
            this.expressionMap.selects = this.expressionMap.selects.concat(selection.map(function (selection) { return ({ selection: selection }); }));
        }
        else {
            this.expressionMap.selects.push({ selection: selection, aliasName: selectionAliasName });
        }
        return this;
    };
    /**
     * Creates UPDATE query and applies given update values.
     */
    QueryBuilder.prototype.update = function (entityOrTableNameUpdateSet, maybeUpdateSet) {
        var updateSet = maybeUpdateSet ? maybeUpdateSet : entityOrTableNameUpdateSet;
        if (entityOrTableNameUpdateSet instanceof Function) {
            this.expressionMap.createMainAlias({
                target: entityOrTableNameUpdateSet
            });
        }
        else if (typeof entityOrTableNameUpdateSet === "string") {
            this.expressionMap.createMainAlias({
                tableName: entityOrTableNameUpdateSet
            });
        }
        this.expressionMap.queryType = "update";
        this.expressionMap.updateSet = updateSet;
        return this;
    };
    /**
     * Creates DELETE query.
     */
    QueryBuilder.prototype.delete = function () {
        this.expressionMap.queryType = "delete";
        return this;
    };
    /**
     * Specifies FROM which entity's table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    QueryBuilder.prototype.from = function (entityTarget, aliasName) {
        this.expressionMap.createMainAlias({
            name: aliasName,
            target: entityTarget
        });
        return this;
    };
    /**
     * Specifies FROM which table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    QueryBuilder.prototype.fromTable = function (tableName, aliasName) {
        // if table has a metadata then find it to properly escape its properties
        var metadata = this.connection.entityMetadatas.find(function (metadata) { return metadata.tableName === tableName; });
        if (metadata) {
            this.expressionMap.createMainAlias({
                name: aliasName,
                metadata: metadata,
            });
        }
        else {
            this.expressionMap.createMainAlias({
                name: aliasName,
                tableName: tableName,
            });
        }
        return this;
    };
    /**
     * INNER JOINs (without selection).
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.innerJoin = function (entityOrProperty, aliasName, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.join("INNER", entityOrProperty, aliasName, condition, options);
        return this;
    };
    /**
     * LEFT JOINs (without selection).
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.leftJoin = function (entityOrProperty, aliasName, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.join("LEFT", entityOrProperty, aliasName, condition, options);
        return this;
    };
    /**
     * INNER JOINs and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.innerJoinAndSelect = function (entityOrProperty, aliasName, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(aliasName);
        this.innerJoin(entityOrProperty, aliasName, condition, options);
        return this;
    };
    /**
     * LEFT JOINs and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.leftJoinAndSelect = function (entityOrProperty, aliasName, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(aliasName);
        this.leftJoin(entityOrProperty, aliasName, condition, options);
        return this;
    };
    /**
     * INNER JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.innerJoinAndMapMany = function (mapToProperty, entityOrProperty, aliasName, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(aliasName);
        this.join("INNER", entityOrProperty, aliasName, condition, options, mapToProperty, true);
        return this;
    };
    /**
     * INNER JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.innerJoinAndMapOne = function (mapToProperty, entityOrProperty, aliasName, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(aliasName);
        this.join("INNER", entityOrProperty, aliasName, condition, options, mapToProperty, false);
        return this;
    };
    /**
     * LEFT JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.leftJoinAndMapMany = function (mapToProperty, entityOrProperty, aliasName, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(aliasName);
        this.join("LEFT", entityOrProperty, aliasName, condition, options, mapToProperty, true);
        return this;
    };
    /**
     * LEFT JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.leftJoinAndMapOne = function (mapToProperty, entityOrProperty, aliasName, condition, options) {
        if (condition === void 0) { condition = ""; }
        this.addSelect(aliasName);
        this.join("LEFT", entityOrProperty, aliasName, condition, options, mapToProperty, false);
        return this;
    };
    /**
     * LEFT JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.loadRelationIdAndMap = function (mapToProperty, relationName, aliasNameOrOptions, queryBuilderFactory) {
        var relationIdAttribute = new RelationIdAttribute_1.RelationIdAttribute(this.expressionMap);
        relationIdAttribute.mapToProperty = mapToProperty;
        relationIdAttribute.relationName = relationName;
        if (typeof aliasNameOrOptions === "string")
            relationIdAttribute.alias = aliasNameOrOptions;
        if (aliasNameOrOptions instanceof Object && aliasNameOrOptions.disableMixedMap)
            relationIdAttribute.disableMixedMap = true;
        relationIdAttribute.queryBuilderFactory = queryBuilderFactory;
        this.expressionMap.relationIdAttributes.push(relationIdAttribute);
        if (relationIdAttribute.relation.junctionEntityMetadata) {
            this.expressionMap.createAlias({
                name: relationIdAttribute.junctionAlias,
                metadata: relationIdAttribute.relation.junctionEntityMetadata
            });
        }
        return this;
    };
    /**
     * Counts number of entities of entity's relation and maps the value into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    QueryBuilder.prototype.loadRelationCountAndMap = function (mapToProperty, relationName, aliasName, queryBuilderFactory) {
        var relationCountAttribute = new RelationCountAttribute_1.RelationCountAttribute(this.expressionMap);
        relationCountAttribute.mapToProperty = mapToProperty;
        relationCountAttribute.relationName = relationName;
        relationCountAttribute.alias = aliasName;
        relationCountAttribute.queryBuilderFactory = queryBuilderFactory;
        this.expressionMap.relationCountAttributes.push(relationCountAttribute);
        this.expressionMap.createAlias({
            name: relationCountAttribute.junctionAlias
        });
        if (relationCountAttribute.relation.junctionEntityMetadata) {
            this.expressionMap.createAlias({
                name: relationCountAttribute.junctionAlias,
                metadata: relationCountAttribute.relation.junctionEntityMetadata
            });
        }
        return this;
    };
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.where = function (where, parameters) {
        this.expressionMap.wheres.push({ type: "simple", condition: where });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.andWhere = function (where, parameters) {
        this.expressionMap.wheres.push({ type: "and", condition: where });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.orWhere = function (where, parameters) {
        this.expressionMap.wheres.push({ type: "or", condition: where });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Sets HAVING condition in the query builder.
     * If you had previously HAVING expression defined,
     * calling this function will override previously set HAVING conditions.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.having = function (having, parameters) {
        this.expressionMap.havings.push({ type: "simple", condition: having });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new AND HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.andHaving = function (having, parameters) {
        this.expressionMap.havings.push({ type: "and", condition: having });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Adds new OR HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    QueryBuilder.prototype.orHaving = function (having, parameters) {
        this.expressionMap.havings.push({ type: "or", condition: having });
        if (parameters)
            this.setParameters(parameters);
        return this;
    };
    /**
     * Sets GROUP BY condition in the query builder.
     * If you had previously GROUP BY expression defined,
     * calling this function will override previously set GROUP BY conditions.
     */
    QueryBuilder.prototype.groupBy = function (groupBy) {
        this.expressionMap.groupBys = [groupBy];
        return this;
    };
    /**
     * Adds GROUP BY condition in the query builder.
     */
    QueryBuilder.prototype.addGroupBy = function (groupBy) {
        this.expressionMap.groupBys.push(groupBy);
        return this;
    };
    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    QueryBuilder.prototype.orderBy = function (sort, order) {
        if (order === void 0) { order = "ASC"; }
        if (sort) {
            this.expressionMap.orderBys = (_a = {}, _a[sort] = order, _a);
        }
        else {
            this.expressionMap.orderBys = {};
        }
        return this;
        var _a;
    };
    /**
     * Adds ORDER BY condition in the query builder.
     */
    QueryBuilder.prototype.addOrderBy = function (sort, order) {
        if (order === void 0) { order = "ASC"; }
        this.expressionMap.orderBys[sort] = order;
        return this;
    };
    /**
     * Set's LIMIT - maximum number of rows to be selected.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead take method instead.
     */
    QueryBuilder.prototype.setLimit = function (limit) {
        this.expressionMap.limit = limit;
        return this;
    };
    /**
     * Set's OFFSET - selection offset.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead skip method instead.
     */
    QueryBuilder.prototype.setOffset = function (offset) {
        this.expressionMap.offset = offset;
        return this;
    };
    /**
     * Sets maximal number of entities to take.
     */
    QueryBuilder.prototype.take = function (take) {
        this.expressionMap.take = take;
        return this;
    };
    /**
     * Sets number of entities to skip.
     */
    QueryBuilder.prototype.skip = function (skip) {
        this.expressionMap.skip = skip;
        return this;
    };
    /**
     * Sets maximal number of entities to take.
     *
     * @deprecated use take method instead
     */
    QueryBuilder.prototype.setMaxResults = function (take) {
        this.expressionMap.take = take;
        return this;
    };
    /**
     * Sets number of entities to skip.
     *
     * @deprecated use skip method instead
     */
    QueryBuilder.prototype.setFirstResult = function (skip) {
        this.expressionMap.skip = skip;
        return this;
    };
    /**
     * Sets locking mode.
     */
    QueryBuilder.prototype.setLock = function (lockMode, lockVersion) {
        this.expressionMap.lockMode = lockMode;
        this.expressionMap.lockVersion = lockVersion;
        return this;
    };
    /**
     * Sets given parameter's value.
     */
    QueryBuilder.prototype.setParameter = function (key, value) {
        this.expressionMap.parameters[key] = value;
        return this;
    };
    /**
     * Adds all parameters from the given object.
     */
    QueryBuilder.prototype.setParameters = function (parameters) {
        var _this = this;
        Object.keys(parameters).forEach(function (key) {
            _this.expressionMap.parameters[key] = parameters[key];
        });
        return this;
    };
    /**
     * Gets all parameters.
     */
    QueryBuilder.prototype.getParameters = function () {
        var parameters = Object.assign({}, this.expressionMap.parameters);
        // add discriminator column parameter if it exist
        if (this.expressionMap.mainAlias.hasMetadata) {
            var metadata = this.expressionMap.mainAlias.metadata;
            if (metadata.discriminatorColumn && metadata.parentEntityMetadata) {
                var values = metadata.childEntityMetadatas
                    .filter(function (childMetadata) { return childMetadata.discriminatorColumn; })
                    .map(function (childMetadata) { return childMetadata.discriminatorValue; });
                values.push(metadata.discriminatorValue);
                parameters["discriminatorColumnValues"] = values;
            }
        }
        return parameters;
    };
    /**
     * Gets generated sql that will be executed.
     * Parameters in the query are escaped for the currently used driver.
     */
    QueryBuilder.prototype.getSql = function () {
        var sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        sql += this.createLockExpression();
        sql = this.connection.driver.escapeQueryWithParameters(sql, this.expressionMap.parameters)[0];
        return sql.trim();
    };
    /**
     * Gets generated sql without parameters being replaced.
     */
    QueryBuilder.prototype.getGeneratedQuery = function () {
        var sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        sql += this.createLockExpression();
        return sql.trim();
    };
    /**
     * Gets sql to be executed with all parameters used in it.
     */
    QueryBuilder.prototype.getSqlWithParameters = function (options) {
        var sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        if (!options || !options.skipOrderBy)
            sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        sql += this.createLockExpression();
        return this.connection.driver.escapeQueryWithParameters(sql, this.getParameters());
    };
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    QueryBuilder.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, _a, sql, parameters;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getQueryRunner()];
                    case 1:
                        queryRunner = _b.sent();
                        _a = this.getSqlWithParameters(), sql = _a[0], parameters = _a[1];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 7]);
                        return [4 /*yield*/, queryRunner.query(sql, parameters)];
                    case 3: return [2 /*return*/, _b.sent()]; // await is needed here because we are using finally
                    case 4:
                        if (!this.hasOwnQueryRunner()) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunner.release()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Executes sql generated by query builder and returns object with raw results and entities created from them.
     */
    QueryBuilder.prototype.getEntitiesAndRawResults = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunner, relationIdLoader, relationCountLoader, relationIdMetadataTransformer, relationCountMetadataTransformer, metadata, mainAliasName_1, _a, sql, parameters, _b, selects, orderBys, distinctAlias_1, metadata_1, idsQuery, entities, rawResults, condition, parameters_1, ids, areAllNumbers, clonnedQb, _c, queryWithIdsSql, queryWithIdsParameters, rawRelationIdResults, rawRelationCountResults, _d, sql, parameters, rawResults, rawRelationIdResults, rawRelationCountResults, entities;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.getQueryRunner()];
                    case 1:
                        queryRunner = _e.sent();
                        relationIdLoader = new RelationIdLoader_1.RelationIdLoader(this.connection, this.queryRunnerProvider, this.expressionMap.relationIdAttributes);
                        relationCountLoader = new RelationCountLoader_1.RelationCountLoader(this.connection, this.queryRunnerProvider, this.expressionMap.relationCountAttributes);
                        relationIdMetadataTransformer = new RelationIdMetadataToAttributeTransformer_1.RelationIdMetadataToAttributeTransformer(this.expressionMap);
                        relationIdMetadataTransformer.transform();
                        relationCountMetadataTransformer = new RelationCountMetadataToAttributeTransformer_1.RelationCountMetadataToAttributeTransformer(this.expressionMap);
                        relationCountMetadataTransformer.transform();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, , 16, 19]);
                        if (!this.expressionMap.mainAlias)
                            throw new Error("Alias is not set. Looks like nothing is selected. Use select*, delete, update method to set an alias.");
                        if ((this.expressionMap.lockMode === "pessimistic_read" || this.expressionMap.lockMode === "pessimistic_write") && !queryRunner.isTransactionActive())
                            throw new PessimisticLockTransactionRequiredError_1.PessimisticLockTransactionRequiredError();
                        if (this.expressionMap.lockMode === "optimistic") {
                            metadata = this.expressionMap.mainAlias.metadata;
                            if (!metadata.versionColumn && !metadata.updateDateColumn)
                                throw new NoVersionOrUpdateDateColumnError_1.NoVersionOrUpdateDateColumnError(metadata.name);
                        }
                        mainAliasName_1 = this.expressionMap.mainAlias.name;
                        if (!(this.expressionMap.skip || this.expressionMap.take)) return [3 /*break*/, 9];
                        _a = this.getSqlWithParameters({ skipOrderBy: true }), sql = _a[0], parameters = _a[1];
                        _b = this.createOrderByCombinedWithSelectExpression("distinctAlias"), selects = _b[0], orderBys = _b[1];
                        distinctAlias_1 = this.escapeTable("distinctAlias");
                        metadata_1 = this.expressionMap.mainAlias.metadata;
                        idsQuery = "SELECT ";
                        idsQuery += metadata_1.primaryColumns.map(function (primaryColumn, index) {
                            var propertyName = _this.escapeAlias(mainAliasName_1 + "_" + primaryColumn.databaseName);
                            if (index === 0) {
                                return "DISTINCT(" + distinctAlias_1 + "." + propertyName + ") as ids_" + primaryColumn.databaseName;
                            }
                            else {
                                return distinctAlias_1 + "." + propertyName + ") as ids_" + primaryColumn.databaseName;
                            }
                        }).join(", ");
                        if (selects.length > 0)
                            idsQuery += ", " + selects;
                        idsQuery += " FROM (" + sql + ") " + distinctAlias_1; // TODO: WHAT TO DO WITH PARAMETERS HERE? DO THEY WORK?
                        if (orderBys.length > 0) {
                            idsQuery += " ORDER BY " + orderBys;
                        }
                        else {
                            idsQuery += " ORDER BY \"ids_" + metadata_1.primaryColumns[0].databaseName + "\""; // this is required for mssql driver if firstResult is used. Other drivers don't care about it
                        }
                        if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
                            if (this.expressionMap.skip || this.expressionMap.take) {
                                idsQuery += " OFFSET " + (this.expressionMap.skip || 0) + " ROWS";
                                if (this.expressionMap.take)
                                    idsQuery += " FETCH NEXT " + this.expressionMap.take + " ROWS ONLY";
                            }
                        }
                        else {
                            if (this.expressionMap.take)
                                idsQuery += " LIMIT " + this.expressionMap.take;
                            if (this.expressionMap.skip)
                                idsQuery += " OFFSET " + this.expressionMap.skip;
                        }
                        entities = [];
                        return [4 /*yield*/, queryRunner.query(idsQuery, parameters)];
                    case 3:
                        rawResults = _e.sent();
                        if (!(rawResults.length > 0)) return [3 /*break*/, 8];
                        condition = "";
                        parameters_1 = {};
                        if (metadata_1.hasMultiplePrimaryKeys) {
                            condition = rawResults.map(function (result) {
                                return metadata_1.primaryColumns.map(function (primaryColumn) {
                                    parameters_1["ids_" + primaryColumn.propertyName] = result["ids_" + primaryColumn.propertyName];
                                    return mainAliasName_1 + "." + primaryColumn.propertyName + "=:ids_" + primaryColumn.propertyName;
                                }).join(" AND ");
                            }).join(" OR ");
                        }
                        else {
                            ids = rawResults.map(function (result) { return result["ids_" + metadata_1.primaryColumns[0].propertyName]; });
                            areAllNumbers = ids.every(function (id) { return typeof id === "number"; });
                            if (areAllNumbers) {
                                // fixes #190. if all numbers then its safe to perform query without parameter
                                condition = mainAliasName_1 + "." + metadata_1.primaryColumns[0].propertyName + " IN (" + ids.join(", ") + ")";
                            }
                            else {
                                parameters_1["ids"] = ids;
                                condition = mainAliasName_1 + "." + metadata_1.primaryColumns[0].propertyName + " IN (:ids)";
                            }
                        }
                        clonnedQb = this.clone({ queryRunnerProvider: this.queryRunnerProvider });
                        clonnedQb.expressionMap.extraAppendedAndWhereCondition = condition;
                        _c = clonnedQb
                            .setParameters(parameters_1)
                            .getSqlWithParameters(), queryWithIdsSql = _c[0], queryWithIdsParameters = _c[1];
                        return [4 /*yield*/, queryRunner.query(queryWithIdsSql, queryWithIdsParameters)];
                    case 4:
                        rawResults = _e.sent();
                        return [4 /*yield*/, relationIdLoader.load(rawResults)];
                    case 5:
                        rawRelationIdResults = _e.sent();
                        return [4 /*yield*/, relationCountLoader.load(rawResults)];
                    case 6:
                        rawRelationCountResults = _e.sent();
                        entities = this.rawResultsToEntities(rawResults, rawRelationIdResults, rawRelationCountResults);
                        if (!this.expressionMap.mainAlias.hasMetadata) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.connection.broadcaster.broadcastLoadEventsForAll(this.expressionMap.mainAlias.target, rawResults)];
                    case 7:
                        _e.sent();
                        _e.label = 8;
                    case 8: return [2 /*return*/, {
                            entities: entities,
                            rawResults: rawResults
                        }];
                    case 9:
                        _d = this.getSqlWithParameters(), sql = _d[0], parameters = _d[1];
                        return [4 /*yield*/, queryRunner.query(sql, parameters)];
                    case 10:
                        rawResults = _e.sent();
                        return [4 /*yield*/, relationIdLoader.load(rawResults)];
                    case 11:
                        rawRelationIdResults = _e.sent();
                        return [4 /*yield*/, relationCountLoader.load(rawResults)];
                    case 12:
                        rawRelationCountResults = _e.sent();
                        entities = this.rawResultsToEntities(rawResults, rawRelationIdResults, rawRelationCountResults);
                        if (!this.expressionMap.mainAlias.hasMetadata) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.connection.broadcaster.broadcastLoadEventsForAll(this.expressionMap.mainAlias.target, rawResults)];
                    case 13:
                        _e.sent();
                        _e.label = 14;
                    case 14: return [2 /*return*/, {
                            entities: entities,
                            rawResults: rawResults
                        }];
                    case 15: return [3 /*break*/, 19];
                    case 16:
                        if (!this.hasOwnQueryRunner()) return [3 /*break*/, 18];
                        return [4 /*yield*/, queryRunner.release()];
                    case 17:
                        _e.sent();
                        _e.label = 18;
                    case 18: return [7 /*endfinally*/];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets count - number of entities selected by sql generated by this query builder.
     * Count excludes all limitations set by setFirstResult and setMaxResults methods call.
     */
    QueryBuilder.prototype.getCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var queryRunner, mainAlias, metadata, distinctAlias, countSql, countQueryBuilder, _a, countQuerySql, countQueryParameters, results;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.expressionMap.lockMode === "optimistic")
                            throw new OptimisticLockCanNotBeUsedError_1.OptimisticLockCanNotBeUsedError();
                        return [4 /*yield*/, this.getQueryRunner()];
                    case 1:
                        queryRunner = _b.sent();
                        mainAlias = this.expressionMap.mainAlias.name;
                        metadata = this.expressionMap.mainAlias.metadata;
                        distinctAlias = this.escapeAlias(mainAlias);
                        countSql = "COUNT(" + metadata.primaryColumns.map(function (primaryColumn, index) {
                            var propertyName = _this.escapeColumn(primaryColumn.databaseName);
                            if (index === 0) {
                                return "DISTINCT(" + distinctAlias + "." + propertyName + ")";
                            }
                            else {
                                return distinctAlias + "." + propertyName + ")";
                            }
                        }).join(", ") + ") as \"cnt\"";
                        countQueryBuilder = this
                            .clone({ queryRunnerProvider: this.queryRunnerProvider })
                            .orderBy(undefined)
                            .setOffset(undefined)
                            .setLimit(undefined)
                            .select(countSql);
                        countQueryBuilder.expressionMap.ignoreParentTablesJoins = true;
                        _a = countQueryBuilder.getSqlWithParameters(), countQuerySql = _a[0], countQueryParameters = _a[1];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 7]);
                        return [4 /*yield*/, queryRunner.query(countQuerySql, countQueryParameters)];
                    case 3:
                        results = _b.sent();
                        if (!results || !results[0] || !results[0]["cnt"])
                            return [2 /*return*/, 0];
                        return [2 /*return*/, parseInt(results[0]["cnt"])];
                    case 4:
                        if (!this.hasOwnQueryRunner()) return [3 /*break*/, 6];
                        return [4 /*yield*/, queryRunner.release()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets all raw results returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getRawMany = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.expressionMap.lockMode === "optimistic")
                    throw new OptimisticLockCanNotBeUsedError_1.OptimisticLockCanNotBeUsedError();
                return [2 /*return*/, this.execute()];
            });
        });
    };
    /**
     * Gets first raw result returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getRawOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.expressionMap.lockMode === "optimistic")
                            throw new OptimisticLockCanNotBeUsedError_1.OptimisticLockCanNotBeUsedError();
                        return [4 /*yield*/, this.execute()];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results[0]];
                }
            });
        });
    };
    /**
     * Gets entities and count returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getManyAndCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.expressionMap.lockMode === "optimistic")
                    throw new OptimisticLockCanNotBeUsedError_1.OptimisticLockCanNotBeUsedError();
                // todo: share database connection and counter
                return [2 /*return*/, Promise.all([
                        this.getMany(),
                        this.getCount()
                    ])];
            });
        });
    };
    /**
     * Gets entities returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getMany = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.expressionMap.lockMode === "optimistic")
                            throw new OptimisticLockCanNotBeUsedError_1.OptimisticLockCanNotBeUsedError();
                        return [4 /*yield*/, this.getEntitiesAndRawResults()];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.entities];
                }
            });
        });
    };
    /**
     * Gets single entity returned by execution of generated query builder sql.
     */
    QueryBuilder.prototype.getOne = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, result, metadata, actualVersion, actualVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEntitiesAndRawResults()];
                    case 1:
                        results = _a.sent();
                        result = results.entities[0];
                        if (result && this.expressionMap.lockMode === "optimistic" && this.expressionMap.lockVersion) {
                            metadata = this.expressionMap.mainAlias.metadata;
                            if (this.expressionMap.lockVersion instanceof Date) {
                                actualVersion = result[metadata.updateDateColumn.propertyName];
                                this.expressionMap.lockVersion.setMilliseconds(0);
                                if (actualVersion.getTime() !== this.expressionMap.lockVersion.getTime())
                                    throw new OptimisticLockVersionMismatchError_1.OptimisticLockVersionMismatchError(metadata.name, this.expressionMap.lockVersion, actualVersion);
                            }
                            else {
                                actualVersion = result[metadata.versionColumn.propertyName];
                                if (actualVersion !== this.expressionMap.lockVersion)
                                    throw new OptimisticLockVersionMismatchError_1.OptimisticLockVersionMismatchError(metadata.name, this.expressionMap.lockVersion, actualVersion);
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * Clones query builder as it is.
     */
    QueryBuilder.prototype.clone = function (options) {
        var qb = new QueryBuilder(this.connection, options ? options.queryRunnerProvider : undefined);
        qb.expressionMap = this.expressionMap.clone();
        return qb;
    };
    /**
     * Disables escaping.
     */
    QueryBuilder.prototype.disableEscaping = function () {
        this.expressionMap.disableEscaping = false;
        return this;
    };
    /**
     * Escapes alias name using current database's escaping character.
     */
    QueryBuilder.prototype.escapeAlias = function (name) {
        if (!this.expressionMap.disableEscaping)
            return name;
        return this.connection.driver.escapeAliasName(name);
    };
    /**
     * Escapes column name using current database's escaping character.
     */
    QueryBuilder.prototype.escapeColumn = function (name) {
        if (!this.expressionMap.disableEscaping)
            return name;
        return this.connection.driver.escapeColumnName(name);
    };
    /**
     * Escapes table name using current database's escaping character.
     */
    QueryBuilder.prototype.escapeTable = function (name) {
        if (!this.expressionMap.disableEscaping)
            return name;
        return this.connection.driver.escapeTableName(name);
    };
    /**
     * Enables special query builder options.
     *
     * @deprecated looks like enableRelationIdValues is not used anymore. What to do? Remove this method? What about persistence?
     */
    QueryBuilder.prototype.enableAutoRelationIdsLoad = function () {
        var _this = this;
        this.expressionMap.mainAlias.metadata.relations.forEach(function (relation) {
            _this.loadRelationIdAndMap(_this.expressionMap.mainAlias.name + "." + relation.propertyPath, _this.expressionMap.mainAlias.name + "." + relation.propertyPath, { disableMixedMap: true });
        });
        return this;
    };
    /**
     * Adds new AND WHERE with conditions for the given ids.
     *
     * @experimental Maybe this method should be moved to repository?
     * @deprecated
     */
    QueryBuilder.prototype.andWhereInIds = function (ids) {
        var _a = this.createWhereIdsExpression(ids), whereExpression = _a[0], parameters = _a[1];
        this.andWhere(whereExpression, parameters);
        return this;
    };
    /**
     * Adds new OR WHERE with conditions for the given ids.
     *
     * @experimental Maybe this method should be moved to repository?
     * @deprecated
     */
    QueryBuilder.prototype.orWhereInIds = function (ids) {
        var _a = this.createWhereIdsExpression(ids), whereExpression = _a[0], parameters = _a[1];
        this.orWhere(whereExpression, parameters);
        return this;
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    QueryBuilder.prototype.join = function (direction, entityOrProperty, aliasName, condition, options, mapToProperty, isMappingMany) {
        var joinAttribute = new JoinAttribute_1.JoinAttribute(this.connection, this.expressionMap);
        joinAttribute.direction = direction;
        joinAttribute.mapToProperty = mapToProperty;
        joinAttribute.options = options;
        joinAttribute.isMappingMany = isMappingMany;
        joinAttribute.entityOrProperty = entityOrProperty; // relationName
        joinAttribute.condition = condition; // joinInverseSideCondition
        // joinAttribute.junctionAlias = joinAttribute.relation.isOwning ? parentAlias + "_" + destinationTableAlias : destinationTableAlias + "_" + parentAlias;
        this.expressionMap.joinAttributes.push(joinAttribute);
        // todo: find and set metadata right there?
        joinAttribute.alias = this.expressionMap.createAlias({
            name: aliasName,
            metadata: joinAttribute.metadata
        });
        if (joinAttribute.relation && joinAttribute.relation.junctionEntityMetadata) {
            this.expressionMap.createAlias({
                name: joinAttribute.junctionAlias,
                metadata: joinAttribute.relation.junctionEntityMetadata
            });
        }
    };
    QueryBuilder.prototype.rawResultsToEntities = function (results, rawRelationIdResults, rawRelationCountResults) {
        return new RawSqlResultsToEntityTransformer_1.RawSqlResultsToEntityTransformer(this.connection.driver, this.expressionMap.joinAttributes, rawRelationIdResults, rawRelationCountResults)
            .transform(results, this.expressionMap.mainAlias);
    };
    QueryBuilder.prototype.buildEscapedEntityColumnSelects = function (aliasName, metadata) {
        var _this = this;
        var hasMainAlias = this.expressionMap.selects.some(function (select) { return select.selection === aliasName; });
        var columns = hasMainAlias ? metadata.columns : metadata.columns.filter(function (column) {
            return _this.expressionMap.selects.some(function (select) { return select.selection === aliasName + "." + column.propertyName; });
        });
        return columns.map(function (column) {
            var selection = _this.expressionMap.selects.find(function (select) { return select.selection === aliasName + "." + column.propertyName; });
            return {
                selection: _this.escapeAlias(aliasName) + "." + _this.escapeColumn(column.databaseName),
                aliasName: selection && selection.aliasName ? selection.aliasName : aliasName + "_" + column.databaseName,
            };
            // return this.escapeAlias(aliasName) + "." + this.escapeColumn(column.fullName) +
            //     " AS " + this.escapeAlias(aliasName + "_" + column.fullName);
        });
    };
    QueryBuilder.prototype.findEntityColumnSelects = function (aliasName, metadata) {
        var mainSelect = this.expressionMap.selects.find(function (select) { return select.selection === aliasName; });
        if (mainSelect)
            return [mainSelect];
        return this.expressionMap.selects.filter(function (select) {
            return metadata.columns.some(function (column) { return select.selection === aliasName + "." + column.propertyName; });
        });
    };
    // todo: extract all create expression methods to separate class QueryExpressionBuilder
    QueryBuilder.prototype.createSelectExpression = function () {
        var _this = this;
        if (!this.expressionMap.mainAlias)
            throw new Error("Cannot build query because main alias is not set (call qb#from method)");
        // separate escaping functions are used to reduce code size and complexity below
        var et = function (aliasName) { return _this.escapeTable(aliasName); };
        var ea = function (aliasName) { return _this.escapeAlias(aliasName); };
        var ec = function (aliasName) { return _this.escapeColumn(aliasName); };
        // todo throw exception if selects or from is missing
        var tableName;
        var allSelects = [];
        var excludedSelects = [];
        var aliasName = this.expressionMap.mainAlias.name;
        if (this.expressionMap.mainAlias.hasMetadata) {
            var metadata = this.expressionMap.mainAlias.metadata;
            tableName = metadata.tableName;
            allSelects.push.apply(allSelects, this.buildEscapedEntityColumnSelects(aliasName, metadata));
            excludedSelects.push.apply(excludedSelects, this.findEntityColumnSelects(aliasName, metadata));
        }
        else {
            tableName = this.expressionMap.mainAlias.tableName;
        }
        // add selects from joins
        this.expressionMap.joinAttributes
            .forEach(function (join) {
            if (join.metadata) {
                allSelects.push.apply(allSelects, _this.buildEscapedEntityColumnSelects(join.alias.name, join.metadata));
                excludedSelects.push.apply(excludedSelects, _this.findEntityColumnSelects(join.alias.name, join.metadata));
            }
            else {
                var hasMainAlias = _this.expressionMap.selects.some(function (select) { return select.selection === join.alias.name; });
                if (hasMainAlias) {
                    allSelects.push({ selection: ea(join.alias.name) + ".*" });
                    excludedSelects.push({ selection: ea(join.alias.name) });
                }
            }
        });
        if (!this.expressionMap.ignoreParentTablesJoins && this.expressionMap.mainAlias.hasMetadata) {
            var metadata = this.expressionMap.mainAlias.metadata;
            if (metadata.parentEntityMetadata && metadata.parentEntityMetadata.inheritanceType === "class-table" && metadata.parentIdColumns) {
                var alias_1 = "parentIdColumn_" + metadata.parentEntityMetadata.tableName;
                metadata.parentEntityMetadata.columns.forEach(function (column) {
                    // TODO implement partial select
                    allSelects.push({ selection: ea(alias_1) + "." + ec(column.databaseName), aliasName: alias_1 + "_" + column.databaseName });
                });
            }
        }
        // add selects from relation id joins
        // this.relationIdAttributes.forEach(relationIdAttr => {
        // });
        /*if (this.enableRelationIdValues) {
            const parentMetadata = this.aliasMap.getEntityMetadataByAlias(this.aliasMap.mainAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + this.aliasMap.mainAlias.name);

            const metadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
            metadata.manyToManyRelations.forEach(relation => {

                const junctionMetadata = relation.junctionEntityMetadata;
                junctionMetadata.columns.forEach(column => {
                    const select = ea(this.aliasMap.mainAlias.name + "_" + junctionMetadata.table.name + "_ids") + "." +
                        ec(column.name) + " AS " +
                        ea(this.aliasMap.mainAlias.name + "_" + relation.name + "_ids_" + column.name);
                    allSelects.push(select);
                });
            });
        }*/
        // add all other selects
        this.expressionMap.selects
            .filter(function (select) { return excludedSelects.indexOf(select) === -1; })
            .forEach(function (select) { return allSelects.push({ selection: _this.replacePropertyNames(select.selection), aliasName: select.aliasName }); });
        // if still selection is empty, then simply set it to all (*)
        if (allSelects.length === 0)
            allSelects.push({ selection: "*" });
        var lock = "";
        if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
            switch (this.expressionMap.lockMode) {
                case "pessimistic_read":
                    lock = " WITH (HOLDLOCK, ROWLOCK)";
                    break;
                case "pessimistic_write":
                    lock = " WITH (UPDLOCK, ROWLOCK)";
                    break;
            }
        }
        // create a selection query
        switch (this.expressionMap.queryType) {
            case "select":
                var selection = allSelects.map(function (select) { return select.selection + (select.aliasName ? " AS " + ea(select.aliasName) : ""); }).join(", ");
                if ((this.expressionMap.limit || this.expressionMap.offset) && this.connection.driver instanceof OracleDriver_1.OracleDriver) {
                    var finalSelect = "SELECT * FROM (SELECT ROWNUM \"rn\"," + selection + " FROM " + this.escapeTable(tableName) + " " + ea(aliasName) + lock + ") WHERE ";
                    if (this.expressionMap.offset) {
                        finalSelect += "\"rn\" > " + this.expressionMap.offset;
                    }
                    if (this.expressionMap.limit) {
                        finalSelect += (this.expressionMap.offset ? " AND" : "") + "\"rn\" < " + ((this.expressionMap.offset || 0) + this.expressionMap.limit);
                    }
                    return finalSelect;
                }
                return "SELECT " + selection + " FROM " + this.escapeTable(tableName) + " " + ea(aliasName) + lock;
            case "delete":
                return "DELETE FROM " + et(tableName);
            // return "DELETE " + (alias ? ea(alias) : "") + " FROM " + this.escapeTable(tableName) + " " + (alias ? ea(alias) : ""); // TODO: only mysql supports aliasing, so what to do with aliases in DELETE queries? right now aliases are used however we are relaying that they will always match a table names
            case "update":
                var updateSet = Object.keys(this.expressionMap.updateSet).map(function (key) { return key + "=:updateSet__" + key; });
                var params = Object.keys(this.expressionMap.updateSet).reduce(function (object, key) {
                    // todo: map propertyNames to names ?
                    object["updateSet_" + key] = _this.expressionMap.updateSet[key];
                    return object;
                }, {});
                this.setParameters(params);
                return "UPDATE " + tableName + " " + (aliasName ? ea(aliasName) : "") + " SET " + updateSet;
        }
        throw new Error("No query builder type is specified.");
    };
    QueryBuilder.prototype.createHavingExpression = function () {
        var _this = this;
        if (!this.expressionMap.havings || !this.expressionMap.havings.length)
            return "";
        var conditions = this.expressionMap.havings.map(function (having, index) {
            switch (having.type) {
                case "and":
                    return (index > 0 ? "AND " : "") + _this.replacePropertyNames(having.condition);
                case "or":
                    return (index > 0 ? "OR " : "") + _this.replacePropertyNames(having.condition);
                default:
                    return _this.replacePropertyNames(having.condition);
            }
        }).join(" ");
        if (!conditions.length)
            return "";
        return " HAVING " + conditions;
    };
    QueryBuilder.prototype.createWhereExpression = function () {
        var _this = this;
        var conditions = this.expressionMap.wheres.map(function (where, index) {
            switch (where.type) {
                case "and":
                    return (index > 0 ? "AND " : "") + _this.replacePropertyNames(where.condition);
                case "or":
                    return (index > 0 ? "OR " : "") + _this.replacePropertyNames(where.condition);
                default:
                    return _this.replacePropertyNames(where.condition);
            }
        }).join(" ");
        if (this.expressionMap.mainAlias.hasMetadata) {
            var metadata = this.expressionMap.mainAlias.metadata;
            if (metadata.discriminatorColumn && metadata.parentEntityMetadata) {
                var condition = this.replacePropertyNames(this.expressionMap.mainAlias.name + "." + metadata.discriminatorColumn.databaseName) + " IN (:discriminatorColumnValues)";
                return " WHERE " + (conditions.length ? "(" + conditions + ") AND" : "") + " " + condition;
            }
        }
        if (!conditions.length)
            return this.expressionMap.extraAppendedAndWhereCondition ? " WHERE " + this.replacePropertyNames(this.expressionMap.extraAppendedAndWhereCondition) : "";
        if (this.expressionMap.extraAppendedAndWhereCondition)
            return " WHERE (" + conditions + ") AND " + this.replacePropertyNames(this.expressionMap.extraAppendedAndWhereCondition);
        return " WHERE " + conditions;
    };
    /**
     * Replaces all entity's propertyName to name in the given statement.
     */
    QueryBuilder.prototype.replacePropertyNames = function (statement) {
        var _this = this;
        this.expressionMap.aliases.forEach(function (alias) {
            if (!alias.hasMetadata)
                return;
            alias.metadata.columns.forEach(function (column) {
                var expression = "([ =\(]|^.{0})" + alias.name + "\\." + column.propertyPath + "([ =\)\,]|.{0}$)";
                statement = statement.replace(new RegExp(expression, "gm"), "$1" + _this.escapeAlias(alias.name) + "." + _this.escapeColumn(column.databaseName) + "$2");
                var expression2 = "([ =\(]|^.{0})" + alias.name + "\\." + column.propertyName + "([ =\)\,]|.{0}$)";
                statement = statement.replace(new RegExp(expression2, "gm"), "$1" + _this.escapeAlias(alias.name) + "." + _this.escapeColumn(column.databaseName) + "$2");
            });
            alias.metadata.relations.forEach(function (relation) {
                relation.joinColumns.concat(relation.inverseJoinColumns).forEach(function (joinColumn) {
                    var expression = "([ =\(]|^.{0})" + alias.name + "\\." + relation.propertyPath + "\\." + joinColumn.referencedColumn.propertyPath + "([ =\)\,]|.{0}$)";
                    statement = statement.replace(new RegExp(expression, "gm"), "$1" + _this.escapeAlias(alias.name) + "." + _this.escapeColumn(joinColumn.databaseName) + "$2"); // todo: fix relation.joinColumns[0], what if multiple columns
                });
                if (relation.joinColumns.length > 0) {
                    var expression = "([ =\(]|^.{0})" + alias.name + "\\." + relation.propertyPath + "([ =\)\,]|.{0}$)";
                    statement = statement.replace(new RegExp(expression, "gm"), "$1" + _this.escapeAlias(alias.name) + "." + _this.escapeColumn(relation.joinColumns[0].databaseName) + "$2"); // todo: fix relation.joinColumns[0], what if multiple columns
                }
            });
        });
        return statement;
    };
    QueryBuilder.prototype.createJoinExpression = function () {
        var _this = this;
        // separate escaping functions are used to reduce code size and complexity below
        var et = function (aliasName) { return _this.escapeTable(aliasName); };
        var ea = function (aliasName) { return _this.escapeAlias(aliasName); };
        var ec = function (aliasName) { return _this.escapeColumn(aliasName); };
        // examples:
        // select from owning side
        // qb.select("post")
        //     .leftJoinAndSelect("post.category", "category");
        // select from non-owning side
        // qb.select("category")
        //     .leftJoinAndSelect("category.post", "post");
        var joins = this.expressionMap.joinAttributes.map(function (joinAttr) {
            var relation = joinAttr.relation;
            var destinationTableName = joinAttr.tableName;
            var destinationTableAlias = joinAttr.alias.name;
            var appendedCondition = joinAttr.condition ? " AND (" + joinAttr.condition + ")" : "";
            var parentAlias = joinAttr.parentAlias;
            // if join was build without relation (e.g. without "post.category") then it means that we have direct
            // table to join, without junction table involved. This means we simply join direct table.
            if (!parentAlias || !relation)
                return " " + joinAttr.direction + " JOIN " + et(destinationTableName) + " " + ea(destinationTableAlias) +
                    (joinAttr.condition ? " ON " + _this.replacePropertyNames(joinAttr.condition) : "");
            // if real entity relation is involved
            if (relation.isManyToOne || relation.isOneToOneOwner) {
                // JOIN `category` `category` ON `category`.`id` = `post`.`categoryId`
                var condition = relation.joinColumns.map(function (joinColumn) {
                    return destinationTableAlias + "." + joinColumn.referencedColumn.propertyPath + "=" +
                        parentAlias + "." + relation.propertyPath + "." + joinColumn.referencedColumn.propertyPath;
                }).join(" AND ");
                return " " + joinAttr.direction + " JOIN " + et(destinationTableName) + " " + ea(destinationTableAlias) + " ON " + _this.replacePropertyNames(condition + appendedCondition);
            }
            else if (relation.isOneToMany || relation.isOneToOneNotOwner) {
                // JOIN `post` `post` ON `post`.`categoryId` = `category`.`id`
                var condition = relation.inverseRelation.joinColumns.map(function (joinColumn) {
                    return destinationTableAlias + "." + relation.inverseRelation.propertyPath + "." + joinColumn.referencedColumn.propertyPath + "=" +
                        parentAlias + "." + joinColumn.referencedColumn.propertyPath;
                }).join(" AND ");
                return " " + joinAttr.direction + " JOIN " + et(destinationTableName) + " " + ea(destinationTableAlias) + " ON " + _this.replacePropertyNames(condition + appendedCondition);
            }
            else {
                var junctionTableName = relation.junctionEntityMetadata.tableName;
                var junctionAlias_1 = joinAttr.junctionAlias;
                var junctionCondition = "", destinationCondition = "";
                if (relation.isOwning) {
                    junctionCondition = relation.joinColumns.map(function (joinColumn) {
                        // `post_category`.`postId` = `post`.`id`
                        return junctionAlias_1 + "." + joinColumn.propertyPath + "=" + parentAlias + "." + joinColumn.referencedColumn.propertyPath;
                    }).join(" AND ");
                    destinationCondition = relation.inverseJoinColumns.map(function (joinColumn) {
                        // `category`.`id` = `post_category`.`categoryId`
                        return destinationTableAlias + "." + joinColumn.referencedColumn.propertyPath + "=" + junctionAlias_1 + "." + joinColumn.propertyPath;
                    }).join(" AND ");
                }
                else {
                    junctionCondition = relation.inverseRelation.inverseJoinColumns.map(function (joinColumn) {
                        // `post_category`.`categoryId` = `category`.`id`
                        return junctionAlias_1 + "." + joinColumn.propertyPath + "=" + parentAlias + "." + joinColumn.referencedColumn.propertyPath;
                    }).join(" AND ");
                    destinationCondition = relation.inverseRelation.joinColumns.map(function (joinColumn) {
                        // `post`.`id` = `post_category`.`postId`
                        return destinationTableAlias + "." + joinColumn.referencedColumn.propertyPath + "=" + junctionAlias_1 + "." + joinColumn.propertyPath;
                    }).join(" AND ");
                }
                return " " + joinAttr.direction + " JOIN " + et(junctionTableName) + " " + ea(junctionAlias_1) + " ON " + _this.replacePropertyNames(junctionCondition) +
                    " " + joinAttr.direction + " JOIN " + et(destinationTableName) + " " + ea(destinationTableAlias) + " ON " + _this.replacePropertyNames(destinationCondition + appendedCondition);
            }
        });
        if (!this.expressionMap.ignoreParentTablesJoins && this.expressionMap.mainAlias.hasMetadata) {
            var metadata = this.expressionMap.mainAlias.metadata;
            if (metadata.parentEntityMetadata && metadata.parentEntityMetadata.inheritanceType === "class-table" && metadata.parentIdColumns) {
                var alias_2 = "parentIdColumn_" + metadata.parentEntityMetadata.tableName;
                var condition = metadata.parentIdColumns.map(function (parentIdColumn) {
                    return _this.expressionMap.mainAlias.name + "." + parentIdColumn.databaseName + "=" + ea(alias_2) + "." + parentIdColumn.propertyName;
                }).join(" AND ");
                var join = " JOIN " + et(metadata.parentEntityMetadata.tableName) + " " + ea(alias_2) + " ON " + condition;
                joins.push(join);
            }
        }
        return joins.join(" ");
    };
    QueryBuilder.prototype.createGroupByExpression = function () {
        if (!this.expressionMap.groupBys || !this.expressionMap.groupBys.length)
            return "";
        return " GROUP BY " + this.replacePropertyNames(this.expressionMap.groupBys.join(", "));
    };
    QueryBuilder.prototype.createOrderByCombinedWithSelectExpression = function (parentAlias) {
        var _this = this;
        // if table has a default order then apply it
        var orderBys = this.expressionMap.orderBys;
        if (!Object.keys(orderBys).length && this.expressionMap.mainAlias.hasMetadata) {
            orderBys = this.expressionMap.mainAlias.metadata.orderBy || {};
        }
        var selectString = Object.keys(orderBys)
            .map(function (columnName) {
            var _a = columnName.split("."), alias = _a[0], column = _a[1], embeddedProperties = _a.slice(2);
            return _this.escapeAlias(parentAlias) + "." + _this.escapeColumn(alias + "_" + column + embeddedProperties.join("_"));
        })
            .join(", ");
        var orderByString = Object.keys(orderBys)
            .map(function (columnName) {
            var _a = columnName.split("."), alias = _a[0], column = _a[1], embeddedProperties = _a.slice(2);
            return _this.escapeAlias(parentAlias) + "." + _this.escapeColumn(alias + "_" + column + embeddedProperties.join("_")) + " " + _this.expressionMap.orderBys[columnName];
        })
            .join(", ");
        return [selectString, orderByString];
    };
    QueryBuilder.prototype.createOrderByExpression = function () {
        var _this = this;
        var orderBys = this.expressionMap.orderBys;
        // if table has a default order then apply it
        if (!Object.keys(orderBys).length && this.expressionMap.mainAlias.hasMetadata) {
            orderBys = this.expressionMap.mainAlias.metadata.orderBy || {};
        }
        // if user specified a custom order then apply it
        if (Object.keys(orderBys).length > 0)
            return " ORDER BY " + Object.keys(orderBys)
                .map(function (columnName) {
                return _this.replacePropertyNames(columnName) + " " + _this.expressionMap.orderBys[columnName];
            })
                .join(", ");
        return "";
    };
    QueryBuilder.prototype.createLimitExpression = function () {
        if (!this.expressionMap.limit || this.connection.driver instanceof OracleDriver_1.OracleDriver)
            return "";
        return " LIMIT " + this.expressionMap.limit;
    };
    QueryBuilder.prototype.createOffsetExpression = function () {
        if (!this.expressionMap.offset || this.connection.driver instanceof OracleDriver_1.OracleDriver)
            return "";
        return " OFFSET " + this.expressionMap.offset;
    };
    QueryBuilder.prototype.createLockExpression = function () {
        switch (this.expressionMap.lockMode) {
            case "pessimistic_read":
                if (this.connection.driver instanceof MysqlDriver_1.MysqlDriver) {
                    return " LOCK IN SHARE MODE";
                }
                else if (this.connection.driver instanceof PostgresDriver_1.PostgresDriver) {
                    return " FOR SHARE";
                }
                else if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
                    return "";
                }
                else {
                    throw new LockNotSupportedOnGivenDriverError_1.LockNotSupportedOnGivenDriverError();
                }
            case "pessimistic_write":
                if (this.connection.driver instanceof MysqlDriver_1.MysqlDriver || this.connection.driver instanceof PostgresDriver_1.PostgresDriver) {
                    return " FOR UPDATE";
                }
                else if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
                    return "";
                }
                else {
                    throw new LockNotSupportedOnGivenDriverError_1.LockNotSupportedOnGivenDriverError();
                }
            default:
                return "";
        }
    };
    /**
     * Creates "WHERE" expression and variables for the given "ids".
     */
    QueryBuilder.prototype.createWhereIdsExpression = function (ids) {
        var _this = this;
        var metadata = this.expressionMap.mainAlias.metadata;
        // create shortcuts for better readability
        var ea = function (aliasName) { return _this.escapeAlias(aliasName); };
        var ec = function (columnName) { return _this.escapeColumn(columnName); };
        var alias = this.expressionMap.mainAlias.name;
        var parameters = {};
        var whereStrings = ids.map(function (id, index) {
            var whereSubStrings = [];
            // if (metadata.hasMultiplePrimaryKeys) {
            metadata.primaryColumns.forEach(function (primaryColumn, secondIndex) {
                whereSubStrings.push(ea(alias) + "." + ec(primaryColumn.databaseName) + "=:id_" + index + "_" + secondIndex);
                parameters["id_" + index + "_" + secondIndex] = primaryColumn.getEntityValue(id);
            });
            metadata.parentIdColumns.forEach(function (primaryColumn, secondIndex) {
                whereSubStrings.push(ea(alias) + "." + ec(id[primaryColumn.databaseName]) + "=:parentId_" + index + "_" + secondIndex);
                parameters["parentId_" + index + "_" + secondIndex] = primaryColumn.getEntityValue(id);
            });
            // } else {
            //     if (metadata.primaryColumns.length > 0) {
            //         whereSubStrings.push(ea(alias) + "." + ec(metadata.firstPrimaryColumn.fullName) + "=:id_" + index);
            //         parameters["id_" + index] = id;
            //
            //     } else if (metadata.parentIdColumns.length > 0) {
            //         whereSubStrings.push(ea(alias) + "." + ec(metadata.parentIdColumns[0].fullName) + "=:parentId_" + index);
            //         parameters["parentId_" + index] = id;
            //     }
            // }
            return whereSubStrings.join(" AND ");
        });
        var whereString = whereStrings.length > 1 ? "(" + whereStrings.join(" OR ") + ")" : whereStrings[0];
        return [whereString, parameters];
    };
    QueryBuilder.prototype.getQueryRunner = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.queryRunnerProvider instanceof QueryRunnerProvider_1.QueryRunnerProvider) {
                    return [2 /*return*/, this.queryRunnerProvider.provide()];
                }
                else {
                    return [2 /*return*/, this.connection.driver.createQueryRunner()];
                }
                return [2 /*return*/];
            });
        });
    };
    QueryBuilder.prototype.hasOwnQueryRunner = function () {
        return !this.queryRunnerProvider;
    };
    return QueryBuilder;
}());
exports.QueryBuilder = QueryBuilder;

//# sourceMappingURL=QueryBuilder.js.map
