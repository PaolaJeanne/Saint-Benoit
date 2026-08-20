const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  console.log("⛔ [SERVICES] Action refusée (non authentifié)");
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM services WHERE actif=1 ORDER BY ordre, id");
    console.log(`⛪ [SERVICES] GET -> ${rows.length} service(s)`);
    res.json(rows);
  } catch (err) { console.error("❌ [SERVICES] GET Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { titre, description, icone, ordre } = req.body;
    const r = run(db,
      "INSERT INTO services (titre, description, icone, ordre) VALUES (?,?,?,?)",
      [titre, description || null, icone || "fa-church", parseInt(ordre) || 0]
    );
    console.log(`➕ [SERVICES] POST -> Ajout service "${titre}" (ID: ${r.lastInsertRowid})`);
    res.json({ id: r.lastInsertRowid });
  } catch (err) { console.error("❌ [SERVICES] POST Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const { titre, description, icone, ordre } = req.body;
    const existing = get(db, "SELECT id FROM services WHERE id=?", [id]);
    if (!existing) {
      console.log(`⚠️  [SERVICES] PUT -> Service #${id} introuvable`);
      return res.status(404).json({ error: "Service introuvable" });
    }
    run(db,
      "UPDATE services SET titre=?, description=?, icone=?, ordre=? WHERE id=?",
      [titre, description || null, icone || "fa-church", parseInt(ordre) || 0, id]
    );
    console.log(`✏️  [SERVICES] PUT -> Service #${id} mis à jour ("${titre}")`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [SERVICES] PUT #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    run(db, "DELETE FROM services WHERE id=?", [id]);
    console.log(`🗑️  [SERVICES] DELETE -> Service #${id} supprimé`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [SERVICES] DELETE #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

module.exports = router;
