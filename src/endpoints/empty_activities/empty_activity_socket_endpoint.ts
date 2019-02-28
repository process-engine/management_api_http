import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {IManagementApi, Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:user_tasks');

type UserSubscriptionDictionary = {[userId: string]: Array<Subscription>};

export class EmptyActivitySocketEndpoint extends BaseSocketEndpoint {

  private _connections: Map<string, IIdentity> = new Map();

  private _managementApiService: IManagementApi;
  private _eventAggregator: IEventAggregator;
  private _identityService: IIdentityService;

  private _endpointSubscriptions: Array<Subscription> = [];
  private _userSubscriptions: UserSubscriptionDictionary = {};

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

        await this._clearUserScopeNotifications(identity);

        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });

      await this._createUserScopeNotifications(socket, identity);
    });

    await this._createSocketScopeNotifications(socketIo);
  }

  public async dispose(): Promise<void> {

    logger.info(`Disposing Socket IO subscriptions...`);
    // Clear out Socket-scope Subscriptions.
    for (const subscription of this._endpointSubscriptions) {
      this._eventAggregator.unsubscribe(subscription);
    }

    // Clear out all User-Subscriptions.
    for (const userId in this._userSubscriptions) {
      const userSubscriptions: Array<Subscription> = this._userSubscriptions[userId];

      for (const subscription of userSubscriptions) {
        this._eventAggregator.unsubscribe(subscription);
      }

      delete this._userSubscriptions[userId];
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
  private async _createSocketScopeNotifications(socketIoInstance: SocketIO.Namespace): Promise<void> {

    const emptyActivityReachedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.emptyActivityReached,
        (emptyActivityWaitingMessage: Messages.SystemEvents.EmptyActivityReachedMessage) => {
          socketIoInstance.emit(socketSettings.paths.emptyActivityWaiting, emptyActivityWaitingMessage);
        });

    const emptyActivityFinishedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.emptyActivityFinished,
        (emptyActivityFinishedMessage: Messages.SystemEvents.EmptyActivityFinishedMessage) => {
          socketIoInstance.emit(socketSettings.paths.emptyActivityFinished, emptyActivityFinishedMessage);
        });

    this._endpointSubscriptions.push(emptyActivityReachedSubscription);
    this._endpointSubscriptions.push(emptyActivityFinishedSubscription);
  }

  /**
   * Creates a number of Subscriptions for events that are only published for
   * certain identities.
   * An example would be "EmptyActivity started by User with ID 123456".
   *
   * @async
   * @param socket   The socketIO client on which to create the subscriptions.
   * @param identity The identity for which to create the subscriptions
   */
  private async _createUserScopeNotifications(socket: SocketIO.Socket, identity: IIdentity): Promise<void> {

    const userSubscriptions: Array<Subscription> = [];

    const onEmptyActivityForIdentityWaitingSubscription: Subscription =
      await this._managementApiService.onEmptyActivityForIdentityWaiting(identity,
        (message: Messages.SystemEvents.UserTaskReachedMessage) => {

          const eventToPublish: string = socketSettings.paths.emptyActivityForIdentityWaiting
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        });

    const onEmptyActivityForIdentityFinishedSubscription: Subscription =
      await this._managementApiService.onEmptyActivityForIdentityFinished(identity,
      (message: Messages.SystemEvents.UserTaskReachedMessage) => {

        const eventToPublish: string = socketSettings.paths.emptyActivityForIdentityFinished
          .replace(socketSettings.pathParams.userId, identity.userId);

        socket.emit(eventToPublish, message);
      });

    userSubscriptions.push(onEmptyActivityForIdentityWaitingSubscription);
    userSubscriptions.push(onEmptyActivityForIdentityFinishedSubscription);

    this._userSubscriptions[identity.userId] = userSubscriptions;
  }

  /**
   * Clears out all Subscriptions for the given identity.
   * Should only be used when a client disconnects.
   *
   * @async
   * @param identity The identity for which to remove the Subscriptions.
   */
  private async _clearUserScopeNotifications(identity: IIdentity): Promise<void> {

    logger.verbose(`Clearing subscriptions for user with ID ${identity.userId}`);
    const userSubscriptions: Array<Subscription> = this._userSubscriptions[identity.userId];

    const noSubscriptionsFound: boolean = !userSubscriptions;
    if (noSubscriptionsFound) {
      logger.verbose(`No subscriptions for user with ID ${identity.userId} found.`);

      return;
    }

    for (const subscription of userSubscriptions) {
      await this._managementApiService.removeSubscription(identity, subscription);
    }

    delete this._userSubscriptions[identity.userId];
  }
}
