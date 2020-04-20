import {BadRequestError} from '@essential-projects/errors_ts';
import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class CronjobController implements HttpController.ICronjobHttpController {

  private httpCodeSuccessfulResponse = 200;

  private cronjobService: APIs.ICronjobManagementApi;

  constructor(cronjobService: APIs.ICronjobManagementApi) {
    this.cronjobService = cronjobService;
  }

  public async getAllActiveCronjobs(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.cronjobService.getAllActiveCronjobs(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCronjobExecutionHistoryForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const startEventId = request.query.start_event_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.cronjobService.getCronjobExecutionHistoryForProcessModel(identity, processModelId, startEventId as string, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCronjobExecutionHistoryForCrontab(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const crontab = request.params.crontab;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.cronjobService.getCronjobExecutionHistoryForCrontab(identity, crontab, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
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
