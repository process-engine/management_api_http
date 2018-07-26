import {
  IManagementApiService,
  ManagementContext,
  ManagementRequest,
  UserTaskList,
  UserTaskResult,
} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class UserTaskController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private _managementApiService: IManagementApiService;

  constructor(managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService;
  }

  private get managementApiService(): IManagementApiService {
    return this._managementApiService;
  }

  public async getUserTasksForProcessModel(request: ManagementRequest, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const context: ManagementContext = request.managementContext;

    const result: UserTaskList = await this.managementApiService.getUserTasksForProcessModel(context, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getUserTasksForCorrelation(request: ManagementRequest, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const context: ManagementContext = request.managementContext;

    const result: UserTaskList = await this.managementApiService.getUserTasksForCorrelation(context, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getUserTasksForProcessModelInCorrelation(request: ManagementRequest, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.params.correlation_id;
    const context: ManagementContext = request.managementContext;

    const result: UserTaskList = await this.managementApiService.getUserTasksForProcessModelInCorrelation(context, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async finishUserTask(request: ManagementRequest, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.params.correlation_id;
    const userTaskId: string = request.params.user_task_id;
    const userTaskResult: UserTaskResult = request.body;
    const context: ManagementContext = request.managementContext;

    await this.managementApiService.finishUserTask(context, processModelId, correlationId, userTaskId, userTaskResult);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
