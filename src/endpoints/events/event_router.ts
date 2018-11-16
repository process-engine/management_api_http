import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/management_api_contracts';

import {resolveIdentity} from './../../middlewares/resolve_identity';
import {EventController} from './event_controller';

import {wrap} from 'async-middleware';

export class EventRouter extends BaseRouter {

  private _eventController: EventController;

  constructor(eventController: EventController) {
    super();
    this._eventController = eventController;
  }

  private get eventController(): EventController {
    return this._eventController;
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
    const controller: EventController = this.eventController;

    this.router.get(restSettings.paths.waitingProcessModelEvents, wrap(controller.getWaitingEventsForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.waitingCorrelationEvents, wrap(controller.getWaitingEventsForCorrelation.bind(controller)));
    this.router.get(restSettings.paths.waitingProcessModelCorrelationEvents,
                    wrap(controller.getWaitingEventsForProcessModelInCorrelation.bind(controller)));
    this.router.post(restSettings.paths.triggerMessageEvent, wrap(controller.triggerMessageEvent.bind(controller)));
    this.router.post(restSettings.paths.triggerSignalEvent, wrap(controller.triggerSignalEvent.bind(controller)));
  }
}
