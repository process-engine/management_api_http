import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  Correlation,
  IManagementApi,
  ProcessModelExecution,
} from '@process-engine/management_api_contracts';

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

  public async getAllActiveCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;

    const result: Array<Correlation> = await this.managementApiService.getAllActiveCorrelations(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelsForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;

    const result: Array<ProcessModelExecution.ProcessModel> =
      await this.managementApiService.getProcessModelsForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
