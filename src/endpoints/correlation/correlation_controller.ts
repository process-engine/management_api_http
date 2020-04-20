import {BadRequestError} from '@essential-projects/errors_ts';
import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, DataModels, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class CorrelationController implements HttpController.ICorrelationHttpController {

  private httpCodeSuccessfulResponse = 200;

  private correlationService: APIs.ICorrelationManagementApi;

  constructor(correlationService: APIs.ICorrelationManagementApi) {
    this.correlationService = correlationService;
  }

  public async getAllCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.correlationService.getAllCorrelations(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveCorrelations(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.correlationService.getActiveCorrelations(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;

    const result = await this.correlationService.getCorrelationById(identity, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationsByProcessModelId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.correlationService.getCorrelationsByProcessModelId(identity, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessInstanceById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;

    const result = await this.correlationService.getProcessInstanceById(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessInstancesForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const correlationId = request.params.correlation_id;
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.correlationService.getProcessInstancesForCorrelation(identity, correlationId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessInstancesForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.correlationService.getProcessInstancesForProcessModel(identity, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessInstancesByState(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const state = DataModels.Correlations.CorrelationState[request.params.process_instance_state];
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.correlationService.getProcessInstancesByState(identity, state, offset, limit);

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
