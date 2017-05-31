"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RepositoryFactory_1 = require("./RepositoryFactory");
var container_1 = require("../container");
/**
 * Aggregates all repositories of the specific metadata.
 */
var RepositoryAggregator = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function RepositoryAggregator(connection, metadata, queryRunnerProvider) {
        this.metadata = metadata;
        var factory = container_1.getFromContainer(RepositoryFactory_1.RepositoryFactory);
        if (metadata.table.isClosure) {
            this.repository = this.treeRepository = factory.createTreeRepository(connection, metadata, queryRunnerProvider);
        }
        else {
            this.repository = factory.createRepository(connection, metadata, queryRunnerProvider);
        }
        this.specificRepository = factory.createSpecificRepository(connection, metadata, queryRunnerProvider);
    }
    return RepositoryAggregator;
}());
exports.RepositoryAggregator = RepositoryAggregator;

//# sourceMappingURL=RepositoryAggregator.js.map
