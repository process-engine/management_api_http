import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class EmptyActivityController implements HttpController.IEmptyActivityHttpController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private emptyActivityService: APIs.IEmptyActivityManagementApi;

  constructor(emptyActivityService: APIs.IEmptyActivityManagementApi) {
    this.emptyActivityService = emptyActivityService;
  }

  public async getEmptyActivitiesForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;

    const result = await this.emptyActivityService.getEmptyActivitiesForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEmptyActivitiesForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;

    const result = await this.emptyActivityService.getEmptyActivitiesForProcessInstance(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEmptyActivitiesForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;

    const result = await this.emptyActivityService.getEmptyActivitiesForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;

    const result = await this.emptyActivityService.getEmptyActivitiesForProcessModelInCorrelation(identity, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async finishEmptyActivity(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const processInstanceId = request.params.process_instance_id;
    const emptyActivityInstanceId = request.params.empty_activity_instance_id;

    await this.emptyActivityService.finishEmptyActivity(identity, processInstanceId, correlationId, emptyActivityInstanceId);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
