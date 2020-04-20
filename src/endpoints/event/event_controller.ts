import {BadRequestError} from '@essential-projects/errors_ts';
import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class EventController implements HttpController.IEventHttpController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private eventService: APIs.IEventManagementApi;

  constructor(eventService: APIs.IEventManagementApi) {
    this.eventService = eventService;
  }

  public async getWaitingEventsForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.eventService.getWaitingEventsForProcessModel(identity, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getWaitingEventsForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.eventService.getWaitingEventsForCorrelation(identity, correlationId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getWaitingEventsForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result =
      await this.eventService.getWaitingEventsForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async triggerMessageEvent(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const eventName = request.params.event_name;
    const payload = request.body;
    const identity = request.identity;

    await this.eventService.triggerMessageEvent(identity, eventName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async triggerSignalEvent(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const eventName = request.params.event_name;
    const payload = request.body;
    const identity = request.identity;

    await this.eventService.triggerSignalEvent(identity, eventName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  private parseOffset(request: HttpRequestWithIdentity): number {
    try {
      return request.query?.offset ? parseInt(request.query.offset as string) : 0;
    } catch (error) {
      throw new BadRequestError(`Value ${request.query.offset} is not a valid offset! Offsets must be provided as a number.`);
    }
  }

  private parseLimit(request: HttpRequestWithIdentity): number {
    try {
      return request.query?.limit ? parseInt(request.query.limit as string) : 0;
    } catch (error) {
      throw new BadRequestError(`Value ${request.query.limit} is not a valid limit! Limits must be provided as a number.`);
    }
  }

}
