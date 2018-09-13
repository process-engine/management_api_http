import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/management_api_contracts';

import {resolveManagementContext} from './../../middlewares/resolve_management_context';
import {CorrelationController} from './correlation_controller';

import {wrap} from 'async-middleware';

export class CorrelationRouter extends BaseRouter {

  private _correlationController: CorrelationController;

  constructor(correlationController: CorrelationController) {
    super();
    this._correlationController = correlationController;
  }

  private get correlationController(): CorrelationController {
    return this._correlationController;
  }

  public get baseRoute(): string {
    return 'api/management/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    this.router.use(wrap(resolveManagementContext));
  }

  private registerRoutes(): void {
    const controller: CorrelationController = this.correlationController;

    this.router.get(restSettings.paths.activeCorrelations, wrap(controller.getAllActiveCorrelations.bind(controller)));
    this.router.get(restSettings.paths.getProcessModelForCorrelation, wrap(controller.getProcessModelForCorrelation.bind(controller)));
  }
}
