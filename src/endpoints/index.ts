import * as CorrelationEndpoint from './correlations/index';
import * as EventEndpoint from './events/index';
import * as HeatmapEndpoint from './heatmap/index';
import * as ManualTasksEndpoint from './manual_tasks/index';
import * as ProcessModelEndpoint from './process_models/index';
import * as UserTaskEndpoint from './user_tasks/index';

// tslint:disable:no-namespace
export namespace Endpoints {
  export import Correlation = CorrelationEndpoint;
  export import Event = EventEndpoint;
  export import Heatmap = HeatmapEndpoint;
  export import ProcessModels = ProcessModelEndpoint;
  export import UserTasks = UserTaskEndpoint;
  export import ManualTasks = ManualTasksEndpoint;
}
