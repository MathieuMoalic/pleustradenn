set dotenv-load

release:
    #!/usr/bin/env bash
    
    # Step 1: Increment the minor version in pyproject.toml
    VERSION=$(grep -Eo 'version = "[0-9]+\.[0-9]+\.[0-9]+"' backend/pyproject.toml | grep -Eo '[0-9]+\.[0-9]+\.[0-9]+')
    MAJOR=$(echo "$VERSION" | cut -d. -f1)
    MINOR=$(echo "$VERSION" | cut -d. -f2)
    PATCH=$(echo "$VERSION" | cut -d. -f3)
    NEW_PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
    echo "Bumping version from $VERSION to $NEW_VERSION"
    sed -i -E "s/version = \"$VERSION\"/version = \"$NEW_VERSION\"/" backend/pyproject.toml

    # Step 2: Stage and commit the changes
    git add backend/pyproject.toml
    git commit -m "Release of v$NEW_VERSION"

    # Step 3: Tag the commit with the new version
    git tag -a "v$NEW_VERSION" -m "Version v$NEW_VERSION"

    # Step 4: Push the commit and tag to the origin
    git push origin main
    git push origin "v$NEW_VERSION"

    echo "Version bumped to v$NEW_VERSION and pushed with tag."

    
staging:
    podman build -t localhost/workouts-staging:latest .

    podman run --rm --replace \
        --name workouts-staging \
        --network tmp-proxy \
        -v /tmp/data:/data \
        -p 6001:6001 \
        -e ADMIN_USERNAME=${ADMIN_USERNAME} \
        -e ADMIN_PASSWORD=${ADMIN_PASSWORD} \
        localhost/workouts-staging:latest 
    
caddy:
    podman run --rm -d --replace \
        --name caddy \
        --network tmp-proxy \
        -v ./Caddyfile:/etc/caddy/Caddyfile \
        -p 80:80 \
        -p 443:443 \
        caddy:latest

backend:
    rm -f ./data/db1.sqlite
    DATABASE_URL=sqlite:///./data/db1.sqlite \
    ADMIN_USERNAME=${ADMIN_USERNAME} \
    ADMIN_PASSWORD=${ADMIN_PASSWORD} \
    uvicorn backend.main:app --proxy-headers --host 0.0.0.0 --port 6001 --reload

migrate:
    cd backend/migrations && \
    DATABASE_URL=sqlite:///../../test1.db \
    alembic upgrade head

build-frontend:
    cd frontend && \
    npm install && \
    npm run build && \
    mv build ../backend/static

test:
    DATABASE_URL=sqlite:///./data/db1.sqlite \
    ADMIN_USERNAME=${ADMIN_USERNAME} \
    ADMIN_PASSWORD=${ADMIN_PASSWORD} \
    pytest backend/tests