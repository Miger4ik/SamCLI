#!/bin/bash

BUCKET=migera-test-bucket
REGION=us-east-2
STACK_NAME=js-lambda-delete-users

sam deploy --debug \
  --region $REGION \
  --stack-name $STACK_NAME \
  --no-confirm-changeset \
  --s3-bucket $BUCKET \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \

# --parameter-overrides "LogGroupName=$LOG_GROUP_NAME" \


