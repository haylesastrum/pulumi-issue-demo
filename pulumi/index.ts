import { interpolate } from "@pulumi/pulumi";
import {
    Application,
    ServicePrincipal,
    getClientConfig
  } from '@pulumi/azuread';
import { RandomUuid } from '@pulumi/random';

import * as config from './config';

const current = getClientConfig({ provider: config.azureadProvider });
const scopeId = new RandomUuid('scope-id', {});

// Backend Application
export const backendIdentifierUri = interpolate`api://${config.appName}-backend-${config.stackName}`;

export const backendApp = new Application(
    'aad-app-backend',
    {
      displayName: `${config.appName}-backend-${config.stackName}`,
      identifierUris: [backendIdentifierUri],
      owners: [current.then(current => current.objectId)],
      api: {
        oauth2PermissionScopes: [
          {
            id: scopeId.result,
            value: 'Http.Post',
            type: 'User',
            adminConsentDisplayName: 'Http post call',
            adminConsentDescription: 'Allow the app to send http post call.',
            enabled: true
          }
        ]
      }
    },
    {provider: config.azureadProvider}
  );
  
  new ServicePrincipal(
    'aad-sp-backend',
    {
      clientId: backendApp.clientId,
      owners: [current.then(current => current.objectId)]
    },
    { dependsOn: backendApp,
        provider: config.azureadProvider
     }
  );