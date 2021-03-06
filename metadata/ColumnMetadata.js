"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This metadata contains all information about entity's column.
 */
var ColumnMetadata = (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function ColumnMetadata(options) {
        /**
         * Type's length in the database.
         */
        this.length = "";
        /**
         * Indicates if this column is a primary key.
         */
        this.isPrimary = false;
        /**
         * Indicates if this column is generated (auto increment or generated other way).
         */
        this.isGenerated = false;
        /**
         * Indicates if column value in the database should be unique or not.
         */
        this.isUnique = false;
        /**
         * Indicates if column can contain nulls or not.
         */
        this.isNullable = false;
        /**
         * Column comment.
         * This feature is not supported by all databases.
         */
        this.comment = "";
        /**
         * Indicates if date column will contain a timezone.
         * Used only for date-typed column types.
         * Note that timezone option is not supported by all databases (only postgres for now).
         */
        this.timezone = false;
        /**
         * Indicates if date object must be stored in given date's timezone.
         * By default date is saved in UTC timezone.
         * Works only with "datetime" columns.
         */
        this.localTimezone = false;
        /**
         * Indicates if column's type will be set as a fixed-length data type.
         * Works only with "string" columns.
         */
        this.fixedLength = false;
        /**
         * Indicates if column is virtual. Virtual columns are not mapped to the entity.
         */
        this.isVirtual = false;
        /**
         * Indicates if column is a parent id. Parent id columns are not mapped to the entity.
         */
        this.isParentId = false;
        /**
         * Indicates if column is discriminator. Discriminator columns are not mapped to the entity.
         */
        this.isDiscriminator = false;
        /**
         * Indicates if column is tree-level column. Tree-level columns are used in closure entities.
         */
        this.isTreeLevel = false;
        /**
         * Indicates if this column contains an entity creation date.
         */
        this.isCreateDate = false;
        /**
         * Indicates if this column contains an entity update date.
         */
        this.isUpdateDate = false;
        /**
         * Indicates if this column contains an entity version.
         */
        this.isVersion = false;
        /**
         * Indicates if this column contains an object id.
         */
        this.isObjectId = false;
        this.entityMetadata = options.entityMetadata;
        this.embeddedMetadata = options.embeddedMetadata;
        this.referencedColumn = options.referencedColumn;
        if (options.args.propertyName)
            this.propertyName = options.args.propertyName;
        if (options.args.options.name)
            this.givenDatabaseName = options.args.options.name;
        if (options.args.options.type)
            this.type = options.args.options.type;
        if (options.args.options.length)
            this.length = String(options.args.options.length);
        if (options.args.options.primary)
            this.isPrimary = options.args.options.primary;
        if (options.args.options.generated)
            this.isGenerated = options.args.options.generated;
        if (options.args.options.unique)
            this.isUnique = options.args.options.unique;
        if (options.args.options.nullable)
            this.isNullable = options.args.options.nullable;
        if (options.args.options.comment)
            this.comment = options.args.options.comment;
        if (options.args.options.default !== undefined)
            this.default = options.args.options.default;
        if (options.args.options.scale)
            this.scale = options.args.options.scale;
        if (options.args.options.precision)
            this.precision = options.args.options.precision;
        if (options.args.options.timezone)
            this.timezone = options.args.options.timezone;
        if (options.args.options.localTimezone)
            this.localTimezone = options.args.options.localTimezone;
        if (options.args.options.fixedLength)
            this.fixedLength = options.args.options.fixedLength;
        if (options.args.mode) {
            this.isVirtual = options.args.mode === "virtual";
            this.isParentId = options.args.mode === "parentId";
            this.isDiscriminator = options.args.mode === "discriminator";
            this.isTreeLevel = options.args.mode === "treeLevel";
            this.isCreateDate = options.args.mode === "createDate";
            this.isUpdateDate = options.args.mode === "updateDate";
            this.isVersion = options.args.mode === "version";
            this.isObjectId = options.args.mode === "objectId";
        }
    }
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    /**
     * Creates entity id map from the given entity ids array.
     */
    ColumnMetadata.prototype.createValueMap = function (value) {
        var _this = this;
        // extract column value from embeds of entity if column is in embedded
        if (this.embeddedMetadata) {
            // example: post[data][information][counters].id where "data", "information" and "counters" are embeddeds
            // we need to get value of "id" column from the post real entity object and return it in a
            // { data: { information: { counters: { id: ... } } } } format
            // first step - we extract all parent properties of the entity relative to this column, e.g. [data, information, counters]
            var propertyNames = this.embeddedMetadata.parentPropertyNames.slice();
            // now need to access post[data][information][counters] to get column value from the counters
            // and on each step we need to create complex literal object, e.g. first { data },
            // then { data: { information } }, then { data: { information: { counters } } },
            // then { data: { information: { counters: [this.propertyName]: entity[data][information][counters][this.propertyName] } } }
            // this recursive function helps doing that
            var extractEmbeddedColumnValue_1 = function (propertyNames, map) {
                var propertyName = propertyNames.shift();
                if (propertyName) {
                    map[propertyName] = {};
                    extractEmbeddedColumnValue_1(propertyNames, map[propertyName]);
                    return map;
                }
                map[_this.propertyName] = value;
                return map;
            };
            return extractEmbeddedColumnValue_1(propertyNames, {});
        }
        else {
            return _a = {}, _a[this.propertyName] = value, _a;
        }
        var _a;
    };
    /**
     * Extracts column value and returns its column name with this value in a literal object.
     * If column is in embedded (or recursive embedded) it returns complex literal object.
     *
     * Examples what this method can return depend if this column is in embeds.
     * { id: 1 } or { title: "hello" }, { counters: { code: 1 } }, { data: { information: { counters: { code: 1 } } } }
     */
    ColumnMetadata.prototype.getEntityValueMap = function (entity) {
        var _this = this;
        // extract column value from embeds of entity if column is in embedded
        if (this.embeddedMetadata) {
            // example: post[data][information][counters].id where "data", "information" and "counters" are embeddeds
            // we need to get value of "id" column from the post real entity object and return it in a
            // { data: { information: { counters: { id: ... } } } } format
            // first step - we extract all parent properties of the entity relative to this column, e.g. [data, information, counters]
            var propertyNames = this.embeddedMetadata.parentPropertyNames.slice();
            // now need to access post[data][information][counters] to get column value from the counters
            // and on each step we need to create complex literal object, e.g. first { data },
            // then { data: { information } }, then { data: { information: { counters } } },
            // then { data: { information: { counters: [this.propertyName]: entity[data][information][counters][this.propertyName] } } }
            // this recursive function helps doing that
            var extractEmbeddedColumnValue_2 = function (propertyNames, value, map) {
                var propertyName = propertyNames.shift();
                if (propertyName) {
                    map[propertyName] = {};
                    extractEmbeddedColumnValue_2(propertyNames, value ? value[propertyName] : undefined, map[propertyName]);
                    return map;
                }
                map[_this.propertyName] = value ? value[_this.propertyName] : undefined;
                return map;
            };
            return extractEmbeddedColumnValue_2(propertyNames, entity, {});
        }
        else {
            return _a = {}, _a[this.propertyName] = entity[this.propertyName], _a;
        }
        var _a;
    };
    /**
     * Extracts column value from the given entity.
     * If column is in embedded (or recursive embedded) it extracts its value from there.
     */
    ColumnMetadata.prototype.getEntityValue = function (entity) {
        // if (entity === undefined || entity === null) return undefined; // uncomment if needed
        // extract column value from embeddeds of entity if column is in embedded
        if (this.embeddedMetadata) {
            // example: post[data][information][counters].id where "data", "information" and "counters" are embeddeds
            // we need to get value of "id" column from the post real entity object
            // first step - we extract all parent properties of the entity relative to this column, e.g. [data, information, counters]
            var propertyNames = this.embeddedMetadata.parentPropertyNames.slice();
            // next we need to access post[data][information][counters][this.propertyName] to get column value from the counters
            // this recursive function takes array of generated property names and gets the post[data][information][counters] embed
            var extractEmbeddedColumnValue_3 = function (propertyNames, value) {
                var propertyName = propertyNames.shift();
                return propertyName ? extractEmbeddedColumnValue_3(propertyNames, value[propertyName]) : value;
            };
            // once we get nested embed object we get its column, e.g. post[data][information][counters][this.propertyName]
            var embeddedObject = extractEmbeddedColumnValue_3(propertyNames, entity);
            if (embeddedObject) {
                if (this.relationMetadata && this.referencedColumn && this.isVirtual) {
                    var relatedEntity = this.relationMetadata.getEntityValue(embeddedObject);
                    return relatedEntity ? this.referencedColumn.getEntityValue(relatedEntity) : undefined;
                }
                else {
                    return embeddedObject[this.propertyName];
                }
            }
            return undefined;
            // return embeddedObject ? embeddedObject[this.propertyName] : undefined;
        }
        else {
            if (this.relationMetadata && this.referencedColumn && this.isVirtual) {
                var relatedEntity = this.relationMetadata.getEntityValue(entity);
                return relatedEntity ? this.referencedColumn.getEntityValue(relatedEntity) : undefined;
            }
            else {
                return entity[this.propertyName];
            }
            // return entity[this.propertyName];
        }
    };
    /**
     * Sets given entity's column value.
     * Using of this method helps to set entity relation's value of the lazy and non-lazy relations.
     */
    ColumnMetadata.prototype.setEntityValue = function (entity, value) {
        var _this = this;
        if (this.embeddedMetadata) {
            // first step - we extract all parent properties of the entity relative to this column, e.g. [data, information, counters]
            var extractEmbeddedColumnValue_4 = function (embeddedMetadatas, map) {
                // if (!object[embeddedMetadata.propertyName])
                //     object[embeddedMetadata.propertyName] = embeddedMetadata.create();
                var embeddedMetadata = embeddedMetadatas.shift();
                if (embeddedMetadata) {
                    if (!map[embeddedMetadata.propertyName])
                        map[embeddedMetadata.propertyName] = embeddedMetadata.create();
                    extractEmbeddedColumnValue_4(embeddedMetadatas, map[embeddedMetadata.propertyName]);
                    return map;
                }
                map[_this.propertyName] = value;
                return map;
            };
            return extractEmbeddedColumnValue_4(this.embeddedMetadata.embeddedMetadataTree.slice(), entity);
        }
        else {
            entity[this.propertyName] = value;
        }
    };
    // ---------------------------------------------------------------------
    // Builder Methods
    // ---------------------------------------------------------------------
    ColumnMetadata.prototype.build = function (namingStrategy) {
        this.propertyPath = this.buildPropertyPath();
        this.databaseName = this.buildDatabaseName(namingStrategy);
        this.databaseNameWithoutPrefixes = namingStrategy.columnName(this.propertyName, this.givenDatabaseName, []);
        return this;
    };
    // ---------------------------------------------------------------------
    // Protected Methods
    // ---------------------------------------------------------------------
    ColumnMetadata.prototype.buildPropertyPath = function () {
        var path = "";
        if (this.embeddedMetadata && this.embeddedMetadata.parentPropertyNames.length)
            path = this.embeddedMetadata.parentPropertyNames.join(".") + ".";
        if (this.referencedColumn && this.referencedColumn.propertyName !== this.propertyName)
            path += this.referencedColumn.propertyName + ".";
        return path + this.propertyName;
    };
    ColumnMetadata.prototype.buildDatabaseName = function (namingStrategy) {
        var propertyNames = this.embeddedMetadata ? this.embeddedMetadata.parentPropertyNames : [];
        return namingStrategy.columnName(this.propertyName, this.givenDatabaseName, propertyNames);
    };
    return ColumnMetadata;
}());
exports.ColumnMetadata = ColumnMetadata;

//# sourceMappingURL=ColumnMetadata.js.map
