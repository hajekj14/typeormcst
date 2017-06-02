import { QueryRunner } from "../../query-runner/QueryRunner";
import { DatabaseConnection } from "../DatabaseConnection";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { Logger } from "../../logger/Logger";
import { MongoDriver } from "./MongoDriver";
import { ColumnSchema } from "../../schema-builder/schema/ColumnSchema";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { TableSchema } from "../../schema-builder/schema/TableSchema";
import { ForeignKeySchema } from "../../schema-builder/schema/ForeignKeySchema";
import { IndexSchema } from "../../schema-builder/schema/IndexSchema";
import { ColumnType } from "../../metadata/types/ColumnTypes";
import { Cursor, Collection, MongoCountPreferences, CollectionAggregationOptions, AggregationCursor, CollectionBluckWriteOptions, BulkWriteOpResultObject, MongodbIndexOptions, CollectionOptions, DeleteWriteOpResultObject, FindAndModifyWriteOpResultObject, FindOneAndReplaceOption, GeoHaystackSearchOptions, GeoNearOptions, ReadPreference, Code, OrderedBulkOperation, UnorderedBulkOperation, InsertWriteOpResult, CollectionInsertManyOptions, CollectionInsertOneOptions, InsertOneWriteOpResult, CommandCursor, MapReduceOptions, ParallelCollectionScanOptions, ReplaceOneOptions, UpdateWriteOpResult, CollStats } from "./typings";
/**
 * Runs queries on a single MongoDB connection.
 */
