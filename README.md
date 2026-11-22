# Eternity-Connect

Simple WebRTC video and text chat examples built with Node.js, Express, Socket.io, PeerJS and EJS.

## Projects

- `text chat minimal https` – minimal text chat
- `videochat minimal https` – minimal video chat over HTTPS
- `videochat with textchat final` – video chat with integrated text chat

## Running

```bash
cd "videochat with textchat final"
npm install
npm start
```

The HTTPS examples need a certificate in `certs/` (not included). Create a self-signed one for development:

```bash
mkdir -p certs
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout certs/key.pem -out certs/cert.pem -subj "/CN=localhost"
```

## License

GPL-3.0 – see [LICENSE](LICENSE).
