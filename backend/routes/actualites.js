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
  console.log("⛔ [ACTUALITES] Action refusée (non authentifié)");
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM actualites WHERE actif=1 ORDER BY id DESC");
    console.log(`📰 [ACTUALITES] GET -> ${rows.length} article(s)`);
    res.json(rows);
  } catch (err) { console.error("❌ [ACTUALITES] GET Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const row = get(db, "SELECT * FROM actualites WHERE id=?", [id]);
    if (!row) {
      console.log(`⚠️  [ACTUALITES] GET -> Article #${id} non trouvé`);
      return res.status(404).json({ error: "Non trouvé" });
    }
    console.log(`📰 [ACTUALITES] GET #${id} -> "${row.titre}"`);
    res.json(row);
  } catch (err) { console.error(`❌ [ACTUALITES] GET #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, upload.single("image"), async (req, res) => {
  try {
    const db = await getDb();
    const { titre, categorie, chapeau, contenu } = req.body;
    const image = req.file ? req.file.filename : (req.body.image || null);
    const r = run(db,
      "INSERT INTO actualites (titre, categorie, chapeau, contenu, image) VALUES (?,?,?,?,?)",
      [titre, categorie || "vie-paroissiale", chapeau || null, contenu || null, image]
    );
    console.log(`➕ [ACTUALITES] POST -> Nouvel article "${titre}" (ID: ${r.lastInsertRowid})`);
    res.json({ id: r.lastInsertRowid });
  } catch (err) { console.error("❌ [ACTUALITES] POST Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, upload.single("image"), async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const { titre, categorie, chapeau, contenu } = req.body;
    const existing = get(db, "SELECT image FROM actualites WHERE id=?", [id]);
    if (!existing) {
      console.log(`⚠️  [ACTUALITES] PUT -> Article #${id} introuvable`);
      return res.status(404).json({ error: "Actualité introuvable" });
    }
    const image = req.file ? req.file.filename : (req.body.image || existing.image);
    run(db,
      "UPDATE actualites SET titre=?, categorie=?, chapeau=?, contenu=?, image=? WHERE id=?",
      [titre, categorie || "vie-paroissiale", chapeau || null, contenu || null, image, id]
    );
    console.log(`✏️  [ACTUALITES] PUT -> Article #${id} mis à jour ("${titre}")`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [ACTUALITES] PUT #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    run(db, "DELETE FROM actualites WHERE id=?", [id]);
    console.log(`🗑️  [ACTUALITES] DELETE -> Article #${id} supprimé`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [ACTUALITES] DELETE #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

module.exports = router;
