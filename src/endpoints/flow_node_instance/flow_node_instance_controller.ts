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
    const offset = request.query.offset || 0;
    const limit = request.query.limit || 0;

    const result = await this.flowNodeInstanceService.getFlowNodeInstancesForProcessInstance(identity, processInstanceId, offset, limit);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

}
