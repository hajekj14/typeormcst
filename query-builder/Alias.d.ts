import { EntityMetadata } from "../metadata/EntityMetadata";
/**
 */
export declare class Alias {
    name: string;
    /**
     * Table on which this alias is applied.
     * Used only for aliases which select custom tables.
     */
    tableName?: string;
    constructor(alias?: Alias);
    private _metadata?;
    readonly target: Function | string;
    readonly hasMetadata: boolean;
    metadata: EntityMetadata;
}
