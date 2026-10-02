/* ==========================================================================
   EDIT THIS FILE to change contact details across every page.
   Items marked CONFIRM were guessed and need the doctor's confirmation.
   ========================================================================== */
window.SITE = {
  clinic: "Bilawal Homoeopathic Clinic",   // from the Google Maps listing
  clinicUr: "بلاول ہومیوپیتھک کلینک",
  tagline: "Homoeopathic care",
  taglineUr: "ہومیوپیتھک علاج",
  phone: "+92 300 7592091",                // shown on the page
  phoneRaw: "+923007592091",               // used for tel: links
  whatsapp: "923007592091",                // digits only, with country code, no +
  email: "drmuhammadnasir62@gmail.com",     // shown on the site and used for "Send by email" fallback
  // Web3Forms access key. Create a free key at web3forms.com using the clinic's email,
  // paste it between the quotes, and "Send by email" will deliver straight to that inbox.
  // (If this is ever left empty, "Send by email" opens the visitor's own email app instead.)
  web3formsKey: "ae943642-5d7b-48c2-927a-216d05b1360b",
  // Firebase settings for LIVE patient reviews (see the private guide, "Live reviews").
  // Leave empty to keep reviews in js/reviews.js only.
  firebase: {
    apiKey: "AIzaSyD96LyiGoHX4CY7ZZ63m4e0taJt9LtNJcI",
    authDomain: "bilawal-homoeopathic-clicnic.firebaseapp.com",
    projectId: "bilawal-homoeopathic-clicnic",
    appId: "1:445545439413:web:92f183f0f7d71dbd5e1efc"
  },
  address: "122 K Block, Street No. 1, Burewala, Punjab, Pakistan",
  addressUr: "122 کے بلاک، گلی نمبر 1، بورے والا، پنجاب، پاکستان",
  // Exact map pin (from the Google Maps link) used for the embedded map and directions.
  mapQuery: "30.1585391,72.6731291",
  // Where the "Open in Google Maps" click goes.
  mapLink: "https://maps.app.goo.gl/nCBqmBjc35WHcf2P7",
  // Opening hours and doctors' availability now live in js/timings.js (edit with timings-admin.html).
};
