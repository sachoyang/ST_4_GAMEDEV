/* =========================================================================
   site.js — 교안 전체의 목차 데이터 + 공통 렌더링
   file:// 로 직접 열어도 동작해야 하므로 fetch/JSON 대신 전역 객체를 쓴다.
   ========================================================================= */

const SITE = {
  title: "게임 클라이언트 교안",
  subtitle: "원리부터 다시 쌓는 CS · 게임 도메인 지식",

  /* ---- 학습 파트 / 챕터 ------------------------------------------------ */
  parts: [
    {
      id: "A",
      name: "메모리와 언어 기반",
      tagline: "모든 성능 이야기의 출발점. 여기가 흔들리면 위의 모든 챕터가 암기가 된다.",
      chapters: [
        { id: "a1", num: "A-1", title: "프로그램의 메모리 구조",
          file: "a1-memory-layout.html",
          desc: "코드·데이터·스택·힙이 왜 나뉘어 있는가. 스택 프레임과 지역변수의 수명.",
          status: "todo" },
        { id: "a2", num: "A-2", title: "포인터와 참조",
          file: "a2-pointer-reference.html",
          desc: "주소라는 개념, 역참조 비용, 널/댕글링이 왜 위험한가.",
          status: "todo" },
        { id: "a3", num: "A-3", title: "동적 할당의 진짜 비용",
          file: "a3-allocation-cost.html",
          desc: "new/malloc이 실제로 하는 일 — 힙 탐색, 단편화, 정렬(alignment), 캐시 라인.",
          status: "todo" },
        { id: "a4", num: "A-4", title: "객체지향의 메모리 모델",
          file: "a4-oop-memory.html",
          desc: "클래스가 메모리에 놓이는 모양, vtable과 가상함수 호출 비용, RAII.",
          status: "todo" }
      ]
    },
    {
      id: "B",
      name: "자료구조와 알고리즘",
      tagline: "\"무엇을 쓰는가\"가 아니라 \"왜 그것이 빠른가\"를 설명할 수 있어야 한다.",
      chapters: [
        { id: "b1", num: "B-1", title: "배열 vs 연결 리스트",
          file: "b1-array-vs-list.html",
          desc: "빅오는 같은데 실측은 10배 차이나는 이유 — 캐시 지역성.",
          status: "todo" },
        { id: "b2", num: "B-2", title: "스택 · 큐 · 힙 · 해시",
          file: "b2-stack-queue-heap-hash.html",
          desc: "네 자료구조가 게임 코드 어디에 숨어 있는지.",
          status: "todo" },
        { id: "b3", num: "B-3", title: "탐색과 길찾기",
          file: "b3-search-pathfinding.html",
          desc: "BFS/DFS에서 A*까지. 휴리스틱이 왜 '거짓말하면 안 되는가'.",
          status: "todo" },
        { id: "b4", num: "B-4", title: "복잡도와 정렬",
          file: "b4-complexity-sorting.html",
          desc: "면접이 빅오를 묻는 진짜 이유, 그리고 정렬 알고리즘의 선택 기준.",
          status: "todo" }
      ]
    },
    {
      id: "C",
      name: "게임 런타임 구조",
      tagline: "게임이 다른 소프트웨어와 갈라지는 지점 — 매 프레임 정해진 시간 안에 끝내야 한다.",
      chapters: [
        { id: "c1", num: "C-1", title: "게임 루프와 시간",
          file: "c1-game-loop.html",
          desc: "프레임, 델타타임, 고정 타임스텝. 물리와 렌더링을 왜 분리하는가.",
          status: "todo" },
        { id: "c2", num: "C-2", title: "오브젝트 관리와 메모리 풀",
          file: "c2-object-pool.html",
          desc: "탄막 5000발을 매 프레임 만들고 지우면 무슨 일이 일어나는가. 실물 프레임워크 해부.",
          status: "done" },
        { id: "c3", num: "C-3", title: "컴포넌트 구조와 업데이트 순서",
          file: "c3-component-update.html",
          desc: "상속 트리가 무너지는 지점과 컴포넌트 조합. MonoBehaviour 생명주기의 원리.",
          status: "todo" }
      ]
    },
    {
      id: "D",
      name: "C# / Unity 런타임",
      tagline: "엔진이 대신 해주는 일을 '무엇을 대신 해주는지' 아는 상태로 쓰기.",
      chapters: [
        { id: "d1", num: "D-1", title: "값 타입과 참조 타입",
          file: "d1-value-reference.html",
          desc: "스택/힙 이분법의 오해, struct와 class, 박싱이 만드는 쓰레기.",
          status: "todo" },
        { id: "d2", num: "D-2", title: "가비지 컬렉션",
          file: "d2-gc.html",
          desc: "Unity의 GC는 .NET과 다르다 — Boehm 방식, 비세대별, 비압축.",
          status: "todo" },
        { id: "d3", num: "D-3", title: "Unity 엔진 구조",
          file: "d3-unity-architecture.html",
          desc: "씬·프리팹·직렬화·에셋. 에디터에서 한 작업이 런타임에 남는 방식.",
          status: "todo" }
      ]
    },
    {
      id: "E",
      name: "그래픽스와 게임 수학",
      tagline: "화면에 한 픽셀이 찍히기까지의 경로를 말로 설명할 수 있는가.",
      chapters: [
        { id: "e1", num: "E-1", title: "렌더링 파이프라인",
          file: "e1-render-pipeline.html",
          desc: "정점에서 픽셀까지. 좌표 변환 단계와 컬링·클리핑의 순서.",
          status: "todo" },
        { id: "e2", num: "E-2", title: "게임 수학",
          file: "e2-game-math.html",
          desc: "내적·외적이 실제로 무엇을 판정하는가. 행렬과 쿼터니언.",
          status: "todo" },
        { id: "e3", num: "E-3", title: "셰이더와 드로우 콜",
          file: "e3-shader-drawcall.html",
          desc: "드로우 콜이 왜 비싼가, 배칭·인스턴싱·SRP Batcher가 각각 줄이는 것.",
          status: "todo" }
      ]
    },
    {
      id: "F",
      name: "시스템과 설계",
      tagline: "게임 밖에서도 통하는 컴퓨터 공학 기본기.",
      chapters: [
        { id: "f1", num: "F-1", title: "프로세스 · 스레드 · 동기화",
          file: "f1-thread-sync.html",
          desc: "경쟁 상태와 데드락, 락의 비용. 게임 스레드가 하나인 이유.",
          status: "todo" },
        { id: "f2", num: "F-2", title: "네트워크와 동기화 모델",
          file: "f2-network.html",
          desc: "TCP/UDP 선택 기준, 권위(authority) 설계, 보간과 예측.",
          status: "todo" },
        { id: "f3", num: "F-3", title: "디자인 패턴",
          file: "f3-design-patterns.html",
          desc: "게임 코드에서 실제로 반복되는 패턴만. 싱글톤이 욕먹는 이유 포함.",
          status: "todo" }
      ]
    }
  ],

  /* ---- 면접 질문 모음 (기존 면접정리예제/ 이식 예정) -------------------- */
  interview: [
    { id: "i1", file: "01-c-cpp.html",       title: "C / C++",          count: 32, status: "todo" },
    { id: "i2", file: "02-csharp.html",      title: "C#",               count: 32, status: "todo" },
    { id: "i3", file: "03-unity.html",       title: "Unity",            count: 35, status: "todo" },
    { id: "i4", file: "04-ds-algo.html",     title: "자료구조 · 알고리즘", count: 25, status: "todo" },
    { id: "i5", file: "05-graphics-math.html", title: "그래픽스 · 수학",  count: 22, status: "todo" },
    { id: "i6", file: "06-cs.html",          title: "CS 기본",           count: 30, status: "todo" },
    { id: "i7", file: "07-patterns.html",    title: "디자인 패턴",        count: 13, status: "todo" },
    { id: "i8", file: "08-personal.html",    title: "인성 · 직무",        count: 15, status: "todo" }
  ],

  /* ---- 내 프로젝트 사례 ------------------------------------------------ */
  projects: [
    { id: "p1", file: "c.html",      title: "C",            src: "../../c_핵심정리.md",      status: "todo" },
    { id: "p2", file: "cpp.html",    title: "C++",          src: "../../cpp_핵심정리.md",    status: "todo" },
    { id: "p3", file: "winapi.html", title: "WinAPI / MFC", src: "../../winapi_핵심정리.md", status: "todo" },
    { id: "p4", file: "unity.html",  title: "Unity",        src: "../../unity_핵심정리.md",  status: "todo" },
    { id: "p5", file: "ttt.html",    title: "TTT — 탄막 게임 프레임워크", src: null, status: "todo" }
  ]
};

