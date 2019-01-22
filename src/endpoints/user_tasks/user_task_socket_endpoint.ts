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

  public initializeEndpoint(socketIo: SocketIO.Namespace): void {

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

    this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.userTaskReached,
      (userTaskWaitingMessage: Messages.Public.SystemEvents.UserTaskReachedMessage) => {
        socketIo.emit(socketSettings.paths.userTaskWaiting, userTaskWaitingMessage);
      });

    this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.userTaskFinished,
      (userTaskFinishedMessage: Messages.Public.SystemEvents.UserTaskFinishedMessage) => {
        socketIo.emit(socketSettings.paths.userTaskFinished, userTaskFinishedMessage);
      });
  }

}
