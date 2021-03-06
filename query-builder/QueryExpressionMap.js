"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Alias_1 = require("./Alias");
var JoinAttribute_1 = require("./JoinAttribute");
var RelationIdAttribute_1 = require("./relation-id/RelationIdAttribute");
var RelationCountAttribute_1 = require("./relation-count/RelationCountAttribute");
/**
 * Contains all properties of the QueryBuilder that needs to be build a final query.
 */
var QueryExpressionMap = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function QueryExpressionMap(connection) {
        this.connection = connection;
        /**
         * All aliases (including main alias) used in the query.
         */
        this.aliases = [];
        /**
         * Represents query type. QueryBuilder is able to build SELECT, UPDATE and DELETE queries.
         */
        this.queryType = "select";
        /**
         * Data needs to be SELECT-ed.
         */
        this.selects = [];
        /**
         * JOIN queries.
         */
        this.joinAttributes = [];
        /**
         * RelationId queries.
         */
        this.relationIdAttributes = [];
        /**
         * Relation count queries.
         */
        this.relationCountAttributes = [];
        /**
         * WHERE queries.
         */
        this.wheres = [];
        /**
         * HAVING queries.
         */
        this.havings = [];
        /**
         * ORDER BY queries.
         */
        this.orderBys = {};
        /**
         * GROUP BY queries.
         */
        this.groupBys = [];
        /**
         * Parameters used to be escaped in final query.
         */
        this.parameters = {};
        /**
         * Indicates if alias, table names and column names will be ecaped by driver, or not.
         *
         * todo: rename to isQuotingDisabled, also think if it should be named "escaping"
         */
        this.disableEscaping = true;
        /**
         * todo: needs more information.
         */
        this.ignoreParentTablesJoins = false;
        /**
         * Indicates if virtual columns should be included in entity result.
         *
         * todo: what to do with it? is it properly used? what about persistence?
         */
        this.enableRelationIdValues = false;
        /**
         * Extra where condition appended to the end of original where conditions with AND keyword.
         * Original condition will be wrapped into brackets.
         */
        this.extraAppendedAndWhereCondition = "";
    }
    /**
     * Creates a main alias and adds it to the current expression map.
     */
    QueryExpressionMap.prototype.createMainAlias = function (options) {
        var alias = this.createAlias(options);
        // if main alias is already set then remove it from the array
        if (this.mainAlias)
            this.aliases.splice(this.aliases.indexOf(this.mainAlias));
        // set new main alias
        this.mainAlias = alias;
        return alias;
    };
    /**
     * Creates a new alias and adds it to the current expression map.
     */
    QueryExpressionMap.prototype.createAlias = function (options) {
        var aliasName = options.name;
        if (!aliasName && options.tableName)
            aliasName = options.tableName;
        if (!aliasName && options.target instanceof Function)
            aliasName = options.target.name;
        if (!aliasName && typeof options.target === "string")
            aliasName = options.target;
        var alias = new Alias_1.Alias();
        if (aliasName)
            alias.name = aliasName;
        if (options.metadata)
            alias.metadata = options.metadata;
        if (options.target && !alias.hasMetadata)
            alias.metadata = this.connection.getMetadata(options.target);
        if (options.tableName)
            alias.tableName = options.tableName;
        this.aliases.push(alias);
        return alias;
    };
    /**
     * Finds alias with the given name.
     * If alias was not found it throw an exception.
     */
    QueryExpressionMap.prototype.findAliasByName = function (aliasName) {
        var alias = this.aliases.find(function (alias) { return alias.name === aliasName; });
        if (!alias)
            throw new Error("\"" + aliasName + "\" alias was not found. Maybe you forgot to join it?");
        return alias;
    };
    /**
     * Copies all properties of the current QueryExpressionMap into a new one.
     * Useful when QueryBuilder needs to create a copy of itself.
     */
    QueryExpressionMap.prototype.clone = function () {
        var _this = this;
        var map = new QueryExpressionMap(this.connection);
        map.queryType = this.queryType;
        map.selects = this.selects.map(function (select) { return select; });
        this.aliases.forEach(function (alias) { return map.aliases.push(new Alias_1.Alias(alias)); });
        map.mainAlias = this.mainAlias;
        map.updateSet = this.updateSet;
        map.joinAttributes = this.joinAttributes.map(function (join) { return new JoinAttribute_1.JoinAttribute(_this.connection, _this, join); });
        map.relationIdAttributes = this.relationIdAttributes.map(function (relationId) { return new RelationIdAttribute_1.RelationIdAttribute(_this, relationId); });
        map.relationCountAttributes = this.relationCountAttributes.map(function (relationCount) { return new RelationCountAttribute_1.RelationCountAttribute(_this, relationCount); });
        map.wheres = this.wheres.map(function (where) { return (__assign({}, where)); });
        map.havings = this.havings.map(function (having) { return (__assign({}, having)); });
        map.orderBys = Object.assign({}, this.orderBys);
        map.groupBys = this.groupBys.map(function (groupBy) { return groupBy; });
        map.limit = this.limit;
        map.offset = this.offset;
        map.skip = this.skip;
        map.take = this.take;
        map.lockMode = this.lockMode;
        map.lockVersion = this.lockVersion;
        map.parameters = Object.assign({}, this.parameters);
        map.disableEscaping = this.disableEscaping;
        map.ignoreParentTablesJoins = this.ignoreParentTablesJoins;
        map.enableRelationIdValues = this.enableRelationIdValues;
        return map;
    };
    return QueryExpressionMap;
}());
exports.QueryExpressionMap = QueryExpressionMap;

//# sourceMappingURL=QueryExpressionMap.js.map
