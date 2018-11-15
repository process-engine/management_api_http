'use strict'

const CorrelationEndpoint = require('./dist/commonjs/index').Endpoints.Correlation;
const EventEndpoint = require('./dist/commonjs/index').Endpoints.Event;
const HeatmapEndpoint = require('./dist/commonjs/index').Endpoints.Heatmap;
const ProcessModelExecutionEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModelExecution;
const UserTasksEndpoint = require('./dist/commonjs/index').Endpoints.UserTasks;
const ManualTasksEndpoint = require('./dist/commonjs/index').Endpoints.ManualTasks;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;
const socketEndpointDiscoveryTag = require('@essential-projects/bootstrapper_contracts').socketEndpointDiscoveryTag;

function registerInContainer(container) {

  container.register('ManagementApiCorrelationRouter', CorrelationEndpoint.CorrelationRouter)
    .dependencies('ManagementApiCorrelationController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiCorrelationController', CorrelationEndpoint.CorrelationController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiEventRouter', EventEndpoint.EventRouter)
    .dependencies('ManagementApiEventController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiEventController', EventEndpoint.EventController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiHeatmapRouter', HeatmapEndpoint.HeatmapRouter)
    .dependencies('ManagementApiHeatmapController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiHeatmapController', HeatmapEndpoint.HeatmapController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiProcessModelExecutionRouter', ProcessModelExecutionEndpoint.ProcessModelExecutionRouter)
    .dependencies('ManagementApiProcessModelExecutionController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiProcessModelExecutionSocketEndpoint', ProcessModelExecutionEndpoint.ExecutionSocketEndpoint)
    .dependencies('EventAggregator')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

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

  container.register('ManagementApiUserTaskSocketEndpoint', UserTasksEndpoint.UserTaskSocketEndpoint)
    .dependencies('EventAggregator')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiManualTaskRouter', ManualTasksEndpoint.ManualTaskRouter)
    .dependencies('ManagementApiManualTaskController')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiManualTaskController', ManualTasksEndpoint.ManualTaskController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiManualTaskSocketEndpoint', ManualTasksEndpoint.ManualTaskSocketEndpoint)
    .dependencies('EventAggregator')
    .singleton()
    .tags(socketEndpointDiscoveryTag);
}

module.exports.registerInContainer = registerInContainer;
