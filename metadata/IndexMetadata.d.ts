import { EntityMetadata } from "./EntityMetadata";
import { IndexMetadataArgs } from "../metadata-args/IndexMetadataArgs";
/**
 * Index metadata contains all information about table's index.
 */
export declare class IndexMetadata {
    /**
     * Entity metadata of the class to which this index is applied.
     */
    entityMetadata: EntityMetadata;
    /**
     * Indicates if this index must be unique.
     */
    readonly isUnique: boolean;
    /**
     * Target class to which metadata is applied.
     */
    readonly target?: Function | string;
    /**
     * Composite index name.
     */
    private readonly _name;
    /**
     * Columns combination to be used as index.
     */
    private readonly _columns;
    constructor(args: IndexMetadataArgs);
    /**
     * Gets index's name.
     */
    readonly name: string;
    /**
     * Gets the table name on which index is applied.
     */
    readonly tableName: string;
    /**
     * Gets the column names which are in this index.
     */
    readonly columns: string[];
    /**
     * Builds columns as a map of values where column name is key of object and value is a value provided by
     * function or default value given to this function.
     */
    buildColumnsAsMap(defaultValue?: number): {
        [key: string]: number;
    };
}
