import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRouter);

app.get("/", (req, res) => {
  res.send({ ok: true, message: "Notes API - backend running" });
});

app.listen(PORT, () => {
  console.log(`Notes backend running on http://localhost:${PORT}`);
});
