const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "..", "frontend", "img")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${Date.now()}-${baseName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les formats d'image (JPG, PNG, WebP, GIF) sont autorisés."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo max
});

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  console.log("⛔ [EQUIPE] Action refusée (non authentifié)");
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM equipe WHERE actif=1 ORDER BY ordre, id");
    console.log(`👥 [EQUIPE] GET -> ${rows.length} membre(s)`);
    res.json(rows);
  } catch (err) { console.error("❌ [EQUIPE] GET Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, upload.single("photo"), async (req, res) => {
  try {
    const db = await getDb();
    const { nom, role, bio, email, ordre } = req.body;
    const photo = req.file ? req.file.filename : (req.body.photo || null);
    const r = run(db,
      "INSERT INTO equipe (nom, role, bio, photo, email, ordre) VALUES (?,?,?,?,?,?)",
      [nom, role, bio || null, photo, email || null, parseInt(ordre) || 0]
    );
    console.log(`➕ [EQUIPE] POST -> Ajout membre "${nom}" (${role}) (ID: ${r.lastInsertRowid})`);
    res.json({ id: r.lastInsertRowid });
  } catch (err) { console.error("❌ [EQUIPE] POST Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, upload.single("photo"), async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const { nom, role, bio, email, ordre } = req.body;
    const existing = get(db, "SELECT photo FROM equipe WHERE id=?", [id]);
    if (!existing) {
      console.log(`⚠️  [EQUIPE] PUT -> Membre #${id} introuvable`);
      return res.status(404).json({ error: "Membre introuvable" });
    }
    const photo = req.file ? req.file.filename : (req.body.photo || existing.photo);
    run(db,
      "UPDATE equipe SET nom=?, role=?, bio=?, photo=?, email=?, ordre=? WHERE id=?",
      [nom, role, bio || null, photo, email || null, parseInt(ordre) || 0, id]
    );
    console.log(`✏️  [EQUIPE] PUT -> Membre #${id} mis à jour ("${nom}")`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [EQUIPE] PUT #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    run(db, "DELETE FROM equipe WHERE id=?", [id]);
    console.log(`🗑️  [EQUIPE] DELETE -> Membre #${id} supprimé`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [EQUIPE] DELETE #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

module.exports = router;
