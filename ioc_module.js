'use strict'

const CorrelationEndpoint = require('./dist/commonjs/index').Endpoints.Correlation;
const ProcessModelExecutionEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModelExecution;
const UserTasksEndpoint = require('./dist/commonjs/index').Endpoints.UserTasks;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {

  container.register('CorrelationRouter', CorrelationEndpoint.CorrelationRouter)
    .dependencies('CorrelationController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('CorrelationController', CorrelationEndpoint.CorrelationController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiProcessModelExecutionRouter', ProcessModelExecutionEndpoint.ProcessModelExecutionRouter)
    .dependencies('ManagementApiProcessModelExecutionController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiProcessModelExecutionController', ProcessModelExecutionEndpoint.ProcessModelExecutionController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiUserTaskRouter', UserTasksEndpoint.UserTaskRouter)
    .dependencies('ManagementApiUserTaskController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiUserTaskController', UserTasksEndpoint.UserTaskController)
    .dependencies('ManagementApiService')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
