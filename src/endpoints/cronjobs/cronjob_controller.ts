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

  public async getCronjobExecutionHistoryForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const startEventId = request.query.start_event_id;

    const result = await this.managementApiService.getCronjobExecutionHistoryForProcessModel(identity, processModelId, startEventId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCronjobExecutionHistoryForCrontab(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const crontab = request.params.crontab;

    const result = await this.managementApiService.getCronjobExecutionHistoryForCrontab(identity, crontab);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
