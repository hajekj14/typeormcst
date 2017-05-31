import { Connection } from "../connection/Connection";
import { FindManyOptions } from "../find-options/FindManyOptions";
import { ObjectType } from "../common/ObjectType";
import { BaseEntityManager } from "./BaseEntityManager";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { FindOneOptions } from "../find-options/FindOneOptions";
import { DeepPartial } from "../common/DeepPartial";
import { RemoveOptions } from "../repository/RemoveOptions";
import { PersistOptions } from "../repository/PersistOptions";
/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
export declare class EntityManager extends BaseEntityManager {
    /**
     * Stores temporarily user data.
     * Useful for sharing data with subscribers.
     */
    private data;
    constructor(connection: Connection, queryRunnerProvider?: QueryRunnerProvider);
    /**
     * Gets user data by a given key.
     */
    getData(key: string): any;
    /**
     * Sets value for the given key in user data.
     */
    setData(key: string, value: any): void;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(entity: Entity, options?: PersistOptions): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(targetOrEntity: Function, entity: Entity, options?: PersistOptions): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(targetOrEntity: string, entity: Entity, options?: PersistOptions): Promise<Entity>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(entities: Entity[], options?: PersistOptions): Promise<Entity[]>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(targetOrEntity: Function, entities: Entity[], options?: PersistOptions): Promise<Entity[]>;
    /**
     * Persists (saves) all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    persist<Entity>(targetOrEntity: string, entities: Entity[], options?: PersistOptions): Promise<Entity[]>;
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     */
    update<Entity>(target: Function | string, conditions: Partial<Entity>, partialEntity: DeepPartial<Entity>, options?: PersistOptions): Promise<void>;
    /**
     * Updates entity partially. Entity can be found by a given find options.
     */
    update<Entity>(target: Function | string, findOptions: FindOneOptions<Entity>, partialEntity: DeepPartial<Entity>, options?: PersistOptions): Promise<void>;
    /**
     * Updates entity partially. Entity will be found by a given id.
     */
    updateById<Entity>(target: Function | string, id: any, partialEntity: DeepPartial<Entity>, options?: PersistOptions): Promise<void>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(entity: Entity): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: Function, entity: Entity, options?: RemoveOptions): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: string, entity: Entity, options?: RemoveOptions): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(entity: Entity[], options?: RemoveOptions): Promise<Entity>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: Function, entity: Entity[], options?: RemoveOptions): Promise<Entity[]>;
    /**
     * Removes a given entity from the database.
     */
    remove<Entity>(targetOrEntity: string, entity: Entity[], options?: RemoveOptions): Promise<Entity[]>;
    /**
     * Removes entity by a given entity id.
     */
    removeById(targetOrEntity: Function | string, id: any, options?: RemoveOptions): Promise<void>;
    /**
     * Counts entities that match given options.
     */
    count<Entity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<number>;
    /**
     * Counts entities that match given conditions.
     */
    count<Entity>(entityClass: ObjectType<Entity>, conditions?: Partial<Entity>): Promise<number>;
    /**
     * Finds entities that match given options.
     */
    find<Entity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find<Entity>(entityClass: ObjectType<Entity>, conditions?: Partial<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    findAndCount<Entity>(entityClass: ObjectType<Entity>, options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    findAndCount<Entity>(entityClass: ObjectType<Entity>, conditions?: Partial<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds first entity that matches given find options.
     */
    findOne<Entity>(entityClass: ObjectType<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne<Entity>(entityClass: ObjectType<Entity>, conditions?: Partial<Entity>): Promise<Entity | undefined>;
    /**
     * Finds entities with ids.
     * Optionally find options can be applied.
     */
    findByIds<Entity>(entityClass: ObjectType<Entity>, ids: any[], options?: FindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities with ids.
     * Optionally conditions can be applied.
     */
    findByIds<Entity>(entityClass: ObjectType<Entity>, ids: any[], conditions?: Partial<Entity>): Promise<Entity[]>;
    /**
     * Finds entity with given id.
     * Optionally find options can be applied.
     */
    findOneById<Entity>(entityClass: ObjectType<Entity>, id: any, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds entity with given id.
     * Optionally conditions can be applied.
     */
    findOneById<Entity>(entityClass: ObjectType<Entity>, id: any, conditions?: Partial<Entity>): Promise<Entity | undefined>;
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
    clear<Entity>(entityClass: ObjectType<Entity>): Promise<void>;
}
