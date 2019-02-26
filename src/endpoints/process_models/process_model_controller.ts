import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {DataModels, IManagementApi, restSettings} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class ProcessModelController {

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

    const result: DataModels.ProcessModels.ProcessModelList = await this.managementApiService.getProcessModels(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelById(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: DataModels.ProcessModels.ProcessModel = await this.managementApiService.getProcessModelById(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelByProcessInstanceId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processInstanceId: string = request.params.process_instance_id;
    const identity: IIdentity = request.identity;

    const result: DataModels.ProcessModels.ProcessModel =
      await this.managementApiService.getProcessModelByProcessInstanceId(identity, processInstanceId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getStartEventsForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    const result: DataModels.Events.EventList = await this.managementApiService.getStartEventsForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async startProcessInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processModelId: string = request.params.process_model_id;
    const startEventId: string = request.query[restSettings.queryParams.startEventId];
    const endEventId: string = request.query[restSettings.queryParams.endEventId];
    const payload: DataModels.ProcessModels.ProcessStartRequestPayload = request.body;
    let startCallbackType: DataModels.ProcessModels.StartCallbackType =
      <DataModels.ProcessModels.StartCallbackType> Number.parseInt(request.query.start_callback_type);

    if (!startCallbackType) {
      startCallbackType = DataModels.ProcessModels.StartCallbackType.CallbackOnProcessInstanceCreated;
    }

    const identity: IIdentity = request.identity;

    const result: DataModels.ProcessModels.ProcessStartResponsePayload =
      await this.managementApiService.startProcessInstance(identity, processModelId, payload, startCallbackType, startEventId, endEventId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async updateProcessDefinitionsByName(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processDefinitionsName: string = request.params.process_definitions_name;
    const payload: DataModels.ProcessModels.UpdateProcessDefinitionsRequestPayload = request.body;
    const identity: IIdentity = request.identity;

    await this.managementApiService.updateProcessDefinitionsByName(identity, processDefinitionsName, payload);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async deleteProcessDefinitionsByProcessModelId(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const processDefinitionsName: string = request.params.process_model_id;
    const identity: IIdentity = request.identity;

    await this.managementApiService.deleteProcessDefinitionsByProcessModelId(identity, processDefinitionsName);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }
}
