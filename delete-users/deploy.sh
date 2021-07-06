#!/bin/bash

BUCKET=migera-test-bucket
REGION=us-east-2
STACK_NAME=lambda-delete-users

echo "enter Name Regex:"
read -r NAME_REGEX

echo "enter User Pull Id:"
read -r USER_PULL_ID

echo "enter the maximum number of user days if you want to disable this filter, enter 0 "
read  -r MAX_DAYS_EXISTENCE

sam deploy --debug \
  --region $REGION \
  --stack-name $STACK_NAME \
  --no-confirm-changeset \
  --parameter-overrides "NameRegex=$NAME_REGEX" "UserPullId=$USER_PULL_ID" "MaxDaysExistence=$MAX_DAYS_EXISTENCE"\
  --s3-bucket $BUCKET \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \

