import { Connection } from "../connection/Connection";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { FindManyOptions } from "../find-options/FindManyOptions";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { FindOneOptions } from "../find-options/FindOneOptions";
import { DeepPartial } from "../common/DeepPartial";
import { PersistOptions } from "./PersistOptions";
import { RemoveOptions } from "./RemoveOptions";
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
export declare class Repository<Entity extends ObjectLiteral> {
    /**
     * Connection used by this repository.
     */
    protected connection: Connection;
    /**
     * Entity metadata of the entity current repository manages.
     */
    protected metadata: EntityMetadata;
    /**
     * Query runner provider used for this repository.
     */
    protected queryRunnerProvider?: QueryRunnerProvider;
    /**
     * Returns object that is managed by this repository.
     * If this repository manages entity from schema,
     * then it returns a name of that schema instead.
     */
    readonly target: Function | string;
    /**
     * Checks if entity has an id.
     * If entity contains compose ids, then it checks them all.
     */
    hasId(entity: Entity): boolean;
    /**
     * Gets entity mixed id.
     */
    getId(entity: Entity): any;
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder(alias: string, queryRunnerProvider?: QueryRunnerProvider): QueryBuilder<Entity>;
    /**
     * Creates a new entity instance.
     */
    create(): Entity;
    /**
     * Creates a new entities and copies all entity properties from given objects into their new entities.
     * Note that it copies only properties that present in entity schema.
     */
    create(entityLikeArray: DeepPartial<Entity>[]): Entity[];
    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     * Note that it copies only properties that present in entity schema.
     */
    create(entityLike: DeepPartial<Entity>): Entity;
    /**
     * Merges multiple entities (or entity-like objects) into a given entity.
     */
    merge(mergeIntoEntity: Entity, ...entityLikes: DeepPartial<Entity>[]): Entity;
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     *
     * Note that given entity-like object must have an entity id / primary key to find entity by.
     * Returns undefined if entity with given id was not found.
     */
    preload(entityLike: DeepPartial<Entity>): Promise<Entity | undefined>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist(entities: Entity[], options?: PersistOptions): Promise<Entity[]>;
    /**
     * Persists (saves) a given entity in the database.
     * If entity does not exist in the database then inserts, otherwise updates.
     */
    persist(entity: Entity, options?: PersistOptions): Promise<Entity>;
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     */
    update(conditions: Partial<Entity>, partialEntity: DeepPartial<Entity>, options?: PersistOptions): Promise<void>;
    /**
     * Updates entity partially. Entity can be found by a given find options.
     */
    update(findOptions: FindOneOptions<Entity>, partialEntity: DeepPartial<Entity>, options?: PersistOptions): Promise<void>;
    /**
     * Updates entity partially. Entity will be found by a given id.
     */
    updateById(id: any, partialEntity: DeepPartial<Entity>, options?: PersistOptions): Promise<void>;
    /**
     * Removes a given entities from the database.
     */
    remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;
    /**
     * Removes a given entity from the database.
     */
    remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;
    /**
     * Removes entity by a given entity id.
     */
    removeById(id: any, options?: RemoveOptions): Promise<void>;
    /**
     * Counts entities that match given options.
     */
    count(options?: FindManyOptions<Entity>): Promise<number>;
    /**
     * Counts entities that match given conditions.
     */
    count(conditions?: DeepPartial<Entity>): Promise<number>;
    /**
     * Finds entities that match given options.
     */
    find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find(conditions?: DeepPartial<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    findAndCount(conditions?: DeepPartial<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     */
    findByIds(ids: any[], options?: FindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities by ids.
     * Optionally conditions can be applied.
     */
    findByIds(ids: any[], conditions?: DeepPartial<Entity>): Promise<Entity[]>;
    /**
     * Finds first entity that matches given options.
     */
    findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne(conditions?: DeepPartial<Entity>): Promise<Entity | undefined>;
    /**
     * Finds entity by given id.
     * Optionally find options can be applied.
     */
    findOneById(id: any, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds entity by given id.
     * Optionally conditions can be applied.
     */
    findOneById(id: any, conditions?: DeepPartial<Entity>): Promise<Entity | undefined>;
    /**
     * Executes a raw SQL query and returns a raw database results.
     * Raw query execution is supported only by relational databases (MongoDB is not supported).
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Wraps given function execution (and all operations made there) in a transaction.
     * All database operations must be executed using provided repository.
     *
     * Most important, you should execute all your database operations using provided repository instance,
     * all other operations would not be included in the transaction.
     * If you want to execute transaction and persist multiple different entity types, then
     * use EntityManager.transaction method instead.
     *
     * Transactions are supported only by relational databases (MongoDB is not supported).
     */
    transaction(runInTransaction: (repository: Repository<Entity>) => Promise<any> | any): Promise<any>;
    /**
     * Clears all the data from the given table/collection (truncates/drops it).
     */
    clear(): Promise<void>;
}
