const APP_STRINGS = {
  // Login
  LOGIN_TITLE: "Dobrodošli na SB Trade Upravljanje",
  LOGIN_EMAIL: "E-pošta",
  LOGIN_ENTER_EMAIL: "Unesi e-poštu",
  LOGIN_PASSWORD: "Lozinka",
  LOGIN_ENTER_PASSWORD: "Unesi lozinku",
  LOGIN_LOG_IN: "Prijavi se",

  // Navigation bar
  NAV_WISH_EU: "SB Trade Upravljanje",
  NAV_DATA_ENTRY: "Unos podataka",
  NAV_EMPLOYEES: "Zaposlenici",
  NAV_USERS: "Krajnji Korisnici",
  NAV_CATEGORIES: "Lokacije",
  NAV_SICK_LEAVE: "Bolovanje",
  NAV_VACATION: "Godišnji Odmor",
  NAV_REPORT_VIEW: "Pregled izvještaja",
  NAV_REPORTS: "Izvještaji",
  NAV_GENERATE: "Generiraj Mjesečni Izvještaj",
  NAV_LOG_OUT: "Odjavi se",

  // Category
  CAT_CATEGORIES: "Lokacije",
  CAT_ADD_NEW: "Dodaj Novu Lokaciju",
  CAT_BACK: "Nazad",
  CAT_IME: "Ime",
  CAT_ENTER_NAME: "Unesi ime lokacije",
  CAT_EDIT: "Uredi",
  CAT_CANCEL: "Poništi",
  CAT_APPLY: "Potvrdi",
  CAT_DELETE: "Izbriši",
  CAT_SAVE: "Spremi",
  CAT_THERE_IS_AN_ERROR: "Dogodila se greška, molimo pokušajte ponovno.",

  // Employees
  EMP_EMPLOYEES: "Zaposlenici",
  EMP_ADD_NEW: "Dodaj Novog Zaposlenika",
  EMP_EDIT: "Uredi",
  EMP_DELETE: "Izbriši",
  EMP_ENTER_ORG_PASSWORD: "Unesi svoju lozinku",
  EMP_IN_ORDER_TO: "Kako bi unijeli novog zaposlenika, unesite vašu lozinku.",
  EMP_CLOSE: "Zatvori",
  EMP_CANCEL: "Poništi",
  EMP_APPLY: "Potvrdi",
  EMP_SAVE: "Spremi",
  EMP_BACK: "Nazad",
  EMP_NAME: "Ime",
  EMP_ENTER_NAME: "Unesi ime zaposlenika",
  EMP_SURNAME: "Prezime",
  EMP_ENTER_SURNAME: "Unesi prezime zaposlenika",
  EMP_EMAIL: "E-pošte",
  EMP_ENTER_EMAIL: "Unesi e-poštu zaposlenika",
  EMP_PASSWORD: "Lozinka",
  EMP_ENTER_PASSWORD: "Unesi lozinku zaposlenika",
  EMP_THERE_IS_AN_ERROR: "Dogodila se greška, molimo pokušajte ponovno.",
  EMP_ITEM_VAC_NAME: "Ime",
  EMP_ITEM_VAC_START_DATE: "Početak",
  EMP_ITEM_VAC_END_DATE: "Završetak",
  EMP_ITEM_SL_START_DATE: "Početak",
  EMP_ITEM_SL_END_DATE: "Završetak",
  EMP_INFO: "Informacije o zaposleniku",
  EMP_SICK_LEAVE: "Bolovanja",
  EMP_VACCATION: "Godišnji odmori",
  EMP_LOADING: "Učitavanje...",
  EMP_NO_VACCATIONS: "Trenutno nema unesenih godišnjih odmora.",
  EMP_NO_SICK_LEAVES: "Trenutno nema unesenih godišnjih odmora.",

  // Sick Leave
  SL_ADD_NEW: "Dodaj Novo Bolovanje",
  SL_START_DATE: "Datum početka",
  SL_END_DATE: "Datum završetka",
  SL_SELECTE_EMPLOYEE: "Izaberi zaposlenika",
  SL_SAVE: "Spremi",
  SL_ERROR_WEEKEND:
    "Datumi početka ili završetka bolovanja ne mogu biti na vikend.",
  SL_ERROR_OVERLAP_SL:
    "Ovo bolovanje se preklapa s već dodanim bolovanjem za ovog zaposlenika.",
  SL_ERROR_OVERLAP_VAC:
    "Ovo bolovanje se preklapa s već dodanim godišnjim odmorom za ovog zaposlenika.",
  SL_ERROR_OVERLAP_COL_VAC:
    "Ovo bolovanje se preklapa s već dodanim kolektivnim godišnjim odmorom.",
  SL_ERROR_END_DATE: "Završni datum mora biti veći od početnog datuma.",
  SL_ERROR: "Dogodila se greška, molimo pokušajte ponovno.",
  SL_ADDED:
    "Bolovanje spremljeno. Da biste to vidjeli, odite na informacije o zaposleniku.",

  // End User
  EU_END_USER: "Krajnji Korisnici",
  EU_ADD_NEW: "Dodaj Novog Krajnjeg Korisnika",
  EU_BACK: "Nazad",
  EU_NAME: "Ime",
  EU_ENTER_NAME: "Unesi ime krajnjeg korisnika",
  EU_SURNAME: "Prezime",
  EU_ENTER_SURNAME: "Unesi prezime krajnjeg korisnika",
  EU_OIB: "OIB",
  EU_ENTER_OIB: "Unesi OIB krajnjeg korisnika",
  EU_SAVE: "Spremi",
  EU_THERE_IS_AN_ERROR: "Dogodila se greška, molimo pokušajte ponovno.",
  EU_EDIT: "Uredi",
  EU_DELETE: "Izbriši",
  EU_APPLY: "Potvrdi",
  EU_CANCEL: "Poništi",

  // Vacation
  VAC_ADD_NEW: "Dodaj Novi Godišnji Odmor",
  VAC_VACATION_TYPE: "Vrsta",
  VAC_INDIVIDUAL: "Individualni",
  VAC_COLLECTIVE: "Kolektivni",
  VAC_NAME: "Ime",
  VAC_ENTER_NAME: "Unesi ime godišnjeg odmora",
  VAC_START_DATE: "Početni datum",
  VAC_END_DATE: "Završni datum",
  VAC_SELECT_EMPLOYEE: "Izaberi zaposlenika",
  VAC_SAVE: "Spremi",
  VAC_ERROR_END_DATE: "Završni datum mora biti veći od početnog datuma.",
  VAC_ERROR_WEEKENDS:
    "Vikendi ne mogu biti izabrani kao početni ili završni datum.",
  VAC_ERROR_UNEXPECTED: "Neočekivana greška, molimo pokušajte kasnije.",
  VAC_SUCCESS_MSG:
    "Godišnji spremljen. Da biste to vidjeli, odite na informacije o zaposleniku.",
  VAC_ERROR_COL_OVERLAP:
    "Ovaj godišnji odmor se preklapa s već prije unesenim kolektivnim godišnjim odmorom.",
  VAC_ERROR_IND_OVERLAP:
    "Ovaj godišnji odmor se preklapa s već prije unesenim godišnjim odmorom za ovog radnika.",
  VAC_COLLECTIVE_TITLE: "Kolektivni godišnji",
  VAC_NO_COLLECTIVE_VACATOINS: "Trenutno nema dodanih kolektivnih godišnjih",
  VAC_BACK: "Nazad",

  // Reports
  REP_PREVIOUS_YEAR: "Prethodna godina",
  REP_NEXT_YEAR: "Iduća godina",
  REP_TABLE_DAY: "Dan",
  REP_TABLE_DESCRIPTION: "Opis",
  REP_TABLE_START_TIME: "Početno vrijeme",
  REP_TABLE_END_TIME: "Završno vrijeme",
  REP_TABLE_EMPLOYEE: "Zaposlenik",
  REP_TABLE_END_USER: "Krajnji korisnik",
  REP_SHOW_TABLE: "Prikažni tablicu",
  REP_HIDE_TABLE: "Sakrij tablicu",
  REP_FILTER_END_USER: "Filtriraj krajnjeg korisnika po imenu i prezimenu",
  REP_FILTER_DAY: "Filtriraj po danu",
  REP_FITLER_EMPLOYEE: "Filtriraj zaposlenika po imenu i prezimenu",

  // Generate Monthly Report
  GMR_GENERATE_MONTHLY_REPORT: "Generiraj Mjesečno Izvješće",
  GMR_CONTRACT_NUMBER: "Broj ugovora",
  GMR_ENTER_CONTRACT_NUMBER: "Unesi broj ugovora",
  GMR_CONTRACT_NAME: "Ime ugovora",
  GMR_ENTER_CONTRACT_NAME: "Unesi ime ugovora",
  GMR_CONTRACT_USER: "Ime udruge",
  GMR_ENTER_CONTRACT_USER: "Unesi ime udruge koja provodi projekt",
  GMR_SELECT_EMPLOYEE: "Izaberi zaposlenika",
  GMR_SELECT_MONTH: "Izaberi mjesec",
  GMR_SELECT_YEAR: "Izaberi godinu",
  GMR_SAVE: "Generiraj Izvješće",
  GMR_DOC_LOADING: "Učitavanje dokumenta...",
  GMR_DOWNLOAD_PDF: "Preuzmi PDF",
  GMR_PDF_READY:
    "PDF dokument je spreman za preuzimanje. Kliknite link za preuzimanje.",
  GMR_ERROR:
    "Dogodila se greška. Čini se da nema aktivnosti za ovog zaposlenika ili ovo vremenskog razdoblje.",

  // Landing Page
  LANDING_FAILED_TO_LOG_OUT: "Pogreška u odjavljivanju, pokušajte ponovno.",
  LANDING_WELCOME: "Dobrodošli!",
  LANDING_MANAGE_ORG:
    "S ovom aplikacijom možete jednostavno upravljati svojom udrugom.",
  LANDING_CONTRACT_TITLE: "Ime ugovora",
  LANDING_ENTER_CONTRACT_TITLE:
    "Unesi ime ugovora koji će se koristiti u generiranju izvještaja",
  LANDING_CONTRACT_NUMBER: "Broj ugovora",
  LANDING_ENTER_CONTRACT_NUMBER:
    "Unesi broj ugovora koji će se koristiti u generiranju izvještaja",
  LANDING_SAVE: "Spremi",
  LANDING_INFO: "Unesite podatke koji će se koristiti u budućim izvještajima.",
};

export default APP_STRINGS;
