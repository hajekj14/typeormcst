import { QueryBuilder } from "../../query-builder/QueryBuilder";
/**
 * Holds a number of children in the closure table of the column.
 */
export declare function RelationCount<T>(relation: string | ((object: T) => any), alias?: string, queryBuilderFactory?: (qb: QueryBuilder<any>) => QueryBuilder<any>): Function;
