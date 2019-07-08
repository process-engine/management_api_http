import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class CronjobController {

  private httpCodeSuccessfulResponse = 200;

  private managementApiService: IManagementApi;

  constructor(managementApiService: IManagementApi) {
    this.managementApiService = managementApiService;
  }

  public async getAllActiveCronjobs(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;

    const result = await this.managementApiService.getAllActiveCronjobs(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
