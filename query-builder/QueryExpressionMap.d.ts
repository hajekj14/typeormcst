import { Alias } from "./Alias";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { OrderByCondition } from "../find-options/OrderByCondition";
import { JoinAttribute } from "./JoinAttribute";
import { RelationIdAttribute } from "./relation-id/RelationIdAttribute";
import { RelationCountAttribute } from "./relation-count/RelationCountAttribute";
import { Connection } from "../connection/Connection";
import { EntityMetadata } from "../metadata/EntityMetadata";
import { SelectQuery } from "./SelectQuery";
/**
 * Contains all properties of the QueryBuilder that needs to be build a final query.
 */
export declare class QueryExpressionMap {
    protected connection: Connection;
    /**
     * Main alias is a main selection object selected by QueryBuilder.
     */
    mainAlias?: Alias;
    /**
     * All aliases (including main alias) used in the query.
     */
    aliases: Alias[];
    /**
     * Represents query type. QueryBuilder is able to build SELECT, UPDATE and DELETE queries.
     */
    queryType: "select" | "update" | "delete";
    /**
     * Data needs to be SELECT-ed.
     */
    selects: SelectQuery[];
    /**
     * If update query was used, it needs "update set" - properties which will be updated by this query.
     */
    updateSet?: ObjectLiteral;
    /**
     * JOIN queries.
     */
    joinAttributes: JoinAttribute[];
    /**
     * RelationId queries.
     */
    relationIdAttributes: RelationIdAttribute[];
    /**
     * Relation count queries.
     */
    relationCountAttributes: RelationCountAttribute[];
    /**
     * WHERE queries.
     */
    wheres: {
        type: "simple" | "and" | "or";
        condition: string;
    }[];
    /**
     * HAVING queries.
     */
    havings: {
        type: "simple" | "and" | "or";
        condition: string;
    }[];
    /**
     * ORDER BY queries.
     */
    orderBys: OrderByCondition;
    /**
     * GROUP BY queries.
     */
    groupBys: string[];
    /**
     * LIMIT query.
     */
    limit?: number;
    /**
     * OFFSET query.
     */
    offset?: number;
    /**
     * Number of rows to skip of result using pagination.
     */
    skip?: number;
    /**
     * Number of rows to take using pagination.
     */
    take?: number;
    /**
     * Locking mode.
     */
    lockMode?: "optimistic" | "pessimistic_read" | "pessimistic_write";
    /**
     * Current version of the entity, used for locking.
     */
    lockVersion?: number | Date;
    /**
     * Parameters used to be escaped in final query.
     */
    parameters: ObjectLiteral;
    /**
     * Indicates if alias, table names and column names will be ecaped by driver, or not.
     *
     * todo: rename to isQuotingDisabled, also think if it should be named "escaping"
     */
    disableEscaping: boolean;
    /**
     * todo: needs more information.
     */
    ignoreParentTablesJoins: boolean;
    /**
     * Indicates if virtual columns should be included in entity result.
     *
     * todo: what to do with it? is it properly used? what about persistence?
     */
    enableRelationIdValues: boolean;
    /**
     * Extra where condition appended to the end of original where conditions with AND keyword.
     * Original condition will be wrapped into brackets.
     */
    extraAppendedAndWhereCondition: string;
    constructor(connection: Connection);
    /**
     * Creates a main alias and adds it to the current expression map.
     */
    createMainAlias(options: {
        name: string;
    }): Alias;
    /**
     * Creates a main alias and adds it to the current expression map.
     */
    createMainAlias(options: {
        name: string;
        metadata: EntityMetadata;
    }): Alias;
    /**
     * Creates a main alias and adds it to the current expression map.
     */
    createMainAlias(options: {
        name?: string;
        target: Function | string;
    }): Alias;
    /**
     * Creates a main alias and adds it to the current expression map.
     */
    createMainAlias(options: {
        name?: string;
        tableName: string;
    }): Alias;
    /**
     * Creates a new alias and adds it to the current expression map.
     */
    createAlias(options: {
        name: string;
    }): Alias;
    /**
     * Creates a new alias and adds it to the current expression map.
     */
    createAlias(options: {
        name: string;
        metadata: EntityMetadata;
    }): Alias;
    /**
     * Creates a new alias and adds it to the current expression map.
     */
    createAlias(options: {
        name?: string;
        target: Function | string;
    }): Alias;
    /**
     * Creates a new alias and adds it to the current expression map.
     */
    createAlias(options: {
        name?: string;
        tableName: string;
    }): Alias;
    /**
     * Finds alias with the given name.
     * If alias was not found it throw an exception.
     */
    findAliasByName(aliasName: string): Alias;
    /**
     * Copies all properties of the current QueryExpressionMap into a new one.
     * Useful when QueryBuilder needs to create a copy of itself.
     */
    clone(): QueryExpressionMap;
}
