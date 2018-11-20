import * as CorrelationEndpoint from './correlations/index';
import * as EventEndpoint from './events/index';
import * as HeatmapEndpoint from './heatmap/index';
import * as ManualTasksEndpoint from './manual_tasks/index';
import * as ExecutionEndpoint from './process_model_execution/index';
import * as UserTaskEndpoint from './user_tasks/index';

// tslint:disable:no-namespace
export namespace Endpoints {
  export import Correlation = CorrelationEndpoint;
  export import Event = EventEndpoint;
  export import Heatmap = HeatmapEndpoint;
  export import ProcessModelExecution = ExecutionEndpoint;
  export import UserTasks = UserTaskEndpoint;
  export import ManualTasks = ManualTasksEndpoint;
}
