# Deploying

## podman or docker:

```bash
podman run -d --replace \
	--name workouts \
	--network workouts-proxy \
	-v ./workouts:/data \
	-e ADMIN_USERNAME=${ADMIN_USERNAME} \
	-e ADMIN_PASSWORD=${ADMIN_PASSWORD} \
	ghcr.io/mathieumoalic/workouts:5.0.8
```

## Reverse proxy
### Caddy
```Caddyfile
workouts.example.com {
	reverse_proxy localhost:6001
}
```
