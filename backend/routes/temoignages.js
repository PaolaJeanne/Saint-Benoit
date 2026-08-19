const express = require("express");
const router = express.Router();
const { getDb, all, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    res.json(all(db, "SELECT * FROM temoignages WHERE actif=1 ORDER BY id"));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { texte, auteur, mouvement } = req.body;
    const r = run(db,
      "INSERT INTO temoignages (texte, auteur, mouvement) VALUES (?,?,?)",
      [texte, auteur, mouvement || null]
    );
    res.json({ id: r.lastInsertRowid });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { texte, auteur, mouvement } = req.body;
    run(db,
      "UPDATE temoignages SET texte=?, auteur=?, mouvement=? WHERE id=?",
      [texte, auteur, mouvement || null, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    run(db, "DELETE FROM temoignages WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
