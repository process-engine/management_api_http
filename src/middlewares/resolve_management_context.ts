import {UnauthorizedError} from '@essential-projects/errors_ts';
import {IManagementEndpointConfig, ManagementContext, ManagementRequest} from '@process-engine/management_api_contracts';
import {Handler, NextFunction, Response} from 'express';

export function getResolveManagementContextMiddleware(config: IManagementEndpointConfig): any {

  return function resolveManagementContext(request: ManagementRequest, response: Response, next: NextFunction): void {

    const managementContext: ManagementContext = {
      internationalization: request.get('accept-language'),
      identity: null,
    };

    const bearerToken: string = request.get('authorization');

    if (bearerToken !== undefined && bearerToken !== null) {
      managementContext.identity = bearerToken.substr('Bearer '.length);
    } else {
      if (config.authenticationIsMandatory === true) {
        throw new UnauthorizedError('No auth token provided!');
      }
    }

    request.managementContext = managementContext;
    next();
  };

}
