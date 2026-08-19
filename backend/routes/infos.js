const express = require("express");
const router = express.Router();
const { getDb, all, get, run } = require("../db/init");

function isAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: "Non autorisé" });
}

// GET /api/infos — retourne un objet clé:valeur pour faciliter l'usage frontend
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const rows = all(db, "SELECT cle, valeur, label, groupe FROM infos_paroisse ORDER BY groupe, id");
    // Transformer en objet { cle: valeur } pour usage simple côté frontend
    const obj = {};
    rows.forEach(r => { obj[r.cle] = r.valeur; });
    res.json(obj);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/infos/all — retourne le tableau complet avec labels (pour l'admin)
router.get("/all", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    res.json(all(db, "SELECT * FROM infos_paroisse ORDER BY groupe, id"));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/infos/:cle — mettre à jour une valeur par sa clé
router.put("/:cle", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const { valeur } = req.body;
    const existing = get(db, "SELECT id FROM infos_paroisse WHERE cle=?", [req.params.cle]);
    if (!existing) return res.status(404).json({ error: "Clé introuvable" });
    run(db, "UPDATE infos_paroisse SET valeur=? WHERE cle=?", [valeur, req.params.cle]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/infos/batch — mettre à jour plusieurs clés en une requête
router.post("/batch", isAuth, async (req, res) => {
  try {
    const db = await getDb();
    const updates = req.body; // { cle: valeur, cle2: valeur2, ... }
    Object.entries(updates).forEach(([cle, valeur]) => {
      const existing = get(db, "SELECT id FROM infos_paroisse WHERE cle=?", [cle]);
      if (existing) run(db, "UPDATE infos_paroisse SET valeur=? WHERE cle=?", [valeur, cle]);
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
