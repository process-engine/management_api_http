import {BadRequestError} from '@essential-projects/errors_ts';
import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {APIs, DataModels, HttpController} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class ProcessModelController implements HttpController.IProcessModelHttpController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private processModelService: APIs.IProcessModelManagementApi;

  constructor(processModelService: APIs.IProcessModelManagementApi) {
    this.processModelService = processModelService;
  }

  public async getProcessModels(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity = request.identity;
    const offset = this.parseOffset(request);
    const limit = this.parseLimit(request);

    const result = await this.processModelService.getProcessModels(identity, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;

    const result = await this.processModelService.getProcessModelById(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;

    const result = await this.processModelService.getProcessModelByProcessInstanceId(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getStartEventsForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const identity = request.identity;

    const result = await this.processModelService.getStartEventsForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async startProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId = request.params.process_model_id;
    const startEventId = request.query.start_event_id as string;
    const endEventId = request.query.end_event_id as string;
    const payload = request.body;

    let startCallbackType = <DataModels.ProcessModels.StartCallbackType> parseInt(request.query.start_callback_type as string);

    if (!startCallbackType) {
      startCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const identity = request.identity;

    const result =
      await this.processModelService.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async updateProcessDefinitionsByName(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processDefinitionsName = request.params.process_definitions_name;
    const payload = request.body;
    const identity = request.identity;

    await this.processModelService.updateProcessDefinitionsByName(identity, processDefinitionsName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async deleteProcessDefinitionsByProcessModelId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processDefinitionsName = request.params.process_model_id;
    const identity = request.identity;

    await this.processModelService.deleteProcessDefinitionsByProcessModelId(identity, processDefinitionsName);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async terminateProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId = request.params.process_instance_id;
    const identity = request.identity;

    await this.processModelService.terminateProcessInstance(identity, processInstanceId);

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
