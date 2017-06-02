import { EntityMetadata } from "../../metadata/EntityMetadata";
import { RelationMetadata } from "../../metadata/RelationMetadata";
import { QueryExpressionMap } from "../QueryExpressionMap";
import { QueryBuilder } from "../QueryBuilder";
export declare class RelationCountAttribute {
    private expressionMap;
    private relationCountAttribute;
    /**
     * Alias of the joined (destination) table.
     */
    alias?: string;
    /**
     * Name of relation.
     */
    relationName: string;
    /**
     * Property + alias of the object where to joined data should be mapped.
     */
    mapToProperty: string;
    /**
     * Extra condition applied to "ON" section of join.
     */
    queryBuilderFactory?: (qb: QueryBuilder<any>) => QueryBuilder<any>;
    constructor(expressionMap: QueryExpressionMap, relationCountAttribute?: Partial<RelationCountAttribute>);
    readonly joinInverseSideMetadata: EntityMetadata;
    /**
     * Alias of the parent of this join.
     * For example, if we join ("post.category", "categoryAlias") then "post" is a parent alias.
     * This value is extracted from entityOrProperty value.
     * This is available when join was made using "post.category" syntax.
     */
    readonly parentAlias: string;
    /**
     * Relation property name of the parent.
     * This is used to understand what is joined.
     * For example, if we join ("post.category", "categoryAlias") then "category" is a relation property.
     * This value is extracted from entityOrProperty value.
     * This is available when join was made using "post.category" syntax.
     */
    readonly relationProperty: string | undefined;
    readonly junctionAlias: string;
    /**
     * Relation of the parent.
     * This is used to understand what is joined.
     * This is available when join was made using "post.category" syntax.
     */
    readonly relation: RelationMetadata;
    /**
     * Metadata of the joined entity.
     * If table without entity was joined, then it will return undefined.
     */
    readonly metadata: EntityMetadata;
    readonly mapToPropertyPropertyName: string;
}
