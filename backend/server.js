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
    callback(null, true);
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
app.post("/api/auth/login", (req, res) => {
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

// Fallback 404
app.use((req, res) => res.status(404).send("Page non trouvée"));

// ---- Démarrage ----
getDb().then(() => {
  app.listen(PORT, () => {
    console.log("\n=======================================================");
    console.log("✅ Serveur Paroisse Saint-Benoît : http://localhost:" + PORT);
    console.log("🔐 Panneau admin             : http://localhost:" + PORT + "/admin/");
    console.log("🔑 Mot de passe admin        : " + (process.env.ADMIN_PASSWORD ? "(défini dans .env)" : '"admin"'));
    console.log("📊 Logs activés sur TOUTES les routes !");
    console.log("=======================================================\n");
  });
}).catch(err => {
  console.error("❌ Erreur d'initialisation :", err);
  process.exit(1);
});
