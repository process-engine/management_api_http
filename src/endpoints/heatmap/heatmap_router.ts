import {BaseRouter} from '@essential-projects/http_node';
import {restSettings} from '@process-engine/management_api_contracts';

import {resolveIdentity} from './../../middlewares/resolve_identity';
import {HeatmapController} from './heatmap_controller';

import {wrap} from 'async-middleware';

export class HeatmapRouter extends BaseRouter {

  private _heatmapController: HeatmapController;

  constructor(heatmapController: HeatmapController) {
    super();
    this._heatmapController = heatmapController;
  }

  private get heatmapController(): HeatmapController {
    return this._heatmapController;
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
    const controller: HeatmapController = this.heatmapController;

    this.router.get(restSettings.paths.getRuntimeInformationForProcessModel, wrap(controller.getRuntimeInformationForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForProcessModel, wrap(controller.getActiveTokensForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getRuntimeInformationForFlowNode, wrap(controller.getRuntimeInformationForFlowNode.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForFlowNode, wrap(controller.getActiveTokensForFlowNode.bind(controller)));
    this.router.get(restSettings.paths.getProcessModelLog, wrap(controller.getProcessModelLog.bind(controller)));
    this.router.get(restSettings.paths.getTokensForFlowNode, wrap(controller.getTokensForFlowNodeInstance.bind(controller)));
  }
}
