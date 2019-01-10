import {Logger} from 'loggerhythm';

import {IEventAggregator} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';

import {Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:user_tasks');

interface IConnection {
  identity: string;
}

export class ManualTaskSocketEndpoint extends BaseSocketEndpoint {

  private _connections: Map<string, IConnection> = new Map();
  private _eventAggregator: IEventAggregator;

  constructor(eventAggregator: IEventAggregator) {
    super();
    this._eventAggregator = eventAggregator;
  }

  public get namespace(): string {
    return socketSettings.namespace;
  }

  public initializeEndpoint(socketIo: SocketIO.Namespace): void {

    socketIo.on('connect', (socket: SocketIO.Socket) => {
      const identity: string = socket.handshake.headers['authorization'];

      const connection: IConnection = {
        identity,
      };

      this._connections.set(socket.id, connection);

      logger.info(`Client with socket id "${socket.id} connected."`);

      socket.on('disconnect', (reason: any) => {
        this._connections.delete(socket.id);

        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });
    });

    this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.manualTaskReached,
      (manualTaskWaitingMessage: Messages.Public.SystemEvents.ManualTaskReachedMessage) => {
        socketIo.emit(socketSettings.paths.manualTaskWaiting, manualTaskWaitingMessage);
      });

    this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.manualTaskFinished,
      (manualTaskFinishedMessage: Messages.Public.SystemEvents.ManualTaskFinishedMessage) => {
        socketIo.emit(socketSettings.paths.manualTaskFinished, manualTaskFinishedMessage);
      });
  }

}
