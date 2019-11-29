#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkAllStack } from '../lib/cdk-all-stack';
import { EcsFargate } from '../lib/esc-fargate';
import { EcsEc2 } from '../lib/esc-ec2';
import { EcsEc2Fargate } from '../lib/esc-ec2-fargate';
import { Ecs } from '../lib/esc';
import { Cf } from '../lib/cf';
import { Cf2 } from '../lib/cf.1';

const app = new cdk.App();

const env = {
     region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,	 
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};
new CdkAllStack(app, 'CdkAllStack', { env });
new EcsFargate(app, 'EcsFargate', { env });
new EcsEc2(app, "EcsEc2", { env });
new EcsEc2Fargate(app, "EcsEc2Fargate", { env });
new Ecs(app, 'Ecs', { env });

new Cf(app, 'Cf', { env });
new Cf2(app, 'Cf2', { env });

