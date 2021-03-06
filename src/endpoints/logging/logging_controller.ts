import {BadRequestError} from '@essential-projects/errors_ts';
import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class LoggingController implements HttpController.ILoggingHttpController {

  private httpCodeSuccessfulResponse = 200;

  private loggingService: APIs.ILoggingManagementApi;

  constructor(loggingService: APIs.ILoggingManagementApi) {
    this.loggingService = loggingService;
  }

  public async getProcessModelLog(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const correlationId = request.query.correlation_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.loggingService.getProcessModelLog(identity, processModelId, correlationId as string, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessInstanceLog(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const processInstanceId = request.params.process_instance_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.loggingService.getProcessInstanceLog(identity, processModelId, processInstanceId, offset, limit);

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
