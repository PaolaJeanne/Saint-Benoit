const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: "Non autorisé" });
}

// GET /api/messes — public
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM messes WHERE actif=1 ORDER BY ordre, id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messes — admin
router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { jour, heure, type, intention, ordre } = req.body;
    const r = run(db,
      "INSERT INTO messes (jour, heure, type, intention, ordre) VALUES (?,?,?,?,?)",
      [jour, heure, type || "Messe", intention || null, ordre || 0]
    );
    res.json({ id: r.lastInsertRowid, jour, heure, type, intention, ordre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/messes/:id — admin
router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { jour, heure, type, intention, ordre } = req.body;
    run(db,
      "UPDATE messes SET jour=?, heure=?, type=?, intention=?, ordre=? WHERE id=?",
      [jour, heure, type || "Messe", intention || null, ordre || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/messes/:id — admin
router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    run(db, "DELETE FROM messes WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
