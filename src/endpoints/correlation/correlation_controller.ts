import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class CorrelationController implements HttpController.ICorrelationHttpController {

  private httpCodeSuccessfulResponse = 200;

  private correlationService: APIs.ICorrelationManagementApi;

  constructor(correlationService: APIs.ICorrelationManagementApi) {
    this.correlationService = correlationService;
  }

  public async getAllCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.correlationService.getAllCorrelations(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.correlationService.getActiveCorrelations(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;

    const result = await this.correlationService.getCorrelationById(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;

    const result = await this.correlationService.getCorrelationByProcessInstanceId(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationsByProcessModelId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.correlationService.getCorrelationsByProcessModelId(identity, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
