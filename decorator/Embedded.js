"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
/**
 * Property in entity can be marked as Embedded, and on persist all columns from the embedded are mapped to the
 * single table of the entity where Embedded is used. And on hydration all columns which supposed to be in the
 * embedded will be mapped to it from the single table.
 *
 * Array option works only in monogodb.
 */
function Embedded(typeFunction, options) {
    return function (object, propertyName) {
        var reflectMetadataType = Reflect && Reflect.getMetadata ? Reflect.getMetadata("design:type", object, propertyName) : undefined;
        var isArray = reflectMetadataType === Array || (options && options.array === true) ? true : false;
        var args = {
            target: object.constructor,
            propertyName: propertyName,
            isArray: isArray,
            prefix: options && options.prefix !== undefined ? options.prefix : undefined,
            type: typeFunction
        };
        index_1.getMetadataArgsStorage().embeddeds.push(args);
    };
}
exports.Embedded = Embedded;

//# sourceMappingURL=Embedded.js.map