export declare class MongoQueryRunner implements QueryRunner {
    protected databaseConnection: DatabaseConnection;
    protected driver: MongoDriver;
    protected logger: Logger;
    constructor(databaseConnection: DatabaseConnection, driver: MongoDriver, logger: Logger);
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     */
    cursor(collectionName: string, query?: ObjectLiteral): Cursor<any>;
    /**
     * Execute an aggregation framework pipeline against the collection.
     */
    aggregate(collectionName: string, pipeline: ObjectLiteral[], options?: CollectionAggregationOptions): AggregationCursor<any>;
    /**
     * Perform a bulkWrite operation without a fluent API.
     */
    bulkWrite(collectionName: string, operations: ObjectLiteral[], options?: CollectionBluckWriteOptions): Promise<BulkWriteOpResultObject>;
    /**
     * Count number of matching documents in the db to a query.
     */
    count(collectionName: string, query?: ObjectLiteral, options?: MongoCountPreferences): Promise<any>;
    /**
     * Creates an index on the db and collection.
     */
    createCollectionIndex(collectionName: string, fieldOrSpec: string | any, options?: MongodbIndexOptions): Promise<string>;
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error. Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     */
    createCollectionIndexes(collectionName: string, indexSpecs: ObjectLiteral[]): Promise<void>;
    /**
     * Delete multiple documents on MongoDB.
     */
    deleteMany(collectionName: string, query: ObjectLiteral, options?: CollectionOptions): Promise<DeleteWriteOpResultObject>;
    /**
     * Delete a document on MongoDB.
     */
    deleteOne(collectionName: string, query: ObjectLiteral, options?: CollectionOptions): Promise<DeleteWriteOpResultObject>;
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     */
    distinct(collectionName: string, key: string, query: ObjectLiteral, options?: {
        readPreference?: ReadPreference | string;
    }): Promise<any>;
    /**
     * Drops an index from this collection.
     */
    dropCollectionIndex(collectionName: string, indexName: string, options?: CollectionOptions): Promise<any>;
    /**
     * Drops all indexes from the collection.
     */
    dropCollectionIndexes(collectionName: string): Promise<any>;
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     */
    findOneAndDelete(collectionName: string, query: ObjectLiteral, options?: {
        projection?: Object;
        sort?: Object;
        maxTimeMS?: number;
    }): Promise<FindAndModifyWriteOpResultObject>;
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     */
    findOneAndReplace(collectionName: string, query: ObjectLiteral, replacement: Object, options?: FindOneAndReplaceOption): Promise<FindAndModifyWriteOpResultObject>;
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     */
    findOneAndUpdate(collectionName: string, query: ObjectLiteral, update: Object, options?: FindOneAndReplaceOption): Promise<FindAndModifyWriteOpResultObject>;
    /**
     * Execute a geo search using a geo haystack index on a collection.
     */
    geoHaystackSearch(collectionName: string, x: number, y: number, options?: GeoHaystackSearchOptions): Promise<any>;
    /**
     * Execute the geoNear command to search for items in the collection.
     */
    geoNear(collectionName: string, x: number, y: number, options?: GeoNearOptions): Promise<any>;
    /**
     * Run a group command across a collection.
     */
    group(collectionName: string, keys: Object | Array<any> | Function | Code, condition: Object, initial: Object, reduce: Function | Code, finalize: Function | Code, command: boolean, options?: {
        readPreference?: ReadPreference | string;
    }): Promise<any>;
    /**
     * Retrieve all the indexes on the collection.
     */
    collectionIndexes(collectionName: string): Promise<any>;
    /**
     * Retrieve all the indexes on the collection.
     */
    collectionIndexExists(collectionName: string, indexes: string | string[]): Promise<boolean>;
    /**
     * Retrieves this collections index info.
     */
    collectionIndexInformation(collectionName: string, options?: {
        full: boolean;
    }): Promise<any>;
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     */
    initializeOrderedBulkOp(collectionName: string, options?: CollectionOptions): OrderedBulkOperation;
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     */
    initializeUnorderedBulkOp(collectionName: string, options?: CollectionOptions): UnorderedBulkOperation;
    /**
     * Inserts an array of documents into MongoDB.
     */
    insertMany(collectionName: string, docs: ObjectLiteral[], options?: CollectionInsertManyOptions): Promise<InsertWriteOpResult>;
    /**
     * Inserts a single document into MongoDB.
     */
    insertOne(collectionName: string, doc: ObjectLiteral, options?: CollectionInsertOneOptions): Promise<InsertOneWriteOpResult>;
    /**
     * Returns if the collection is a capped collection.
     */
    isCapped(collectionName: string): Promise<any>;
    /**
     * Get the list of all indexes information for the collection.
     */
    listCollectionIndexes(collectionName: string, options?: {
        batchSize?: number;
        readPreference?: ReadPreference | string;
    }): CommandCursor;
    /**
     * Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.
     */
    mapReduce(collectionName: string, map: Function | string, reduce: Function | string, options?: MapReduceOptions): Promise<any>;
    /**
     * Return N number of parallel cursors for a collection allowing parallel reading of entire collection.
     * There are no ordering guarantees for returned results.
     */
    parallelCollectionScan(collectionName: string, options?: ParallelCollectionScanOptions): Promise<Cursor<any>[]>;
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    reIndex(collectionName: string): Promise<any>;
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    rename(collectionName: string, newName: string, options?: {
        dropTarget?: boolean;
    }): Promise<Collection>;
    /**
     * Replace a document on MongoDB.
     */
    replaceOne(collectionName: string, query: ObjectLiteral, doc: ObjectLiteral, options?: ReplaceOneOptions): Promise<UpdateWriteOpResult>;
    /**
     * Get all the collection statistics.
     */
    stats(collectionName: string, options?: {
        scale: number;
    }): Promise<CollStats>;
    /**
     * Update multiple documents on MongoDB.
     */
    updateMany(collectionName: string, query: ObjectLiteral, update: ObjectLiteral, options?: {
        upsert?: boolean;
        w?: any;
        wtimeout?: number;
        j?: boolean;
    }): Promise<UpdateWriteOpResult>;
    /**
     * Update a single document on MongoDB.
     */
    updateOne(collectionName: string, query: ObjectLiteral, update: ObjectLiteral, options?: ReplaceOneOptions): Promise<UpdateWriteOpResult>;
    /**
     * For MongoDB database we don't release connection, because its single connection.
     */
    release(): Promise<void>;
    /**
     * Removes all collections from the currently connected database.
     * Be careful with using this method and avoid using it in production or migrations
     * (because it can clear all your database).
     */
    clearDatabase(): Promise<void>;
    /**
     * Starts transaction.
     */
    beginTransaction(): Promise<void>;
    /**
     * Commits transaction.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Checks if transaction is in progress.
     */
    isTransactionActive(): boolean;
    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Insert a new row with given values into given table.
     */
    insert(collectionName: string, keyValues: ObjectLiteral, generatedColumn?: ColumnMetadata): Promise<any>;
    /**
     * Updates rows that match given conditions in the given table.
     */
    update(collectionName: string, valuesMap: ObjectLiteral, conditions: ObjectLiteral): Promise<void>;
    /**
     * Deletes from the given table by a given conditions.
     */
    delete(collectionName: string, condition: string, parameters?: any[]): Promise<void>;
    /**
     * Deletes from the given table by a given conditions.
     */
    delete(collectionName: string, conditions: ObjectLiteral): Promise<void>;
    /**
     * Inserts rows into the closure table.
     */
    insertIntoClosureTable(collectionName: string, newEntityId: any, parentId: any, hasLevel: boolean): Promise<number>;
    /**
     * Loads given table's data from the database.
     */
    loadTableSchema(collectionName: string): Promise<TableSchema | undefined>;
    /**
     * Loads all tables (with given names) from the database and creates a TableSchema from them.
     */
    loadTableSchemas(collectionNames: string[]): Promise<TableSchema[]>;
    /**
     * Checks if table with the given name exist in the database.
     */
    hasTable(collectionName: string): Promise<boolean>;
    /**
     * Creates a new table from the given table schema and column schemas inside it.
     */
    createTable(table: TableSchema): Promise<void>;
    /**
     * Checks if column with the given name exist in the given table.
     */
    hasColumn(collectionName: string, columnName: string): Promise<boolean>;
    /**
     * Creates a new column from the column schema in the table.
     */
    addColumn(collectionName: string, column: ColumnSchema): Promise<void>;
    /**
     * Creates a new column from the column schema in the table.
     */
    addColumn(tableSchema: TableSchema, column: ColumnSchema): Promise<void>;
    /**
     * Creates a new columns from the column schema in the table.
     */
    addColumns(collectionName: string, columns: ColumnSchema[]): Promise<void>;
    /**
     * Creates a new columns from the column schema in the table.
     */
    addColumns(tableSchema: TableSchema, columns: ColumnSchema[]): Promise<void>;
    /**
     * Renames column in the given table.
     */
    renameColumn(table: TableSchema, oldColumn: ColumnSchema, newColumn: ColumnSchema): Promise<void>;
    /**
     * Renames column in the given table.
     */
    renameColumn(collectionName: string, oldColumnName: string, newColumnName: string): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumn(tableSchema: TableSchema, oldColumn: ColumnSchema, newColumn: ColumnSchema): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumn(tableSchema: string, oldColumn: string, newColumn: ColumnSchema): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumns(tableSchema: TableSchema, changedColumns: {
        newColumn: ColumnSchema;
        oldColumn: ColumnSchema;
    }[]): Promise<void>;
    /**
     * Drops column in the table.
     */
    dropColumn(collectionName: string, columnName: string): Promise<void>;
    /**
     * Drops column in the table.
     */
    dropColumn(tableSchema: TableSchema, column: ColumnSchema): Promise<void>;
    /**
     * Drops the columns in the table.
     */
    dropColumns(collectionName: string, columnNames: string[]): Promise<void>;
    /**
     * Drops the columns in the table.
     */
    dropColumns(tableSchema: TableSchema, columns: ColumnSchema[]): Promise<void>;
    /**
     * Updates table's primary keys.
     */
    updatePrimaryKeys(tableSchema: TableSchema): Promise<void>;
    /**
     * Creates a new foreign key.
     */
    createForeignKey(collectionName: string, foreignKey: ForeignKeySchema): Promise<void>;
    /**
     * Creates a new foreign key.
     */
    createForeignKey(tableSchema: TableSchema, foreignKey: ForeignKeySchema): Promise<void>;
    /**
     * Creates a new foreign keys.
     */
    createForeignKeys(collectionName: string, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Creates a new foreign keys.
     */
    createForeignKeys(tableSchema: TableSchema, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Drops a foreign key from the table.
     */
    dropForeignKey(collectionName: string, foreignKey: ForeignKeySchema): Promise<void>;
    /**
     * Drops a foreign key from the table.
     */
    dropForeignKey(tableSchema: TableSchema, foreignKey: ForeignKeySchema): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     */
    dropForeignKeys(collectionName: string, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     */
    dropForeignKeys(tableSchema: TableSchema, foreignKeys: ForeignKeySchema[]): Promise<void>;
    /**
     * Creates a new index.
     */
    createIndex(collectionName: string, index: IndexSchema): Promise<void>;
    /**
     * Drops an index from the table.
     */
    dropIndex(collectionName: string, indexName: string): Promise<void>;
    /**
     * Creates a database type from a given column metadata.
     */
    normalizeType(typeOptions: {
        type: ColumnType;
        length?: string | number;
        precision?: number;
        scale?: number;
        timezone?: boolean;
        fixedLength?: boolean;
    }): string;
    /**
     * Checks if "DEFAULT" values in the column metadata and in the database schema are equal.
     */
    compareDefaultValues(columnMetadataValue: any, databaseValue: any): boolean;
    /**
     * Drops collection.
     */
    truncate(collectionName: string): Promise<void>;
    /**
     * Database name shortcut.
     */
    protected readonly dbName: string;
    /**
     * Gets collection from the database with a given name.
     */
    protected getCollection(collectionName: string): Collection;
}
