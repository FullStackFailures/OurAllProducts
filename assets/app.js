(async function () {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const colors = { website: "var(--web)", apk: "var(--apk)", exe: "var(--exe)", tool: "var(--tool)", other: "var(--other)" };

  let site, data;
  try {
    [site, data] = await Promise.all(["data/site.json", "data/products.json"].map((u) => fetch(u).then((r) => r.json())));
  } catch (e) {
    $("list").textContent = "Could not load the product list. Check data/products.json for a missing comma or quote.";
    return;
  }

  document.title = site.name + " | Links";
  $("name").textContent = site.name;
  $("handle").textContent = site.handle || "";
  $("bio").textContent = site.bio || "";
  $("footer").textContent = site.footer || "";
  $("avatar").src = site.avatar || "assets/avatar.svg";
  $("avatar").alt = site.name;
  (site.socials || []).forEach((s) => { const a = el("a", "", s.label); a.href = s.url; a.target = "_blank"; a.rel = "noopener"; $("socials").append(a); });

  const types = data.types;
  const products = data.products.map((p) => ({ ...p, type: types[p.type] ? p.type : "other" }));
  const color = (t) => colors[t] || "var(--other)";

  function button(p) {
    const a = el("a", "btn", (types[p.type] || {}).action || "Open");
    a.href = p.url; a.target = "_blank"; a.rel = "noopener";
    a.style.setProperty("--c", color(p.type));
    if (p.type === "apk" || p.type === "exe") a.setAttribute("download", "");
    return a;
  }

  const feat = products.find((p) => p.featured);
  if (feat) {
    const box = $("featured");
    box.hidden = false;
    box.append(el("span", "feat-label", "Start here"), el("div", "feat-title", feat.title), el("p", "", feat.description), button(feat));
  }

  let active = "all", query = "";
  const chips = $("chips");
  const counts = {}; products.forEach((p) => (counts[p.type] = (counts[p.type] || 0) + 1));
  [["all", "All", products.length], ...Object.keys(types).filter((k) => counts[k]).map((k) => [k, types[k].label, counts[k]])]
    .forEach(([key, label, n]) => {
      const c = el("button", "chip", label); c.type = "button"; c.setAttribute("role", "tab");
      c.dataset.key = key; c.append(el("small", "", n));
      c.onclick = () => { active = key; render(); };
      chips.append(c);
    });
  $("q").addEventListener("input", (e) => { query = e.target.value.trim().toLowerCase(); render(); });

  function row(p) {
    const r = el("div", "item"); r.style.setProperty("--c", color(p.type));
    const ico = el("div", "ico");
    if (p.icon && /^(https?:|assets\/)/.test(p.icon)) { const i = el("img"); i.src = p.icon; i.alt = ""; ico.append(i); }
    else ico.textContent = p.icon || types[p.type].icon;
    const body = el("div", "body");
    const t = el("div", "title", p.title);
    if (p.new) t.append(el("span", "badge", "New"));
    body.append(t, el("div", "desc", p.description));
    const meta = [p.price, p.version, p.size].filter(Boolean).join("  ·  ");
    if (meta) body.append(el("div", "meta", meta));
    r.append(ico, body, button(p));
    return r;
  }

  function render() {
    [...chips.children].forEach((c) => c.setAttribute("aria-selected", c.dataset.key === active));
    const list = $("list"); list.replaceChildren();
    const match = (p) => (active === "all" || p.type === active) &&
      (!query || [p.title, p.description, (p.tags || []).join(" ")].join(" ").toLowerCase().includes(query));
    let shown = 0;
    Object.keys(types).forEach((k) => {
      const items = products.filter((p) => p.type === k && match(p));
      if (!items.length) return;
      shown += items.length;
      const g = el("section", "group");
      const h = el("h2"); h.append(el("span", "", types[k].label), el("i", "rail")); g.append(h);
      items.forEach((p) => g.append(row(p)));
      list.append(g);
    });
    $("empty").hidden = shown > 0;
  }
  render();

  $("share").onclick = async () => {
    const d = { title: document.title, url: location.href };
    try {
      if (navigator.share) await navigator.share(d);
      else { await navigator.clipboard.writeText(d.url); $("share").textContent = "Link copied"; }
    } catch (_) {}
  };
})();
