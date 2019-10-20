#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkAllStack } from '../lib/cdk-all-stack';

const app = new cdk.App();
new CdkAllStack(app, 'CdkAllStack');
