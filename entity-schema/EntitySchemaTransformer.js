"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MetadataArgsStorage_1 = require("../metadata-args/MetadataArgsStorage");
var EntitySchemaTransformer = (function () {
    function EntitySchemaTransformer() {
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    EntitySchemaTransformer.prototype.transform = function (schemas) {
        var metadataArgsStorage = new MetadataArgsStorage_1.MetadataArgsStorage();
        schemas.forEach(function (schema) {
            // add table metadata args from the schema
            var tableSchema = schema.table || {};
            var table = {
                target: schema.target || schema.name,
                name: tableSchema.name,
                type: tableSchema.type || "regular",
                orderBy: tableSchema.orderBy
            };
            metadataArgsStorage.tables.push(table);
            // add columns metadata args from the schema
            Object.keys(schema.columns).forEach(function (columnName) {
                var columnSchema = schema.columns[columnName];
                var mode = "regular";
                if (columnSchema.createDate)
                    mode = "createDate";
                if (columnSchema.updateDate)
                    mode = "updateDate";
                if (columnSchema.version)
                    mode = "version";
                if (columnSchema.treeChildrenCount)
                    mode = "treeChildrenCount";
                if (columnSchema.treeLevel)
                    mode = "treeLevel";
                var column = {
                    target: schema.target || schema.name,
                    mode: mode,
                    propertyName: columnName,
                    options: {
                        type: columnSchema.type,
                        name: columnSchema.name,
                        length: columnSchema.length,
                        primary: columnSchema.primary,
                        generated: columnSchema.generated,
                        unique: columnSchema.unique,
                        nullable: columnSchema.nullable,
                        comment: columnSchema.comment,
                        default: columnSchema.default,
                        precision: columnSchema.precision,
                        scale: columnSchema.scale
                    }
                };
                metadataArgsStorage.columns.push(column);
            });
            // add relation metadata args from the schema
            if (schema.relations) {
                Object.keys(schema.relations).forEach(function (relationName) {
                    var relationSchema = schema.relations[relationName];
                    var relation = {
                        target: schema.target || schema.name,
                        propertyName: relationName,
                        relationType: relationSchema.type,
                        isLazy: relationSchema.isLazy || false,
                        type: relationSchema.target,
                        inverseSideProperty: relationSchema.inverseSide,
                        isTreeParent: relationSchema.isTreeParent,
                        isTreeChildren: relationSchema.isTreeChildren,
                        options: {
                            cascadeAll: relationSchema.cascadeAll,
                            cascadeInsert: relationSchema.cascadeInsert,
                            cascadeUpdate: relationSchema.cascadeUpdate,
                            cascadeRemove: relationSchema.cascadeRemove,
                            nullable: relationSchema.nullable,
                            onDelete: relationSchema.onDelete
                        }
                    };
                    metadataArgsStorage.relations.push(relation);
                    // add join column
                    if (relationSchema.joinColumn) {
                        if (typeof relationSchema.joinColumn === "boolean") {
                            var joinColumn = {
                                target: schema.target || schema.name,
                                propertyName: relationName
                            };
                            metadataArgsStorage.joinColumns.push(joinColumn);
                        }
                        else {
                            var joinColumn = {
                                target: schema.target || schema.name,
                                propertyName: relationName,
                                name: relationSchema.joinColumn.name,
                                referencedColumnName: relationSchema.joinColumn.referencedColumnName
                            };
                            metadataArgsStorage.joinColumns.push(joinColumn);
                        }
                    }
                    // add join table
                    if (relationSchema.joinTable) {
                        if (typeof relationSchema.joinTable === "boolean") {
                            var joinTable = {
                                target: schema.target || schema.name,
                                propertyName: relationName
                            };
                            metadataArgsStorage.joinTables.push(joinTable);
                        }
                        else {
                            var joinTable = {
                                target: schema.target || schema.name,
                                propertyName: relationName,
                                name: relationSchema.joinTable.name,
                                joinColumns: (relationSchema.joinTable.joinColumn ? [relationSchema.joinTable.joinColumn] : relationSchema.joinTable.joinColumns),
                                inverseJoinColumns: (relationSchema.joinTable.inverseJoinColumn ? [relationSchema.joinTable.inverseJoinColumn] : relationSchema.joinTable.inverseJoinColumns),
                            };
                            metadataArgsStorage.joinTables.push(joinTable);
                        }
                    }
                });
            }
        });
        return metadataArgsStorage;
    };
    return EntitySchemaTransformer;
}());
exports.EntitySchemaTransformer = EntitySchemaTransformer;

//# sourceMappingURL=EntitySchemaTransformer.js.map
