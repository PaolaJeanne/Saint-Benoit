const express = require("express");
const router = express.Router();
const { getDb, all, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: "Non autorisé" });
}

// GET /api/evenements — public
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM evenements WHERE actif=1 ORDER BY id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/evenements — admin
router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { titre, description, date_debut, lieu, icone } = req.body;
    const r = run(db,
      "INSERT INTO evenements (titre, description, date_debut, lieu, icone) VALUES (?,?,?,?,?)",
      [titre, description || null, date_debut || null, lieu || null, icone || "fa-calendar"]
    );
    res.json({ id: r.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/evenements/:id — admin
router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { titre, description, date_debut, lieu, icone } = req.body;
    run(db,
      "UPDATE evenements SET titre=?, description=?, date_debut=?, lieu=?, icone=? WHERE id=?",
      [titre, description || null, date_debut || null, lieu || null, icone || "fa-calendar", req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/evenements/:id — admin
router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    run(db, "DELETE FROM evenements WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
