import {Correlation, IManagementApiService, ManagementContext, ManagementRequest} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class CorrelationController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;

  private _managementApiService: IManagementApiService;

  constructor(managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService;
  }

  private get managementApiService(): IManagementApiService {
    return this._managementApiService;
  }

  public async getAllActiveCorrelations(request: ManagementRequest, response: Response): Promise<void> {
    const context: ManagementContext = request.managementContext;

    const result: Array<Correlation> = await this.managementApiService.getAllActiveCorrelations(context);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
