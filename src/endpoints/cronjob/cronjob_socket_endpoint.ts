import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {APIs, Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:cronjobs');

type UserSubscriptionDictionary = {[userId: string]: Array<Subscription>};

export class CronjobSocketEndpoint extends BaseSocketEndpoint {

  private connections: Map<string, IIdentity> = new Map();

  private notificationService: APIs.INotificationManagementApi;
  private eventAggregator: IEventAggregator;
  private identityService: IIdentityService;

  private endpointSubscriptions: Array<Subscription> = [];
  private userSubscriptions: UserSubscriptionDictionary = {};

  constructor(
    eventAggregator: IEventAggregator,
    identityService: IIdentityService,
    notificationService: APIs.INotificationManagementApi,
  ) {
    super();
    this.eventAggregator = eventAggregator;
    this.identityService = identityService;
    this.notificationService = notificationService;
  }

  public get namespace(): string {
    return socketSettings.namespace;
  }

  public async initializeEndpoint(socketIo: SocketIO.Namespace): Promise<void> {

    socketIo.on('connect', async (socket: SocketIO.Socket): Promise<void> => {
      const token = socket.handshake.headers.authorization;

      const identityNotSet = token === undefined;
      if (identityNotSet) {
        logger.error('A Socket.IO client attempted to connect without providing an Auth-Token!');
        socket.disconnect();
        throw new UnauthorizedError('No auth token provided!');
      }

      const identity = await this.identityService.getIdentity(token);

      this.connections.set(socket.id, identity);

      logger.info(`Client with socket id "${socket.id} connected."`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on('disconnect', async (reason: any): Promise<void> => {
        this.connections.delete(socket.id);

        await this.clearUserScopeNotifications(identity);

        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });

      await this.createUserScopeNotifications(socket, identity);
    });

    await this.createSocketScopeNotifications(socketIo);
  }

  public async dispose(): Promise<void> {

    logger.info('Disposing Socket IO subscriptions...');
    // Clear out Socket-scope Subscriptions.
    for (const subscription of this.endpointSubscriptions) {
      this.eventAggregator.unsubscribe(subscription);
    }

    // Clear out all User-Subscriptions.
    // eslint-disable-next-line
    for (const userId in this.userSubscriptions) {
      const userSubscriptions = this.userSubscriptions[userId];

      for (const subscription of userSubscriptions) {
        this.eventAggregator.unsubscribe(subscription);
      }

      delete this.userSubscriptions[userId];
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

    const cronjobCreatedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobCreated,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cronjobCreatedMessage: any): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobCreated, cronjobCreatedMessage);
        },
      );

    const cronjobExecutedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobExecuted,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cronjobExecutedMessage: any): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobExecuted, cronjobExecutedMessage);
        },
      );

    const cronjobStoppedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobStopped,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cronjobStoppedMessage: any): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobStopped, cronjobStoppedMessage);
        },
      );

    const cronjobUpdatedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.cronjobUpdated,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cronjobUpdatedMessage: any): void => {
          socketIoInstance.emit(socketSettings.paths.cronjobUpdated, cronjobUpdatedMessage);
        },
      );

    this.endpointSubscriptions.push(cronjobCreatedSubscription);
    this.endpointSubscriptions.push(cronjobExecutedSubscription);
    this.endpointSubscriptions.push(cronjobStoppedSubscription);
    this.endpointSubscriptions.push(cronjobUpdatedSubscription);
  }

  /**
   * Creates a number of Subscriptions for events that are only published for
   * certain identities.
   * An example would be "Cronjob started by User with ID 123456".
   *
   * @async
   * @param socket   The socketIO client on which to create the subscriptions.
   * @param identity The identity for which to create the subscriptions
   */
  private async createUserScopeNotifications(socket: SocketIO.Socket, identity: IIdentity): Promise<void> {

    const userSubscriptions: Array<Subscription> = [];

    const onCronjobCreatedSubscription =
      await this.notificationService.onCronjobCreated(
        identity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (message: any): void => {

          const eventToPublish = socketSettings.paths.cronjobCreated
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onCronjobExecutedSubscription =
      await this.notificationService.onCronjobExecuted(
        identity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (message: any): void => {

          const eventToPublish = socketSettings.paths.cronjobExecuted
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onCronjobStoppedSubscription =
      await this.notificationService.onCronjobStopped(
        identity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (message: any): void => {

          const eventToPublish = socketSettings.paths.cronjobStopped
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    const onCronjobUpdatedSubscription =
      await this.notificationService.onCronjobUpdated(
        identity,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (message: any): void => {

          const eventToPublish = socketSettings.paths.cronjobUpdated
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        },
      );

    userSubscriptions.push(onCronjobCreatedSubscription);
    userSubscriptions.push(onCronjobExecutedSubscription);
    userSubscriptions.push(onCronjobStoppedSubscription);
    userSubscriptions.push(onCronjobUpdatedSubscription);

    this.userSubscriptions[identity.userId] = userSubscriptions;
  }

  /**
   * Clears out all Subscriptions for the given identity.
   * Should only be used when a client disconnects.
   *
   * @async
   * @param identity The identity for which to remove the Subscriptions.
   */
  private async clearUserScopeNotifications(identity: IIdentity): Promise<void> {

    logger.verbose(`Clearing subscriptions for user with ID ${identity.userId}`);
    const userSubscriptions = this.userSubscriptions[identity.userId];

    const noSubscriptionsFound = !userSubscriptions;
    if (noSubscriptionsFound) {
      logger.verbose(`No subscriptions for user with ID ${identity.userId} found.`);

      return;
    }

    for (const subscription of userSubscriptions) {
      await this.notificationService.removeSubscription(identity, subscription);
    }

    delete this.userSubscriptions[identity.userId];
  }

}
