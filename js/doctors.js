/* ==========================================================================
   DOCTORS — one block per doctor. Add, remove or reorder freely.
   The About page, the "Meet our doctors" section on Home and the
   "Preferred doctor" menu on the appointment form all read from here.

   To add a doctor, copy the block below, give it a new id and fill it in.
   Any field you leave out simply does not show.

     id               short unique name, lowercase, no spaces
     name             full name with title, e.g. "Dr. Ayesha Khan"
     role             e.g. "Homoeopathic physician"
     qualifications   degrees, e.g. "DHMS, RHMP" (add the registration number if you wish)
     education        where the degree was completed
     experience       e.g. "30+ years of experience"
     patients         e.g. "4000+ patients treated"
     focus            areas of special interest (list)
     timing           the days and hours this doctor sees patients
     languages        languages spoken with patients
     bio              one or two sentences about the doctor
     photo            path to a portrait, e.g. "img/doctors/doctor-1.jpg"
                      (portrait, about 800 x 1000). If missing, an initial shows.
   ========================================================================== */
window.DOCTORS = [
  {
    id: "doctor-1",
    name: "Dr. M Nasir",
    name_ur: "ڈاکٹر محمد ناصر",
    role: "Homoeopathic consultant and infertility specialist",
    qualifications: "DHMS, RHMP",
    education: "Vehari Homoeopathic Medical College",
    experience: "30+ years of experience",
    patients: "4000+ patients treated",
    timing: "Every day except Friday",
    focus: ["Infertility", "Child health", "Men's health"],
    bio: "More than 30 years of homoeopathic practice, with special interests in infertility, child health and men's health.",
    photo: "img/doctors/doctor-1.jpg"
  },
  {
    id: "doctor-2",
    name: "Dr. Fozia Nasir",
    role: "Homoeopathic consultant",
    qualifications: "DHMS, RHMP",
    education: "Almarad Homoeopathic Medical College and Hospital, Sahiwal",
    experience: "28+ years of experience",
    patients: "2000+ patients treated",
    timing: "Thursday, Saturday and Sunday",
    focus: ["Infertility", "Women's health", "Child health"],
    bio: "More than 28 years of homoeopathic practice, with special interests in infertility, women's health and child health.",
    photo: "img/doctors/doctor-2.jpg"
  }
];
