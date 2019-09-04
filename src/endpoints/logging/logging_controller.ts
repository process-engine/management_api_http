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

    const result = await this.loggingService.getProcessModelLog(identity, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessInstanceLog(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const processInstanceId = request.params.process_instance_id;

    const result = await this.loggingService.getProcessInstanceLog(identity, processModelId, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
