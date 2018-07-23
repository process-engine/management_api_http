import {
  EventList,
  IManagementApiService,
  ManagementContext,
  ManagementRequest,
  ProcessModelExecution,
} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class ProcessModelExecutionController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;

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
    const processModelId: string = request.params.process_model_key;
    const context: ManagementContext = request.managementContext;

    const result: ProcessModelExecution.ProcessModel = await this.managementApiService.getProcessModelById(context, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async startProcessInstance(request: ManagementRequest, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_key;
    const startEventKey: string = request.params.start_event_key;
    const endEventKey: string = request.query.end_event_key;
    const payload: ProcessModelExecution.ProcessStartRequestPayload = request.body;
    let startCallbackType: ProcessModelExecution.StartCallbackType =
      <ProcessModelExecution.StartCallbackType> Number.parseInt(request.query.start_callback_type);

    if (!startCallbackType) {
      startCallbackType = ProcessModelExecution.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const context: ManagementContext = request.managementContext;

    const result: ProcessModelExecution.ProcessStartResponsePayload =
      await this.managementApiService.startProcessInstance(context, processModelId, startEventKey, payload, startCallbackType, endEventKey);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getEventsForProcessModel(request: ManagementRequest, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_key;
    const context: ManagementContext = request.managementContext;

    const result: EventList = await this.managementApiService.getEventsForProcessModel(context, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
