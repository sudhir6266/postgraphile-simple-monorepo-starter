import app from "./app";
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`API server is listening on port ${PORT}`));
