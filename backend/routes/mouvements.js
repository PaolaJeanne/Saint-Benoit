const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  console.log("⛔ [MOUVEMENTS] Action refusée (non authentifié)");
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const cat = req.query.categorie;
    const sql = cat
      ? "SELECT * FROM mouvements WHERE actif=1 AND categorie=? ORDER BY ordre, id"
      : "SELECT * FROM mouvements WHERE actif=1 ORDER BY ordre, id";
    const rows = all(db, sql, cat ? [cat] : []);
    console.log(`🙏 [MOUVEMENTS] GET -> ${rows.length} mouvement(s)${cat ? ' (cat: ' + cat + ')' : ''}`);
    res.json(rows);
  } catch (err) { console.error("❌ [MOUVEMENTS] GET Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { nom, categorie, tranche_age, description, horaire, lieu, responsable, icone, ordre } = req.body;
    const r = run(db,
      "INSERT INTO mouvements (nom, categorie, tranche_age, description, horaire, lieu, responsable, icone, ordre) VALUES (?,?,?,?,?,?,?,?,?)",
      [nom, categorie || "jeunes", tranche_age || null, description || null, horaire || null, lieu || null, responsable || null, icone || "fa-users", parseInt(ordre) || 0]
    );
    console.log(`➕ [MOUVEMENTS] POST -> Ajout mouvement "${nom}" (cat: ${categorie}) (ID: ${r.lastInsertRowid})`);
    res.json({ id: r.lastInsertRowid });
  } catch (err) { console.error("❌ [MOUVEMENTS] POST Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const { nom, categorie, tranche_age, description, horaire, lieu, responsable, icone, ordre } = req.body;
    if (!nom) return res.status(400).json({ error: "Le nom est requis" });
    const existing = get(db, "SELECT id FROM mouvements WHERE id=?", [id]);
    if (!existing) {
      console.log(`⚠️  [MOUVEMENTS] PUT -> Mouvement #${id} introuvable`);
      return res.status(404).json({ error: "Mouvement introuvable" });
    }
    run(db,
      "UPDATE mouvements SET nom=?, categorie=?, tranche_age=?, description=?, horaire=?, lieu=?, responsable=?, icone=?, ordre=? WHERE id=?",
      [nom, categorie || "jeunes", tranche_age || null, description || null, horaire || null, lieu || null, responsable || null, icone || "fa-users", parseInt(ordre) || 0, id]
    );
    console.log(`✏️  [MOUVEMENTS] PUT -> Mouvement #${id} mis à jour ("${nom}")`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [MOUVEMENTS] PUT #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    run(db, "DELETE FROM mouvements WHERE id=?", [id]);
    console.log(`🗑️  [MOUVEMENTS] DELETE -> Mouvement #${id} supprimé`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [MOUVEMENTS] DELETE #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

module.exports = router;
