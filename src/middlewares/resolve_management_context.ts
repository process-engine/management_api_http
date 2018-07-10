import {UnauthorizedError} from '@essential-projects/errors_ts';
import {ManagementRequest} from '@process-engine/management_api_contracts';
import {NextFunction, Response} from 'express';

export function resolveManagementContext(request: ManagementRequest, response: Response, next: NextFunction): void {
  const bearerToken: string = request.get('authorization');

  if (!bearerToken) {
    throw new UnauthorizedError('No auth token provided!');
  }

  request.managementContext = {
    identity: bearerToken.substr('Bearer '.length),
    internationalization: request.get('accept-language'),
  };

  next();
}