/* ========================================================================= */
/* 유틸                                                                       */
/* ========================================================================= */

const allChapters = () => SITE.parts.flatMap(p => p.chapters.map(c => ({ ...c, part: p })));

function findChapter(id) {
  return allChapters().find(c => c.id === id) || null;
}

/** 현재 페이지 기준 루트(교안/)까지의 상대 경로 */
function rootPath() {
  return document.body.dataset.root || "./";
}

/* ---- 진도 저장 (localStorage) ------------------------------------------ */
const PROGRESS_KEY = "gyoan.progress.v1";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}
function isRead(id) { return !!loadProgress()[id]; }
function setRead(id, v) {
  const p = loadProgress();
  if (v) p[id] = Date.now(); else delete p[id];
  saveProgress(p);
}

/* ---- 테마 -------------------------------------------------------------- */
const THEME_KEY = "gyoan.theme";

function applyTheme(t) {
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}
function initTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || "auto");
}
function cycleTheme() {
  const cur = localStorage.getItem(THEME_KEY) || "auto";
  const next = cur === "auto" ? "light" : cur === "light" ? "dark" : "auto";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  updateThemeButton();
}
function updateThemeButton() {
  const btn = document.querySelector(".theme-btn");
  if (!btn) return;
  const cur = localStorage.getItem(THEME_KEY) || "auto";
  btn.textContent = cur === "auto" ? "◐ 자동" : cur === "light" ? "☀ 밝게" : "☾ 어둡게";
  btn.title = "테마 전환 (자동 → 밝게 → 어둡게)";
}

