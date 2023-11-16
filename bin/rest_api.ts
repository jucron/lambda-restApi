#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RestApiStack } from '../lib/rest_api-stack';

const app = new cdk.App();
const region = "eu-west-1";
const account = "684807310606";
new RestApiStack(app, 'RestApiStack',{
    env: {region: region, account: account}
});
