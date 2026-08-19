const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "..", "img")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-"))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: "Non autorisé" });
}

// GET /api/actualites — public
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM actualites WHERE actif=1 ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/actualites/:id — public
router.get("/:id", async (req, res) => {
  try {
    const db = await getDb();
    const row = get(db, "SELECT * FROM actualites WHERE id=?", [req.params.id]);
    if (!row) return res.status(404).json({ error: "Non trouvé" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/actualites — admin
router.post("/", isAuth, upload.single("image"), async (req, res) => {
  try {
    const db = await getDb();
    const { titre, categorie, chapeau, contenu } = req.body;
    const image = req.file ? req.file.filename : (req.body.image || null);
    const r = run(db,
      "INSERT INTO actualites (titre, categorie, chapeau, contenu, image) VALUES (?,?,?,?,?)",
      [titre, categorie || "vie-paroissiale", chapeau || null, contenu || null, image]
    );
    res.json({ id: r.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/actualites/:id — admin
router.put("/:id", isAuth, upload.single("image"), async (req, res) => {
  try {
    const db = await getDb();
    const { titre, categorie, chapeau, contenu } = req.body;
    const existing = get(db, "SELECT image FROM actualites WHERE id=?", [req.params.id]);
    const image = req.file ? req.file.filename : (req.body.image || (existing ? existing.image : null));
    run(db,
      "UPDATE actualites SET titre=?, categorie=?, chapeau=?, contenu=?, image=? WHERE id=?",
      [titre, categorie || "vie-paroissiale", chapeau || null, contenu || null, image, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/actualites/:id — admin
router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    run(db, "DELETE FROM actualites WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
