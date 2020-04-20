import {BadRequestError} from '@essential-projects/errors_ts';
import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class FlowNodeInstanceController implements HttpController.IFlowNodeInstanceHttpController {

  private httpCodeSuccessfulResponse = 200;

  private flowNodeInstanceService: APIs.IFlowNodeInstanceManagementApi;

  constructor(flowNodeInstanceService: APIs.IFlowNodeInstanceManagementApi) {
    this.flowNodeInstanceService = flowNodeInstanceService;
  }

  public async getFlowNodeInstancesForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.flowNodeInstanceService.getFlowNodeInstancesForProcessInstance(
      identity,
      processInstanceId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getAllSuspendedTasks(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.flowNodeInstanceService.getAllSuspendedTasks(
      identity,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.flowNodeInstanceService.getSuspendedTasksForProcessModel(
      identity,
      processModelId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.flowNodeInstanceService.getSuspendedTasksForProcessInstance(
      identity,
      processInstanceId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.flowNodeInstanceService.getSuspendedTasksForCorrelation(
      identity,
      correlationId,
      offset,
      limit,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getSuspendedTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.flowNodeInstanceService.getSuspendedTasksForProcessModelInCorrelation(
      identity,
      processModelId,
      correlationId,
      offset,
      limit,
    );

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
