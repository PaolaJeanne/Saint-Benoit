const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  console.log("⛔ [MESSES] Action refusée (non authentifié)");
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM messes WHERE actif=1 ORDER BY ordre, id");
    console.log("📋 [MESSES] GET -> " + rows.length + " messe(s)");
    res.json(rows);
  } catch (err) { console.error("❌ [MESSES] GET Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { jour, heure, type, intention, ordre } = req.body;
    const r = run(db,
      "INSERT INTO messes (jour, heure, type, intention, ordre) VALUES (?,?,?,?,?)",
      [jour, heure, type || "Messe", intention || null, parseInt(ordre) || 0]
    );
    console.log(`➕ [MESSES] POST -> Ajout messe "${jour} - ${heure}" (ID: ${r.lastInsertRowid})`);
    res.json({ id: r.lastInsertRowid });
  } catch (err) { console.error("❌ [MESSES] POST Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const { jour, heure, type, intention, ordre } = req.body;
    const existing = get(db, "SELECT id FROM messes WHERE id=?", [id]);
    if (!existing) {
      console.log(`⚠️  [MESSES] PUT -> Messe #${id} introuvable`);
      return res.status(404).json({ error: "Messe introuvable" });
    }
    run(db,
      "UPDATE messes SET jour=?, heure=?, type=?, intention=?, ordre=? WHERE id=?",
      [jour, heure, type || "Messe", intention || null, parseInt(ordre) || 0, id]
    );
    console.log(`✏️  [MESSES] PUT -> Messe #${id} mise à jour ("${jour} - ${heure}")`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [MESSES] PUT #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    run(db, "DELETE FROM messes WHERE id=?", [id]);
    console.log(`🗑️  [MESSES] DELETE -> Messe #${id} supprimée`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [MESSES] DELETE #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

module.exports = router;
