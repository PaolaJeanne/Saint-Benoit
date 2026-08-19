const initSqlJs = require("sql.js");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "..", "database.db");

let _db = null;

async function getDb() {
  if (_db) return _db;

  const SQL = await initSqlJs();

  let fileBuffer;
  if (fs.existsSync(DB_PATH)) {
    fileBuffer = fs.readFileSync(DB_PATH);
  }

  _db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

  _db.run(`
    CREATE TABLE IF NOT EXISTS messes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jour TEXT NOT NULL,
      heure TEXT NOT NULL,
      type TEXT DEFAULT 'Messe',
      intention TEXT,
      ordre INTEGER DEFAULT 0,
      actif INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS actualites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      categorie TEXT DEFAULT 'vie-paroissiale',
      chapeau TEXT,
      contenu TEXT,
      image TEXT,
      date_publication TEXT DEFAULT (date('now')),
      actif INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS evenements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      description TEXT,
      date_debut TEXT,
      lieu TEXT,
      icone TEXT DEFAULT 'fa-calendar',
      actif INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS equipe (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT,
      photo TEXT,
      email TEXT,
      ordre INTEGER DEFAULT 0,
      actif INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS mouvements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      categorie TEXT DEFAULT 'jeunes',
      tranche_age TEXT,
      description TEXT,
      horaire TEXT,
      lieu TEXT,
      responsable TEXT,
      icone TEXT DEFAULT 'fa-users',
      ordre INTEGER DEFAULT 0,
      actif INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS temoignages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      texte TEXT NOT NULL,
      auteur TEXT NOT NULL,
      mouvement TEXT,
      actif INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      description TEXT,
      icone TEXT DEFAULT 'fa-church',
      ordre INTEGER DEFAULT 0,
      actif INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS infos_paroisse (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cle TEXT UNIQUE NOT NULL,
      valeur TEXT,
      label TEXT,
      groupe TEXT DEFAULT 'general'
    );
  `);

  // ---- Données initiales ----

  const mc = _db.exec("SELECT COUNT(*) as c FROM messes")[0];
  if (mc && mc.values[0][0] === 0) {
    _db.run("INSERT INTO messes (jour, heure, type, ordre) VALUES (?, ?, ?, ?)", ["Lundi - Vendredi", "06h30", "Messe", 1]);
    _db.run("INSERT INTO messes (jour, heure, type, ordre) VALUES (?, ?, ?, ?)", ["Samedi", "06h30", "Messe", 2]);
    _db.run("INSERT INTO messes (jour, heure, type, ordre) VALUES (?, ?, ?, ?)", ["Dimanche", "07h30", "Messe", 3]);
    _db.run("INSERT INTO messes (jour, heure, type, ordre) VALUES (?, ?, ?, ?)", ["Dimanche", "10h00", "Messe des jeunes", 4]);
  }

  const ac = _db.exec("SELECT COUNT(*) as c FROM actualites")[0];
  if (ac && ac.values[0][0] === 0) {
    _db.run("INSERT INTO actualites (titre, categorie, chapeau, image) VALUES (?, ?, ?, ?)",
      ["Programme de la Semaine Sainte", "vie-paroissiale", "Des Rameaux à la Résurrection : découvrez le déroulement complet.", "Paque.jpg"]);
    _db.run("INSERT INTO actualites (titre, categorie, chapeau, image) VALUES (?, ?, ?, ?)",
      ["Nos projets de construction avancent", "projets", "Construction de la Grotte Mariale et nouveau Presbytère.", "grotte-mariale.jpg"]);
    _db.run("INSERT INTO actualites (titre, categorie, chapeau, image) VALUES (?, ?, ?, ?)",
      ["Cérémonie de réparation après la profanation", "vie-paroissiale", "Célébration présidée par le Vicaire Général.", "reparation-autel.jpeg"]);
  }

  const ec = _db.exec("SELECT COUNT(*) as c FROM evenements")[0];
  if (ec && ec.values[0][0] === 0) {
    _db.run("INSERT INTO evenements (titre, description, date_debut, lieu, icone) VALUES (?, ?, ?, ?, ?)",
      ["Temps du Carême", "Temps de conversion et de prière", "Mars - Avril", "Paroisse Saint-Benoît", "fa-cross"]);
    _db.run("INSERT INTO evenements (titre, description, date_debut, lieu, icone) VALUES (?, ?, ?, ?, ?)",
      ["Semaine Sainte et Pâques", "Célébrations de la Passion et de la Résurrection", "Semaine Sainte", "Paroisse Saint-Benoît", "fa-church"]);
    _db.run("INSERT INTO evenements (titre, description, date_debut, lieu, icone) VALUES (?, ?, ?, ?, ?)",
      ["Fête Patronale Saint-Benoît", "Grande fête de notre patron le 11 Juillet", "11 Juillet", "Paroisse Saint-Benoît", "fa-star"]);
  }

  const eqc = _db.exec("SELECT COUNT(*) as c FROM equipe")[0];
  if (eqc && eqc.values[0][0] === 0) {
    _db.run("INSERT INTO equipe (nom, role, bio, photo, email, ordre) VALUES (?, ?, ?, ?, ?, ?)",
      ["Père Jesus Martial", "Curé de la paroisse", "Ordonné prêtre en 2017, le Père Jesus Martial guide notre communauté avec sagesse et dévouement depuis lors.", "Cure.jpg", "pere.jm@saint-benoit.cm", 1]);
    _db.run("INSERT INTO equipe (nom, role, bio, photo, email, ordre) VALUES (?, ?, ?, ?, ?, ?)",
      ["Père Mesaac", "Vicaire de la paroisse", "Jeune prêtre dynamique, le Père Mesaac s'occupe particulièrement de la pastorale des jeunes et de la catéchèse.", "Vicaire.jpg", "pere.mesaac@saint-benoit.cm", 2]);
  }

  const mvc = _db.exec("SELECT COUNT(*) as c FROM mouvements")[0];
  if (mvc && mvc.values[0][0] === 0) {
    const mvs = [
      ["Mouvement Jeune", "jeunes", "16 - 35 ans", "Rencontres mensuelles, formation spirituelle, pèlerinages et actions solidaires.", "1er samedi du mois - 15h00", "Salle paroissiale", "Sœur Thérèse", "fa-users", 1],
      ["Enfants de Chœur", "jeunes", "Garçons 8-16 ans", "Service liturgique au pied de l'autel. Formation spirituelle et accompagnement du prêtre.", "Samedi - 9h00", "Sacristie et église", "M. Jean Mballa", "fa-cross", 2],
      ["Garde Suisse", "jeunes", "Jeunes hommes 18-30 ans", "Service d'honneur lors des grandes célébrations et processions.", "2e dimanche du mois - 15h00", "Salle paroissiale", "M. André Fouda", "fa-shield-alt", 3],
      ["Lecteurs", "jeunes", "16 ans et plus", "Service de la Parole de Dieu pendant les célébrations liturgiques.", "Samedi - 10h00", "Église principale", "M. Paul Essomba", "fa-book-open", 4],
      ["Chorale des Jeunes", "jeunes", "14-35 ans", "Animation musicale des messes des jeunes. Répertoire moderne et traditionnel.", "Mercredi - 18h00", "Église principale", "Mlle Sarah Nkomo", "fa-music", 5],
      ["Légion de Marie", "adultes", "Adultes tous âges", "Mouvement marial d'apostolat et de sanctification. Prière du chapelet et service aux démunis.", "Jeudi - 17h00", "Salle Marie", "Mme Marie Atangana", "fa-praying-hands", 6],
      ["Dames Apostoliques", "adultes", "Femmes adultes", "Mouvement féminin d'apostolat et de charité. Formation spirituelle et actions caritatives.", "Mardi - 15h00", "Salle des Dames", "Mme Célestine Owona", "fa-female", 7],
      ["Miséricorde Divine", "adultes", "Adultes tous âges", "Dévotion à Jésus Miséricordieux. Chapelet de la Miséricorde, neuvaines et adoration.", "Vendredi - 15h00", "Chapelle du Saint-Sacrement", "Mme Sylvie Mballa", "fa-heart", 8],
      ["Chorale Sainte-Cécile", "chorales", "Adultes tous âges", "Chorale principale. Animation des messes dominicales et des grandes fêtes liturgiques.", "Mardi et vendredi - 18h00", "Église principale", "M. Paul Essomba", "fa-music", 9],
      ["Chorale des Enfants", "chorales", "6-15 ans", "Formation musicale et liturgique des enfants. Animation des messes des familles.", "Samedi - 14h00", "Salle de catéchisme", "Mlle Marie Nkomo", "fa-child", 10],
      ["Chorale Gospel", "chorales", "Jeunes et adultes", "Répertoire gospel et chants contemporains. Animation des veillées de prière.", "Dimanche - 16h00", "Salle paroissiale", "M. Thomas Ngono", "fa-microphone", 11]
    ];
    mvs.forEach(m => _db.run(
      "INSERT INTO mouvements (nom, categorie, tranche_age, description, horaire, lieu, responsable, icone, ordre) VALUES (?,?,?,?,?,?,?,?,?)", m
    ));
  }

  const tc = _db.exec("SELECT COUNT(*) as c FROM temoignages")[0];
  if (tc && tc.values[0][0] === 0) {
    _db.run("INSERT INTO temoignages (texte, auteur, mouvement) VALUES (?, ?, ?)",
      ["Le Mouvement Jeune m'a formé à l'engagement social. Grâce à la méthode 'Voir-Juger-Agir', j'ai appris à être un témoin du Christ dans mon université.", "Marie, 20 ans", "Mouvement Jeune"]);
    _db.run("INSERT INTO temoignages (texte, auteur, mouvement) VALUES (?, ?, ?)",
      ["Servir comme enfant de chœur m'a rapproché de Jésus-Eucharistie. C'est un honneur de L'accompagner à l'autel chaque dimanche.", "Paul, 14 ans", "Enfant de Chœur"]);
    _db.run("INSERT INTO temoignages (texte, auteur, mouvement) VALUES (?, ?, ?)",
      ["La Légion de Marie nous unit dans la prière et le service. Sous le regard de Notre-Dame, nous grandissons en sainteté.", "Sylvie, 45 ans", "Légion de Marie"]);
  }

  const sc = _db.exec("SELECT COUNT(*) as c FROM services")[0];
  if (sc && sc.values[0][0] === 0) {
    _db.run("INSERT INTO services (titre, description, icone, ordre) VALUES (?, ?, ?, ?)",
      ["Sacrements", "Baptême, Confirmation, Mariage, Réconciliation... Nous vous accompagnons dans votre cheminement spirituel.", "fa-hands-praying", 1]);
    _db.run("INSERT INTO services (titre, description, icone, ordre) VALUES (?, ?, ?, ?)",
      ["Catéchèse", "Formation chrétienne pour tous les âges : enfants, jeunes et adultes. Approfondissez votre foi.", "fa-graduation-cap", 2]);
    _db.run("INSERT INTO services (titre, description, icone, ordre) VALUES (?, ?, ?, ?)",
      ["Chorales", "Rejoignez nos chorales paroissiales et participez à la beauté des célébrations liturgiques.", "fa-music", 3]);
    _db.run("INSERT INTO services (titre, description, icone, ordre) VALUES (?, ?, ?, ?)",
      ["Solidarité", "Actions caritatives et soutien aux plus démunis. Ensemble, construisons un monde plus juste.", "fa-heart", 4]);
  }

  const ic = _db.exec("SELECT COUNT(*) as c FROM infos_paroisse")[0];
  if (ic && ic.values[0][0] === 0) {
    const infos = [
      // Contact
      ["adresse", "PK15 - PK16, Dallas-Nsape", "Adresse", "contact"],
      ["telephone", "+237 6 91 06 04 15", "Téléphone principal", "contact"],
      ["telephone2", "+237 6 52 72 65 52", "Téléphone secondaire", "contact"],
      ["email", "contact@saint-benoit.cm", "Email général", "contact"],
      ["email_mouvements", "mouvements@saint-benoit.cm", "Email mouvements", "contact"],
      ["horaires_secretariat", "Lun-Ven : 8h–12h / 14h–17h — Sam : 8h–12h", "Horaires secrétariat", "contact"],
      // Réseaux sociaux
      ["facebook", "https://facebook.com/paroisse.saintbenoit.dallas", "Facebook", "reseaux"],
      ["instagram", "https://instagram.com/saintbenoit_dallas", "Instagram", "reseaux"],
      ["youtube", "https://youtube.com/@paroissesaintbenoit", "YouTube", "reseaux"],
      // Textes hero / accueil
      ["hero_citation", "\"Venez et vous verrez\"", "Citation hero accueil", "textes"],
      ["hero_soustitre", "La Paroisse Saint-Benoît vous accueille dans la joie et la paix du Christ. Rejoignez notre communauté de foi, d'espérance et de charité.", "Sous-titre hero accueil", "textes"],
      // Histoire
      ["histoire_titre", "Notre Histoire", "Titre section histoire", "textes"],
      ["histoire_lead", "La Paroisse Saint-Benoît a été fondée en 2017 avec la mission de rassembler la communauté chrétienne dans un esprit de foi, de communion et d'espérance.", "Texte principal histoire", "textes"],
      ["histoire_texte", "Située au cœur de Dallas-Nsape, notre paroisse rayonne depuis son église principale à Dallas avec un poste eucharistique à Nsape. Notre histoire de croissance continue a vu naître plusieurs communautés, dont celle de PK 17 qui est devenue paroisse autonome.", "Texte secondaire histoire", "textes"],
      ["histoire_image", "OIP.webp", "Image histoire", "textes"],
      // Footer
      ["footer_description", "Une communauté vivante de foi, d'espérance et de charité au service de tous.", "Description footer", "textes"],
      ["copyright", "2025 Paroisse Saint-Benoît. Tous droits réservés.", "Texte copyright", "textes"],
      // Coordonnées carte
      ["carte_lat", "3.9500", "Latitude carte", "localisation"],
      ["carte_lng", "9.7100", "Longitude carte", "localisation"],
      ["carte_label", "Paroisse Saint-Benoît, Dallas-Nsape, Douala", "Label carte", "localisation"]
    ];
    infos.forEach(([cle, valeur, label, groupe]) =>
      _db.run("INSERT INTO infos_paroisse (cle, valeur, label, groupe) VALUES (?, ?, ?, ?)", [cle, valeur, label, groupe])
    );
  }

  saveDb(_db);
  return _db;
}

function saveDb(db) {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function all(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function get(db, sql, params = []) {
  return all(db, sql, params)[0] || null;
}

function run(db, sql, params = []) {
  db.run(sql, params);
  saveDb(db);
  const lastId = db.exec("SELECT last_insert_rowid() as id")[0];
  return { lastInsertRowid: lastId ? lastId.values[0][0] : null };
}

module.exports = { getDb, all, get, run, saveDb };
