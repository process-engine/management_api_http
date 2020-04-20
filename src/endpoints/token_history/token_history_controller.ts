import {BadRequestError} from '@essential-projects/errors_ts';
import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class TokenHistoryController implements HttpController.ITokenHistoryHttpController {

  private httpCodeSuccessfulResponse = 200;

  private tokenHistoryService: APIs.ITokenHistoryManagementApi;

  constructor(tokenHistoryService: APIs.ITokenHistoryManagementApi) {
    this.tokenHistoryService = tokenHistoryService;
  }

  public async getTokensForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const processModelId = request.params.process_model_id;
    const flowNodeId = request.params.flow_node_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.tokenHistoryService.getTokensForFlowNode(identity, correlationId, processModelId, flowNodeId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForFlowNodeByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;
    const flowNodeId = request.params.flow_node_id;

    const result = await this.tokenHistoryService.getTokensForFlowNodeByProcessInstanceId(identity, processInstanceId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForCorrelationAndProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const processModelId = request.params.process_model_id;

    const result = await this.tokenHistoryService.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;

    const result = await this.tokenHistoryService.getTokensForProcessInstance(identity, processInstanceId);

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
