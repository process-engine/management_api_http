import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {IManagementApi, Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:user_tasks');

type UserSubscriptionDictionary = {[userId: string]: Array<Subscription>};

export class IntermediateEventSocketEndpoint extends BaseSocketEndpoint {

  private _connections: Map<string, IIdentity> = new Map();

  private _managementApiService: IManagementApi;
  private _eventAggregator: IEventAggregator;
  private _identityService: IIdentityService;

  private _endpointSubscriptions: Array<Subscription> = [];

  constructor(eventAggregator: IEventAggregator, identityService: IIdentityService, managementApiService: IManagementApi) {
    super();
    this._eventAggregator = eventAggregator;
    this._identityService = identityService;
    this._managementApiService = managementApiService;
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

      socket.on('disconnect', async(reason: any) => {
        this._connections.delete(socket.id);

        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });
    });

    await this.createSocketScopeNotifications(socketIo);
  }

  public async dispose(): Promise<void> {

    logger.info(`Disposing Socket IO subscriptions...`);
    // Clear out Socket-scope Subscriptions.
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
  private async createSocketScopeNotifications(socketIoInstance: SocketIO.Namespace): Promise<void> {

    const intermediateEventTriggeredSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.intermediateEventTriggered,
        (intermediateEventTriggeredMessage: Messages.SystemEvents.IntermediateEventTriggeredMessage) => {
          socketIoInstance.emit(socketSettings.paths.intermediateEventTriggered, intermediateEventTriggeredMessage);
        });

    const intermediateCatchEventFinishedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.intermediateCatchEventFinished,
        (intermediateCatchEventFinishedMessage: Messages.SystemEvents.IntermediateCatchEventFinishedMessage) => {
          socketIoInstance.emit(socketSettings.paths.intermediateCatchEventFinished, intermediateCatchEventFinishedMessage);
        });

    this._endpointSubscriptions.push(intermediateEventTriggeredSubscription);
    this._endpointSubscriptions.push(intermediateCatchEventFinishedSubscription);
  }
}
