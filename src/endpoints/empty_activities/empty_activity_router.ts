import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware, MiddlewareFunction} from './../../middlewares/resolve_identity';
import {EmptyActivityController} from './empty_activity_controller';

import {wrap} from 'async-middleware';

export class EmptyActivityRouter extends BaseRouter {

  private _identityService: IIdentityService;
  private _emptyActivityController: EmptyActivityController;

  constructor(emptyActivityController: EmptyActivityController, identityService: IIdentityService) {
    super();
    this._emptyActivityController = emptyActivityController;
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
    const controller: EmptyActivityController = this._emptyActivityController;

    this.router.get(restSettings.paths.processModelEmptyActivities, wrap(controller.getEmptyActivitiesForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.processInstanceEmptyActivities, wrap(controller.getEmptyActivitiesForProcessInstance.bind(controller)));
    this.router.get(restSettings.paths.correlationEmptyActivities, wrap(controller.getEmptyActivitiesForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.processModelCorrelationEmptyActivities,
       wrap(controller.getEmptyActivitiesForProcessModelInCorrelation.bind(controller)));
    this.router.post(restSettings.paths.finishEmptyActivity, wrap(controller.finishEmptyActivity.bind(controller)));
  }
}
