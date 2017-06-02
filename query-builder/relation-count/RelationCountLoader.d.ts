import { Connection } from "../../connection/Connection";
import { QueryRunnerProvider } from "../../query-runner/QueryRunnerProvider";
import { RelationCountAttribute } from "./RelationCountAttribute";
import { RelationCountLoadResult } from "./RelationCountLoadResult";
export declare class RelationCountLoader {
    protected connection: Connection;
    protected queryRunnerProvider: QueryRunnerProvider | undefined;
    protected relationCountAttributes: RelationCountAttribute[];
    constructor(connection: Connection, queryRunnerProvider: QueryRunnerProvider | undefined, relationCountAttributes: RelationCountAttribute[]);
    load(rawEntities: any[]): Promise<RelationCountLoadResult[]>;
}
