import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {HeatmapController} from './heatmap_controller';

export class HeatmapRouter extends BaseRouter {

  private identityService: IIdentityService;
  private heatmapController: HeatmapController;

  constructor(heatmapController: HeatmapController, identityService: IIdentityService) {
    super();
    this.heatmapController = heatmapController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/management/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
  }

  private registerMiddlewares(): void {
    const resolveIdentity = createResolveIdentityMiddleware(this.identityService);
    this.router.use(wrap(resolveIdentity));
  }

  private registerRoutes(): void {
    const controller = this.heatmapController;

    this.router.get(restSettings.paths.getRuntimeInformationForProcessModel, wrap(controller.getRuntimeInformationForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForProcessModel, wrap(controller.getActiveTokensForProcessModel.bind(controller)));
    this.router.get(restSettings.paths.getRuntimeInformationForFlowNode, wrap(controller.getRuntimeInformationForFlowNode.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForFlowNode, wrap(controller.getActiveTokensForFlowNode.bind(controller)));
    this.router.get(restSettings.paths.getActiveTokensForProcessInstance, wrap(controller.getActiveTokensForProcessInstance.bind(controller)));
    this.router.get(
      restSettings.paths.getActiveTokensForCorrelationAndProcessModel,
      wrap(controller.getActiveTokensForCorrelationAndProcessModel.bind(controller)),
    );
    this.router.get(restSettings.paths.getProcessModelLog, wrap(controller.getProcessModelLog.bind(controller)));
    this.router.get(restSettings.paths.getProcessInstanceLog, wrap(controller.getProcessInstanceLog.bind(controller)));
    this.router.get(restSettings.paths.getTokensForFlowNode, wrap(controller.getTokensForFlowNode.bind(controller)));
    this.router.get(
      restSettings.paths.getTokensForFlowNodeByProcessInstanceId,
      wrap(controller.getTokensForFlowNodeByProcessInstanceId.bind(controller)),
    );
    this.router.get(restSettings.paths.getTokensForProcessInstance, wrap(controller.getTokensForProcessInstance.bind(controller)));
    this.router.get(
      restSettings.paths.getTokensForCorrelationAndProcessModel,
      wrap(controller.getTokensForCorrelationAndProcessModel.bind(controller)),
    );
  }

}
