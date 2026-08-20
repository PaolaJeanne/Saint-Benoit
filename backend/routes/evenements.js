const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  console.log("⛔ [EVENEMENTS] Action refusée (non authentifié)");
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM evenements WHERE actif=1 ORDER BY id");
    console.log(`📅 [EVENEMENTS] GET -> ${rows.length} événement(s)`);
    res.json(rows);
  } catch (err) { console.error("❌ [EVENEMENTS] GET Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { titre, description, date_debut, lieu, icone } = req.body;
    const r = run(db,
      "INSERT INTO evenements (titre, description, date_debut, lieu, icone) VALUES (?,?,?,?,?)",
      [titre, description || null, date_debut || null, lieu || null, icone || "fa-calendar"]
    );
    console.log(`➕ [EVENEMENTS] POST -> Ajout événement "${titre}" (${date_debut}) (ID: ${r.lastInsertRowid})`);
    res.json({ id: r.lastInsertRowid });
  } catch (err) { console.error("❌ [EVENEMENTS] POST Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const { titre, description, date_debut, lieu, icone } = req.body;
    const existing = get(db, "SELECT id FROM evenements WHERE id=?", [id]);
    if (!existing) {
      console.log(`⚠️  [EVENEMENTS] PUT -> Événement #${id} introuvable`);
      return res.status(404).json({ error: "Événement introuvable" });
    }
    run(db,
      "UPDATE evenements SET titre=?, description=?, date_debut=?, lieu=?, icone=? WHERE id=?",
      [titre, description || null, date_debut || null, lieu || null, icone || "fa-calendar", id]
    );
    console.log(`✏️  [EVENEMENTS] PUT -> Événement #${id} mis à jour ("${titre}")`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [EVENEMENTS] PUT #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    run(db, "DELETE FROM evenements WHERE id=?", [id]);
    console.log(`🗑️  [EVENEMENTS] DELETE -> Événement #${id} supprimé`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [EVENEMENTS] DELETE #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

module.exports = router;
