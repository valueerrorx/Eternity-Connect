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

The two video chat examples run over HTTPS, because browsers only allow camera and microphone access in a secure context. On first start the server creates a self-signed certificate in `certs/` (requires `openssl`). Your browser will warn about it; accept the warning to continue.

- `videochat with textchat final` → https://localhost:3030
- `videochat minimal https` → https://localhost:3000
- `text chat minimal https` → http://localhost:3000 (plain HTTP, no certificate needed)

## License

GPL-3.0 – see [LICENSE](LICENSE).
