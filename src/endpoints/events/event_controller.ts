import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class EventController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private managementApiService: IManagementApi;

  constructor(managementApiService: IManagementApi) {
    this.managementApiService = managementApiService;
  }

  public async getWaitingEventsForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;

    const result = await this.managementApiService.getWaitingEventsForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getWaitingEventsForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const identity = request.identity;

    const result = await this.managementApiService.getWaitingEventsForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getWaitingEventsForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;
    const identity = request.identity;

    const result =
      await this.managementApiService.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async triggerMessageEvent(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const eventName = request.params.event_name;
    const payload = request.body;
    const identity = request.identity;

    await this.managementApiService.triggerMessageEvent(identity, eventName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async triggerSignalEvent(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const eventName = request.params.event_name;
    const payload = request.body;
    const identity = request.identity;

    await this.managementApiService.triggerSignalEvent(identity, eventName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
