import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware, MiddlewareFunction} from './../../middlewares/resolve_identity';
import {CorrelationController} from './correlation_controller';

import {wrap} from 'async-middleware';

export class CorrelationRouter extends BaseRouter {

  private _correlationController: CorrelationController;
  private _identityService: IIdentityService;

  constructor(correlationController: CorrelationController, identityService: IIdentityService) {
    super();
    this._correlationController = correlationController;
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
    const controller: CorrelationController = this._correlationController;

    this.router.get(restSettings.paths.getAllCorrelations, wrap(controller.getAllCorrelations.bind(controller)));
    this.router.get(restSettings.paths.getActiveCorrelations, wrap(controller.getActiveCorrelations.bind(controller)));
    this.router.get(restSettings.paths.getCorrelationByProcessInstanceId, wrap(controller.getCorrelationByProcessInstanceId.bind(controller)));
    this.router.get(restSettings.paths.getCorrelationsByProcessModelId, wrap(controller.getCorrelationsByProcessModelId.bind(controller)));
    this.router.get(restSettings.paths.getCorrelationById, wrap(controller.getCorrelationById.bind(controller)));
  }
}
