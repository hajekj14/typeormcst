import { RelationIdAttribute } from "./RelationIdAttribute";
import { Connection } from "../../connection/Connection";
import { QueryRunnerProvider } from "../../query-runner/QueryRunnerProvider";
import { RelationIdLoadResult } from "./RelationIdLoadResult";
export declare class RelationIdLoader {
    protected connection: Connection;
    protected queryRunnerProvider: QueryRunnerProvider | undefined;
    protected relationIdAttributes: RelationIdAttribute[];
    constructor(connection: Connection, queryRunnerProvider: QueryRunnerProvider | undefined, relationIdAttributes: RelationIdAttribute[]);
    load(rawEntities: any[]): Promise<RelationIdLoadResult[]>;
}
