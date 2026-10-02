/* ==========================================================================
   TIMINGS — the ONE file for opening hours and doctors' availability.
   Change it with timings-admin.html (fill in the form, download the new
   timings.js, replace this file) or edit it by hand.

   hours     the clinic's opening hours, shown in the page footer, on the
             Contact page and on the Appointment page. Days must stay in this
             order. Use "Closed" for a day off.
   doctors   the availability line shown on each doctor's card. The name on
             the left is the doctor's id from js/doctors.js.
   ========================================================================== */
window.TIMINGS = {
  hours: [
    { day: "Monday", time: "10:00 am – 6:00 pm" },
    { day: "Tuesday", time: "10:00 am – 6:00 pm" },
    { day: "Wednesday", time: "10:00 am – 6:00 pm" },
    { day: "Thursday", time: "10:00 am – 6:00 pm" },
    { day: "Friday", time: "Closed" },
    { day: "Saturday", time: "10:00 am – 6:00 pm" },
    { day: "Sunday", time: "10:00 am – 6:00 pm" }
  ],
  doctors: {
    "doctor-1": "Every day except Friday",
    "doctor-2": "Thursday, Saturday and Sunday"
  }
};
