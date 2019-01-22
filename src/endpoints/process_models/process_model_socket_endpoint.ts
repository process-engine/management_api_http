import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:user_tasks');

export class ProcessModelSocketEndpoint extends BaseSocketEndpoint {

  private _connections: Map<string, IIdentity> = new Map();

  private _eventAggregator: IEventAggregator;
  private _identityService: IIdentityService;

  private _endpointSubscriptions: Array<Subscription> = [];

  constructor(eventAggregator: IEventAggregator, identityService: IIdentityService) {
    super();
    this._eventAggregator = eventAggregator;
    this._identityService = identityService;
  }

  public get namespace(): string {
    return socketSettings.namespace;
  }

  public async initializeEndpoint(socketIo: SocketIO.Namespace): Promise<void> {

    socketIo.on('connect', async(socket: SocketIO.Socket) => {
      const token: string = socket.handshake.headers['authorization'];

      const identityNotSet: boolean = token === undefined;
      if (identityNotSet) {
        logger.error('A Socket.IO client attempted to connect without providing an Auth-Token!');
        socket.disconnect();
        throw new UnauthorizedError('No auth token provided!');
      }

      const identity: IIdentity = await this._identityService.getIdentity(token);

      this._connections.set(socket.id, identity);

      logger.info(`Client with socket id "${socket.id} connected."`);

      socket.on('disconnect', (reason: any) => {
        this._connections.delete(socket.id);
        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });
    });

    await this._createSocketScopeNotifications(socketIo);
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
  private async _createSocketScopeNotifications(socketIoInstance: SocketIO.Namespace): Promise<void> {

    const processStartedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.processStarted,
        (processStartedMessage: Messages.Public.SystemEvents.ProcessStartedMessage) => {
          socketIoInstance.emit(socketSettings.paths.processStarted, processStartedMessage);

          const processInstanceStartedIdMessage: string =
            socketSettings.paths.processInstanceStarted
              .replace(socketSettings.pathParams.processModelId, processStartedMessage.processModelId);

          socketIoInstance.emit(processInstanceStartedIdMessage, processStartedMessage);
        });

    const processEndedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.processEnded,
        (processEndedMessage: Messages.Public.BpmnEvents.EndEventReachedMessage) => {
          socketIoInstance.emit(socketSettings.paths.processEnded, processEndedMessage);
        });

    const processTerminatedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.processTerminated,
        (processTerminatedMessage: Messages.Public.BpmnEvents.TerminateEndEventReachedMessage) => {
          socketIoInstance.emit(socketSettings.paths.processTerminated, processTerminatedMessage);
        });

    this._endpointSubscriptions.push(processStartedSubscription);
    this._endpointSubscriptions.push(processEndedSubscription);
    this._endpointSubscriptions.push(processTerminatedSubscription);
  }

}
