"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents entity of the migration in the database.
 */
var Migration = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function Migration(timestamp, name, instance) {
        this.timestamp = timestamp;
        this.name = name;
        this.instance = instance;
    }
    return Migration;
}());
exports.Migration = Migration;

//# sourceMappingURL=Migration.js.map
