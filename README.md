# Clearviction Link Scan

This is an AWS CDK application that invokes a Lambda function which runs a [linkinator](https://github.com/JustinBeckwith/linkinator) scan on the Clearviction website on a monthly schedule, and reports any broken links via SES.

## Services used

- AWS Lambda
- AWS Simple Email Service (SES)
- AWS Identity and Access Management (IAM)
- AWS EventBridge Scheduler

## To update

1. Make changes
1. Empty `dist` folder
1. Run `npm run build`
1. Run `cdk deploy`
1. Test changes
1. Push changes to github

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template