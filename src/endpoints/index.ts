import * as ExecutionEndpoint from './process_model_execution/index';
import * as UserTaskEndpoint from './user_tasks/index';

// tslint:disable:no-namespace
export namespace Endpoints {
  export import ProcessModelExecution = ExecutionEndpoint;
  export import UserTasks = UserTaskEndpoint;
}
