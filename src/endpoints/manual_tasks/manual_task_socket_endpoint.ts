import {Logger} from 'loggerhythm';

import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity} from '@essential-projects/iam_contracts';
import {IEndpointSocketScope, ISocketClient} from '@essential-projects/websocket_contracts';

import {IManagementApi, Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:user_tasks');

type UserSubscriptionDictionary = {[userId: string]: Array<Subscription>};

export class ManualTaskSocketEndpoint extends BaseSocketEndpoint {

  private _managementApiService: IManagementApi;
  private _eventAggregator: IEventAggregator;

  private _endpointSubscriptions: Array<Subscription> = [];
  private _userSubscriptions: UserSubscriptionDictionary = {};

  constructor(eventAggregator: IEventAggregator, managementApiService: IManagementApi) {
    super();
    this._eventAggregator = eventAggregator;
    this._managementApiService = managementApiService;
  }

  public get namespace(): string {
    return socketSettings.namespace;
  }

  public async initializeEndpoint(endpoint: IEndpointSocketScope): Promise<void> {

    endpoint.on('connect', async(socket: ISocketClient, identity: IIdentity) => {

      socket.onDisconnect(async() => {
        await this._clearUserScopeNotifications(identity);
      });

      await this._createUserScopeNotifications(socket, identity);
    });

    await this._createSocketScopeNotifications(endpoint);
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
  private async _createSocketScopeNotifications(endpoint: IEndpointSocketScope): Promise<void> {

    const manualTaskReachedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.manualTaskReached,
        (manualTaskWaitingMessage: Messages.SystemEvents.ManualTaskReachedMessage) => {
          endpoint.emit(socketSettings.paths.manualTaskWaiting, manualTaskWaitingMessage);
        });

    const manualTaskFinishedSubscription: Subscription =
      this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.manualTaskFinished,
        (manualTaskFinishedMessage: Messages.SystemEvents.ManualTaskFinishedMessage) => {
          endpoint.emit(socketSettings.paths.manualTaskFinished, manualTaskFinishedMessage);
        });

    this._endpointSubscriptions.push(manualTaskReachedSubscription);
    this._endpointSubscriptions.push(manualTaskFinishedSubscription);
  }

  /**
   * Creates a number of Subscriptions for events that are only published for
   * certain identities.
   * An example would be "ManualTask started by User with ID 123456".
   *
   * @async
   * @param socket   The socketIO client on which to create the subscriptions.
   * @param identity The identity for which to create the subscriptions
   */
  private async _createUserScopeNotifications(socket: ISocketClient, identity: IIdentity): Promise<void> {

    const userSubscriptions: Array<Subscription> = [];

    const onManualTaskForIdentityWaitingSubscription: Subscription =
      await this._managementApiService.onManualTaskForIdentityWaiting(identity,
        (message: Messages.SystemEvents.UserTaskReachedMessage) => {

          const eventToPublish: string = socketSettings.paths.manualTaskForIdentityWaiting
            .replace(socketSettings.pathParams.userId, identity.userId);

          socket.emit(eventToPublish, message);
        });

    const onManualTaskForIdentityFinishedSubscription: Subscription =
      await this._managementApiService.onManualTaskForIdentityFinished(identity,
      (message: Messages.SystemEvents.UserTaskReachedMessage) => {

        const eventToPublish: string = socketSettings.paths.manualTaskForIdentityFinished
          .replace(socketSettings.pathParams.userId, identity.userId);

        socket.emit(eventToPublish, message);
      });

    userSubscriptions.push(onManualTaskForIdentityWaitingSubscription);
    userSubscriptions.push(onManualTaskForIdentityFinishedSubscription);

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
