// Posts shared by the website and the admin dashboard.
// In this prototype they are kept in the browser (localStorage), so a post
// written in the admin dashboard appears on the website in the same browser.
// A real system would keep them in a database.
window.HLB_POSTS = (() => {
  const KEY = "hlb-posts-v1";
  const DEFAULTS = [
    {
      id: "p1", cat: "update", date: "2026-10-21", icon: "🗣️", color: "blue", status: "published", example: false,
      title: "What families told us at our forum",
      summary: "Families shared how moving home affects their children's learning, and what would help most.",
      body: "At our Family Needs Assessment Forum, parents told us that moving home and temporary accommodation make it hard for children to keep learning. They asked for a platform that works on a mobile phone, in English and Farsi, with simple sign-in, audio instructions, and videos, books and homework help. We are using everything we heard to design HomeLearn Bridge.",
    },
    {
      id: "p2", cat: "activity", date: "2026-10-15", icon: "📱", color: "green", status: "published", example: false,
      title: "Children's app prototype ready for testing",
      summary: "The first version of the HomeLearn Bridge children's app is ready for families to try.",
      body: "The children's app lets several children in one family learn on the same device, in English, Dari or Pashto. It has learning games, stories read aloud, homework help, and stars and stickers to keep children motivated. We would love your feedback.",
    },
    {
      id: "p3", cat: "event", date: "2026-11-01", when: "Saturday 1 November · 11:00 · Hounslow library", icon: "👪", color: "orange", status: "published", example: true,
      title: "Family workshop: helping with homework",
      summary: "Simple ways to support your child's homework, even if you are still learning English.",
      body: "Join us for a friendly workshop for parents and carers. We will show you how to use the HomeLearn Bridge app with your children and share easy ways to help with homework at home. Interpreters for Dari and Pashto will be there.",
    },
    {
      id: "p4", cat: "event", date: "2026-11-04", when: "Tuesday 4 November · 13:00 · Online", icon: "🧑‍🎓", color: "purple", status: "published", example: true,
      title: "English classes for parents",
      summary: "A free weekly online English class for parents and carers.",
      body: "A relaxed online English class for adults, focused on everyday school words: letters from school, parents' evening, homework and more.",
    },
    {
      id: "p5", cat: "update", date: "2026-10-12", icon: "💛", color: "pink", status: "published", example: false,
      title: "Thank you for completing our survey",
      summary: "Thank you to every family who took part in our family survey.",
      body: "Your answers about devices, internet, study space and language are shaping every part of HomeLearn Bridge. Thank you for your time and honesty.",
    },
  ];
  const copy = (list) => list.map((p) => ({ ...p }));
  function load() {
    try {
      const s = localStorage.getItem(KEY);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return copy(DEFAULTS);
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch (e) { return false; }
  }
  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    return copy(DEFAULTS);
  }
  return { load, save, reset };
})();
