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
    const cat = req.query.categorie;
    const sql = cat
      ? "SELECT * FROM mouvements WHERE actif=1 AND categorie=? ORDER BY ordre, id"
      : "SELECT * FROM mouvements WHERE actif=1 ORDER BY ordre, id";
    res.json(all(db, sql, cat ? [cat] : []));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { nom, categorie, tranche_age, description, horaire, lieu, responsable, icone, ordre } = req.body;
    const r = run(db,
      "INSERT INTO mouvements (nom, categorie, tranche_age, description, horaire, lieu, responsable, icone, ordre) VALUES (?,?,?,?,?,?,?,?,?)",
      [nom, categorie || "jeunes", tranche_age || null, description || null, horaire || null, lieu || null, responsable || null, icone || "fa-users", ordre || 0]
    );
    res.json({ id: r.lastInsertRowid });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { nom, categorie, tranche_age, description, horaire, lieu, responsable, icone, ordre } = req.body;
    run(db,
      "UPDATE mouvements SET nom=?, categorie=?, tranche_age=?, description=?, horaire=?, lieu=?, responsable=?, icone=?, ordre=? WHERE id=?",
      [nom, categorie || "jeunes", tranche_age || null, description || null, horaire || null, lieu || null, responsable || null, icone || "fa-users", ordre || 0, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    run(db, "DELETE FROM mouvements WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
