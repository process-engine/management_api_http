import {
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

  public async startProcessInstance(request: ManagementRequest, response: Response): Promise<void> {
    const processModelKey: string = request.params.process_model_key;
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
      await this.managementApiService.startProcessInstance(context, processModelKey, startEventKey, payload, startCallbackType, endEventKey);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
