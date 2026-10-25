(function () {
  "use strict";

  const CONFIG = window.CALENDAR_CONFIG;
  const FALLBACK_EVENTS = [];
  let drafts = [];
  let shared = [];
  try { const saved = JSON.parse(localStorage.getItem("web-coding-drafts") || "[]"); if (Array.isArray(saved)) drafts = saved; } catch (_) {}
  const zhWeek = ["日", "一", "二", "三", "四", "五", "六"];
  let events = FALLBACK_EVENTS;
  let shownMonth = new Date().getMonth();
  let shownYear = new Date().getFullYear();

  const el = (id) => document.getElementById(id);
  const iso = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  const monthName = () => `${shownYear}年 ${shownMonth + 1}月`;
  const teachingWeek = () => "";

  function render() {
    el("monthTitle").textContent = monthName();
    el("courseCount").textContent = events.filter(e => ["course-a", "course-b", "tutorial"].includes(e.category)).length;
    el("raCount").textContent = events.filter(e => e.category === "workshop").length;
    renderMonth();
    renderAgenda();
  }

  function renderMonth() {
    const grid = el("calendarGrid");
    grid.replaceChildren();
    const first = new Date(shownYear, shownMonth, 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(shownYear, shownMonth, 1 - offset);

    for (let i = 0; i < 42; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const dateString = iso(day);
      const cell = document.createElement("div");
      cell.className = `day${day.getMonth() !== shownMonth ? " other-month" : ""}`;
      const dateNumber = document.createElement("span");
      dateNumber.className = "day-number";
      dateNumber.textContent = day.getDate();
      cell.append(dateNumber);
      const week = teachingWeek(dateString);
      if (week && day.getDay() === 1) {
        const badge = document.createElement("span");
        badge.className = "week-label";
        badge.textContent = week;
        cell.append(badge);
      }
      const stack = document.createElement("div");
      stack.className = "events";
      events.filter(e => e.date === dateString).forEach(event => stack.append(makePill(event)));
      cell.append(stack);
      grid.append(cell);
    }
  }

  function makePill(event) {
    const pill = el("eventTemplate").content.firstElementChild.cloneNode(true);
    pill.classList.add(event.category || "personal");
    pill.querySelector(".event-time").textContent = event.start || "全天";
    pill.querySelector(".event-title").textContent = event.title;
    pill.title = [event.title, event.start && `${event.start}–${event.end}`, event.details].filter(Boolean).join("\n");
    pill.addEventListener("click", () => alert(pill.title));
    return pill;
  }

  function renderAgenda() {
    const agenda = el("agendaView");
    agenda.replaceChildren();
    const monthly = events.filter(e => {
      const d = new Date(`${e.date}T12:00:00`);
      return d.getFullYear() === shownYear && d.getMonth() === shownMonth;
    }).sort((a,b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
    const grouped = Object.groupBy ? Object.groupBy(monthly, e => e.date) : monthly.reduce((acc,e) => ((acc[e.date] ||= []).push(e), acc), {});
    Object.entries(grouped).forEach(([dateString, dayEvents]) => {
      const date = new Date(`${dateString}T12:00:00`);
      const row = document.createElement("div");
      row.className = "agenda-day";
      row.innerHTML = `<div class="agenda-date"><strong>${date.getMonth()+1}月${date.getDate()}日</strong><span>周${zhWeek[date.getDay()]} · ${teachingWeek(dateString)}</span></div><div class="agenda-events"></div>`;
      dayEvents.forEach(event => {
        const item = document.createElement("div");
        item.className = `agenda-event ${event.category || "personal"}`;
        item.innerHTML = `<strong></strong><span></span>`;
        item.querySelector("strong").textContent = event.title;
        item.querySelector("span").textContent = `${event.start ? `${event.start}–${event.end}` : "全天"}${event.details ? ` · ${event.details}` : ""}`;
        row.querySelector(".agenda-events").append(item);
      });
      agenda.append(row);
    });
    if (!monthly.length) agenda.innerHTML = '<p style="padding:30px 0;color:#6f7788;text-align:center">本月暂无事件</p>';
  }

  async function syncEvents() {
    const status = el("syncStatus");
    try {
      const response = await fetch("events.json?t=" + Date.now(), {cache:"no-store"});
      if (!response.ok) throw new Error("load");
      shared = await response.json();
      if (!Array.isArray(shared)) throw new Error("format");
      events = [...shared, ...drafts];
      status.className = "sync-status ok";
      status.textContent = "已读取公开示例 · 本机草稿不会自动上传";
    } catch (_) {
      events = [...shared, ...drafts];
      status.className = "sync-status error";
      status.textContent = "共享示例读取失败，请通过本地 HTTP 服务或 GitHub Pages 打开";
    }
    render();
  }

  el("prevMonth").addEventListener("click", () => { shownMonth--; if (shownMonth < 0) { shownMonth = 11; shownYear--; } render(); });
  el("nextMonth").addEventListener("click", () => { shownMonth++; if (shownMonth > 11) { shownMonth = 0; shownYear++; } render(); });
  el("monthTitle").addEventListener("click", () => { shownYear = new Date().getFullYear(); shownMonth = new Date().getMonth(); render(); });
  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach(b => b.classList.toggle("active", b === button));
    el("monthView").hidden = button.dataset.view !== "month";
    el("agendaView").hidden = button.dataset.view !== "agenda";
  }));
  el("openAdd").addEventListener("click", () => el("eventDialog").showModal());
  el("closeDialog").addEventListener("click", () => el("eventDialog").close());
  el("eventForm").addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const start = data.get("start") || "", end = data.get("end") || "";
    if ((start && !end) || (!start && end) || (start && end <= start)) {
      alert("请填写完整的开始与结束时间，结束时间须晚于开始时间；全天事件请都留空。");
      return;
    }
    const item = {id:"draft-" + crypto.randomUUID(), date:data.get("date"),
      title:data.get("title"), start, end, category:data.get("category"),
      details:data.get("notes") || ""};
    drafts.push(item);
    try { localStorage.setItem("web-coding-drafts", JSON.stringify(drafts)); }
    catch (_) { alert("浏览器不允许保存，本次草稿仅在当前页面保留。"); }
    events = [...shared, ...drafts];
    shownYear = Number(item.date.slice(0,4));
    shownMonth = Number(item.date.slice(5,7))-1;
    render();
    event.currentTarget.reset();
    el("eventDialog").close();
  });

  el("exportEvents").addEventListener("click", () => {
    const content = JSON.stringify([...shared, ...drafts].sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start)), null, 2);
    const url = URL.createObjectURL(new Blob([content], {type:"application/json"}));
    const link = document.createElement("a"); link.href = url; link.download = "events.json"; link.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  });
  el("clearDrafts").addEventListener("click", () => {
    if (!confirm("清除本浏览器的全部示例草稿？共享日程不受影响。")) return;
    drafts = []; try { localStorage.removeItem("web-coding-drafts"); } catch (_) {}
    events = shared; render();
  });
  if (CONFIG.logoUrl) {
    const img = document.createElement("img"); img.src = CONFIG.logoUrl; img.alt = CONFIG.logoAlt;
    img.style.cssText = "max-width:160px;max-height:48px;object-fit:contain";
    document.querySelector(".brand-mark").replaceWith(img);
  }
  render();
  syncEvents();

})();
