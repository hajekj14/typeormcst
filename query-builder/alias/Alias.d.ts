import { EntityMetadata } from "../../metadata/EntityMetadata";
/**
 */
export declare class Alias {
    isMain: boolean;
    name: string;
    metadata: EntityMetadata;
    parentPropertyName: string;
    parentAliasName: string;
    constructor(name: string);
    readonly selection: string;
    readonly target: Function | string;
}
