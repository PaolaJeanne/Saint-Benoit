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

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    res.json(all(db, "SELECT * FROM equipe WHERE actif=1 ORDER BY ordre, id"));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, upload.single("photo"), async (req, res) => {
  try {
    const db = await getDb();
    const { nom, role, bio, email, ordre } = req.body;
    const photo = req.file ? req.file.filename : (req.body.photo || null);
    const r = run(db,
      "INSERT INTO equipe (nom, role, bio, photo, email, ordre) VALUES (?,?,?,?,?,?)",
      [nom, role, bio || null, photo, email || null, ordre || 0]
    );
    res.json({ id: r.lastInsertRowid });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, upload.single("photo"), async (req, res) => {
  try {
    const db = await getDb();
    const { nom, role, bio, email, ordre } = req.body;
    const existing = get(db, "SELECT photo FROM equipe WHERE id=?", [req.params.id]);
    const photo = req.file ? req.file.filename : (req.body.photo || (existing ? existing.photo : null));
    run(db,
      "UPDATE equipe SET nom=?, role=?, bio=?, photo=?, email=?, ordre=? WHERE id=?",
      [nom, role, bio || null, photo, email || null, ordre || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    run(db, "DELETE FROM equipe WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
