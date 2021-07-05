#!/bin/bash

AUTHOR=Sava-Bohdan
DESCRIPTION=Lambda-for-delete-test-users
NAME=Lambda-for-delete-test-users
SOURCE_CODE_URL=https://github.com/Miger4ik/SamCLI
TEMPLATE_BODY=template.yaml

aws serverlessrepo create-application \
--author $AUTHOR \
--description $DESCRIPTION \
--name $NAME \
--source-code-url $SOURCE_CODE_URL \
--template-body $TEMPLATE_BODY

