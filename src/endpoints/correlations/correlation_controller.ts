import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class CorrelationController {

  private httpCodeSuccessfulResponse = 200;

  private managementApiService: IManagementApi;

  constructor(managementApiService: IManagementApi) {
    this.managementApiService = managementApiService;
  }

  public async getAllCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;

    const result = await this.managementApiService.getAllCorrelations(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;

    const result = await this.managementApiService.getActiveCorrelations(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;

    const result = await this.managementApiService.getCorrelationById(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;

    const result = await this.managementApiService.getCorrelationByProcessInstanceId(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationsByProcessModelId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;

    const result = await this.managementApiService.getCorrelationsByProcessModelId(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
