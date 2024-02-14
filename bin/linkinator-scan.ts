#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LinkinatorScanStack } from '../lib/linkinator-scan-stack';

const app = new cdk.App();
new LinkinatorScanStack(app, 'LinkinatorScanStack');
