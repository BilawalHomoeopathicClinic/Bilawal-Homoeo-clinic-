/* ==========================================================================
   PATIENT REVIEWS — shown on reviews.html and in the home-page slider.

   Patients publish reviews live from the Reviews page (stored in Firebase), so this
   list starts empty. Only add a review here by hand if you have a patient's permission:
     { id: "r1", featured: true, rating: 5, tag: "family", name: "A. Khan", role: "Parent of a patient", text: "..." }

     name / name_ur   patient's first name or initials
     role / role_ur   short description, e.g. "Parent of a patient"
     tag              one of the keys in REVIEW_TAGS below
     rating           1 to 5
     featured         true = also shown in the home-page slider
   ========================================================================== */
window.REVIEW_TAGS = {
  children: ["Children", "بچے"],
  skin: ["Skin", "جلد"],
  digestive: ["Digestive", "ہاضمہ"],
  mind: ["Stress and sleep", "ذہنی دباؤ اور نیند"],
  camp: ["Free camps", "مفت کیمپ"],
  family: ["Family care", "خاندانی علاج"]
};

window.REVIEWS = [];
