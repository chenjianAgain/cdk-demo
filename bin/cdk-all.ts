#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkAllStack } from '../lib/cdk-all-stack';
import { EcsFargate } from '../lib/esc-fargate';
import { EcsEc2 } from '../lib/esc-ec2';
import { EcsEc2Fargate } from '../lib/esc-ec2-fargate';
import { Ecs } from '../lib/esc';

const app = new cdk.App();

const env = {
    region: 'us-west-2',
    account: '374801192098'
};
new CdkAllStack(app, 'CdkAllStack', { env });
new EcsFargate(app, 'EcsFargate', { env });
new EcsEc2(app, "EcsEc2", { env });
new EcsEc2Fargate(app, "EcsEc2Fargate", { env });
new Ecs(app, 'Ecs', { env });
