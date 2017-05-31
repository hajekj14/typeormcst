"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EntityManager_1 = require("./EntityManager");
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 *
 * This implementation is used for MongoDB driver which has some specifics in its EntityManager.
 */
var MongoEntityManager = (function (_super) {
    __extends(MongoEntityManager, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function MongoEntityManager(connection, queryRunnerProvider) {
        return _super.call(this, connection, queryRunnerProvider) || this;
    }
    // -------------------------------------------------------------------------
    // Overridden Methods
    // -------------------------------------------------------------------------
    /**
     * Executes raw SQL query and returns raw database results.
     */
    MongoEntityManager.prototype.query = function (query, parameters) {
        throw new Error("Queries aren't supported by MongoDB.");
    };
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided entity manager.
     */
    MongoEntityManager.prototype.transaction = function (runInTransaction) {
        throw new Error("Transactions aren't supported by MongoDB.");
    };
    /**
     * Using Query Builder with MongoDB is not supported yet.
     * Calling this method will return an error.
     */
    MongoEntityManager.prototype.createQueryBuilder = function (entityClassOrName, alias, queryRunnerProvider) {
        throw new Error("Query Builder is not supported by MongoDB.");
    };
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     */
    MongoEntityManager.prototype.createCursor = function (entityClassOrName, query) {
        return this.getMongoRepository(entityClassOrName).createCursor(query);
    };
    /**
     * Creates a cursor for a query that can be used to iterate over results from MongoDB.
     * This returns modified version of cursor that transforms each result into Entity model.
     */
    MongoEntityManager.prototype.createEntityCursor = function (entityClassOrName, query) {
        return this.getMongoRepository(entityClassOrName).createEntityCursor(query);
    };
    /**
     * Execute an aggregation framework pipeline against the collection.
     */
    MongoEntityManager.prototype.aggregate = function (entityClassOrName, pipeline, options) {
        return this.getMongoRepository(entityClassOrName).aggregate(pipeline, options);
    };
    /**
     * Perform a bulkWrite operation without a fluent API.
     */
    MongoEntityManager.prototype.bulkWrite = function (entityClassOrName, operations, options) {
        return this.getMongoRepository(entityClassOrName).bulkWrite(operations, options);
    };
    /**
     * Count number of matching documents in the db to a query.
     */
    MongoEntityManager.prototype.count = function (entityClassOrName, query, options) {
        return this.getMongoRepository(entityClassOrName).count(query, options);
    };
    /**
     * Creates an index on the db and collection.
     */
    MongoEntityManager.prototype.createCollectionIndex = function (entityClassOrName, fieldOrSpec, options) {
        return this.getMongoRepository(entityClassOrName).createCollectionIndex(fieldOrSpec, options);
    };
    /**
     * Creates multiple indexes in the collection, this method is only supported for MongoDB 2.6 or higher.
     * Earlier version of MongoDB will throw a command not supported error.
     * Index specifications are defined at http://docs.mongodb.org/manual/reference/command/createIndexes/.
     */
    MongoEntityManager.prototype.createCollectionIndexes = function (entityClassOrName, indexSpecs) {
        return this.getMongoRepository(entityClassOrName).createCollectionIndexes(indexSpecs);
    };
    /**
     * Delete multiple documents on MongoDB.
     */
    MongoEntityManager.prototype.deleteMany = function (entityClassOrName, query, options) {
        return this.getMongoRepository(entityClassOrName).deleteMany(query, options);
    };
    /**
     * Delete a document on MongoDB.
     */
    MongoEntityManager.prototype.deleteOne = function (entityClassOrName, query, options) {
        return this.getMongoRepository(entityClassOrName).deleteOne(query, options);
    };
    /**
     * The distinct command returns returns a list of distinct values for the given key across a collection.
     */
    MongoEntityManager.prototype.distinct = function (entityClassOrName, key, query, options) {
        return this.getMongoRepository(entityClassOrName).distinct(key, query, options);
    };
    /**
     * Drops an index from this collection.
     */
    MongoEntityManager.prototype.dropCollectionIndex = function (entityClassOrName, indexName, options) {
        return this.getMongoRepository(entityClassOrName).dropCollectionIndex(indexName, options);
    };
    /**
     * Drops all indexes from the collection.
     */
    MongoEntityManager.prototype.dropCollectionIndexes = function (entityClassOrName) {
        return this.getMongoRepository(entityClassOrName).dropCollectionIndexes();
    };
    /**
     * Find a document and delete it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoEntityManager.prototype.findOneAndDelete = function (entityClassOrName, query, options) {
        return this.getMongoRepository(entityClassOrName).findOneAndDelete(query, options);
    };
    /**
     * Find a document and replace it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoEntityManager.prototype.findOneAndReplace = function (entityClassOrName, query, replacement, options) {
        return this.getMongoRepository(entityClassOrName).findOneAndReplace(query, replacement, options);
    };
    /**
     * Find a document and update it in one atomic operation, requires a write lock for the duration of the operation.
     */
    MongoEntityManager.prototype.findOneAndUpdate = function (entityClassOrName, query, update, options) {
        return this.getMongoRepository(entityClassOrName).findOneAndUpdate(query, update, options);
    };
    /**
     * Execute a geo search using a geo haystack index on a collection.
     */
    MongoEntityManager.prototype.geoHaystackSearch = function (entityClassOrName, x, y, options) {
        return this.getMongoRepository(entityClassOrName).geoHaystackSearch(x, y, options);
    };
    /**
     * Execute the geoNear command to search for items in the collection.
     */
    MongoEntityManager.prototype.geoNear = function (entityClassOrName, x, y, options) {
        return this.getMongoRepository(entityClassOrName).geoNear(x, y, options);
    };
    /**
     * Run a group command across a collection.
     */
    MongoEntityManager.prototype.group = function (entityClassOrName, keys, condition, initial, reduce, finalize, command, options) {
        return this.getMongoRepository(entityClassOrName).group(keys, condition, initial, reduce, finalize, command, options);
    };
    /**
     * Retrieve all the indexes on the collection.
     */
    MongoEntityManager.prototype.collectionIndexes = function (entityClassOrName) {
        return this.getMongoRepository(entityClassOrName).collectionIndexes();
    };
    /**
     * Retrieve all the indexes on the collection.
     */
    MongoEntityManager.prototype.collectionIndexExists = function (entityClassOrName, indexes) {
        return this.getMongoRepository(entityClassOrName).collectionIndexExists(indexes);
    };
    /**
     * Retrieves this collections index info.
     */
    MongoEntityManager.prototype.collectionIndexInformation = function (entityClassOrName, options) {
        return this.getMongoRepository(entityClassOrName).collectionIndexInformation(options);
    };
    /**
     * Initiate an In order bulk write operation, operations will be serially executed in the order they are added, creating a new operation for each switch in types.
     */
    MongoEntityManager.prototype.initializeOrderedBulkOp = function (entityClassOrName, options) {
        return this.getMongoRepository(entityClassOrName).initializeOrderedBulkOp(options);
    };
    /**
     * Initiate a Out of order batch write operation. All operations will be buffered into insert/update/remove commands executed out of order.
     */
    MongoEntityManager.prototype.initializeUnorderedBulkOp = function (entityClassOrName, options) {
        return this.getMongoRepository(entityClassOrName).initializeUnorderedBulkOp(options);
    };
    /**
     * Inserts an array of documents into MongoDB.
     */
    MongoEntityManager.prototype.insertMany = function (entityClassOrName, docs, options) {
        return this.getMongoRepository(entityClassOrName).insertMany(docs, options);
    };
    /**
     * Inserts a single document into MongoDB.
     */
    MongoEntityManager.prototype.insertOne = function (entityClassOrName, doc, options) {
        return this.getMongoRepository(entityClassOrName).insertOne(doc, options);
    };
    /**
     * Returns if the collection is a capped collection.
     */
    MongoEntityManager.prototype.isCapped = function (entityClassOrName) {
        return this.getMongoRepository(entityClassOrName).isCapped();
    };
    /**
     * Get the list of all indexes information for the collection.
     */
    MongoEntityManager.prototype.listCollectionIndexes = function (entityClassOrName, options) {
        return this.getMongoRepository(entityClassOrName).listCollectionIndexes(options);
    };
    /**
     * Run Map Reduce across a collection. Be aware that the inline option for out will return an array of results not a collection.
     */
    MongoEntityManager.prototype.mapReduce = function (entityClassOrName, map, reduce, options) {
        return this.getMongoRepository(entityClassOrName).mapReduce(map, reduce, options);
    };
    /**
     * Return N number of parallel cursors for a collection allowing parallel reading of entire collection.
     * There are no ordering guarantees for returned results.
     */
    MongoEntityManager.prototype.parallelCollectionScan = function (entityClassOrName, options) {
        return this.getMongoRepository(entityClassOrName).parallelCollectionScan(options);
    };
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    MongoEntityManager.prototype.reIndex = function (entityClassOrName) {
        return this.getMongoRepository(entityClassOrName).reIndex();
    };
    /**
     * Reindex all indexes on the collection Warning: reIndex is a blocking operation (indexes are rebuilt in the foreground) and will be slow for large collections.
     */
    MongoEntityManager.prototype.rename = function (entityClassOrName, newName, options) {
        return this.getMongoRepository(entityClassOrName).rename(newName, options);
    };
    /**
     * Replace a document on MongoDB.
     */
    MongoEntityManager.prototype.replaceOne = function (entityClassOrName, query, doc, options) {
        return this.getMongoRepository(entityClassOrName).replaceOne(query, doc, options);
    };
    /**
     * Get all the collection statistics.
     */
    MongoEntityManager.prototype.stats = function (entityClassOrName, options) {
        return this.getMongoRepository(entityClassOrName).stats(options);
    };
    /**
     * Update multiple documents on MongoDB.
     */
    MongoEntityManager.prototype.updateMany = function (entityClassOrName, query, update, options) {
        return this.getMongoRepository(entityClassOrName).updateMany(query, update, options);
    };
    /**
     * Update a single document on MongoDB.
     */
    MongoEntityManager.prototype.updateOne = function (entityClassOrName, query, update, options) {
        return this.getMongoRepository(entityClassOrName).updateOne(query, update, options);
    };
    return MongoEntityManager;
}(EntityManager_1.EntityManager));
exports.MongoEntityManager = MongoEntityManager;

//# sourceMappingURL=MongoEntityManager.js.map
