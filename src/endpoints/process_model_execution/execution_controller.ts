import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  Correlation,
  EventList,
  IManagementApi,
  ProcessModelExecution,
  restSettings,
} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class ProcessModelExecutionController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private _managementApiService: IManagementApi;

  constructor(managementApiService: IManagementApi) {
    this._managementApiService = managementApiService;
  }

  private get managementApiService(): IManagementApi {
    return this._managementApiService;
  }

  public async getProcessModels(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;

    const result: ProcessModelExecution.ProcessModelList = await this.managementApiService.getProcessModels(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: ProcessModelExecution.ProcessModel = await this.managementApiService.getProcessModelById(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getCorrelationsForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: Array<Correlation> = await this.managementApiService.getCorrelationsForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEventsForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: EventList = await this.managementApiService.getEventsForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async startProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const startEventId: string = request.params.start_event_id;
    const endEventId: string = request.query[restSettings.queryParams.endEventId];
    const payload: ProcessModelExecution.ProcessStartRequestPayload = request.body;
    let startCallbackType: ProcessModelExecution.StartCallbackType =
      <ProcessModelExecution.StartCallbackType> Number.parseInt(request.query.start_callback_type);

    if (!startCallbackType) {
      startCallbackType = ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const identity: IIdentity = request.identity;

    const result: ProcessModelExecution.ProcessStartResponsePayload =
      await this.managementApiService.startProcessInstance(identity, processModelId, startEventId, payload, startCallbackType, endEventId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async updateProcessDefinitionsByName(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processDefinitionsName: string = request.params.process_definitions_name;
    const payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload = request.body;
    const identity: IIdentity = request.identity;

    await this.managementApiService.updateProcessDefinitionsByName(identity, processDefinitionsName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
