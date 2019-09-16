import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {TaskController} from './task_controller';

export class TaskRouter extends BaseRouter {

  private identityService: IIdentityService;
  private taskController: TaskController;

  constructor(taskController: TaskController, identityService: IIdentityService) {
    super();
    this.taskController = taskController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/management/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    const resolveIdentity = createResolveIdentityMiddleware(this.identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private registerRoutes(): void {
    const controller = this.taskController;

    this.router.get(restSettings.paths.allSuspendedTasks, wrap(controller.getAllSuspendedTasks.bind(controller)));
    this.router.get(restSettings.paths.suspendedProcessModelTasks, wrap(controller.getSuspendedTasksForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.suspendedProcessInstanceTasks, wrap(controller.getSuspendedTasksForProcessInstance.bind(controller)));
    this.router.get(restSettings.paths.suspenededCorrelationTasks, wrap(controller.getSuspendedTasksForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.suspendedProcessModelCorrelationTasks, wrap(controller.getSuspendedTasksForProcessModelInCorrelation.bind(controller)));
  }

}
