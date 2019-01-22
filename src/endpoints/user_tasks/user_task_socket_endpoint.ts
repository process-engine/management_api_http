import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {IManagementApi, Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:user_tasks');

type UserSubscriptionDictionary = {[userId: string]: Array<Subscription>};

export class UserTaskSocketEndpoint extends BaseSocketEndpoint {

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

      socket.on('disconnect', (reason: any) => {
        this._connections.delete(socket.id);

        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });

      await this._createUserScopeNotifications(socket, identity);
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

    const userTaskReachedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.userTaskReached,
        (userTaskWaitingMessage: Messages.Public.SystemEvents.UserTaskReachedMessage) => {
          socketIoInstance.emit(socketSettings.paths.userTaskWaiting, userTaskWaitingMessage);
        });

    const userTaskFinishedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.userTaskFinished,
        (userTaskFinishedMessage: Messages.Public.SystemEvents.UserTaskFinishedMessage) => {
          socketIoInstance.emit(socketSettings.paths.userTaskFinished, userTaskFinishedMessage);
        });

    this._endpointSubscriptions.push(userTaskReachedSubscription);
    this._endpointSubscriptions.push(userTaskFinishedSubscription);
  }

  /**
   * Creates a number of Subscriptions for events that are only published for
   * certain identities.
   * An example would be "UserTask started by User with ID 123456".
   *
   * @async
   * @param socket   The socketIO client on which to create the subscriptions.
   * @param identity The identity for which to create the subscriptions
   */
  private async _createUserScopeNotifications(socket: SocketIO.Socket, identity: IIdentity): Promise<void> {

    const userSubscriptions: Array<Subscription> = [];

    const onUserTaskForIdentityWaitingSubscription: Subscription =
      await this._managementApiService.onUserTaskForIdentityWaiting(identity,
        (message: Messages.Public.SystemEvents.UserTaskReachedMessage) => {

          const eventToPublish: string = socketSettings.paths.userTaskForIdentityWaiting
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        });

    const onUserTaskForIdentityFinishedSubscription: Subscription =
      await this._managementApiService.onUserTaskForIdentityFinished(identity,
        (message: Messages.Public.SystemEvents.UserTaskReachedMessage) => {

          const eventToPublish: string = socketSettings.paths.userTaskForIdentityFinished
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        });

    userSubscriptions.push(onUserTaskForIdentityWaitingSubscription);
    userSubscriptions.push(onUserTaskForIdentityFinishedSubscription);

    this._userSubscriptions[identity.userId] = userSubscriptions;
  }
}
