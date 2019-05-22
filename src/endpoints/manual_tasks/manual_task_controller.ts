import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class ManualTaskController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private managementApiService: IManagementApi;

  constructor(managementApiService: IManagementApi) {
    this.managementApiService = managementApiService;
  }

  public async getManualTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;

    const result = await this.managementApiService.getManualTasksForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;

    const result = await this.managementApiService.getManualTasksForProcessInstance(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;

    const result = await this.managementApiService.getManualTasksForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getManualTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;

    const result = await this.managementApiService.getManualTasksForProcessModelInCorrelation(identity, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async finishManualTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const processInstanceId = request.params.process_instance_id;
    const manualTaskInstanceId = request.params.manual_task_instance_id;

    await this.managementApiService.finishManualTask(identity, processInstanceId, correlationId, manualTaskInstanceId);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
