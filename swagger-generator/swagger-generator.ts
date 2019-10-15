import {restSettings} from '@process-engine/management_api_contracts';
import * as Swagger from 'openapi-doc';
import * as fs from 'fs';
import * as typescript from 'typescript';

const swagger = new Swagger();
swagger.info('ManagementApi', '1.0', 'This is ManagementApi.');

const baseRoute = 'api/management/v1';

type SwaggerParameter = {
  in: string;
  name: string;
  type: string;
  description: string;
};
type SwaggerParameterList = {[name: string]: SwaggerParameter};

const swaggerPathParameters: SwaggerParameterList = {};

function createSwaggerPathParameter(): void {
  const restSettingsFileName = 'node_modules/@process-engine/management_api_contracts/src/rest_settings.ts';

  const program = typescript.createProgram([restSettingsFileName], {});
  const sourceFile = program.getSourceFile(restSettingsFileName);
  for (const statement of sourceFile.statements) {
    statement.forEachChild((statementNode: any): void => {
      if (
        statementNode.declarations === undefined ||
        statementNode.declarations.length < 1 ||
        !typescript.isVariableDeclaration(statementNode.declarations[0])) {

        return;
      }

      const variable: any = statementNode.declarations[0];
      const variableName = variable.name.getText(sourceFile);

      if (variableName === 'params') {
        const properties = variable.initializer.properties;
        for (const property of properties) {
          const propertyTextWithComment: string = property.getFullText(sourceFile);
          const propertyTextWithoutComment: string = property.getText(sourceFile);

          const propertyName = property.name.getText(sourceFile);
          const propertyValue = property.initializer.getText(sourceFile);
          const propertyDocumentation = propertyTextWithComment.replace(propertyTextWithoutComment, '');

          const swaggerParameterName: string = convertPropertyValueToSwaggerParameterName(propertyValue);
          const swaggerDescription: string = convertPropertyDocumentationToSwaggerDescription(propertyDocumentation);

          addSwaggerPathParameter(propertyName, swaggerParameterName, swaggerDescription);
        }
      }
    });
  }
}

function convertPropertyValueToSwaggerParameterName(propertyValue: string): string {
  return propertyValue.replace(/[':]/g, '');
}

function convertPropertyDocumentationToSwaggerDescription(propertyDocumentation: string): string {
  return propertyDocumentation.replace(/[\/*]/g, '').trim();
}

function addSwaggerPathParameter(propertyName: string, parameterName: string, swaggerDescription: string): void {
  const parameter = {
    in: 'path',
    name: parameterName,
    type: 'string',
    description: swaggerDescription,
  };

  swaggerPathParameters[parameterName] = parameter;
}

function getSwaggerParameterByPropertyName(propertyName: string): any {
  return swaggerPathParameters[propertyName];
}

function generateSwaggerJson(): void {
  const paths: Array<string> = Object.values(restSettings.paths);
  for (const path of paths) {

    const route = baseRoute + path;

    const parameters = getSwaggerParametersForRoute(route);
    swagger.get(route)
      .parameters(parameters)
      .operationId('operationId')
      .tag('tag')
      .summary('Summary.')
      .response(200);
  }

  fs.writeFileSync('swagger.json', JSON.stringify(swagger.doc));
}

function getSwaggerParametersForRoute(route): Array<SwaggerParameter> {
  const params = [];

  const parametersInRoute: Array<string> = extractParametersFromRoute(route);

  for (const parameter of parametersInRoute) {
    params.push(getSwaggerParameterByPropertyName(parameter));
  }

  return params;
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

createSwaggerPathParameter();
generateSwaggerJson();
