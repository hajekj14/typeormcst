import { Driver } from "../Driver";
import { DriverOptions } from "../DriverOptions";
import { Logger } from "../../logger/Logger";
import { QueryRunner } from "../../query-runner/QueryRunner";
import { MongoQueryRunner } from "./MongoQueryRunner";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { NamingStrategyInterface } from "../../naming-strategy/NamingStrategyInterface";
import { EntityMetadata } from "../../metadata/EntityMetadata";
/**
 * Organizes communication with MongoDB.
 */
export declare class MongoDriver implements Driver {
    /**
     * Naming strategy used in the connection where this driver is used.
     */
    namingStrategy: NamingStrategyInterface;
    /**
     * Mongodb does not require to dynamically create query runner each time,
     * because it does not have a regular pool.
     */
    queryRunner: MongoQueryRunner;
    /**
     * Driver connection options.
     */
    readonly options: DriverOptions;
    /**
     * Underlying mongodb driver.
     */
    protected mongodb: any;
    /**
     * Connection to mongodb database provided by native driver.
     */
    protected pool: any;
    /**
     * Logger used to log queries and errors.
     */
    protected logger: Logger;
    constructor(options: DriverOptions, logger: Logger, mongodb?: any);
    /**
     * Performs connection to the database.
     */
    connect(): Promise<void>;
    /**
     * Closes connection with the database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a query runner used for common queries.
     */
    createQueryRunner(): Promise<QueryRunner>;
    /**
     * Access to the native implementation of the database.
     */
    nativeInterface(): {
        driver: any;
        connection: any;
    };
    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral): [string, any[]];
    /**
     * Escapes a column name.
     */
    escapeColumnName(columnName: string): string;
    /**
     * Escapes an alias.
     */
    escapeAliasName(aliasName: string): string;
    /**
     * Escapes a table name.
     */
    escapeTableName(tableName: string): string;
    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any;
    syncSchema(entityMetadatas: EntityMetadata[]): Promise<void>;
    /**
     * Validate driver options to make sure everything is correct and driver will be able to establish connection.
     */
    protected validateOptions(options: DriverOptions): void;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): any;
    /**
     * Builds connection url that is passed to underlying driver to perform connection to the mongodb database.
     */
    protected buildConnectionUrl(): string;
}
