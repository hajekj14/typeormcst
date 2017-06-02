import { EntityMetadata } from "../metadata/EntityMetadata";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { QueryRunner } from "../query-runner/QueryRunner";
import { Connection } from "../connection/Connection";
import { JoinOptions } from "./JoinOptions";
import { QueryRunnerProvider } from "../query-runner/QueryRunnerProvider";
import { QueryExpressionMap } from "./QueryExpressionMap";
import { SelectQuery } from "./SelectQuery";
import { RelationIdLoadResult } from "./relation-id/RelationIdLoadResult";
import { RelationCountLoadResult } from "./relation-count/RelationCountLoadResult";
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
export declare class QueryBuilder<Entity> {
    protected connection: Connection;
    protected queryRunnerProvider: QueryRunnerProvider;
    /**
     * Contains all properties of the QueryBuilder that needs to be build a final query.
     */
    protected expressionMap: QueryExpressionMap;
    constructor(connection: Connection, queryRunnerProvider?: QueryRunnerProvider);
    /**
     * Gets the main alias string used in this query builder.
     */
    readonly alias: string;
    /**
     * Creates SELECT query.
     * Replaces all previous selections if they exist.
     */
    select(): this;
    /**
     * Creates SELECT query and selects given data.
     * Replaces all previous selections if they exist.
     */
    select(selection: string, selectionAliasName?: string): this;
    /**
     * Creates SELECT query and selects given data.
     * Replaces all previous selections if they exist.
     */
    select(selection: string[]): this;
    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(selection: string, selectionAliasName?: string): this;
    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(selection: string[]): this;
    /**
     * Creates UPDATE query and applies given update values.
     */
    update(updateSet: ObjectLiteral): this;
    /**
     * Creates UPDATE query for the given entity and applies given update values.
     */
    update(entity: Function | string, updateSet: ObjectLiteral): this;
    /**
     * Creates UPDATE query for the given table name and applies given update values.
     */
    update(tableName: string, updateSet: ObjectLiteral): this;
    /**
     * Creates DELETE query.
     */
    delete(): this;
    /**
     * Specifies FROM which entity's table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    from(entityTarget: Function | string, aliasName: string): this;
    /**
     * Specifies FROM which table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    fromTable(tableName: string, aliasName: string): this;
    /**
     * INNER JOINs (without selection) entity's property.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(property: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * INNER JOINs (without selection) given entity's table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(entity: Function | string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * INNER JOINs (without selection) given table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(tableName: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs (without selection) entity's property.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(property: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs (without selection) entity's table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(entity: Function | string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs (without selection) given table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(tableName: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * INNER JOINs entity's property and adds all selection properties to SELECT.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(property: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * INNER JOINs entity and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(entity: Function | string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * INNER JOINs table and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(tableName: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs entity's property and adds all selection properties to SELECT.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(property: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs entity and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(entity: Function | string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs table and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(tableName: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * INNER JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, property: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * INNER JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, entity: Function | string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * INNER JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, tableName: string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * INNER JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, property: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * INNER JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, entity: Function | string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * INNER JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, tableName: string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, property: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, entity: Function | string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, tableName: string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, property: string, aliasName: string, condition?: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, entity: Function | string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, tableName: string, aliasName: string, condition: string, options?: JoinOptions): this;
    /**
     * LEFT JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    loadRelationIdAndMap(mapToProperty: string, relationName: string): this;
    /**
     * LEFT JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    loadRelationIdAndMap(mapToProperty: string, relationName: string, options: {
        disableMixedMap: boolean;
    }): this;
    /**
     * LEFT JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    loadRelationIdAndMap(mapToProperty: string, relationName: string, aliasName: string, queryBuilderFactory: (qb: QueryBuilder<any>) => QueryBuilder<any>): this;
    /**
     * Counts number of entities of entity's relation and maps the value into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    loadRelationCountAndMap(mapToProperty: string, relationName: string, aliasName?: string, queryBuilderFactory?: (qb: QueryBuilder<any>) => QueryBuilder<any>): this;
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    where(where: string, parameters?: ObjectLiteral): this;
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andWhere(where: string, parameters?: ObjectLiteral): this;
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orWhere(where: string, parameters?: ObjectLiteral): this;
    /**
     * Sets HAVING condition in the query builder.
     * If you had previously HAVING expression defined,
     * calling this function will override previously set HAVING conditions.
     * Additionally you can add parameters used in where expression.
     */
    having(having: string, parameters?: ObjectLiteral): this;
    /**
     * Adds new AND HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andHaving(having: string, parameters?: ObjectLiteral): this;
    /**
     * Adds new OR HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orHaving(having: string, parameters?: ObjectLiteral): this;
    /**
     * Sets GROUP BY condition in the query builder.
     * If you had previously GROUP BY expression defined,
     * calling this function will override previously set GROUP BY conditions.
     */
    groupBy(groupBy: string): this;
    /**
     * Adds GROUP BY condition in the query builder.
     */
    addGroupBy(groupBy: string): this;
    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    orderBy(sort: string, order?: "ASC" | "DESC"): this;
    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    orderBy(sort: undefined): this;
    /**
     * Adds ORDER BY condition in the query builder.
     */
    addOrderBy(sort: string, order?: "ASC" | "DESC"): this;
    /**
     * Set's LIMIT - maximum number of rows to be selected.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead take method instead.
     */
    setLimit(limit?: number): this;
    /**
     * Set's OFFSET - selection offset.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead skip method instead.
     */
    setOffset(offset?: number): this;
    /**
     * Sets maximal number of entities to take.
     */
    take(take?: number): this;
    /**
     * Sets number of entities to skip.
     */
    skip(skip?: number): this;
    /**
     * Sets maximal number of entities to take.
     *
     * @deprecated use take method instead
     */
    setMaxResults(take?: number): this;
    /**
     * Sets number of entities to skip.
     *
     * @deprecated use skip method instead
     */
    setFirstResult(skip?: number): this;
    /**
     * Sets locking mode.
     */
    setLock(lockMode: "optimistic", lockVersion: number): this;
    /**
     * Sets locking mode.
     */
    setLock(lockMode: "optimistic", lockVersion: Date): this;
    /**
     * Sets locking mode.
     */
    setLock(lockMode: "pessimistic_read" | "pessimistic_write"): this;
    /**
     * Sets given parameter's value.
     */
    setParameter(key: string, value: any): this;
    /**
     * Adds all parameters from the given object.
     */
    setParameters(parameters: ObjectLiteral): this;
    /**
     * Gets all parameters.
     */
    getParameters(): ObjectLiteral;
    /**
     * Gets generated sql that will be executed.
     * Parameters in the query are escaped for the currently used driver.
     */
    getSql(): string;
    /**
     * Gets generated sql without parameters being replaced.
     */
    getGeneratedQuery(): string;
    /**
     * Gets sql to be executed with all parameters used in it.
     */
    getSqlWithParameters(options?: {
        skipOrderBy?: boolean;
    }): [string, any[]];
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    execute(): Promise<any>;
    /**
     * Executes sql generated by query builder and returns object with raw results and entities created from them.
     */
    getEntitiesAndRawResults(): Promise<{
        entities: Entity[];
        rawResults: any[];
    }>;
    /**
     * Gets count - number of entities selected by sql generated by this query builder.
     * Count excludes all limitations set by setFirstResult and setMaxResults methods call.
     */
    getCount(): Promise<number>;
    /**
     * Gets all raw results returned by execution of generated query builder sql.
     */
    getRawMany(): Promise<any[]>;
    /**
     * Gets first raw result returned by execution of generated query builder sql.
     */
    getRawOne(): Promise<any>;
    /**
     * Gets entities and count returned by execution of generated query builder sql.
     */
    getManyAndCount(): Promise<[Entity[], number]>;
    /**
     * Gets entities returned by execution of generated query builder sql.
     */
    getMany(): Promise<Entity[]>;
    /**
     * Gets single entity returned by execution of generated query builder sql.
     */
    getOne(): Promise<Entity | undefined>;
    /**
     * Clones query builder as it is.
     */
    clone(options?: {
        queryRunnerProvider?: QueryRunnerProvider;
    }): QueryBuilder<Entity>;
    /**
     * Disables escaping.
     */
    disableEscaping(): this;
    /**
     * Escapes alias name using current database's escaping character.
     */
    escapeAlias(name: string): string;
    /**
     * Escapes column name using current database's escaping character.
     */
    escapeColumn(name: string): string;
    /**
     * Escapes table name using current database's escaping character.
     */
    escapeTable(name: string): string;
    /**
     * Enables special query builder options.
     *
     * @deprecated looks like enableRelationIdValues is not used anymore. What to do? Remove this method? What about persistence?
     */
    enableAutoRelationIdsLoad(): this;
    /**
     * Adds new AND WHERE with conditions for the given ids.
     *
     * @experimental Maybe this method should be moved to repository?
     * @deprecated
     */
    andWhereInIds(ids: any[]): this;
    /**
     * Adds new OR WHERE with conditions for the given ids.
     *
     * @experimental Maybe this method should be moved to repository?
     * @deprecated
     */
    orWhereInIds(ids: any[]): this;
    protected join(direction: "INNER" | "LEFT", entityOrProperty: Function | string, aliasName: string, condition?: string, options?: JoinOptions, mapToProperty?: string, isMappingMany?: boolean): void;
    protected rawResultsToEntities(results: any[], rawRelationIdResults: RelationIdLoadResult[], rawRelationCountResults: RelationCountLoadResult[]): any[];
    protected buildEscapedEntityColumnSelects(aliasName: string, metadata: EntityMetadata): SelectQuery[];
    protected findEntityColumnSelects(aliasName: string, metadata: EntityMetadata): SelectQuery[];
    protected createSelectExpression(): string;
    protected createHavingExpression(): string;
    protected createWhereExpression(): string;
    /**
     * Replaces all entity's propertyName to name in the given statement.
     */
    protected replacePropertyNames(statement: string): string;
    protected createJoinExpression(): string;
    protected createGroupByExpression(): string;
    protected createOrderByCombinedWithSelectExpression(parentAlias: string): string[];
    protected createOrderByExpression(): string;
    protected createLimitExpression(): string;
    protected createOffsetExpression(): string;
    protected createLockExpression(): string;
    /**
     * Creates "WHERE" expression and variables for the given "ids".
     */
    protected createWhereIdsExpression(ids: any[]): [string, ObjectLiteral];
    protected getQueryRunner(): Promise<QueryRunner>;
    protected hasOwnQueryRunner(): boolean;
}
