#!/bin/bash
cd /home/kavia/workspace/code-generation/mediexpress-41120-41129/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

