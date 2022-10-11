#!/bin/bash

if ! type aws &>/dev/null; then
    echo 'ERROR: Could not find aws-cli.' 1>&2
    exit 1
fi

SCRIPT_PATH="$(dirname "$(readlink -f "${0}")")"
TEMPLATE_PATH="${SCRIPT_PATH}/lib/template.yaml"

if [[ -f "${SCRIPT_PATH}" ]]; then
    echo "ERROR: Failed to find expected template file at '${SCRIPT_PATH}'." 1>&2
    exit 2
fi

echo "Using template at '${TEMPLATE_PATH}'."

aws cloudformation deploy \
    --capabilities CAPABILITY_IAM \
    --no-fail-on-empty-changeset \
    --template-file "${TEMPLATE_PATH}" \
    --stack-name cdk-extensions
