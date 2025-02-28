FROM node:23.5.0-alpine3.21 as frontend
WORKDIR /app
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM python:3.13-slim
WORKDIR /app
COPY backend/pyproject.toml /app/backend/pyproject.toml
RUN pip install --no-cache-dir /app/backend

COPY backend /app/backend
COPY --from=frontend /app/build /app/backend/static

EXPOSE 6001
ENV DATABASE_URL=sqlite:////data/db1.sqlite
ENV PROD=1

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
