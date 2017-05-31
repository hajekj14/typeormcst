"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Contains all information about entity's embedded property.
 */
var EmbeddedMetadata = (function () {
    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------
    function EmbeddedMetadata(table, columns, embeddeds, args) {
        var _this = this;
        this.type = args.type ? args.type() : undefined;
        this.propertyName = args.propertyName;
        this.isArray = args.isArray;
        this.customPrefix = args.prefix;
        this.table = table;
        this.columns = columns;
        this.embeddeds = embeddeds;
        this.embeddeds.forEach(function (embedded) {
            embedded.parentEmbeddedMetadata = _this;
        });
        this.columns.forEach(function (column) {
            column.embeddedMetadata = _this;
        });
    }
    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------
    /**
     * Creates a new embedded object.
     */
    EmbeddedMetadata.prototype.create = function () {
        if (!this.type)
            throw new Error("Embedded cannot be created because it does not have a type set.");
        return new this.type;
    };
    Object.defineProperty(EmbeddedMetadata.prototype, "prefix", {
        /**
         * Gets the prefix of the columns.
         * By default its a property name of the class where this prefix is.
         * But if custom prefix is set then it takes its value as a prefix.
         * However if custom prefix is set to empty string prefix to column is not applied at all.
         */
        get: function () {
            if (this.customPrefix !== undefined)
                return this.customPrefix;
            return this.propertyName;
        },
        enumerable: true,
        configurable: true
    });
    return EmbeddedMetadata;
}());
exports.EmbeddedMetadata = EmbeddedMetadata;

//# sourceMappingURL=EmbeddedMetadata.js.map
