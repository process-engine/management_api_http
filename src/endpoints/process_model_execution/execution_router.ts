import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/management_api_contracts';

import {resolveIdentity} from './../../middlewares/resolve_identity';
import {ProcessModelExecutionController} from './execution_controller';

import {wrap} from 'async-middleware';

export class ProcessModelExecutionRouter extends BaseRouter {

  private _processModelExecutionController: ProcessModelExecutionController;

  constructor(processModelExecutionController: ProcessModelExecutionController) {
    super();
    this._processModelExecutionController = processModelExecutionController;
  }

  private get processModelExecutionController(): ProcessModelExecutionController {
    return this._processModelExecutionController;
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
    const controller: ProcessModelExecutionController = this.processModelExecutionController;

    this.router.get(restSettings.paths.processModels, wrap(controller.getProcessModels.bind(controller)));
    this.router.get(restSettings.paths.processModelById, wrap(controller.getProcessModelById.bind(controller)));
    this.router.get(restSettings.paths.processModelEvents, wrap(controller.getEventsForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.deleteProcessDefinitionsByProcessModelId,
      wrap(controller.deleteProcessDefinitionsByProcessModelId.bind(controller)));

    this.router.post(restSettings.paths.startProcessInstance, wrap(controller.startProcessInstance.bind(controller)));
    this.router.post(restSettings.paths.updateProcessDefinitionsByName, wrap(controller.updateProcessDefinitionsByName.bind(controller)));
  }
}
