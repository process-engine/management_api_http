'use strict'

const CorrelationEndpoint = require('./dist/commonjs/index').Endpoints.Correlation;
const EmptyActivityEndpoint = require('./dist/commonjs/index').Endpoints.EmptyActivity;
const EventEndpoint = require('./dist/commonjs/index').Endpoints.Event;
const HeatmapEndpoint = require('./dist/commonjs/index').Endpoints.Heatmap;
const ProcessModelsEndpoint = require('./dist/commonjs/index').Endpoints.ProcessModels;
const BoundaryEventEndpoints = require('./dist/commonjs/index').Endpoints.BoundaryEvent;
const IntermediateEventEndpoints = require('./dist/commonjs/index').Endpoints.IntermediateEvent;
const CallActivityEndpoints = require('./dist/commonjs/index').Endpoints.CallActivity;
const FlowNodeInstancesEndpoint = require('./dist/commonjs/index').Endpoints.FlowNodeInstances;
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

  container.register('ManagementApiEmptyActivityRouter', EmptyActivityEndpoint.EmptyActivityRouter)
    .dependencies('ManagementApiEmptyActivityController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiEmptyActivityController', EmptyActivityEndpoint.EmptyActivityController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiEmptyActivitySocketEndpoint', EmptyActivityEndpoint.EmptyActivitySocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

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
    .dependencies('EventAggregator', 'IdentityService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiProcessModelController', ProcessModelsEndpoint.ProcessModelController)
    .dependencies('ManagementApiService')
    .singleton();

  container.register('ManagementApiFlowNodeInstanceRouter', FlowNodeInstancesEndpoint.FlowNodeInstanceRouter)
    .dependencies('ManagementApiFlowNodeInstanceController', 'IdentityService')
    .singleton()
    .tags(routerDiscoveryTag);

  container.register('ManagementApiFlowNodeInstanceController', FlowNodeInstancesEndpoint.FlowNodeInstanceController)
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
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiBoundaryEventSocketEndpoint', BoundaryEventEndpoints.BoundaryEventSocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiIntermediateEventSocketEndpoint', IntermediateEventEndpoints.IntermediateEventSocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);

  container.register('ManagementApiCallActivitySocketEndpoint', CallActivityEndpoints.CallActivitySocketEndpoint)
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiService')
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
    .dependencies('EventAggregator', 'IdentityService', 'ManagementApiService')
    .singleton()
    .tags(socketEndpointDiscoveryTag);
}

module.exports.registerInContainer = registerInContainer;
