/* ===== EDIT YOUR EXPERIENCE HERE =====
   type: "fulltime" or "internship"
   start / end: "YYYY-MM-DD". Use end: null for a role you still hold.
   If you join a new company, add a new fulltime entry with end: null and
   give the old one an end date. The page shows both, newest first, and the
   full-time total adds them up automatically. */
const EXPERIENCE = [
  {
    type: "fulltime",
    role: "Software Engineer: Agentic AI and IVR Developer",
    company: "AppXcelerate Solutions Pvt Ltd",
    client: "Deloitte client project for Elevance Health",
    start: "2026-01-22", end: null,
    bullets: [
      "Build agentic AI workflows and multi-agent systems with LangGraph, LangChain, LlamaIndex and Google ADK, with MCP tools for enterprise systems.",
      "Run production RAG on Pinecone and Bedrock Knowledge Bases, with better answer accuracy",
      "Build an MCP-based agentic IVR where the AI takes the whole call and routes it to the appropriate agent, plus IVR and voice AI on Genesys Cloud, Amazon Connect, Lex, Lambda and Polly.",
      "Led the Nova Lite and Nova Sonic voice AI POC. Debug production flows with Splunk and CloudWatch logs and test IVR with Cyara."
    ],
    tags: "LangGraph, LangChain, MCP, RAG, FastAPI, AWS, Genesys Cloud, Splunk"
  },                   
  {
    type: "internship",
    role: "Developer Intern: Agentic AI and IVR",
    company: "AppXcelerate Solutions Pvt Ltd",
    client: "Deloitte client project for Elevance Health",
    start: "2025-09-08", end: "2026-01-22",
    bullets: [
      "Built IVR call flows with menus, DTMF and speech input, and intent-based routing.",
      "Integrated Amazon Connect, Lex, Lambda and Polly, with REST lookups for live account data.",
      "Moved into agentic AI work: RAG pipelines and AI proofs of concept with Nova Sonic on Bedrock."
    ],
    tags: "Genesys Cloud, Amazon Connect, Lex, Lambda, Bedrock"
  },
  {
    type: "internship",
    role: "Python Full Stack Developer Intern",
    company: "TezHire AI",
    start: "2025-01-01", end: "2025-09-01",
    bullets: [
      "Built and maintained a CRM portal with Python and React.js.",
      "Integrated REST APIs and built responsive interfaces.",
      "Worked in Agile sprints and used Git for team collaboration."
    ],
    tags: "Python, React.js, REST APIs, Agile, Git"
  }
];

(function () {
  const P = (s) => s ? new Date(...s.split("-").map((v, i) => i === 1 ? v - 1 : +v)) : new Date();
  const months = (a, b) => {
    let m = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
    if (b.getDate() < a.getDate()) m--;
    return Math.max(m, 0);
  };
  const fmtM = (m) => {
    const y = Math.floor(m / 12), r = m % 12, t = [];
    if (y) t.push(y + (y > 1 ? " yrs" : " yr"));
    if (r || !y) t.push(r + (r === 1 ? " mo" : " mos"));
    return t.join(" ");
  };
  const fmtD = (d) => d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  const GROUPS = [["fulltime", "Full-time"], ["internship", "Internships"]];
  const COLORS = ["var(--green)", "var(--blue)", "var(--sky)"];
  const list = (t) => EXPERIENCE.filter((e) => e.type === t).sort((a, b) => P(b.start) - P(a.start));
  const total = (t) => list(t).reduce((n, e) => n + months(P(e.start), P(e.end)), 0);

  const hero = document.getElementById("exp-total");
  if (hero) hero.textContent = list("fulltime").length ? fmtM(total("fulltime")) : "Fresher";

  const tabs = document.getElementById("xp-tabs"), panel = document.getElementById("xp-panel"), sum = document.getElementById("xp-sum");
  if (!tabs) return;

  function show(type) {
    tabs.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", b.dataset.t === type));
    const items = list(type);
    sum.textContent = (type === "fulltime" ? "Total full-time experience: " : "Total internship experience: ") + fmtM(total(type));
    panel.innerHTML = "";
    panel.className = "tl panel";
    items.forEach((e, i) => {
      const a = document.createElement("article");
      a.style.setProperty("--c", COLORS[i % 3]);
      const end = e.end ? fmtD(P(e.end)) : "present";
      a.innerHTML = (e.end ? "" : '<span class="badge">Current</span>') +
        "<h3></h3><p class=\"meta\"></p><ul></ul><p class=\"tags\"></p>";
      a.querySelector("h3").textContent = e.role;
      a.querySelector(".meta").textContent = e.company + (e.client ? " (" + e.client + "). " : ". ") + fmtD(P(e.start)) + " to " + end + ", " + fmtM(months(P(e.start), P(e.end))) + ".";
      e.bullets.forEach((t) => { const li = document.createElement("li"); li.textContent = t; a.querySelector("ul").appendChild(li); });
      a.querySelector(".tags").textContent = e.tags || "";
      panel.appendChild(a);
    });
    if (!items.length) panel.innerHTML = '<p class="meta">Nothing to show here yet.</p>';
  }

  GROUPS.forEach(([t, label]) => {
    const b = document.createElement("button");
    b.type = "button"; b.role = "tab"; b.dataset.t = t;
    b.textContent = label + " (" + list(t).length + ")";
    b.onclick = () => show(t);
    tabs.appendChild(b);
  });
  show(list("fulltime").length ? "fulltime" : "internship");
})();
