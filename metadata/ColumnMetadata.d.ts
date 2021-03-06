import { ColumnType } from "./types/ColumnTypes";
import { EntityMetadata } from "./EntityMetadata";
import { EmbeddedMetadata } from "./EmbeddedMetadata";
import { RelationMetadata } from "./RelationMetadata";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface";
import { ColumnMetadataArgs } from "../metadata-args/ColumnMetadataArgs";
/**
 * This metadata contains all information about entity's column.
 */
export declare class ColumnMetadata {
    /**
     * Entity metadata where this column metadata is.
     *
     * For example for @Column() name: string in Post, entityMetadata will be metadata of Post entity.
     */
    entityMetadata: EntityMetadata;
    /**
     * Embedded metadata where this column metadata is.
     * If this column is not in embed then this property value is undefined.
     */
    embeddedMetadata?: EmbeddedMetadata;
    /**
     * If column is a foreign key of some relation then this relation's metadata will be there.
     * If this column does not have a foreign key then this property value is undefined.
     */
    relationMetadata?: RelationMetadata;
    /**
     * Class's property name on which this column is applied.
     */
    propertyName: string;
    /**
     * The database type of the column.
     */
    type: ColumnType;
    /**
     * Type's length in the database.
     */
    length: string;
    /**
     * Indicates if this column is a primary key.
     */
    isPrimary: boolean;
    /**
     * Indicates if this column is generated (auto increment or generated other way).
     */
    isGenerated: boolean;
    /**
     * Indicates if column value in the database should be unique or not.
     */
    isUnique: boolean;
    /**
     * Indicates if column can contain nulls or not.
     */
    isNullable: boolean;
    /**
     * Column comment.
     * This feature is not supported by all databases.
     */
    comment: string;
    /**
     * Default database value.
     */
    default?: any;
    /**
     * The precision for a decimal (exact numeric) column (applies only for decimal column),
     * which is the maximum number of digits that are stored for the values.
     */
    precision?: number;
    /**
     * The scale for a decimal (exact numeric) column (applies only for decimal column),
     * which represents the number of digits to the right of the decimal point and must not be greater than precision.
     */
    scale?: number;
    /**
     * Indicates if date column will contain a timezone.
     * Used only for date-typed column types.
     * Note that timezone option is not supported by all databases (only postgres for now).
     */
    timezone: boolean;
    /**
     * Indicates if date object must be stored in given date's timezone.
     * By default date is saved in UTC timezone.
     * Works only with "datetime" columns.
     */
    localTimezone: boolean;
    /**
     * Indicates if column's type will be set as a fixed-length data type.
     * Works only with "string" columns.
     */
    fixedLength: boolean;
    /**
     * Gets full path to this column property (including column property name).
     * Full path is relevant when column is used in embeds (one or multiple nested).
     * For example it will return "counters.subcounters.likes".
     * If property is not in embeds then it returns just property name of the column.
     */
    propertyPath: string;
    /**
     * Complete column name in the database including its embedded prefixes.
     */
    databaseName: string;
    /**
     * Database name in the database without embedded prefixes applied.
     */
    databaseNameWithoutPrefixes: string;
    /**
     * Database name set by entity metadata builder, not yet passed naming strategy process and without embedded prefixes.
     */
    givenDatabaseName?: string;
    /**
     * Indicates if column is virtual. Virtual columns are not mapped to the entity.
     */
    isVirtual: boolean;
    /**
     * Indicates if column is a parent id. Parent id columns are not mapped to the entity.
     */
    isParentId: boolean;
    /**
     * Indicates if column is discriminator. Discriminator columns are not mapped to the entity.
     */
    isDiscriminator: boolean;
    /**
     * Indicates if column is tree-level column. Tree-level columns are used in closure entities.
     */
    isTreeLevel: boolean;
    /**
     * Indicates if this column contains an entity creation date.
     */
    isCreateDate: boolean;
    /**
     * Indicates if this column contains an entity update date.
     */
    isUpdateDate: boolean;
    /**
     * Indicates if this column contains an entity version.
     */
    isVersion: boolean;
    /**
     * Indicates if this column contains an object id.
     */
    isObjectId: boolean;
    /**
     * If this column is foreign key then it references some other column,
     * and this property will contain reference to this column.
     */
    referencedColumn: ColumnMetadata | undefined;
    constructor(options: {
        entityMetadata: EntityMetadata;
        embeddedMetadata?: EmbeddedMetadata;
        referencedColumn?: ColumnMetadata;
        args: ColumnMetadataArgs;
    });
    /**
     * Creates entity id map from the given entity ids array.
     */
    createValueMap(value: any): any;
    /**
     * Extracts column value and returns its column name with this value in a literal object.
     * If column is in embedded (or recursive embedded) it returns complex literal object.
     *
     * Examples what this method can return depend if this column is in embeds.
     * { id: 1 } or { title: "hello" }, { counters: { code: 1 } }, { data: { information: { counters: { code: 1 } } } }
     */
    getEntityValueMap(entity: ObjectLiteral): ObjectLiteral;
    /**
     * Extracts column value from the given entity.
     * If column is in embedded (or recursive embedded) it extracts its value from there.
     */
    getEntityValue(entity: ObjectLiteral): any | undefined;
    /**
     * Sets given entity's column value.
     * Using of this method helps to set entity relation's value of the lazy and non-lazy relations.
     */
    setEntityValue(entity: ObjectLiteral, value: any): void;
    build(namingStrategy: NamingStrategyInterface): this;
    protected buildPropertyPath(): string;
    protected buildDatabaseName(namingStrategy: NamingStrategyInterface): string;
}
