import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware, MiddlewareFunction} from './../../middlewares/resolve_identity';
import {ManualTaskController} from './manual_task_controller';

import {wrap} from 'async-middleware';

export class ManualTaskRouter extends BaseRouter {

  private _identityService: IIdentityService;
  private _manualTaskController: ManualTaskController;

  constructor(manualTaskController: ManualTaskController, identityService: IIdentityService) {
    super();
    this._manualTaskController = manualTaskController;
    this._identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/management/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    const resolveIdentity: MiddlewareFunction = createResolveIdentityMiddleware(this._identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private registerRoutes(): void {
    const controller: ManualTaskController = this._manualTaskController;

    this.router.get(restSettings.paths.processModelManualTasks, wrap(controller.getManualTasksForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.processInstanceManualTasks, wrap(controller.getManualTasksForProcessInstance.bind(controller)));
    this.router.get(restSettings.paths.correlationManualTasks, wrap(controller.getManualTasksForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.processModelCorrelationManualTasks,
       wrap(controller.getManualTasksForProcessModelInCorrelation.bind(controller)));
    this.router.post(restSettings.paths.finishManualTask, wrap(controller.finishManualTask.bind(controller)));
  }
}
