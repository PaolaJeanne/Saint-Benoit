const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  console.log("⛔ [TEMOIGNAGES] Action refusée (non authentifié)");
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM temoignages WHERE actif=1 ORDER BY id");
    console.log(`💬 [TEMOIGNAGES] GET -> ${rows.length} témoignage(s)`);
    res.json(rows);
  } catch (err) { console.error("❌ [TEMOIGNAGES] GET Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.post("/", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { texte, auteur, mouvement } = req.body;
    const r = run(db,
      "INSERT INTO temoignages (texte, auteur, mouvement) VALUES (?,?,?)",
      [texte, auteur, mouvement || null]
    );
    console.log(`➕ [TEMOIGNAGES] POST -> Ajout témoignage de "${auteur}" (ID: ${r.lastInsertRowid})`);
    res.json({ id: r.lastInsertRowid });
  } catch (err) { console.error("❌ [TEMOIGNAGES] POST Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.put("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    const { texte, auteur, mouvement } = req.body;
    const existing = get(db, "SELECT id FROM temoignages WHERE id=?", [id]);
    if (!existing) {
      console.log(`⚠️  [TEMOIGNAGES] PUT -> Témoignage #${id} introuvable`);
      return res.status(404).json({ error: "Témoignage introuvable" });
    }
    run(db,
      "UPDATE temoignages SET texte=?, auteur=?, mouvement=? WHERE id=?",
      [texte, auteur, mouvement || null, id]
    );
    console.log(`✏️  [TEMOIGNAGES] PUT -> Témoignage #${id} mis à jour ("${auteur}")`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [TEMOIGNAGES] PUT #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const id = parseInt(req.params.id);
    run(db, "DELETE FROM temoignages WHERE id=?", [id]);
    console.log(`🗑️  [TEMOIGNAGES] DELETE -> Témoignage #${id} supprimé`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [TEMOIGNAGES] DELETE #${req.params.id} Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

module.exports = router;
