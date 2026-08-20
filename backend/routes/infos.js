const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  console.log("⛔ [INFOS] Action refusée (non authentifié)");
  res.status(401).json({ error: "Non autorisé" });
}

router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT cle, valeur, label, groupe FROM infos_paroisse ORDER BY groupe, id");
    const obj = {};
    rows.forEach(r => { obj[r.cle] = r.valeur; });
    console.log(`⚙️  [INFOS] GET -> Dictionnaire des infos générales`);
    res.json(obj);
  } catch (err) { console.error("❌ [INFOS] GET Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.get("/all", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT * FROM infos_paroisse ORDER BY groupe, id");
    console.log(`⚙️  [INFOS] GET/all -> ${rows.length} paramètre(s) admin`);
    res.json(rows);
  } catch (err) { console.error("❌ [INFOS] GET/all Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

router.put("/:cle", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { valeur } = req.body;
    const existing = get(db, "SELECT id FROM infos_paroisse WHERE cle=?", [req.params.cle]);
    if (!existing) {
      console.log(`⚠️  [INFOS] PUT -> Clé "${req.params.cle}" introuvable`);
      return res.status(404).json({ error: "Clé introuvable" });
    }
    run(db, "UPDATE infos_paroisse SET valeur=? WHERE cle=?", [valeur, req.params.cle]);
    console.log(`✏️  [INFOS] PUT -> Clé "${req.params.cle}" mise à jour`);
    res.json({ success: true });
  } catch (err) { console.error(`❌ [INFOS] PUT "${req.params.cle}" Erreur:`, err.message); res.status(500).json({ error: err.message }); }
});

router.post("/batch", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const updates = req.body;
    const keys = Object.keys(updates);
    keys.forEach(cle => {
      const existing = get(db, "SELECT id FROM infos_paroisse WHERE cle=?", [cle]);
      if (existing) run(db, "UPDATE infos_paroisse SET valeur=? WHERE cle=?", [updates[cle], cle]);
    });
    console.log(`✏️  [INFOS] BATCH -> ${keys.length} paramètre(s) mis à jour`);
    res.json({ success: true });
  } catch (err) { console.error("❌ [INFOS] BATCH Erreur:", err.message); res.status(500).json({ error: err.message }); }
});

module.exports = router;
