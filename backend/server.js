// Charger les variables d'environnement depuis .env si présent
try { require("dotenv").config(); } catch (e) { /* dotenv optionnel */ }

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const { getDb } = require("./db/init");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_SECRET = process.env.SESSION_SECRET || "sb-secret-2024-xK9mL";

app.use(cors({
  origin: function(origin, callback) {
    // Accepter : même origine, file://, et localhost sur n'importe quel port
    if (!origin || origin === 'null' || /^file:\/\//.test(origin) || /^https?:\/\/localhost/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // En dev, tout accepter
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// ---- Auth ----
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.authenticated = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Mot de passe incorrect" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get("/api/auth/check", (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.authenticated) });
});

// ---- API Routes (GET publiques, POST/PUT/DELETE protégées dans les routes) ----
app.use("/api/messes",       require("./routes/messes"));
app.use("/api/actualites",   require("./routes/actualites"));
app.use("/api/evenements",   require("./routes/evenements"));
app.use("/api/equipe",       require("./routes/equipe"));
app.use("/api/mouvements",   require("./routes/mouvements"));
app.use("/api/temoignages",  require("./routes/temoignages"));
app.use("/api/services",     require("./routes/services"));
app.use("/api/infos",        require("./routes/infos"));

// ---- Admin Panel (protégé) ----
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.redirect("/admin/login.html");
}

// Page de login — pas d'auth requise
app.get("/admin/login.html", (req, res) => {
  if (req.session && req.session.authenticated) return res.redirect("/admin/");
  res.sendFile(path.join(__dirname, "admin", "login.html"));
});

// Toutes les autres pages admin — auth requise
app.use("/admin", requireAuth, express.static(path.join(__dirname, "admin")));

// ---- Site statique (dossier frontend/) ----
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Fallback 404
app.use((req, res) => res.status(404).send("Page non trouvée"));

// ---- Démarrage : initialiser la DB d'abord ----
getDb().then(() => {
  app.listen(PORT, () => {
    console.log("✅ Serveur Paroisse Saint-Benoît : http://localhost:" + PORT);
    console.log("🔐 Panneau admin             : http://localhost:" + PORT + "/admin/");
    console.log("🔑 Mot de passe admin        : " + (process.env.ADMIN_PASSWORD ? "(depuis .env)" : '"admin" — changez-le dans .env !'));
  });
}).catch(err => {
  console.error("❌ Erreur d'initialisation de la base de données :", err);
  process.exit(1);
});
