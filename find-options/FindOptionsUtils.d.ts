import { FindManyOptions } from "./FindManyOptions";
import { QueryBuilder } from "../query-builder/QueryBuilder";
import { FindOneOptions } from "./FindOneOptions";
import { ObjectLiteral } from "../common/ObjectLiteral";
/**
 * Utilities to work with FindOptions.
 */
export declare class FindOptionsUtils {
    /**
     * Checks if given object is really instance of FindOneOptions interface.
     */
    static isFindOneOptions(object: any): object is FindOneOptions<any>;
    /**
     * Checks if given object is really instance of FindManyOptions interface.
     */
    static isFindManyOptions(object: any): object is FindManyOptions<any>;
    /**
     * Checks if given object is really instance of FindOptions interface.
     */
    static extractFindOneOptionsAlias(object: any): string | undefined;
    /**
     * Checks if given object is really instance of FindOptions interface.
     */
    static extractFindManyOptionsAlias(object: any): string | undefined;
    /**
     * Applies give find one options to the given query builder.
     */
    static applyFindOneOptionsOrConditionsToQueryBuilder<T>(qb: QueryBuilder<T>, options: FindOneOptions<T> | Partial<T> | undefined): QueryBuilder<T>;
    /**
     * Applies give find many options to the given query builder.
     */
    static applyFindManyOptionsOrConditionsToQueryBuilder<T>(qb: QueryBuilder<T>, options: FindManyOptions<T> | Partial<T> | undefined): QueryBuilder<T>;
    /**
     * Applies give find options to the given query builder.
     */
    static applyOptionsToQueryBuilder<T>(qb: QueryBuilder<T>, options: FindOneOptions<T> | FindManyOptions<T> | undefined): QueryBuilder<T>;
    /**
     * Applies given simple conditions set to a given query builder.
     */
    static applyConditions<T>(qb: QueryBuilder<T>, conditions: ObjectLiteral): QueryBuilder<T>;
}
