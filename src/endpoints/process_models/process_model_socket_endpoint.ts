import {Logger} from 'loggerhythm';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IEventAggregator} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {Messages, socketSettings} from '@process-engine/management_api_contracts';

const logger: Logger = Logger.createLogger('management_api:socket.io_endpoint:process_models');

interface IConnection {
  identity: string;
}

export class ProcessModelSocketEndpoint extends BaseSocketEndpoint {

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

      const identityNotSet: boolean = identity === undefined;
      if (identityNotSet) {
        throw new UnauthorizedError('No auth token provided!');
      }

      this._connections.set(socket.id, connection);

      logger.info(`Client with socket id "${socket.id} connected."`);

      socket.on('disconnect', (reason: any) => {
        this._connections.delete(socket.id);

        logger.info(`Client with socket id "${socket.id} disconnected."`);
      });
    });

    this._eventAggregator.subscribe(
      Messages.EventAggregatorSettings.messagePaths.processStarted,
      (processStartedMessage: Messages.Public.SystemEvents.ProcessStartedMessage) => {
        socketIo.emit(socketSettings.paths.processStarted, processStartedMessage);

        const processStartedWithProcessModelIdMessage: string =
          socketSettings.paths.processInstanceStarted
            .replace(socketSettings.pathParams.processModelId, processStartedMessage.processModelId);

        socketIo.emit(processStartedWithProcessModelIdMessage, processStartedMessage);
    });

    this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.processEnded,
      (processEndedMessage: Messages.Public.BpmnEvents.EndEventReachedMessage) => {
        socketIo.emit(socketSettings.paths.processEnded, processEndedMessage);
      });

    this._eventAggregator.subscribe(Messages.EventAggregatorSettings.messagePaths.processTerminated,
      (processTerminatedMessage: Messages.Public.BpmnEvents.TerminateEndEventReachedMessage) => {
        socketIo.emit(socketSettings.paths.processTerminated, processTerminatedMessage);
      });
  }

}
