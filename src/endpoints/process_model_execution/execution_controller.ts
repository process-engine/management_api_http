import {
  EventList,
  IManagementApiService,
  ManagementContext,
  ManagementRequest,
  ProcessModelExecution,
  restSettings,
} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class ProcessModelExecutionController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private _managementApiService: IManagementApiService;

  constructor(managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService;
  }

  private get managementApiService(): IManagementApiService {
    return this._managementApiService;
  }

  public async getProcessModels(request: ManagementRequest, response: Response): Promise<void> {
    const context: ManagementContext = request.managementContext;

    const result: ProcessModelExecution.ProcessModelList = await this.managementApiService.getProcessModels(context);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelById(request: ManagementRequest, response: Response): Promise<void> {
    const processModelId: string = request.params[restSettings.params.processModelId];
    const context: ManagementContext = request.managementContext;

    const result: ProcessModelExecution.ProcessModel = await this.managementApiService.getProcessModelById(context, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async startProcessInstance(request: ManagementRequest, response: Response): Promise<void> {
    const processModelId: string = request.params[restSettings.params.processModelId];
    const startEventId: string = request.params[restSettings.params.startEventId];
    const endEventId: string = request.query[restSettings.queryParams.endEventId];
    const payload: ProcessModelExecution.ProcessStartRequestPayload = request.body;
    let startCallbackType: ProcessModelExecution.StartCallbackType =
      <ProcessModelExecution.StartCallbackType> Number.parseInt(request.query.start_callback_type);

    if (!startCallbackType) {
      startCallbackType = ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const context: ManagementContext = request.managementContext;

    const result: ProcessModelExecution.ProcessStartResponsePayload =
      await this.managementApiService.startProcessInstance(context, processModelId, startEventId, payload, startCallbackType, endEventId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEventsForProcessModel(request: ManagementRequest, response: Response): Promise<void> {
    const processModelId: string = request.params[restSettings.params.processModelId];
    const context: ManagementContext = request.managementContext;

    const result: EventList = await this.managementApiService.getEventsForProcessModel(context, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async updateProcessDefinitionsById(request: ManagementRequest, response: Response): Promise<void> {
    const processDefinitionsName: string = request.params[restSettings.params.processDefinitionsName];
    const payload: ProcessModelExecution.UpdateProcessDefinitionsRequestPayload = request.body;
    const context: ManagementContext = request.managementContext;

    await this.managementApiService.updateProcessDefinitionsById(context, processDefinitionsName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