/* ========================================================================= */
/* 공통 헤더 / 푸터 / 사이드 목차                                              */
/* ========================================================================= */

function renderHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;
  const r = rootPath();
  const here = document.body.dataset.section || "";
  const nav = [
    ["home",      "홈",       `${r}index.html`],
    ["study",     "공부하기",  `${r}study/index.html`],
    ["interview", "면접 질문", `${r}interview/index.html`],
    ["projects",  "내 코드",   `${r}projects/index.html`],
    ["quiz",      "퀴즈",      `${r}quiz.html`]
  ];
  host.innerHTML = `
    <header class="topbar">
      <a class="brand" href="${r}index.html">
        <span class="brand-mark">教</span>
        <span class="brand-text">${SITE.title}</span>
      </a>
      <nav class="topnav">
        ${nav.map(([k, label, href]) =>
          `<a href="${href}" class="${here === k ? "active" : ""}">${label}</a>`).join("")}
      </nav>
      <button class="theme-btn" type="button"></button>
    </header>`;
  host.querySelector(".theme-btn").addEventListener("click", cycleTheme);
  updateThemeButton();
}

function renderFooter() {
  const host = document.getElementById("site-footer");
  if (!host) return;
  host.innerHTML = `
    <footer class="sitefoot">
      <p>이 교안은 국비 게임클라이언트(Unity) 과정 실습 코드를 원리 중심으로 다시 정리한 개인 학습 자료다.</p>
      <p class="muted">원본 리서치 자료: <code>c_핵심정리.md</code> · <code>cpp_핵심정리.md</code> ·
      <code>winapi_핵심정리.md</code> · <code>mfc_핵심정리.md</code> · <code>unity_핵심정리.md</code> ·
      <code>면접정리예제/</code></p>
    </footer>`;
}

/** 본문 h2/h3를 훑어 사이드 목차 생성 + 스크롤 하이라이트 */
function renderSideToc() {
  const host = document.getElementById("side-toc");
  const doc = document.querySelector("main.doc");
  if (!host || !doc) return;

  const heads = [...doc.querySelectorAll("h2, h3")];
  if (!heads.length) { host.remove(); return; }

  heads.forEach((h, i) => { if (!h.id) h.id = "sec-" + i; });

  const chap = findChapter(document.body.dataset.chapter || "");
  host.innerHTML = `
    <div class="toc-inner">
      ${chap ? `<div class="toc-label">${chap.num}</div>` : ""}
      <div class="toc-title">이 장의 목차</div>
      <ul class="toc-list">
        ${heads.map(h => `<li class="lv-${h.tagName.toLowerCase()}">
            <a href="#${h.id}">${h.textContent.replace(/^\s*[\d.]+\s*/, "")}</a></li>`).join("")}
      </ul>
      ${chap ? `<label class="read-check">
          <input type="checkbox" id="read-toggle"> <span>이 장 다 읽음</span></label>` : ""}
    </div>`;

  const links = [...host.querySelectorAll(".toc-list a")];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "0px 0px -75% 0px" });
  heads.forEach(h => obs.observe(h));

  const box = host.querySelector("#read-toggle");
  if (box && chap) {
    box.checked = isRead(chap.id);
    box.addEventListener("change", () => setRead(chap.id, box.checked));
  }
}

/** 챕터 페이지 하단의 이전/다음 */
function renderPrevNext() {
  const host = document.getElementById("prev-next");
  const id = document.body.dataset.chapter;
  if (!host || !id) return;
  const list = allChapters();
  const i = list.findIndex(c => c.id === id);
  if (i < 0) return;
  const r = rootPath();
  const link = (c, dir) => c
    ? `<a class="pn ${dir}" href="${r}study/${c.file}">
         <span class="pn-dir">${dir === "prev" ? "이전" : "다음"}</span>
         <span class="pn-num">${c.num}</span>
         <span class="pn-title">${c.title}</span></a>`
    : `<span class="pn empty"></span>`;
  host.innerHTML = link(list[i - 1], "prev") + link(list[i + 1], "next");
}

/* ========================================================================= */
function initPage() {
  initTheme();
  renderHeader();
  renderSideToc();
  renderPrevNext();
  renderFooter();
}
document.addEventListener("DOMContentLoaded", initPage);
