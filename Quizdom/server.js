//Andras
// server.js

console.log("🟢 A server.js fájl futni kezdett!");
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
console.log("✅ Minden modul importálva sikeresen!");

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB kapcsolat ---
const MONGO_URI = "mongodb://127.0.0.1:27017/"; // csak a cím
mongoose.connect(MONGO_URI, { dbName: "temak" })
  .then(() => console.log("✅ Kapcsolódva a MongoDB-hez (temak adatbázis)"))
  .catch((err) => console.error("❌ MongoDB hiba:", err));

// --- Séma és modell ---
const kerdesSchema = new mongoose.Schema({
  nehezseg: String,
  kerdes: String,
  pontszam: Number,
  valaszok: [
    {
      szoveg: String,
      helyes: Boolean
    }
  ]
});

const MagyarTortenelem = mongoose.model("magyar_tortenelem", kerdesSchema, "magyar_tortenelem");
const RomanTortenelem  = mongoose.model("roman_tortenelem",  kerdesSchema, "roman_tortenelem");
const AltalanosTortenelem = mongoose.model("altalanos_tortenelem", kerdesSchema, "altalanos_tortenelem");
// --- API végpontok ---

// 1) Teszt - működik-e a backend
app.get("/", (req, res) => {
  res.send("Quizdom backend működik 🚀");
});

// 2) Kérdések lekérdezése
// 2) Összes kérdés lekérdezése az összes kollekcióból
app.get("/questions", async (req, res) => {
  try {
    const magyar = await MagyarTortenelem.find();
    const roman = await RomanTortenelem.find();
    const altalanos = await AltalanosTortenelem.find();

    // összefűzés egyetlen tömbbe
    const allQuestions = [
      ...magyar.map(q => ({ ...q.toObject(), tema: "Magyar történelem" })),
      ...roman.map(q => ({ ...q.toObject(), tema: "Román történelem" })),
      ...altalanos.map(q => ({ ...q.toObject(), tema: "Általános történelem" }))
    ];

    console.log("📦 Összes kérdés lekérve:", allQuestions.length);
    res.json(allQuestions);

  } catch (err) {
    console.error("❌ Adatbázis hiba:", err);
    res.status(500).json({ error: "Adatbázis hiba" });
  }
});
app.get("/questions/:tema", async (req, res) => {
  const tema = req.params.tema; // pl. magyar, roman, altalanos
  try {
    let questions = [];
    if (tema === "magyar") {
      questions = await MagyarTortenelem.find();
    } else if (tema === "roman") {
      questions = await RomanTortenelem.find();
    } else if (tema === "altalanos") {
      questions = await AltalanosTortenelem.find();
    }
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Hiba a lekérdezés során" });
  }
});

// 3) Debug végpont (az adatbázis és kollekciók ellenőrzése)
app.get("/debug", async (req, res) => {
  try {
    const db = mongoose.connection;
    const list = await db.db.listCollections().toArray();
    const names = list.map(c => c.name);
    res.json({
      aktivDB: db.name,
      kollekciok: names
    });
  } catch (err) {
    console.error("❌ Debug hiba:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Szerver indítása ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend fut a http://localhost:${PORT} címen`);
});

