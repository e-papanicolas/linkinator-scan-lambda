#!/usr/bin/env node
import { App, Tags } from 'aws-cdk-lib';
import { LinkinatorScanStack } from '../lib/linkinator-scan-stack';


const app = new App();
const linkScanStack = new LinkinatorScanStack(app, 'LinkinatorScanStack');
Tags.of(linkScanStack).add('project', 'link-scan');
