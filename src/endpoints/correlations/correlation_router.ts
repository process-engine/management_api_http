import {BaseRouter} from '@essential-projects/http_node';
import {IManagementApiEndpointConfig, restSettings} from '@process-engine/management_api_contracts';

import {resolveManagementContext} from './../../middlewares/resolve_management_context';
import {CorrelationController} from './correlation_controller';

import {wrap} from 'async-middleware';

export class CorrelationRouter extends BaseRouter {

  private _correlationController: CorrelationController;
  public config: IManagementApiEndpointConfig;

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
    const resolveManagementContextMiddleware: any = getResolveManagementContextMiddleware(this.config);
    this.router.use(wrap(resolveManagementContextMiddleware));
  }

  private registerRoutes(): void {
    const controller: CorrelationController = this.correlationController;

    this.router.get(restSettings.paths.activeCorrelations, wrap(controller.getAllActiveCorrelations.bind(controller)));
  }
}
