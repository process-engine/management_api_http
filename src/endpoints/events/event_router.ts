import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware, MiddlewareFunction} from './../../middlewares/resolve_identity';
import {EventController} from './event_controller';

import {wrap} from 'async-middleware';

export class EventRouter extends BaseRouter {

  private _eventController: EventController;
  private _identityService: IIdentityService;

  constructor(eventController: EventController, identityService: IIdentityService) {
    super();
    this._eventController = eventController;
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
    const controller: EventController = this._eventController;

    this.router.get(restSettings.paths.waitingProcessModelEvents, wrap(controller.getWaitingEventsForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.waitingCorrelationEvents, wrap(controller.getWaitingEventsForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.waitingProcessModelCorrelationEvents,
                    wrap(controller.getWaitingEventsForProcessModelInCorrelation.bind(controller)));
    this.router.post(restSettings.paths.triggerMessageEvent, wrap(controller.triggerMessageEvent.bind(controller)));
    this.router.post(restSettings.paths.triggerSignalEvent, wrap(controller.triggerSignalEvent.bind(controller)));
  }
}
