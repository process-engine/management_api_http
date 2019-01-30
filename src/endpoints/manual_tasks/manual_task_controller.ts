import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class ManualTaskController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private _managementApiService: IManagementApi;

  constructor(managementApiService: IManagementApi) {
    this._managementApiService = managementApiService;
  }

  private get managementApiService(): IManagementApi {
    return this._managementApiService;
  }

  public async getManualTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;

    const result: DataModels.ManualTasks.ManualTaskList = await this.managementApiService.getManualTasksForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processInstanceId: string = request.params.process_instance_id;

    const result: DataModels.ManualTasks.ManualTaskList = await this.managementApiService.getManualTasksForProcessInstance(identity,
                                                                                                                           processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;

    const result: DataModels.ManualTasks.ManualTaskList = await this.managementApiService.getManualTasksForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.params.correlation_id;

    const result: DataModels.ManualTasks.ManualTaskList =
      await this.managementApiService.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async finishManualTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;
    const processInstanceId: string = request.params.process_instance_id;
    const manualTaskInstanceId: string = request.params.manual_task_instance_id;

    await this.managementApiService.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
