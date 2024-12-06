import {getStack, Config} from '@pulumi/pulumi';
import { Provider as AzureADProvider } from '@pulumi/azuread';

const config = new Config();

export const appName = "pulumitest"
export const stackName = config.get('stackName') || getStack();

// AzureAD Config
const azureadConfig = new Config('azuread');
const azuread = {
  clientId: azureadConfig.require('clientId'),
  clientSecret: azureadConfig.requireSecret('clientSecret'),
  subscriptionId: azureadConfig.require('subscriptionId'),
  tenantId: azureadConfig.require('tenantId')
};

export const azureadProvider = new AzureADProvider('azuread-provider', {
  metadataHost: '',
  ...azuread
});