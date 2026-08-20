try { require("dotenv").config(); } catch (e) { /* dotenv optionnel */ }

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { getDb } = require("./db/init");

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === "production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_SECRET = process.env.SESSION_SECRET || "sb-secret-2024-xK9mL";

// Vérifications de sécurité en production
if (IS_PROD) {
  if (!process.env.SESSION_SECRET || SESSION_SECRET === "sb-secret-2024-xK9mL") {
    console.error("❌ [SECURITE FATALE] SESSION_SECRET doit être défini avec une clé forte dans .env en production !");
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD || ADMIN_PASSWORD === "admin") {
    console.error("❌ [SECURITE FATALE] ADMIN_PASSWORD doit être défini avec un mot de passe fort dans .env en production !");
    process.exit(1);
  }
}

// Configuration CORS (configurable via .env CORS_ORIGIN)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : null;

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Accès CORS non autorisé"));
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
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Rate limiter général pour les requêtes API (120 req / minute)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, veuillez réessayer ultérieurement." }
});
app.use("/api/", apiLimiter);

// Rate limiter strict pour la connexion admin (5 tentatives max par 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Trop de tentatives de connexion échouées. Veuillez réessayer dans 15 minutes." }
});

// ---- Logger HTTP coloré pour TOUTES les requêtes API et Admin ----
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const color = res.statusCode >= 500 ? "\x1b[31m"   // rouge
                : res.statusCode >= 400 ? "\x1b[33m"   // jaune
                : res.statusCode >= 300 ? "\x1b[36m"   // cyan
                : "\x1b[32m";                           // vert
    const reset = "\x1b[0m";
    const method = req.method.padEnd(6);
    const status = res.statusCode;
    const url = req.originalUrl;
    const ms = `${duration}ms`.padStart(6);

    // Logger toutes les requêtes d'API, admin, auth et pages html
    if (!/\.(css|js|png|jpg|jpeg|webp|ico|svg|woff|woff2|ttf|map)(\?|$)/.test(url)) {
      console.log(`🌐 ${color}${method}${reset} ${status} ${url.padEnd(35)} \x1b[90m(${ms})\x1b[0m`);
    }
  });
  next();
});

// ---- Auth ----
app.post("/api/auth/login", loginLimiter, (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.authenticated = true;
    console.log("🔐 \x1b[32m[AUTH]\x1b[0m Connexion ADMIN réussie !");
    res.json({ success: true });
  } else {
    console.log("⚠️ \x1b[31m[AUTH]\x1b[0m Échec de connexion : mot de passe incorrect");
    res.status(401).json({ success: false, message: "Mot de passe incorrect" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  console.log("🚪 \x1b[33m[AUTH]\x1b[0m Déconnexion ADMIN");
  req.session.destroy(() => res.json({ success: true }));
});

app.get("/api/auth/check", (req, res) => {
  const isAuth = !!(req.session && req.session.authenticated);
  res.json({ authenticated: isAuth });
});

// ---- API Routes ----
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

app.get("/admin/login.html", (req, res) => {
  if (req.session && req.session.authenticated) return res.redirect("/admin/");
  res.sendFile(path.join(__dirname, "admin", "login.html"));
});

app.use("/admin", requireAuth, express.static(path.join(__dirname, "admin")));

// ---- Site statique ----
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Middleware de gestion des erreurs (Multer, validation, CORS)
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur :", err.message);
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Fichier trop volumineux. La taille maximale est de 5 Mo." });
    }
    return res.status(400).json({ error: `Erreur d'upload : ${err.message}` });
  }
  if (err.message && err.message.includes("formats d'image")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: "Origine CORS non autorisée." });
  }
  res.status(500).json({ error: "Une erreur interne est survenue." });
});

// Fallback 404
app.use((req, res) => res.status(404).send("Page non trouvée"));

// ---- Démarrage ----
getDb().then(() => {
  app.listen(PORT, () => {
    console.log("\n=======================================================");
    console.log("✅ Serveur Paroisse Saint-Benoît : http://localhost:" + PORT);
    console.log("🔐 Panneau admin             : http://localhost:" + PORT + "/admin/");
    console.log("🔑 Mot de passe admin        : " + (process.env.ADMIN_PASSWORD ? "(défini dans .env)" : '"admin" (⚠️ par défaut, changez-le en production)'));
    console.log("🛡️  Sécurité                   : Rate-limiting & validation upload activés");
    console.log("📊 Logs activés sur TOUTES les routes !");
    console.log("=======================================================\n");
  });
}).catch(err => {
  console.error("❌ Erreur d'initialisation :", err);
  process.exit(1);
});
