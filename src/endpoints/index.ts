/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ActivityEndpoint from './activity/index';
import * as BoundaryEventEndpoint from './boundary_event/index';
import * as CorrelationEndpoint from './correlations/index';
import * as EmptyActivityEndpoint from './empty_activities/index';
import * as EventEndpoint from './events/index';
import * as FlowNodeInstancesEndpoint from './flow_node_instances';
import * as HeatmapEndpoint from './heatmap/index';
import * as IntermediateEventEndpoint from './intermediate_event/index';
import * as ManualTasksEndpoint from './manual_tasks/index';
import * as ProcessModelEndpoint from './process_models/index';
import * as UserTaskEndpoint from './user_tasks/index';

export namespace Endpoints {
  export import Activity = ActivityEndpoint;
  export import BoundaryEvent = BoundaryEventEndpoint;
  export import Correlation = CorrelationEndpoint;
  export import EmptyActivity = EmptyActivityEndpoint;
  export import Event = EventEndpoint;
  export import FlowNodeInstances = FlowNodeInstancesEndpoint;
  export import Heatmap = HeatmapEndpoint;
  export import IntermediateEvent = IntermediateEventEndpoint;
  export import ManualTasks = ManualTasksEndpoint;
  export import ProcessModels = ProcessModelEndpoint;
  export import UserTasks = UserTaskEndpoint;
}
