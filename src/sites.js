const sites = [
  // UK
  { name: "Daily Mail", url: "https://dailymail.co.uk/", country: "UK" },
  { name: "The Telegraph", url: "https://telegraph.co.uk/", country: "UK" },
  { name: "Independent", url: "https://independent.co.uk/", country: "UK" },
  { name: "Mirror", url: "https://mirror.co.uk/", country: "UK" },
  { name: "The Sun", url: "https://thesun.co.uk/", country: "UK" },
  { name: "The Guardian", url: "https://theguardian.com/international/", country: "UK" },
  { name: "Financial Times", url: "https://ft.com/", country: "UK" },
  { name: "BBC World", url: "https://bbc.com/news/world/", country: "UK" },
  // USA
  { name: "Washington Post", url: "https://washingtonpost.com/", country: "US" },
  { name: "NY Times", url: "https://nytimes.com/", country: "US" },
  { name: "Fox News", url: "https://foxnews.com/", country: "US" },
  { name: "The Wall Street Journal", url: "https://wsj.com/", country: "US" },
  { name: "AP News", url: "https://apnews.com/", country: "US" },
  { name: "VOX", url: "https://vox.com/", country: "US" },
  { name: "USA Today", url: "https://eu.usatoday.com/", country: "US" },
  { name: "Los Angeles Times", url: "https://www.latimes.com/", country: "US" },
  { name: "CNBC", url: "https://www.cnbc.com/world/", country: "US" },
  { name: "Bloomberg", url: "https://www.bloomberg.com/europe/", country: "US" },
  { name: "NBC News", url: "https://www.nbcnews.com/", country: "US" },
  // NL
  { name: "Telegraaf", url: "https://telegraaf.nl/", country: "NL" },
  { name: "AD", url: "https://ad.nl/", country: "NL" },
  // Belgien
  {name: "Het Laatste Nieuws",url:"https://www.hln.be/", country: "BE"},
  // Frankrike
  { name: "Le Monde", url: "https://lemonde.fr/en/", country: "FR" },
  { name: "Le Figaro", url: "https://lefigaro.fr/", country: "FR" },
  { name: "France 24", url: "https://www.france24.com/en/", country: "FR" },
  // Italien
  { name: "Corriere della Sera", url: "https://corriere.it/", country: "IT" },
  { name: "La Repubblica", url: "https://repubblica.it/", country: "IT" },
  { name: "La Stampa", url: "https://lastampa.it/", country: "IT" },
  { name: "La Gazzetta dello Sport", url: "https://gazzetta.it/", country: "IT" },
  // Spanien
  { name: "El País", url: "https://elpais.com/", country: "SP" },
  // Tyskland
  { name: "Bild", url: "https://bild.de/", country: "DE" },
  { name: "T-Online", url: "https://t-online.de/", country: "DE" },
  { name: "Tagesschau", url: "https://tagesschau.de/", country: "DE" },
  { name: "Der Spiegel", url: "https://spiegel.de/", country: "DE" },
  { name: "Deutsche Welle", url: "https://www.dw.com/en/", country: "DE" },
  // Schweiz
  { name: "Neue Zürcher Zeitung", url: "https://www.nzz.ch/", country: "CH" },
  { name: "20 min", url: "https://www.20min.ch/", country: "CH" },
  // Österrike
  { name: "Kronen Zeitung", url: "https://www.krone.at/", country: "AT" },
  { name: "Heute", url: "https://www.heute.at/", country: "AT" },
  // Denmark
  { name: "Ekstrabladet", url: "https://ekstrabladet.dk/", country: "DK" },
  { name: "BT", url: "https://bt.dk/", country: "DK" },
  { name: "Politiken", url: "https://politiken.dk/", country: "DK" },
  // Finland
  { name: "Huvudstabladet", url: "https://hbl.fi/", country: "FI" },
  { name: "Helsingin Sanomat", url: "https://hs.fi/", country: "FI" },
  // Norge
  { name: "VG", url: "https://vg.no/", country: "NO" },
  { name: "Dagbladet", url: "https://dagbladet.no/", country: "NO" },
  { name: "Aftenposten", url: "https://aftenposten.no/", country: "NO" },
  { name: "Nettavisen", url: "https://nettavisen.no/", country: "NO" },
  { name: "E24", url: "https://e24.no/", country: "NO" },
  { name: "Finansavisen", url: "https://finansavisen.no/", country: "NO" },
  // Island
  { url: "https://www.mbl.is/frettir/", country: "IS" },
  // Sverige
  { name: "Aftonbladet", url: "https://aftonbladet.se/", country: "SE" },
  { name: "Expressen", url: "https://expressen.se/", country: "SE" },
  { name: "GP", url: "https://gp.se/", country: "SE" },
  { name: "DN", url: "https://dn.se/", country: "SE" },
  { name: "Di", url: "https://di.se/", country: "SE" },
  { name: "Svenska Dagbladet", url: "https://svd.se/", country: "SE" },
  { name: "Sydsvenskan", url: "https://sydsvenskan.se/", country: "SE" },
  { name: "Dagens Naringsliv", url: "https://dagensnaringsliv.se/", country: "SE" },
  { name: "Omni", url: "https://omni.se/", country: "SE" },
  { name: "Breakit", url: "https://breakit.se/", country: "SE" },
  { name: "Realtid", url: "https://realtid.se/", country: "SE" },
  { name: "Resume", url: "https://resume.se/", country: "SE" },
  { name: "Dagens Samhalle", url: "https://dagenssamhalle.se/", country: "SE" },
  { name: "Västerbottenskuriren", url: "https://vk.se/", country: "SE" },
  { name: "Privata Affarer", url: "https://privataaffarer.se/", country: "SE" },
  { name: "Nyheter 24", url: "https://nyheter24.se/", country: "SE" },
  { name: "Hallandsposten", url: "https://hallandsposten.se/", country: "SE" },
  { name: "Sweclockers", url: "https://sweclockers.com/", country: "SE" },
  { name: "Ny Teknik", url: "https://nyteknik.se/", country: "SE" },
  { name: "IDG", url: "https://idg.se/", country: "SE" },
  { name: "SVT", url: "https://svt.se/", country: "SE" },
  { name: "Dala-Demokraten", url: "https://www.dalademokraten.se/", country: "SE" },
  { name: "Helsingborgs Dagblad", url: "https://www.hd.se/", country: "SE" },
  // Australien
  {name: "Herald Sun",url:"https://www.heraldsun.com.au/", country: "AU"},
  {name: "The Sydney Morning Herald",url:"https://www.smh.com.au/", country: "AU"},
  // Canada
  {name: "The Globe and Mail",url:"https://www.theglobeandmail.com/", country: "CA"},
  {name: "Toronto Star",url:"https://www.thestar.com/", country: "CA"},
  // New Zeeland
  {name: "NZ Herald",url:"https://www.nzherald.co.nz/", country: "NZ"},
  // Sydafrika
  {name: "Sunday Times",url:"https://www.timeslive.co.za/sunday-times/", country: "ZA"},
  // Thailand
  {name: "Bangkok Post",url:"https://www.bangkokpost.com/", country: "TH"},
  // Qatar
  {name: "Al Jazeera",url:"https://www.aljazeera.com/", country: "QA"},

];
module.exports = { sites };
