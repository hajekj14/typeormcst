"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a class with constants - list of all possible table types.
 *
 * todo: remove if only regular table will left here
 */
var TableTypes = (function () {
    function TableTypes() {
    }
    return TableTypes;
}());
/**
 * All non-specific tables are just regular tables. Its a default table type.
 */
TableTypes.REGULAR = "regular";
/**
 * This type is for the tables that does not exist in the database,
 * but provide columns and relations for the tables of the child classes who inherit them.
 *
 * @deprecated
 */
TableTypes.ABSTRACT = "abstract";
/**
 * Junction table is a table automatically created by many-to-many relationship.
 *
 * todo: remove and isJunction condition is enough in entity metadata?
 */
TableTypes.JUNCTION = "junction";
/**
 * Closure table is one of the tree-specific tables that supports closure database pattern.
 *
 * todo: maybe we can determine if it is closure if it has some closure-specific decorator?
 * todo: or if its not possible then maybe create a separate decorator for closure?
 */
TableTypes.CLOSURE = "closure";
/**
 * This type is for tables that contain junction metadata of the closure tables.
 *
 * todo: remove and isClosureJunction condition is enough in entity metadata?
 */
TableTypes.CLOSURE_JUNCTION = "closure-junction";
/**
 * Embeddable tables are not stored in the database as separate tables.
 * Instead their columns are embed into tables who owns them.
 *
 * @deprecated
 */
TableTypes.EMBEDDABLE = "embeddable";
/**
 * Special table type for tables that are mapped into single table using Single Table Inheritance pattern.
 *
 * todo: create separate decorators?
 */
TableTypes.SINGLE_TABLE_CHILD = "single-table-child";
/**
 * Special table type for tables that are mapped into multiple tables using Class Table Inheritance pattern.
 *
 * todo: create separate decorators?
 */
TableTypes.CLASS_TABLE_CHILD = "class-table-child";
exports.TableTypes = TableTypes;

//# sourceMappingURL=TableTypes.js.map
