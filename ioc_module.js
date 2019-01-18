'use strict'

const CorrelationEndpoint = require('./dist/commonjs/index').Endpoints.Correlation;
const EventEndpoint = require('./dist/commonjs/index').Endpoints.Event;
const HeatmapEndpoint = require('./dist/commonjs/index').Endpoints.Heatmap;
const ProcessModelsEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModels;
const UserTasksEndpoint = require('./dist/commonjs/index').Endpoints.UserTasks;
const ManualTasksEndpoint = require('./dist/commonjs/index').Endpoints.ManualTasks;

const routerDiscoveryTag = require('@essential-projects/bootstrapper_contracts').routerDiscoveryTag;
const socketEndpointDiscoveryTag = require('@essential-projects/bootstrapper_contracts').socketEndpointDiscoveryTag;

function registerInContainer(container) {

  container.register('ManagementApiCorrelationRouter', CorrelationEndpoint.CorrelationRouter)
    .dependencies('ManagementApiCorrelationController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiCorrelationController', CorrelationEndpoint.CorrelationController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiEventRouter', EventEndpoint.EventRouter)
    .dependencies('ManagementApiEventController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiEventController', EventEndpoint.EventController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiHeatmapRouter', HeatmapEndpoint.HeatmapRouter)
    .dependencies('ManagementApiHeatmapController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiHeatmapController', HeatmapEndpoint.HeatmapController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiProcessModelRouter', ProcessModelsEndpoint.ProcessModelRouter)
    .dependencies('ManagementApiProcessModelController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiProcessModelSocketEndpoint', ProcessModelsEndpoint.ProcessModelSocketEndpoint)
    .dependencies('EventAggregator')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiProcessModelController', ProcessModelsEndpoint.ProcessModelController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiUserTaskRouter', UserTasksEndpoint.UserTaskRouter)
    .dependencies('ManagementApiUserTaskController', 'IdentityService')
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
    .dependencies('ManagementApiManualTaskController', 'IdentityService')
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
