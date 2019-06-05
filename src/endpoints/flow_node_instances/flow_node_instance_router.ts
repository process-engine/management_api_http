import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/management_api_contracts';

import {wrap} from 'async-middleware';
import {createResolveIdentityMiddleware} from '../../middlewares/resolve_identity';
import {FlowNodeInstanceController} from './flow_node_instance_controller';

export class EventRouter extends BaseRouter {

  private eventController: FlowNodeInstanceController;
  private identityService: IIdentityService;

  constructor(eventController: FlowNodeInstanceController, identityService: IIdentityService) {
    super();
    this.eventController = eventController;
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
    const controller = this.eventController;

    this.router.post(
      restSettings.paths.getFlowNodeInstancesForProcessInstance,
      wrap(controller.getFlowNodeInstancesForProcessInstance.bind(controller)),
    );
  }

}
