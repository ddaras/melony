import { createApp } from "./create-app.js";
import { PORT } from "./config.js";

const app = createApp();
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});
