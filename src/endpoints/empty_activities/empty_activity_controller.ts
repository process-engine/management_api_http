import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class EmptyActivityController {
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

  public async getEmptyActivitiesForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;

    const result: DataModels.EmptyActivities.EmptyActivityList =
      await this.managementApiService.getEmptyActivitiesForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEmptyActivitiesForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processInstanceId: string = request.params.process_instance_id;

    const result: DataModels.EmptyActivities.EmptyActivityList =
      await this.managementApiService.getEmptyActivitiesForProcessInstance(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEmptyActivitiesForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;

    const result: DataModels.EmptyActivities.EmptyActivityList =
      await this.managementApiService.getEmptyActivitiesForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.params.correlation_id;

    const result: DataModels.EmptyActivities.EmptyActivityList =
      await this.managementApiService.getEmptyActivitiesForProcessModelInCorrelation(identity, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async finishEmptyActivity(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;
    const processInstanceId: string = request.params.process_instance_id;
    const emptyActivityInstanceId: string = request.params.empty_activity_instance_id;

    await this.managementApiService.finishEmptyActivity(identity, processInstanceId, correlationId, emptyActivityInstanceId);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
