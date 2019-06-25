import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator, Subscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {IIdentity, IIdentityService} from '@essential-projects/iam_contracts';

import {Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger = Logger.createLogger('management_api:socket.io_endpoint:activities');

export class ActivitySocketEndpoint extends BaseSocketEndpoint {

  private connections: Map<string, IIdentity> = new Map();

  private eventAggregator: IEventAggregator;
  private identityService: IIdentityService;

  private endpointSubscriptions: Array<Subscription> = [];

  constructor(eventAggregator: IEventAggregator, identityService: IIdentityService) {
    super();
    this.eventAggregator = eventAggregator;
    this.identityService = identityService;
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

        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });
    });

    await this.createSocketScopeNotifications(socketIo);
  }

  public async dispose(): Promise<void> {

    logger.info('Disposing Socket IO subscriptions...');
    // Clear out Socket-scope Subscriptions.
    for (const subscription of this.endpointSubscriptions) {
      this.eventAggregator.unsubscribe(subscription);
    }
  }

  private async createSocketScopeNotifications(socketIoInstance: SocketIO.Namespace): Promise<void> {

    const activityReachedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.activityReached,
        (activityReachedMessage: Messages.SystemEvents.ActivityReachedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.activityReached, activityReachedMessage);
        },
      );

    const activityFinishedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.activityFinished,
        (activityFinishedMessage: Messages.SystemEvents.ActivityFinishedMessage): void => {
          socketIoInstance.emit(socketSettings.paths.activityFinished, activityFinishedMessage);
        },
      );

    // ---------------------- For backwards compatibility only!

    const callActivityWaitingSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.callActivityReached,
        (callActivityWaitingMessage: Messages.SystemEvents.CallActivityReachedMessage): void => {

          logger.warn('"callActivityWaiting" notifications are deprecated. Use "activityReached" instead.');

          socketIoInstance.emit(socketSettings.paths.callActivityWaiting, callActivityWaitingMessage);
        },
      );

    const callActivityFinishedSubscription =
      this.eventAggregator.subscribe(
        Messages.EventAggregatorSettings.messagePaths.callActivityFinished,
        (callActivityFinishedMessage: Messages.SystemEvents.CallActivityFinishedMessage): void => {

          logger.warn('"callActivityFinished" notifications are deprecated. Use "activityFinished" instead.');

          socketIoInstance.emit(socketSettings.paths.callActivityFinished, callActivityFinishedMessage);
        },
      );

    // ----------------------s

    this.endpointSubscriptions.push(activityReachedSubscription);
    this.endpointSubscriptions.push(activityFinishedSubscription);
    this.endpointSubscriptions.push(callActivityWaitingSubscription);
    this.endpointSubscriptions.push(callActivityFinishedSubscription);
  }

}
