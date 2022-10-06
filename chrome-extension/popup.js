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
  // Denmark
  { name: "Ekstrabladet", url: "https://ekstrabladet.dk/", country: "DK" },
  { name: "bt", url: "https://bt.dk/", country: "DK" },
  { name: "Politiken", url: "https://politiken.dk/", country: "DK" },
  // Finland
  { name: "Huvudstabladet", url: "https://hbl.fi/", country: "FI" },
  { name: "Helsingin Sanomat", url: "https://hs.fi/", country: "FI" },
  // Frankrike
  { name: "Le Monde", url: "https://lemonde.fr/en/", country: "FR" },
  { name: "Le Figaro", url: "https://lefigaro.fr/", country: "FR" },
  // NL
  { name: "Telegraaf", url: "https://telegraaf.nl/", country: "NL" },
  { name: "AD", url: "https://ad.nl/", country: "NL" },
  // Italien
  { name: "Corriere della Sera", url: "https://corriere.it/", country: "IT" },
  { name: "La Repubblica", url: "https://repubblica.it/", country: "IT" },
  { name: "La Stampa", url: "https://lastampa.it/", country: "IT" },
  { name: "La Gazzetta dello Sport", url: "https://gazzetta.it/", country: "IT" },
  // Norge
  { name: "VG", url: "https://vg.no/", country: "NO" },
  { name: "Dagbladet", url: "https://dagbladet.no/", country: "NO" },
  { name: "Aftenposten", url: "https://aftenposten.no/", country: "NO" },
  { name: "Nettavisen", url: "https://nettavisen.no/", country: "NO" },
  { name: "E24", url: "https://e24.no/", country: "NO" },
  { name: "Finansavisen", url: "https://finansavisen.no/", country: "NO" },
  // Tyskland
  { name: "Bild", url: "https://bild.de/", country: "DE" },
  { name: "T-Online", url: "https://t-online.de/", country: "DE" },
  { name: "Tagesschau", url: "https://tagesschau.de/", country: "DE" },
  { name: "Der Spiegel", url: "https://spiegel.de/", country: "DE" },
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
];

// changeColor.onclick = function (element) {
//   let color = element.target.value;
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.executeScript(tabs[0].id, { code: 'document.body.style.backgroundColor = "' + color + '";' });
//   });
// };

function mainMenu(sites) {
  const el = document.getElementById("main-menu");
  for (const d of sites) {
    const n = document.createElement("li");
    const a = document.createElement("a");
    a.href = d.url;
    a.target = "_blank";
    a.innerText = d.name;
    n.appendChild(a);
    el.appendChild(n);
  }
}

console.log("meow");
mainMenu(sites);
