import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {EventList, EventTriggerPayload, IManagementApi} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class EventController {
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

  public async getWaitingEventsForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: EventList = await this.managementApiService.getWaitingEventsForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getWaitingEventsForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId: string = request.params.correlation_id;
    const identity: IIdentity = request.identity;

    const result: EventList = await this.managementApiService.getWaitingEventsForCorrelation(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getWaitingEventsForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.params.correlation_id;
    const identity: IIdentity = request.identity;

    const result: EventList = await this.managementApiService.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async triggerMessageEvent(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const eventName: string = request.params.event_name;
    const payload: EventTriggerPayload = request.body;
    const identity: IIdentity = request.identity;

    await this.managementApiService.triggerMessageEvent(identity, eventName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async triggerSignalEvent(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const eventName: string = request.params.event_name;
    const payload: EventTriggerPayload = request.body;
    const identity: IIdentity = request.identity;

    await this.managementApiService.triggerSignalEvent(identity, eventName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
