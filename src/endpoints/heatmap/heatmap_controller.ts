import {ActiveToken, FlowNodeRuntimeInformation} from '@process-engine/kpi_api_contracts';
import {LogEntry} from '@process-engine/logging_api_contracts';
import {TokenHistoryEntry} from '@process-engine/token_history_api_contracts';

import {
  IManagementApiService,
  ManagementContext,
  ManagementRequest,
} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class HeatmapController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;

  private _managementApiService: IManagementApiService;

  constructor(managementApiService: IManagementApiService) {
    this._managementApiService = managementApiService;
  }

  private get managementApiService(): IManagementApiService {
    return this._managementApiService;
  }

  public async getRuntimeInformationForProcessModel(request: ManagementRequest, response: Response): Promise<void> {
    const context: ManagementContext = request.managementContext;
    const processModelId: string = request.params.process_model_id;

    const result: Array<FlowNodeRuntimeInformation> =
      await this.managementApiService.getRuntimeInformationForProcessModel(context, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getRuntimeInformationForFlowNode(request: ManagementRequest, response: Response): Promise<void> {
    const context: ManagementContext = request.managementContext;
    const processModelId: string = request.params.process_model_id;
    const flowNodeId: string = request.params.flow_node_id;

    const result: FlowNodeRuntimeInformation =
      await this.managementApiService.getRuntimeInformationForFlowNode(context, processModelId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForProcessModel(request: ManagementRequest, response: Response): Promise<void> {
    const context: ManagementContext = request.managementContext;
    const processModelId: string = request.params.process_model_id;

    const result: Array<ActiveToken> = await this.managementApiService.getActiveTokensForProcessModel(context, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForFlowNode(request: ManagementRequest, response: Response): Promise<void> {
    const context: ManagementContext = request.managementContext;
    const flowNodeId: string = request.params.flow_node_id;

    const result: Array<ActiveToken> = await this.managementApiService.getActiveTokensForFlowNode(context, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getLogsForProcessModel(request: ManagementRequest, response: Response): Promise<void> {
    const context: ManagementContext = request.managementContext;
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;

    const result: Array<LogEntry> = await this.managementApiService.getLogsForProcessModel(context, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForFlowNodeInstance(request: ManagementRequest, response: Response): Promise<void> {
    const context: ManagementContext = request.managementContext;
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;
    const flowNodeId: string = request.params.flow_node_id;

    const result: Array<TokenHistoryEntry> =
      await this.managementApiService.getTokensForFlowNodeInstance(context, correlationId, processModelId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
