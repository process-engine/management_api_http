'use strict'

const ProcessModelExecutionEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModelExecution;

const routerDiscoveryTag = require('@essential-projects/core_contracts').RouterDiscoveryTag;

function registerInContainer(container) {
  container.register('ManagementApiProcessModelExecutionRouter', ProcessModelExecutionEndpoint.ProcessModelExecutionRouter)
    .dependencies('ManagementApiProcessModelExecutionController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiProcessModelExecutionController', ProcessModelExecutionEndpoint.ProcessModelExecutionController)
    .dependencies('ManagementApiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
