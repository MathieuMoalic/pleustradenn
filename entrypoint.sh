#!/bin/sh
set -e

if [ "$(echo $DATABASE_URL | cut -c1-9)" != "sqlite://" ]; then
    echo "Database URL is not valid"
    exit 1
fi

DATABASE_PATH=${DATABASE_URL#sqlite:///}

cd /app
exec uvicorn backend.main:app --proxy-headers --host 0.0.0.0 --port 6001
