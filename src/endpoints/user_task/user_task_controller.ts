import {BadRequestError} from '@essential-projects/errors_ts';
import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class UserTaskController implements HttpController.IUserTaskHttpController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private userTaskService: APIs.IUserTaskManagementApi;

  constructor(userTaskService: APIs.IUserTaskManagementApi) {
    this.userTaskService = userTaskService;
  }

  public async getUserTasksForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.userTaskService.getUserTasksForProcessModel(identity, processModelId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getUserTasksForProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.userTaskService.getUserTasksForProcessInstance(identity, processInstanceId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getUserTasksForCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const correlationId = request.params.correlation_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.userTaskService.getUserTasksForCorrelation(identity, correlationId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getUserTasksForProcessModelInCorrelation(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processModelId = request.params.process_model_id;
    const correlationId = request.params.correlation_id;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.userTaskService.getUserTasksForProcessModelInCorrelation(identity, processModelId, correlationId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async finishUserTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const processInstanceId = request.params.process_instance_id;
    const correlationId = request.params.correlation_id;
    const userTaskInstanceId = request.params.user_task_instance_id;
    const userTaskResult = request.body;

    await this.userTaskService.finishUserTask(identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);

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
