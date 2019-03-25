import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {createResolveIdentityMiddleware, MiddlewareFunction} from './../../middlewares/resolve_identity';
import {HeatmapController} from './heatmap_controller';

import {wrap} from 'async-middleware';

export class HeatmapRouter extends BaseRouter {

  private _identityService: IIdentityService;
  private _heatmapController: HeatmapController;

  constructor(heatmapController: HeatmapController, identityService: IIdentityService) {
    super();
    this._heatmapController = heatmapController;
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
    const controller: HeatmapController = this._heatmapController;

    this.router.get(restSettings.paths.getRuntimeInformationForProcessModel, wrap(controller.getRuntimeInformationForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForProcessModel, wrap(controller.getActiveTokensForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getRuntimeInformationForFlowNode, wrap(controller.getRuntimeInformationForFlowNode.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForFlowNode, wrap(controller.getActiveTokensForFlowNode.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForProcessInstance, wrap(controller.getActiveTokensForProcessInstance.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForCorrelationAndProcessModel,
        wrap(controller.getActiveTokensForCorrelationAndProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getProcessModelLog, wrap(controller.getProcessModelLog.bind(controller)));
    this.router.get(restSettings.paths.getProcessInstanceLog, wrap(controller.getProcessInstanceLog.bind(controller)));
    this.router.get(restSettings.paths.getTokensForFlowNode, wrap(controller.getTokensForFlowNodeInstance.bind(controller)));
    this.router.get(restSettings.paths.getTokensForProcessInstance, wrap(controller.getTokensForProcessInstance.bind(controller)));
    this.router.get(restSettings.paths.getTokensForCorrelationAndProcessModel,
      wrap(controller.getTokensForCorrelationAndProcessModel.bind(controller)));
  }
}
