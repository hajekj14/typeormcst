import { Connection } from "../connection/Connection";
import { FindManyOptions } from "../find-options/FindManyOptions";
import { ObjectType } from "../common/ObjectType";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { FindOneOptions } from "../find-options/FindOneOptions";
import { DeepPartial } from "../common/DeepPartial";
import { RemoveOptions } from "../repository/RemoveOptions";
import { SaveOptions } from "../repository/SaveOptions";
import { RepositoryAggregator } from "../repository/RepositoryAggregator";
import { SpecificRepository } from "../repository/SpecificRepository";
import { MongoRepository } from "../repository/MongoRepository";
import { TreeRepository } from "../repository/TreeRepository";
import { Repository } from "../repository/Repository";
import { QueryBuilder } from "../query-builder/QueryBuilder";
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
export declare class EntityManager {
    connection: Connection;
    protected queryRunnerProvider: QueryRunnerProvider;
    /**
     * Stores temporarily user data.
     * Useful for sharing data with subscribers.
     */
    private data;
    /**
     * Stores all registered repositories.
     */
    private repositoryAggregators;
    /**
     * @param connection Connection to be used in this entity manager
     * @param queryRunnerProvider Custom query runner to be used for operations in this entity manager
     */
    constructor(connection: Connection, queryRunnerProvider?: QueryRunnerProvider);
    /**
     * Gets user data by a given key.
     * Used get stored data stored in a transactional entity manager.
     */
    getData(key: string): any;
    /**
     * Sets value for the given key in user data.
     * Used to store data in a transactional entity manager which can be accessed in subscribers then.
     */
    setData(key: string, value: any): this;
    /**
     * Checks if entity has an id.
     */
    hasId(entity: any): boolean;
    /**
     * Checks if entity of given schema name has an id.
     */
    hasId(target: Function | string, entity: any): boolean;
    /**
     * Gets entity mixed id.
     */
    getId(entity: any): any;
    /**
     * Gets entity mixed id.
     */
    getId(target: Function | string, entity: any): any;
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder<Entity>(entityClass: ObjectType<Entity> | Function | string, alias: string, queryRunnerProvider?: QueryRunnerProvider): QueryBuilder<Entity>;
    /**
     * Creates a new entity instance.
     */
    create<Entity>(entityClass: ObjectType<Entity>): Entity;
    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     * Note that it copies only properties that present in entity schema.
     */
    create<Entity>(entityClass: ObjectType<Entity> | string, plainObject: DeepPartial<Entity>): Entity;
    /**
     * Creates a new entities and copies all entity properties from given objects into their new entities.
     * Note that it copies only properties that present in entity schema.
     */
    create<Entity>(entityClass: ObjectType<Entity> | string, plainObjects: DeepPartial<Entity>[]): Entity[];
    /**
     * Merges two entities into one new entity.
     */
    merge<Entity>(entityClass: ObjectType<Entity> | string, mergeIntoEntity: Entity, ...entityLikes: DeepPartial<Entity>[]): Entity;
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     */
    preload<Entity>(entityClass: ObjectType<Entity> | string, entityLike: DeepPartial<Entity>): Promise<Entity | undefined>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    save<Entity>(entity: Entity, options?: SaveOptions): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    save<Entity>(targetOrEntity: Function | string, entity: Entity, options?: SaveOptions): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    save<Entity>(entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    save<Entity>(targetOrEntity: Function | string, entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     *
     * @deprecated
     */
    persist<Entity>(entity: Entity, options?: SaveOptions): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     *
     * @deprecated
     */
    persist<Entity>(targetOrEntity: Function, entity: Entity, options?: SaveOptions): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     *
     * @deprecated
     */
    persist<Entity>(targetOrEntity: string, entity: Entity, options?: SaveOptions): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     *
     * @deprecated
     */
    persist<Entity>(entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     *
     * @deprecated
     */
    persist<Entity>(targetOrEntity: Function, entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     *
     * @deprecated
     */
    persist<Entity>(targetOrEntity: string, entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     */
    update<Entity>(target: ObjectType<Entity> | string, conditions: Partial<Entity>, partialEntity: DeepPartial<Entity>, options?: SaveOptions): Promise<void>;
    /**
     * Updates entity partially. Entity can be found by a given find options.
     */
    update<Entity>(target: ObjectType<Entity> | string, findOptions: FindOneOptions<Entity>, partialEntity: DeepPartial<Entity>, options?: SaveOptions): Promise<void>;
    /**
     * Updates entity partially. Entity will be found by a given id.
     */
    updateById<Entity>(target: ObjectType<Entity> | string, id: any, partialEntity: DeepPartial<Entity>, options?: SaveOptions): Promise<void>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(entity: Entity): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: ObjectType<Entity> | string, entity: Entity, options?: RemoveOptions): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(entity: Entity[], options?: RemoveOptions): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: ObjectType<Entity> | string, entity: Entity[], options?: RemoveOptions): Promise<Entity[]>;
    /**
     * Removes entity by a given entity id.
     */
    removeById<Entity>(targetOrEntity: ObjectType<Entity> | string, id: any, options?: RemoveOptions): Promise<void>;
    /**
     * Counts entities that match given options.
     */
    count<Entity>(entityClass: ObjectType<Entity> | string, options?: FindManyOptions<Entity>): Promise<number>;
    /**
     * Counts entities that match given conditions.
     */
    count<Entity>(entityClass: ObjectType<Entity> | string, conditions?: Partial<Entity>): Promise<number>;
    /**
     * Finds entities that match given options.
     */
    find<Entity>(entityClass: ObjectType<Entity> | string, options?: FindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find<Entity>(entityClass: ObjectType<Entity> | string, conditions?: Partial<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    findAndCount<Entity>(entityClass: ObjectType<Entity> | string, options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    findAndCount<Entity>(entityClass: ObjectType<Entity> | string, conditions?: Partial<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities with ids.
     * Optionally find options can be applied.
     */
    findByIds<Entity>(entityClass: ObjectType<Entity> | string, ids: any[], options?: FindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities with ids.
     * Optionally conditions can be applied.
     */
    findByIds<Entity>(entityClass: ObjectType<Entity> | string, ids: any[], conditions?: Partial<Entity>): Promise<Entity[]>;
    /**
     * Finds first entity that matches given find options.
     */
    findOne<Entity>(entityClass: ObjectType<Entity> | string, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne<Entity>(entityClass: ObjectType<Entity> | string, conditions?: Partial<Entity>): Promise<Entity | undefined>;
    /**
     * Finds entity with given id.
     * Optionally find options can be applied.
     */
    findOneById<Entity>(entityClass: ObjectType<Entity> | string, id: any, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds entity with given id.
     * Optionally conditions can be applied.
     */
    findOneById<Entity>(entityClass: ObjectType<Entity> | string, id: any, conditions?: Partial<Entity>): Promise<Entity | undefined>;
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
     * Clears all the data from the given table (truncates/drops it).
     */
    clear<Entity>(entityClass: ObjectType<Entity> | string): Promise<void>;
    /**
     * Gets repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getRepository<Entity>(entityClassOrName: ObjectType<Entity> | string): Repository<Entity>;
    /**
     * Gets tree repository for the given entity class or name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     */
    getTreeRepository<Entity>(entityClassOrName: ObjectType<Entity> | string): TreeRepository<Entity>;
    /**
     * Gets mongodb repository for the given entity class.
     */
    getMongoRepository<Entity>(entityClass: ObjectType<Entity>): MongoRepository<Entity>;
    /**
     * Gets mongodb repository for the given entity name.
     */
    getMongoRepository<Entity>(entityName: string): MongoRepository<Entity>;
    /**
     * Gets specific repository for the given entity class.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     *
     * @deprecated Don't use specific repository - it will be refactored or removed
     */
    getSpecificRepository<Entity>(entityClass: ObjectType<Entity>): SpecificRepository<Entity>;
    /**
     * Gets specific repository for the given entity name.
     * If single database connection mode is used, then repository is obtained from the
     * repository aggregator, where each repository is individually created for this entity manager.
     * When single database connection is not used, repository is being obtained from the connection.
     *
     * @deprecated Don't use specific repository - it will be refactored or removed
     */
    getSpecificRepository<Entity>(entityName: string): SpecificRepository<Entity>;
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    getCustomRepository<T>(customRepository: ObjectType<T>): T;
    /**
     * Releases all resources used by entity manager.
     * This is used when entity manager is created with a single query runner,
     * and this single query runner needs to be released after job with entity manager is done.
     */
    release(): Promise<void>;
    /**
     * Performs a save operation for a single entity.
     */
    protected saveOne(target: Function | string, entity: any, options?: SaveOptions): Promise<void>;
    /**
     * Performs a remove operation for a single entity.
     */
    protected removeOne(target: Function | string, entity: any, options?: RemoveOptions): Promise<void>;
    /**
     * Gets, or if does not exist yet, creates and returns a repository aggregator for a particular entity target.
     */
    protected obtainRepositoryAggregator<Entity>(entityClassOrName: ObjectType<Entity> | string): RepositoryAggregator;
}
