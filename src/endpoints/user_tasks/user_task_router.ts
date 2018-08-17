import {BaseRouter} from '@essential-projects/http_node';
import {IManagementApiEndpointConfig, restSettings} from '@process-engine/management_api_contracts';

import {getResolveManagementContextMiddleware} from './../../middlewares/resolve_management_context';
import {UserTaskController} from './user_task_controller';

import {wrap} from 'async-middleware';

export class UserTaskRouter extends BaseRouter {

  private _userTaskController: UserTaskController;
  public config: IManagementApiEndpointConfig;

  constructor(userTaskController: UserTaskController) {
    super();
    this._userTaskController = userTaskController;
  }

  private get userTaskController(): UserTaskController {
    return this._userTaskController;
  }

  public get baseRoute(): string {
    return 'api/management/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    const resolveManagementContextMiddleware: any = getResolveManagementContextMiddleware(this.config);
    this.router.use(wrap(resolveManagementContextMiddleware));
  }

  private registerRoutes(): void {
    const controller: UserTaskController = this.userTaskController;

    this.router.get(restSettings.paths.processModelUserTasks, wrap(controller.getUserTasksForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.correlationUserTasks, wrap(controller.getUserTasksForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.processModelCorrelationUserTasks, wrap(controller.getUserTasksForProcessModelInCorrelation.bind(controller)));
    this.router.post(restSettings.paths.finishUserTask, wrap(controller.finishUserTask.bind(controller)));
  }
}
