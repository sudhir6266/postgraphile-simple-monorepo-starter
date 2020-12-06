import app from "./app";
import { startWorkers } from "./worker";
const PORT = process.env.PORT || 3002;

app.listen(PORT, async () => {
  console.log(`API server is listening on port ${PORT}`)
  await startWorkers()
  console.log(`Workers started and ready for actions`)
});
