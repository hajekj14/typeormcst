"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryBuilderUtils_1 = require("./QueryBuilderUtils");
/**
 * Stores all join attributes which will be used to build a JOIN query.
 */
var JoinAttribute = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function JoinAttribute(connection, queryExpressionMap, joinAttribute) {
        this.connection = connection;
        this.queryExpressionMap = queryExpressionMap;
        this.joinAttribute = joinAttribute;
        Object.assign(this, joinAttribute || {});
    }
    Object.defineProperty(JoinAttribute.prototype, "isMany", {
        // -------------------------------------------------------------------------
        // Public Methods
        // -------------------------------------------------------------------------
        get: function () {
            if (this.isMappingMany !== undefined)
                return this.isMappingMany;
            if (this.relation)
                return this.relation.isManyToMany || this.relation.isOneToMany;
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinAttribute.prototype, "tableName", {
        /**
         * Name of the table which we should join.
         */
        get: function () {
            return this.metadata ? this.metadata.tableName : this.entityOrProperty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinAttribute.prototype, "parentAlias", {
        /**
         * Alias of the parent of this join.
         * For example, if we join ("post.category", "categoryAlias") then "post" is a parent alias.
         * This value is extracted from entityOrProperty value.
         * This is available when join was made using "post.category" syntax.
         */
        get: function () {
            if (!QueryBuilderUtils_1.QueryBuilderUtils.isAliasProperty(this.entityOrProperty))
                return undefined;
            return this.entityOrProperty.substr(0, this.entityOrProperty.indexOf("."));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinAttribute.prototype, "relationPropertyPath", {
        /**
         * Relation property name of the parent.
         * This is used to understand what is joined.
         * For example, if we join ("post.category", "categoryAlias") then "category" is a relation property.
         * This value is extracted from entityOrProperty value.
         * This is available when join was made using "post.category" syntax.
         */
        get: function () {
            if (!QueryBuilderUtils_1.QueryBuilderUtils.isAliasProperty(this.entityOrProperty))
                return undefined;
            return this.entityOrProperty.substr(this.entityOrProperty.indexOf(".") + 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinAttribute.prototype, "relation", {
        /**
         * Relation of the parent.
         * This is used to understand what is joined.
         * This is available when join was made using "post.category" syntax.
         * Relation can be undefined if entityOrProperty is regular entity or custom table.
         */
        get: function () {
            if (!QueryBuilderUtils_1.QueryBuilderUtils.isAliasProperty(this.entityOrProperty))
                return undefined;
            var relationOwnerSelection = this.queryExpressionMap.findAliasByName(this.parentAlias);
            var metadata = relationOwnerSelection.metadata.parentEntityMetadata
                ? relationOwnerSelection.metadata.parentEntityMetadata
                : relationOwnerSelection.metadata;
            var relation = metadata.findRelationWithPropertyPath(this.relationPropertyPath);
            if (!relation)
                throw new Error("Relation with property path " + this.relationPropertyPath + " in entity was not found.");
            return relation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinAttribute.prototype, "metadata", {
        /**
         * Metadata of the joined entity.
         * If table without entity was joined, then it will return undefined.
         */
        get: function () {
            var _this = this;
            // entityOrProperty is Entity class
            if (this.entityOrProperty instanceof Function)
                return this.connection.getMetadata(this.entityOrProperty);
            // entityOrProperty is relation, e.g. "post.category"
            if (this.relation)
                return this.relation.inverseEntityMetadata;
            if (typeof this.entityOrProperty === "string") {
                // first try to find entity with such name, this is needed when entity does not have a target class,
                // and its target is a string name (scenario when plain old javascript is used or entity schema is loaded from files)
                var metadata = this.connection.entityMetadatas.find(function (metadata) { return metadata.name === _this.entityOrProperty; });
                if (metadata)
                    return metadata;
                // check if we have entity with such table name, and use its metadata if found
                return this.connection.entityMetadatas.find(function (metadata) { return metadata.tableName === _this.entityOrProperty; });
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinAttribute.prototype, "junctionAlias", {
        /**
         * Generates alias of junction table, whose ids we get.
         */
        get: function () {
            if (!this.relation)
                throw new Error("Cannot get junction table for join without relation.");
            return this.relation.isOwning ? this.parentAlias + "_" + this.alias.name : this.alias.name + "_" + this.parentAlias;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinAttribute.prototype, "mapToPropertyParentAlias", {
        get: function () {
            if (!this.mapToProperty)
                return undefined;
            return this.mapToProperty.split(".")[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JoinAttribute.prototype, "mapToPropertyPropertyName", {
        get: function () {
            if (!this.mapToProperty)
                return undefined;
            return this.mapToProperty.split(".")[1];
        },
        enumerable: true,
        configurable: true
    });
    return JoinAttribute;
}());
exports.JoinAttribute = JoinAttribute;

//# sourceMappingURL=JoinAttribute.js.map
