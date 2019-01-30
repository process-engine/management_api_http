import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware, MiddlewareFunction} from './../../middlewares/resolve_identity';
import {ProcessModelController} from './process_model_controller';

import {wrap} from 'async-middleware';

export class ProcessModelRouter extends BaseRouter {

  private _identityService: IIdentityService;
  private _processModelController: ProcessModelController;

  constructor(processModelController: ProcessModelController, identityService: IIdentityService) {
    super();
    this._processModelController = processModelController;
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
    const controller: ProcessModelController = this._processModelController;

    this.router.get(restSettings.paths.processModels, wrap(controller.getProcessModels.bind(controller)));
    this.router.get(restSettings.paths.processModelById, wrap(controller.getProcessModelById.bind(controller)));
    this.router.get(restSettings.paths.processModelByProcessInstanceId, wrap(controller.getProcessModelByProcessInstanceId.bind(controller)));
    this.router.get(restSettings.paths.processModelStartEvents, wrap(controller.getStartEventsForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.deleteProcessDefinitionsByProcessModelId,
      wrap(controller.deleteProcessDefinitionsByProcessModelId.bind(controller)));

    this.router.post(restSettings.paths.startProcessInstance, wrap(controller.startProcessInstance.bind(controller)));
    this.router.post(restSettings.paths.updateProcessDefinitionsByName, wrap(controller.updateProcessDefinitionsByName.bind(controller)));
  }
}
