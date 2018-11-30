import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  ActiveToken,
  FlowNodeRuntimeInformation,
  IManagementApi,
  LogEntry,
  TokenHistoryEntry,
} from '@process-engine/management_api_contracts';

import {Response} from 'express';

export class HeatmapController {

  private httpCodeSuccessfulResponse: number = 200;

  private _managementApiService: IManagementApi;

  constructor(managementApiService: IManagementApi) {
    this._managementApiService = managementApiService;
  }

  private get managementApiService(): IManagementApi {
    return this._managementApiService;
  }

  public async getRuntimeInformationForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;

    const result: Array<FlowNodeRuntimeInformation> =
      await this.managementApiService.getRuntimeInformationForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getRuntimeInformationForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;
    const flowNodeId: string = request.params.flow_node_id;

    const result: FlowNodeRuntimeInformation =
      await this.managementApiService.getRuntimeInformationForFlowNode(identity, processModelId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;

    const result: Array<ActiveToken> = await this.managementApiService.getActiveTokensForProcessModel(identity, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForCorrelationAndProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;

    const result: Array<ActiveToken> = await this.managementApiService.getActiveTokensForCorrelationAndProcessModel(identity,
                                                                                                                    correlationId,
                                                                                                                    processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getActiveTokensForFlowNode(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const flowNodeId: string = request.params.flow_node_id;

    const result: Array<ActiveToken> = await this.managementApiService.getActiveTokensForFlowNode(identity, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getProcessModelLog(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const processModelId: string = request.params.process_model_id;
    const correlationId: string = request.query.correlation_id;

    const result: Array<LogEntry> = await this.managementApiService.getProcessModelLog(identity, processModelId, correlationId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForFlowNodeInstance(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;
    const flowNodeId: string = request.params.flow_node_id;

    const result: Array<TokenHistoryEntry> =
      await this.managementApiService.getTokensForFlowNodeInstance(identity, correlationId, processModelId, flowNodeId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async getTokensForCorrelationAndProcessModel(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;
    const correlationId: string = request.params.correlation_id;
    const processModelId: string = request.params.process_model_id;

    const result: Array<TokenHistoryEntry> =
      await this.managementApiService.getTokensForCorrelationAndProcessModel(identity, correlationId, processModelId);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }
}
