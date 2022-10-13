#!/bin/bash

if ! type aws &>/dev/null; then
    echo 'ERROR: Could not find aws-cli.' 1>&2
    exit 1
fi

TEMPLATE_NAME='ci-infrastructure.yaml'
TEMPLATE_PATH='../cloudformation/templates'
PARAMETERS_PATH='../cloudformation/parameters'

SCRIPT_PATH="$(dirname "$(readlink -f "${0}")")"
TEMPLATE_FILE="$(readlink -f "${SCRIPT_PATH}/${TEMPLATE_PATH}/${TEMPLATE_NAME}")"
PARAMETERS_FILE="$(readlink -f "${SCRIPT_PATH}/${PARAMETERS_PATH}/${TEMPLATE_NAME%.*}.json")"

if [[ ! -f "${TEMPLATE_FILE}" ]]; then
    echo "ERROR: Failed to find expected template file at '${TEMPLATE_FILE}'." 1>&2
    exit 2
fi

echo "Using template at '${TEMPLATE_FILE}'."

aws cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --no-fail-on-empty-changeset \
    --parameter-overrides "$(test -f "${PARAMETERS_FILE}" && echo "file://${PARAMETERS_FILE}" || echo '[]')" \
    --template-file "${TEMPLATE_FILE}" \
    --stack-name cdk-extensions
