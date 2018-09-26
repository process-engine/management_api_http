import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {Correlation, IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class CorrelationController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;

  private _managementApiService: IManagementApi;

  constructor(managementApiService: IManagementApi) {
    this._managementApiService = managementApiService;
  }

  private get managementApiService(): IManagementApi {
    return this._managementApiService;
  }

  public async getAllCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;

    const result: Array<Correlation> = await this.managementApiService.getAllCorrelations(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;

    const result: Array<Correlation> = await this.managementApiService.getActiveCorrelations(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;

    const result: Correlation = await this.managementApiService.getCorrelationById(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId: string = request.params.process_instance_id;
    const identity: IIdentity = request.identity;

    const result: Correlation = await this.managementApiService.getCorrelationByProcessInstanceId(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationsByProcessModelId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: Array<Correlation> = await this.managementApiService.getCorrelationsByProcessModelId(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
