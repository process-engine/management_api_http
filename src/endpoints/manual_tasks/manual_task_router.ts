import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/management_api_contracts';

import {resolveIdentity} from '../../middlewares/resolve_identity';
import {ManualTaskController} from './manual_task_controller';

import {wrap} from 'async-middleware';

export class ManualTaskRouter extends BaseRouter {

  private _manualTaskController: ManualTaskController;

  constructor(manualTaskController: ManualTaskController) {
    super();
    this._manualTaskController = manualTaskController;
  }

  private get manualTaskController(): ManualTaskController {
    return this._manualTaskController;
  }

  public get baseRoute(): string {
    return 'api/management/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    this.router.use(wrap(resolveIdentity));
  }

  private registerRoutes(): void {
    const controller: ManualTaskController = this.manualTaskController;

    this.router.get(restSettings.paths.processModelManualTasks, wrap(controller.getManualTasksForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.correlationManualTasks, wrap(controller.getManualTasksForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.processModelCorrelationManualTasks,
       wrap(controller.getManualTasksForProcessModelInCorrelation.bind(controller)));
    this.router.post(restSettings.paths.finishManualTask, wrap(controller.finishManualTask.bind(controller)));
  }
}
