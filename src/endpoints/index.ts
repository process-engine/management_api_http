/* eslint-disable @typescript-eslint/no-unused-vars */
import * as CallActivityEndpoint from './call_activity/index';
import * as CorrelationEndpoint from './correlations/index';
import * as EmptyActivityEndpoint from './empty_activities/index';
import * as EventEndpoint from './events/index';
import * as HeatmapEndpoint from './heatmap/index';
import * as ManualTasksEndpoint from './manual_tasks/index';
import * as ProcessModelEndpoint from './process_models/index';
import * as UserTaskEndpoint from './user_tasks/index';

export namespace Endpoints {
  export import Correlation = CorrelationEndpoint;
  export import EmptyActivity = EmptyActivityEndpoint;
  export import Event = EventEndpoint;
  export import Heatmap = HeatmapEndpoint;
  export import ProcessModels = ProcessModelEndpoint;
  export import UserTasks = UserTaskEndpoint;
  export import ManualTasks = ManualTasksEndpoint;
  export import CallActivity = CallActivityEndpoint;
}
