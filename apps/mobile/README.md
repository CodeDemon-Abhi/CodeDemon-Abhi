## FitBuddy AI Mobile (Expo)

### Run

```bash
cd /workspace/apps/mobile
npx expo install
npm run start
```

If running API in Docker on the same machine, update `API_URL` in `App.js` to your LAN IP (e.g., `http://192.168.1.10:4000`). Expo on device cannot reach `localhost` of your computer.

