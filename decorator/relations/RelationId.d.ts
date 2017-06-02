import { QueryBuilder } from "../../query-builder/QueryBuilder";
/**
 * Special decorator used to extract relation id into separate entity property.
 */
export declare function RelationId<T>(relation: string | ((object: T) => any), alias?: string, queryBuilderFactory?: (qb: QueryBuilder<any>) => QueryBuilder<any>): Function;
