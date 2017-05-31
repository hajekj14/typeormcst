import { Connection } from "../connection/Connection";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { EntityManager } from "./EntityManager";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { ObjectType } from "../common/ObjectType";
import { Cursor, Collection, MongoCountPreferences, CollectionAggregationOptions, AggregationCursor, CollectionBluckWriteOptions, BulkWriteOpResultObject, IndexOptions, CollectionOptions, DeleteWriteOpResultObject, FindAndModifyWriteOpResultObject, FindOneAndReplaceOption, GeoHaystackSearchOptions, GeoNearOptions, ReadPreference, Code, OrderedBulkOperation, UnorderedBulkOperation, InsertWriteOpResult, CollectionInsertManyOptions, CollectionInsertOneOptions, InsertOneWriteOpResult, CommandCursor, MapReduceOptions, ParallelCollectionScanOptions, ReplaceOneOptions, UpdateWriteOpResult, CollStats } from "mongodb";
import { ObjectLiteral } from "../common/ObjectLiteral";
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 *
 * This implementation is used for MongoDB driver which has some specifics in its EntityManager.
 */
export declare class MongoEntityManager extends EntityManager {
    constructor(connection: Connection, queryRunnerProvider?: QueryRunnerProvider);
    /**
     * Executes raw SQL query and returns raw database results.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided entity manager.
     */
    transaction(runInTransaction: (entityManger: EntityManager) => Promise<any>): Promise<any>;
    /**
     * Using Query Builder with MongoDB is not supported yet.
     * Calling this method will return an error.
     */
    createQueryBuilder<Entity>(entityClassOrName: ObjectType<Entity> | string, alias: string, queryRunnerProvider?: QueryRunnerProvider): QueryBuilder<Entity>;
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     */
    createCursor<Entity>(entityClassOrName: ObjectType<Entity> | string, query?: ObjectLiteral): Cursor<Entity>;
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     * This returns modified version of cursor that transforms each result into Entity model.
     */
    createEntityCursor<Entity>(entityClassOrName: ObjectType<Entity> | string, query?: ObjectLiteral): Cursor<Entity>;
    /**
     * Execute an aggregation framework pipeline against the collection.
     */
    aggregate<Entity>(entityClassOrName: ObjectType<Entity> | string, pipeline: ObjectLiteral[], options?: CollectionAggregationOptions): AggregationCursor<Entity>;
    /**
     * Perform a bulkWrite operation without a fluent API.
     */
    bulkWrite<Entity>(entityClassOrName: ObjectType<Entity> | string, operations: ObjectLiteral[], options?: CollectionBluckWriteOptions): Promise<BulkWriteOpResultObject>;
    /**
     * Count number of matching documents in the db to a query.
     */
    count<Entity>(entityClassOrName: ObjectType<Entity> | string, query?: ObjectLiteral, options?: MongoCountPreferences): Promise<any>;
    /**
     * Creates an index on the db and collection.
     */
    createCollectionIndex<Entity>(entityClassOrName: ObjectType<Entity> | string, fieldOrSpec: string | any, options?: IndexOptions): Promise<string>;
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     */
    createCollectionIndexes<Entity>(entityClassOrName: ObjectType<Entity> | string, indexSpecs: ObjectLiteral[]): Promise<void>;
    /**
     * Delete multiple documents on MongoDB.
     */
    deleteMany<Entity>(entityClassOrName: ObjectType<Entity> | string, query: ObjectLiteral, options?: CollectionOptions): Promise<DeleteWriteOpResultObject>;
    /**
     * Delete a document on MongoDB.
     */
    deleteOne<Entity>(entityClassOrName: ObjectType<Entity> | string, query: ObjectLiteral, options?: CollectionOptions): Promise<DeleteWriteOpResultObject>;
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     */
    distinct<Entity>(entityClassOrName: ObjectType<Entity> | string, key: string, query: ObjectLiteral, options?: {
        readPreference?: ReadPreference | string;
    }): Promise<any>;
    /**
     * Drops an index from this collection.
     */
    dropCollectionIndex<Entity>(entityClassOrName: ObjectType<Entity> | string, indexName: string, options?: CollectionOptions): Promise<any>;
    /**
     * Drops all indexes from the collection.
     */
    dropCollectionIndexes<Entity>(entityClassOrName: ObjectType<Entity> | string): Promise<any>;
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     */
    findOneAndDelete<Entity>(entityClassOrName: ObjectType<Entity> | string, query: ObjectLiteral, options?: {
        projection?: Object;
        sort?: Object;
        maxTimeMS?: number;
    }): Promise<FindAndModifyWriteOpResultObject>;
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     */
    findOneAndReplace<Entity>(entityClassOrName: ObjectType<Entity> | string, query: ObjectLiteral, replacement: Object, options?: FindOneAndReplaceOption): Promise<FindAndModifyWriteOpResultObject>;
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     */
    findOneAndUpdate<Entity>(entityClassOrName: ObjectType<Entity> | string, query: ObjectLiteral, update: Object, options?: FindOneAndReplaceOption): Promise<FindAndModifyWriteOpResultObject>;
    /**
     * Execute a geo search using a geo haystack index on a collection.
     */
    geoHaystackSearch<Entity>(entityClassOrName: ObjectType<Entity> | string, x: number, y: number, options?: GeoHaystackSearchOptions): Promise<any>;
    /**
     * Execute the geoNear command to search for items in the collection.
     */
    geoNear<Entity>(entityClassOrName: ObjectType<Entity> | string, x: number, y: number, options?: GeoNearOptions): Promise<any>;
    /**
     * Run a group command across a collection.
     */
    group<Entity>(entityClassOrName: ObjectType<Entity> | string, keys: Object | Array<any> | Function | Code, condition: Object, initial: Object, reduce: Function | Code, finalize: Function | Code, command: boolean, options?: {
        readPreference?: ReadPreference | string;
    }): Promise<any>;
    /**
     * Retrieve all the indexes on the collection.
     */
    collectionIndexes<Entity>(entityClassOrName: ObjectType<Entity> | string): Promise<any>;
    /**
     * Retrieve all the indexes on the collection.
     */
    collectionIndexExists<Entity>(entityClassOrName: ObjectType<Entity> | string, indexes: string | string[]): Promise<boolean>;
    /**
     * Retrieves this collections index info.
     */
    collectionIndexInformation<Entity>(entityClassOrName: ObjectType<Entity> | string, options?: {
        full: boolean;
    }): Promise<any>;
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     */
    initializeOrderedBulkOp<Entity>(entityClassOrName: ObjectType<Entity> | string, options?: CollectionOptions): OrderedBulkOperation;
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     */
    initializeUnorderedBulkOp<Entity>(entityClassOrName: ObjectType<Entity> | string, options?: CollectionOptions): UnorderedBulkOperation;
    /**
     * Inserts an array of documents into MongoDB.
     */
    insertMany<Entity>(entityClassOrName: ObjectType<Entity> | string, docs: ObjectLiteral[], options?: CollectionInsertManyOptions): Promise<InsertWriteOpResult>;
    /**
     * Inserts a single document into MongoDB.
     */
    insertOne<Entity>(entityClassOrName: ObjectType<Entity> | string, doc: ObjectLiteral, options?: CollectionInsertOneOptions): Promise<InsertOneWriteOpResult>;
    /**
     * Returns if the collection is a capped collection.
     */
    isCapped<Entity>(entityClassOrName: ObjectType<Entity> | string): Promise<any>;
    /**
     * Get the list of all indexes information for the collection.
     */
    listCollectionIndexes<Entity>(entityClassOrName: ObjectType<Entity> | string, options?: {
        batchSize?: number;
        readPreference?: ReadPreference | string;
    }): CommandCursor;
    /**
     * Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.
     */
    mapReduce<Entity>(entityClassOrName: ObjectType<Entity> | string, map: Function | string, reduce: Function | string, options?: MapReduceOptions): Promise<any>;
    /**
     * Return N number of parallel cursors for a collection allowing parallel reading of entire collection.
     * There are no ordering guarantees for returned results.
     */
    parallelCollectionScan<Entity>(entityClassOrName: ObjectType<Entity> | string, options?: ParallelCollectionScanOptions): Promise<Cursor<Entity>[]>;
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    reIndex<Entity>(entityClassOrName: ObjectType<Entity> | string): Promise<any>;
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    rename<Entity>(entityClassOrName: ObjectType<Entity> | string, newName: string, options?: {
        dropTarget?: boolean;
    }): Promise<Collection>;
    /**
     * Replace a document on MongoDB.
     */
    replaceOne<Entity>(entityClassOrName: ObjectType<Entity> | string, query: ObjectLiteral, doc: ObjectLiteral, options?: ReplaceOneOptions): Promise<UpdateWriteOpResult>;
    /**
     * Get all the collection statistics.
     */
    stats<Entity>(entityClassOrName: ObjectType<Entity> | string, options?: {
        scale: number;
    }): Promise<CollStats>;
    /**
     * Update multiple documents on MongoDB.
     */
    updateMany<Entity>(entityClassOrName: ObjectType<Entity> | string, query: ObjectLiteral, update: ObjectLiteral, options?: {
        upsert?: boolean;
        w?: any;
        wtimeout?: number;
        j?: boolean;
    }): Promise<UpdateWriteOpResult>;
    /**
     * Update a single document on MongoDB.
     */
    updateOne<Entity>(entityClassOrName: ObjectType<Entity> | string, query: ObjectLiteral, update: ObjectLiteral, options?: ReplaceOneOptions): Promise<UpdateWriteOpResult>;
}
