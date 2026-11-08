(async function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------- Icons (drawn, no emoji, no external files) ---------- */
  const S = 'viewBox="0 0 24 24" aria-hidden="true"';
  const ICONS = {
    globe: `<svg ${S}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>`,
    phone: `<svg ${S}><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>`,
    monitor: `<svg ${S}><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>`,
    sliders: `<svg ${S}><path d="M4 7h9M19 7h1M4 17h1M11 17h9"/><circle cx="16" cy="7" r="2.5"/><circle cx="8" cy="17" r="2.5"/></svg>`,
    box: `<svg ${S}><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>`,
    download: `<svg ${S}><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14"/></svg>`,
    link: `<svg ${S}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>`,
    github: `<svg viewBox="0 0 16 16" aria-hidden="true" class="solid"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`,
    instagram: `<svg ${S} class="stroke"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`
  };
  const TYPE_ICON = { website: "globe", apk: "phone", exe: "monitor", tool: "sliders", other: "box" };
  const icon = (name) => {
    const t = document.createElement("template");
    t.innerHTML = ICONS[name] || ICONS.box;
    return t.content.firstElementChild;
  };

  /* ---------- Load data ---------- */
  let site, data;
  try {
    [site, data] = await Promise.all(
      ["data/site.json", "data/products.json"].map((u) =>
        fetch(u).then((r) => { if (!r.ok) throw new Error(u); return r.json(); })
      )
    );
  } catch (e) {
    const box = el("p", "loaderr", "Could not load the product list. If you just edited a file in the data folder, check it for a missing comma or quote.");
    $("products").append(box);
    return;
  }

  /* ---------- Hero ---------- */
  const name = site.name || "";
  document.title = name + " | Links";
  $("lockup").setAttribute("aria-label", name);

  // Three words (or site.lockup with three lines) become the logo lockup. Anything else is plain big text.
  const words = Array.isArray(site.lockup) && site.lockup.length === 3 ? site.lockup : name.split(/\s+/);
  if (words.length === 3 && words.join(" ").toLowerCase() !== $("lockup").textContent.trim().replace(/\s+/g, " ").toLowerCase()) {
    const trace = () => { const t = el("span", "trace"); t.append(el("i"), el("b"), el("i")); return t; };
    const top = el("span", "l-row"), bot = el("span", "l-row");
    top.append(el("span", "l-small", words[0]), trace());
    bot.append(trace(), el("span", "l-small", words[2]));
    const main = el("span", "l-main", words[1]);
    [top, main, bot].forEach((n) => n.setAttribute("aria-hidden", "true"));
    $("lockup").replaceChildren(top, main, bot);
  } else if (words.length !== 3) {
    const main = el("span", "l-main", name);
    main.setAttribute("aria-hidden", "true");
    $("lockup").style.fontSize = "clamp(3rem, 15cqw, 7rem)";
    $("lockup").replaceChildren(main);
  }

  $("handle").textContent = site.handle || "";

  // "Sentence // punchline" renders as two lines, like a code comment.
  const [bioMain, ...bioRest] = (site.bio || "").split("//");
  $("bio").textContent = bioMain.trim();
  if (bioRest.length) {
    $("joke").textContent = "// " + bioRest.join("//").trim();
    $("joke").hidden = false;
  }

  (site.socials || []).forEach((s) => {
    const a = el("a");
    const key = (s.icon || s.label || "").toLowerCase();
    a.append(icon(ICONS[key] ? key : "link"), el("span", "", s.label));
    a.href = s.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    $("socials").append(a);
  });
  $("footer").textContent = site.footer || "";

  /* ---------- Products ---------- */
  const types = data.types || {};
  const all = (data.products || []).map((p) => ({ ...p, type: types[p.type] ? p.type : "other" }));
  if (!types.other) types.other = { label: "More", action: "Open" };
  const feat = all.find((p) => p.featured);
  const rest = all.filter((p) => p !== feat);

  const actionOf = (p) => (types[p.type] || {}).action || "Open";
  const isDownload = (p) => p.type === "apk" || p.type === "exe";

  function tile(p) {
    const t = el("span", "tile");
    t.setAttribute("aria-hidden", "true");
    const custom = p.icon;
    if (custom && /^(https?:|assets\/|\.\/)/.test(custom)) {
      const i = el("img");
      i.src = custom; i.alt = ""; i.width = 56; i.height = 56; i.decoding = "async";
      t.append(i);
    } else if (custom) {
      t.textContent = custom; // an emoji
    } else if (TYPE_ICON[p.type]) {
      t.append(icon(TYPE_ICON[p.type]));
    } else if ((types[p.type] || {}).icon) {
      t.textContent = types[p.type].icon;
    } else {
      t.append(icon("box"));
    }
    return t;
  }

  function specs(p) {
    const list = [];
    if (p.price) list.push([p.price, "spec price"]);
    if (p.version) list.push([p.version, "spec"]);
    if (p.size) list.push([p.size, "spec"]);
    const platform = (types[p.type] || {}).platform;
    if (platform) list.push([platform, "spec"]);
    if (!list.length) return null;
    const box = el("div", "specs");
    list.forEach(([text, cls]) => box.append(el("span", cls, text)));
    return box;
  }

  function cta(p) {
    const c = el("span", "cta");
    if (isDownload(p)) c.append(icon("download"));
    c.append(el("span", "", actionOf(p)));
    return c;
  }

  function link(p, cls) {
    const a = el("a", cls);
    a.href = p.url; a.rel = "noopener noreferrer";
    if (!isDownload(p)) a.target = "_blank";
    return a;
  }

  // Start here
  if (feat) {
    const box = $("featured");
    const a = link(feat, "feature");
    const title = el("h2", "", feat.title);
    a.append(tile(feat), el("span", "tag", "Start here"), title);
    if (feat.description) a.append(el("div", "desc", feat.description));
    const sp = specs(feat); if (sp) a.append(sp);
    a.append(cta(feat));
    box.append(a);
    box.hidden = false;
  }

  // Search and chips only appear when they are useful
  let active = "all", query = "";
  const SEARCH_MIN = 6, CHIPS_MIN = 4; // below these sizes the controls are just clutter
  const counts = {};
  rest.forEach((p) => (counts[p.type] = (counts[p.type] || 0) + 1));
  const typeKeys = Object.keys(types).filter((k) => counts[k]);
  const showChips = typeKeys.length > 1 && rest.length >= CHIPS_MIN;
  const showSearch = rest.length >= SEARCH_MIN;
  $("tools").hidden = !(showChips || showSearch);
  $("q").hidden = !showSearch;
  $("chips").hidden = !showChips;

  if (showChips) {
    [["all", "All", rest.length], ...typeKeys.map((k) => [k, types[k].label || k, counts[k]])].forEach(([key, label, n]) => {
      const c = el("button", "chip", label);
      c.type = "button"; c.setAttribute("role", "tab"); c.dataset.key = key;
      c.append(el("small", "", n));
      c.addEventListener("click", () => { active = key; render(); });
      $("chips").append(c);
    });
  }
  $("q").addEventListener("input", (e) => { query = e.target.value.trim().toLowerCase(); render(); });
  $("clear").addEventListener("click", () => { query = ""; active = "all"; $("q").value = ""; render(); });

  function row(p) {
    const li = el("li");
    const a = link(p, "item");
    const body = el("div", "body");
    const title = el("div", "title", p.title);
    if (p.new) title.append(el("span", "badge", "New"));
    body.append(title);
    if (p.description) body.append(el("div", "desc", p.description));
    const sp = specs(p); if (sp) body.append(sp);
    a.append(tile(p), body, cta(p));
    li.append(a);
    return li;
  }

  function render() {
    [...$("chips").children].forEach((c) => c.setAttribute("aria-selected", String(c.dataset.key === active)));
    const host = $("products");
    host.replaceChildren();
    const match = (p) =>
      (active === "all" || p.type === active) &&
      (!query || [p.title, p.description, (p.tags || []).join(" ")].join(" ").toLowerCase().includes(query));
    let shown = 0;
    Object.keys(types).forEach((k) => {
      const items = rest.filter((p) => p.type === k && match(p));
      if (!items.length) return;
      shown += items.length;
      const g = el("section", "group");
      const h = el("h2", "group-title");
      const tr = el("span", "trace"); tr.append(el("i"), el("b"), el("i"));
      h.append(el("span", "", types[k].label || k), tr);
      const ul = el("ul", "rows");
      items.forEach((p) => ul.append(row(p)));
      g.append(h, ul);
      host.append(g);
    });
    $("empty").hidden = !(rest.length && shown === 0);
  }
  render();

  /* ---------- Instagram's in-app browser blocks many downloads ---------- */
  const inApp = /Instagram|FBAN|FBAV|FB_IAB/i.test(navigator.userAgent);
  if (inApp && all.some(isDownload)) $("note").hidden = false;

  /* ---------- Share ---------- */
  let toastTimer;
  const toast = (msg) => {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("on"), 2400);
  };
  $("share").addEventListener("click", async () => {
    const d = { title: document.title, url: location.href.split("#")[0] };
    try {
      if (navigator.share) { await navigator.share(d); return; }
      await navigator.clipboard.writeText(d.url);
      toast("Link copied");
    } catch (err) {
      if (err && err.name === "AbortError") return; // person closed the share sheet
      toast("Copy the link from the address bar");
    }
  });
})();
