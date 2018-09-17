import {IEventAggregator, ISubscription} from '@essential-projects/event_aggregator_contracts';
import {BaseSocketEndpoint} from '@essential-projects/http_node';
import {socketSettings} from '@process-engine/management_api_contracts';
import {
  eventAggregatorSettings,
  ProcessEndedMessage,
} from '@process-engine/process_engine_contracts';

interface IConnection {
  identity: string;
}

export class ExecutionSocketEndpoint extends BaseSocketEndpoint {

  private _eventAggregator: IEventAggregator;
  private _connections: Map<string, IConnection> = new Map();

  constructor(eventAggregator: IEventAggregator) {
    super();
    this._eventAggregator = eventAggregator;
  }

  private get eventAggregator(): IEventAggregator {
    return this._eventAggregator;
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

      console.log(`Client with socket id "${socket.id} connected."`);

      socket.on('disconnect', (reason: any) => {
        this._connections.delete(socket.id);

        console.log(`Client with socket id "${socket.id} disconnected."`);
      });
    });

    this.eventAggregator.subscribe(eventAggregatorSettings.paths.processEnded, (processEndedMessage: ProcessEndedMessage) => {
      socketIo.emit(socketSettings.paths.processEnded, processEndedMessage);
    });
    this.eventAggregator.subscribe(eventAggregatorSettings.paths.processTerminated, (processTerminatedMessage: ProcessEndedMessage) => {
      socketIo.emit(socketSettings.paths.processTerminated, processTerminatedMessage);
    });
  }

}
