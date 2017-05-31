import { EntityMetadata } from "./EntityMetadata";
import { TableMetadata } from "./TableMetadata";
import { ColumnMetadata } from "./ColumnMetadata";
import { EmbeddedMetadataArgs } from "../metadata-args/EmbeddedMetadataArgs";
/**
 * Contains all information about entity's embedded property.
 */
export declare class EmbeddedMetadata {
    /**
     * Its own entity metadata.
     */
    entityMetadata: EntityMetadata;
    /**
     * Parent embedded in the case if this embedded inside other embedded.
     */
    parentEmbeddedMetadata: EmbeddedMetadata;
    /**
     * Property name on which this embedded is attached.
     */
    readonly propertyName: string;
    /**
     * Embeddable table.
     */
    readonly table: TableMetadata;
    /**
     * Embeddable table's columns.
     */
    readonly columns: ColumnMetadata[];
    /**
     * Nested embeddable in this embeddable.
     */
    readonly embeddeds: EmbeddedMetadata[];
    /**
     * Embedded type.
     */
    readonly type?: Function;
    /**
     * Indicates if this embedded is in array mode.
     */
    readonly isArray: boolean;
    /**
     * Prefix of the embedded, used instead of propertyName.
     * If set to empty string, then prefix is not set at all.
     */
    readonly customPrefix: string | undefined;
    constructor(table: TableMetadata, columns: ColumnMetadata[], embeddeds: EmbeddedMetadata[], args: EmbeddedMetadataArgs);
    /**
     * Creates a new embedded object.
     */
    create(): any;
    /**
     * Gets the prefix of the columns.
     * By default its a property name of the class where this prefix is.
     * But if custom prefix is set then it takes its value as a prefix.
     * However if custom prefix is set to empty string prefix to column is not applied at all.
     */
    readonly prefix: string;
}
