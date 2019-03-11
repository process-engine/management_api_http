import {Logger} from 'loggerhythm';

import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IEndpointSocketScope} from '@essential-projects/websocket_contracts';

import {Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:user_tasks');

export class ProcessModelSocketEndpoint extends BaseSocketEndpoint {

  private _eventAggregator: IEventAggregator;

  private _endpointSubscriptions: Array<Subscription> = [];

  constructor(eventAggregator: IEventAggregator) {
    super();
    this._eventAggregator = eventAggregator;
  }

  public get namespace(): string {
    return socketSettings.namespace;
  }

  public async initializeEndpoint(endpoint: IEndpointSocketScope): Promise<void> {
    await this._createSocketScopeNotifications(endpoint);
  }

  public async dispose(): Promise<void> {
    logger.info(`Disposing Socket IO subscriptions...`);
    for (const subscription of this._endpointSubscriptions) {
      this._eventAggregator.unsubscribe(subscription);
    }
  }

  /**
   * Creates a number of Subscriptions for globally published events.
   * These events will be published for every user connected to the socketIO
   * instance.
   *
   * @async
   * @param socketIoInstance The socketIO instance for which to create the
   *                         subscriptions.
   */
  private async _createSocketScopeNotifications(endpoint: IEndpointSocketScope): Promise<void> {

    const processStartedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.processStarted,
        (processStartedMessage: Messages.SystemEvents.ProcessStartedMessage) => {
          endpoint.emit(socketSettings.paths.processStarted, processStartedMessage);

          const processInstanceStartedIdMessage: string =
            socketSettings.paths.processInstanceStarted
              .replace(socketSettings.pathParams.processModelId, processStartedMessage.processModelId);

          endpoint.emit(processInstanceStartedIdMessage, processStartedMessage);
        });

    const processEndedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.processEnded,
        (processEndedMessage: Messages.BpmnEvents.EndEventReachedMessage) => {
          endpoint.emit(socketSettings.paths.processEnded, processEndedMessage);
        });

    const processTerminatedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.processTerminated,
        (processTerminatedMessage: Messages.BpmnEvents.TerminateEndEventReachedMessage) => {
          endpoint.emit(socketSettings.paths.processTerminated, processTerminatedMessage);
        });

    this._endpointSubscriptions.push(processStartedSubscription);
    this._endpointSubscriptions.push(processEndedSubscription);
    this._endpointSubscriptions.push(processTerminatedSubscription);
  }
}
