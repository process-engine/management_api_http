import {restSettings} from '@process-engine/management_api_contracts';
import * as Swagger from 'openapi-doc';
import * as fs from 'fs';
import * as typescript from 'typescript';

const swagger = new Swagger();
swagger.info('ManagementApi', '1.0', 'This is ManagementApi.');

const baseRoute = '/api/management/v1';

type SwaggerParameter = {
  in: string;
  name: string;
  type: string;
  description: string;
};
type SwaggerParameterList = {[name: string]: SwaggerParameter};

type SwaggerRoute = {
  summary: string;
};
type SwaggerRouteList = {[name: string]: SwaggerRoute};

const swaggerPathParameters: SwaggerParameterList = {};
const swaggerRouteData: SwaggerRouteList = {};

function createSwaggerPathParameter(sourceFile: typescript.SourceFile, properties: Array<any>): void {
  for (const property of properties) {
    const propertyTextWithComment: string = property.getFullText(sourceFile);
    const propertyTextWithoutComment: string = property.getText(sourceFile);

    const propertyValue = property.initializer.getText(sourceFile);
    const propertyDocumentation = propertyTextWithComment.replace(propertyTextWithoutComment, '');

    const swaggerParameterName: string = convertPropertyValueToSwaggerParameterName(propertyValue);
    const swaggerDescription: string = convertPropertyDocumentationToSwaggerDescription(propertyDocumentation);

    addSwaggerPathParameter(swaggerParameterName, swaggerDescription);
  }
}

function convertPropertyValueToSwaggerParameterName(propertyValue: string): string {
  return propertyValue
    .replace(/[':]/g, '');
}

function convertPropertyDocumentationToSwaggerDescription(propertyDocumentation: string): string {
  return propertyDocumentation
    .replace(/[/*]/g, '')
    .trim();
}

function convertPropertyDocumentationToRouteSummary(propertyDocumentation: string): string {
  return propertyDocumentation
    .trim()
    .substring(Math.max(propertyDocumentation.trim().lastIndexOf('\n'), 0))
    .replace(/\/\//g, '')
    .replace(/\*/g, '')
    .trim();
}

function addSwaggerPathParameter(parameterName: string, swaggerDescription: string): void {
  const parameter: SwaggerParameter = {
    in: 'path',
    name: parameterName,
    type: 'string',
    description: swaggerDescription,
  };

  swaggerPathParameters[parameterName] = parameter;
}

function addSwaggerRoute(routeName: string, routeSummary: string): void {
  const route: SwaggerRoute = {
    summary: routeSummary,
  };

  swaggerRouteData[routeName] = route;
}

function getSwaggerRouteDataByRouteName(routeName: string): SwaggerRoute {
  return swaggerRouteData[routeName];
}

function getSwaggerParameterByPropertyName(propertyName: string): SwaggerParameter {
  return swaggerPathParameters[propertyName];
}

function generateSwaggerJson(): void {
  extractSwaggerDataFromContracts();

  const routeNames: Array<string> = Object.keys(restSettings.paths);
  for (const routeName of routeNames) {

    const path: string = restSettings.paths[routeName];
    const tag = path.split('/')[1];

    const route = `${baseRoute}${path}`;

    const routeData = getSwaggerRouteDataByRouteName(routeName);
    const parameters: Array<SwaggerParameter> = getSwaggerParametersForRoute(route);
    swagger.get(route)
      .parameters(parameters)
      .operationId(route)
      .tag(tag)
      .summary(routeData.summary)
      .response(200);
  }

  fs.writeFileSync('swagger.json', JSON.stringify(swagger.doc));
}

function getSwaggerParametersForRoute(route): Array<SwaggerParameter> {
  const swaggerParameters: Array<SwaggerParameter> = [];

  const parametersInRoute: Array<string> = extractParametersFromRoute(route);

  for (const parameter of parametersInRoute) {
    swaggerParameters.push(getSwaggerParameterByPropertyName(parameter));
  }

  return swaggerParameters;
}

function extractParametersFromRoute(route: string): Array<string> {
  const parameters: Array<string> = route.split('/')
    .filter((routePart: string): boolean => {
      return routePart.startsWith(':');
    })
    .map((parameter: string): string => {
      return parameter.replace(':', '');
    });

  return parameters;
}

function createSwaggerRoutes(sourceFile: typescript.SourceFile, properties: Array<any>): void {
  for (const property of properties) {
    const propertyTextWithComment: string = property.getFullText(sourceFile);
    const propertyTextWithoutComment: string = property.getText(sourceFile);
    const propertyDocumentation: string = propertyTextWithComment.replace(propertyTextWithoutComment, '');

    const routeName: string = property.name.getText(sourceFile);
    const routeSummary: string = convertPropertyDocumentationToRouteSummary(propertyDocumentation);

    addSwaggerRoute(routeName, routeSummary);
  }
}

function extractSwaggerDataFromContracts(): void {
  const restSettingsFileName = 'node_modules/@process-engine/management_api_contracts/src/rest_settings.ts';

  const program: typescript.Program = typescript.createProgram([restSettingsFileName], {});
  const sourceFile: typescript.SourceFile = program.getSourceFile(restSettingsFileName);

  for (const statement of sourceFile.statements) {
    statement.forEachChild((statementNode: any): void => {
      if (
        statementNode.declarations === undefined ||
        statementNode.declarations.length < 1 ||
        !typescript.isVariableDeclaration(statementNode.declarations[0])) {

        return;
      }

      const variable: any = statementNode.declarations[0];
      const variableName: string = variable.name.getText(sourceFile);
      const properties: Array<any> = variable.initializer.properties;

      if (variableName === 'params') {
        createSwaggerPathParameter(sourceFile, properties);
      } else if (variableName === 'paths') {
        createSwaggerRoutes(sourceFile, properties);
      }
    });
  }
}

generateSwaggerJson();
