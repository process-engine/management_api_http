'use strict'

const ProcessModelExecutionEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModelExecution;
const UserTasksEndpoint = require('./dist/commonjs/index').Endpoints.UserTasks;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;

function registerInContainer(container) {
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
