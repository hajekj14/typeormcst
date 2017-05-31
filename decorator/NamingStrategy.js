"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
/**
 * Decorator registers a new naming strategy to be used in naming things.
 *
 * todo: deprecate using naming strategies this way. use it without decorators
 * todo: but add multiple default naming strategies for use
 */
function NamingStrategy(name) {
    return function (target) {
        var strategyName = name ? name : target.name;
        var args = {
            target: target,
            name: strategyName
        };
        index_1.getMetadataArgsStorage().namingStrategies.add(args);
    };
}
exports.NamingStrategy = NamingStrategy;

//# sourceMappingURL=NamingStrategy.js.map
