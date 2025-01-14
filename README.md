# Deploying

## podman or docker:

```bash
podman run -d --replace \
	--name groceries \
	--network groceries-proxy \
	-v ./groceries:/data \
	-e ADMIN_USERNAME=${ADMIN_USERNAME} \
	-e ADMIN_PASSWORD=${ADMIN_PASSWORD} \
	ghcr.io/mathieumoalic/groceries-app:5.0.8
```

## Reverse proxy
### Caddy
```Caddyfile
groceries.example.com {
	reverse_proxy localhost:6001
}
```
