/* =========================================================================
   widgets.js — 인터랙티브 교안 위젯
   본문에 <div class="widget" data-widget="이름"></div> 를 두면 자동으로 만들어진다.
   외부 라이브러리 없음. 순수 DOM.

   위젯을 새로 만들 때: WIDGETS 객체에 함수를 추가하기만 하면 된다.
   ========================================================================= */

const WIDGETS = {};

/* -------------------------------------------------------------------------
   공통 셸 — 제목 / 설명 / 본체 / 조작부 / 상태줄
   ------------------------------------------------------------------------- */
function widgetShell(host, { title, desc }) {
  host.innerHTML = `
    <div class="w-head">
      <span class="w-badge">직접 해보기</span>
      <span class="w-title">${title}</span>
    </div>
    ${desc ? `<p class="w-desc">${desc}</p>` : ""}
    <div class="w-body"></div>
    <div class="w-ctrl"></div>
    <div class="w-stat"></div>`;
  return {
    body: host.querySelector(".w-body"),
    ctrl: host.querySelector(".w-ctrl"),
    stat: host.querySelector(".w-stat")
  };
}

function btn(label, onClick, kind = "") {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "w-btn " + kind;
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}


/* =========================================================================
   위젯 1 — 오브젝트 풀 시뮬레이터
   가르치려는 것: 객체가 죽지 않고 슬롯을 오간다는 것, 반납한 자리가 곧바로
   다음 대여에 재사용된다는 것(LIFO), 그리고 풀이 고갈되면 무슨 일이 일어나는가.
   ========================================================================= */
WIDGETS.pool = function (host) {
  const N = 12;
  const ui = widgetShell(host, {
    title: "오브젝트 풀이 실제로 도는 모습",
    desc: "탄을 쏘고(대여) 맞히면(반납) 슬롯이 어떻게 오가는지 눈으로 본다. " +
          "<strong>힙 할당 횟수가 늘어나지 않는다는 점</strong>과, " +
          "<strong>반납한 자리가 바로 다음 탄에 재사용된다는 점</strong>을 보면 된다."
  });

  let slots, free, borrowTotal, serial, log;

  function reset() {
    slots = Array.from({ length: N }, () => ({ used: false, label: "" }));
    free = Array.from({ length: N }, (_, i) => i);   // 앞에서 꺼내고 앞으로 넣는다 (LIFO)
    borrowTotal = 0; serial = 0; log = [];
    draw();
  }

  function borrow() {
    if (free.length === 0) {
      say("풀이 다 찼다 — 대여 실패. 탄이 나가지 않는다.", "bad");
      draw(); return;
    }
    const i = free.shift();
    slots[i] = { used: true, label: "탄 " + (++serial) };
    borrowTotal++;
    say(`슬롯 ${i} 대여 → ${slots[i].label} · 포인터 조작 2회, 힙 할당 0회`, "good");
    draw();
  }

  function give(idx) {
    const used = slots.map((s, i) => s.used ? i : -1).filter(i => i >= 0);
    if (!used.length) { say("반납할 것이 없다.", ""); draw(); return; }
    const i = idx !== undefined ? idx : used[Math.floor(Math.random() * used.length)];
    if (!slots[i].used) return;
    const name = slots[i].label;
    slots[i] = { used: false, label: "" };
    free.unshift(i);                                  // 프리 리스트 맨 앞에 끼운다
    say(`${name} 반납 → 슬롯 ${i}가 프리 리스트 맨 앞으로. 다음 대여가 이 자리를 쓴다.`, "good");
    draw();
  }

  function say(msg, kind) { log.unshift({ msg, kind }); log = log.slice(0, 3); }

  function draw() {
    const inUse = slots.filter(s => s.used).length;
    ui.body.innerHTML = `
      <div class="w-slots">
        ${slots.map((s, i) => `
          <div class="w-slot ${s.used ? "on" : ""} ${free[0] === i ? "next" : ""}"
               data-i="${i}" title="${s.used ? "클릭하면 반납" : ""}">
            <span class="w-slot-i">${i}</span>
            <span class="w-slot-l">${s.used ? s.label : "빈 슬롯"}</span>
          </div>`).join("")}
      </div>
      <div class="w-legend">
        <span><i class="sw on"></i> 사용 중 (활성 리스트)</span>
        <span><i class="sw"></i> 빈 슬롯 (프리 리스트)</span>
        <span><i class="sw next"></i> 다음에 대여될 자리</span>
        <span class="muted">사용 중인 슬롯을 클릭해도 반납된다</span>
      </div>`;

    ui.body.querySelectorAll(".w-slot.on").forEach(el =>
      el.addEventListener("click", () => give(+el.dataset.i)));

    ui.stat.innerHTML = `
      <div class="w-nums">
        <span><b>${inUse}</b> / ${N} 사용 중</span>
        <span>누적 대여 <b>${borrowTotal}</b>회</span>
        <span class="hl">힙 할당 <b>1</b>회 <em>(시작할 때 딱 한 번)</em></span>
        <span class="muted">new 방식이었다면 힙 할당 ${borrowTotal}회 + 해제 ${borrowTotal - inUse}회</span>
      </div>
      <ul class="w-log">${log.map(l => `<li class="${l.kind}">${l.msg}</li>`).join("")}</ul>`;
  }

  ui.ctrl.append(
    btn("탄 발사 (대여)", borrow, "primary"),
    btn("명중 (반납)", () => give(), ""),
    btn("연속 발사 ×5", () => { for (let i = 0; i < 5; i++) borrow(); }, ""),
    btn("초기화", reset, "ghost")
  );
  reset();
};


/* =========================================================================
   위젯 2 — 슬롯 크기와 메모리 정렬
   가르치려는 것: "크기를 8의 배수로 맞춘다"가 왜 취향이 아니라 규칙인가.
   TTT의 실제 결함(슬롯 100바이트)을 직접 만져보게 한다.
   ========================================================================= */
WIDGETS.alignment = function (host) {
  const OBJ = 72;        // sizeof(CBullet)
  const ALIGN = 8;       // alignof — 포인터/vptr
  const COUNT = 5000;    // BulletList 크기
  let size = 100;        // TTT가 실제로 준 값

  const ui = widgetShell(host, {
    title: "슬롯 크기를 바꿔보면 정렬이 어떻게 깨지는가",
    desc: `실제 객체(<code>CBullet</code>)는 <b>72바이트</b>, 정렬 요구는 <b>8바이트</b>다. ` +
          `슬롯 크기를 움직여보면 <strong>왜 100이 문제인지</strong> 바로 보인다.`
  });

  function draw() {
    const rows = [];
    for (let i = 0; i < 8; i++) {
      const off = size * i;
      rows.push({ i, off, ok: off % ALIGN === 0 });
    }
    const badCount = rows.filter(r => !r.ok).length;
    const fits = size >= OBJ;
    const waste = Math.max(0, size - OBJ);
    const total = size * (COUNT + 2);

    ui.body.innerHTML = `
      <div class="w-align">
        ${rows.map(r => `
          <div class="w-arow ${r.ok ? "ok" : "bad"}">
            <span class="w-acell idx">슬롯 ${r.i}</span>
            <span class="w-acell off">시작 주소 +${r.off}</span>
            <span class="w-acell res">${r.off} ÷ ${ALIGN} = ${(r.off / ALIGN).toFixed(r.ok ? 0 : 1)}</span>
            <span class="w-acell mark">${r.ok ? "정렬 OK" : "어긋남 ✕"}</span>
          </div>`).join("")}
      </div>`;

    ui.stat.innerHTML = `
      <div class="w-nums">
        <span class="${fits ? "" : "bad"}">${fits ? "객체가 들어감" : "객체보다 작다 — 못 씀"}</span>
        <span class="${badCount ? "bad" : "hl"}">앞 8개 중 <b>${badCount}</b>개 어긋남</span>
        <span>슬롯당 낭비 <b>${waste}</b> B</span>
        <span>탄 ${COUNT}발 총 <b>${(total / 1024).toFixed(0)}</b> KB</span>
      </div>
      <p class="w-note">${verdict(size, badCount, waste)}</p>`;
  }

  function verdict(s, bad, waste) {
    if (s === 100) return "<b>지금 TTT가 쓰는 값이다.</b> 100은 8의 배수가 아니라 홀수 슬롯이 전부 4바이트씩 밀린다. " +
      "x64 CPU가 너그러워서 지금은 돌아갈 뿐이고, 16바이트 정렬이 필요한 SIMD 타입(게임 수학 타입은 거의 다 그렇다)을 " +
      "멤버로 넣는 순간 크래시한다.";
    if (s < OBJ) return "슬롯이 객체보다 작다. 옆 슬롯을 침범한다 — 최악의 버그다.";
    if (bad === 0 && waste === 0) return "<b>이상적인 값.</b> 낭비 0, 정렬 완벽. 크기를 <code>sizeof</code>에서 뽑고 정렬 배수로 올림하면 자동으로 여기에 온다.";
    if (bad === 0) return "정렬은 안전하다. 남는 " + waste + "바이트는 낭비지만 버그는 아니다 — 나중에 멤버가 늘어날 여유로 볼 수도 있다.";
    return "8의 배수가 아니라서 일부 슬롯의 시작 주소가 어긋난다. 주소가 어긋난 자리에 포인터와 가상 함수 테이블 포인터가 놓인다.";
  }

  const slider = document.createElement("input");
  slider.type = "range"; slider.min = "64"; slider.max = "128"; slider.step = "1"; slider.value = size;
  slider.className = "w-range";
  slider.addEventListener("input", () => { size = +slider.value; label.textContent = size + " B"; draw(); });

  const label = document.createElement("b");
  label.className = "w-rangeval"; label.textContent = size + " B";

  const preset = (v, t) => btn(t, () => { size = v; slider.value = v; label.textContent = v + " B"; draw(); }, "ghost");

  ui.ctrl.append(
    Object.assign(document.createElement("span"), { className: "w-label", textContent: "슬롯 크기" }),
    slider, label,
    preset(100, "TTT의 값 (100)"),
    preset(72, "sizeof 그대로 (72)"),
    preset(80, "8의 배수로 (80)")
  );
  draw();
};


/* =========================================================================
   위젯 3 — 힙 단편화 시뮬레이터
   가르치려는 것: "여유 메모리는 충분한데 할당이 실패한다"는 상황이 실제로 어떻게
   만들어지는가. 그리고 왜 할당자가 이걸 정리하지 못하는가.
   ========================================================================= */
WIDGETS.fragmentation = function (host) {
  const N = 60;                 // 힙 전체 칸 수
  const BIG = 12;               // "큰 블록" 요청 크기
  let cells, nextId, fails, log;

  const ui = widgetShell(host, {
    title: "여유는 충분한데 할당이 실패하는 순간",
    desc: "작은 블록을 넣었다 뺐다 반복하면 <strong>구멍이 잘게 흩어진다</strong>. " +
          "그 상태에서 <b>큰 블록 요청</b>을 눌러보면, 총 여유 칸이 넉넉한데도 실패하는 걸 볼 수 있다. " +
          "이게 <strong>외부 단편화</strong>다."
  });

  function reset() {
    cells = new Array(N).fill(0);   // 0 = 빈 칸, 그 외 = 블록 id
    nextId = 1; fails = 0; log = [];
    say("빈 힙에서 시작. 아직 구멍이 없다.", "");
    draw();
  }

  /** 첫 번째로 들어갈 수 있는 자리를 찾는다 (first fit — 가장 단순한 전략) */
  function firstFit(size) {
    let run = 0;
    for (let i = 0; i < N; i++) {
      run = cells[i] === 0 ? run + 1 : 0;
      if (run === size) return i - size + 1;
    }
    return -1;
  }

  function alloc(size, label) {
    const at = firstFit(size);
    if (at < 0) {
      fails++;
      say(`${label} ${size}칸 요청 실패 — 총 여유 ${freeTotal()}칸인데 연속 ${maxRun()}칸밖에 없다.`, "bad");
    } else {
      const id = nextId++;
      for (let i = at; i < at + size; i++) cells[i] = id;
      say(`${label} ${size}칸을 ${at}번 자리에 할당.`, "good");
    }
    draw();
  }

  function freeRandom() {
    const ids = [...new Set(cells.filter(c => c !== 0))];
    if (!ids.length) { say("해제할 블록이 없다.", ""); draw(); return; }
    const id = ids[Math.floor(Math.random() * ids.length)];
    cells = cells.map(c => c === id ? 0 : c);
    say(`블록 #${id} 해제. 인접한 빈 칸끼리는 자동으로 하나로 합쳐진다(coalescing).`, "good");
    draw();
  }

  function churn() {
    for (let k = 0; k < 14; k++) {
      if (Math.random() < 0.55) {
        const s = 2 + Math.floor(Math.random() * 3);
        const at = firstFit(s);
        if (at >= 0) { const id = nextId++; for (let i = at; i < at + s; i++) cells[i] = id; }
      } else {
        const ids = [...new Set(cells.filter(c => c !== 0))];
        if (ids.length) {
          const id = ids[Math.floor(Math.random() * ids.length)];
          cells = cells.map(c => c === id ? 0 : c);
        }
      }
    }
    say("작은 블록을 무작위로 넣고 뺐다. 구멍이 잘게 흩어진 상태다.", "");
    draw();
  }

  function compact() {
    const used = cells.filter(c => c !== 0);
    cells = used.concat(new Array(N - used.length).fill(0));
    say("압축 완료 — 하지만 실제 malloc은 이걸 못 한다. " +
        "이미 나눠준 주소가 전부 무효가 되기 때문이다.", "bad");
    draw();
  }

  const freeTotal = () => cells.filter(c => c === 0).length;
  function maxRun() {
    let best = 0, run = 0;
    for (const c of cells) { run = c === 0 ? run + 1 : 0; if (run > best) best = run; }
    return best;
  }

  function say(msg, kind) { log.unshift({ msg, kind }); log = log.slice(0, 3); }

  function draw() {
    const total = freeTotal(), run = maxRun();
    const frag = total ? Math.round((1 - run / total) * 100) : 0;

    ui.body.innerHTML = `
      <div class="w-heap">
        ${cells.map((c, i) => {
          const edgeL = i === 0 || cells[i - 1] !== c;
          const edgeR = i === N - 1 || cells[i + 1] !== c;
          const style = c === 0 ? "" : `background:hsl(${(c * 57) % 360} 42% 60%)`;
          return `<i class="hc ${c === 0 ? "free" : "used"} ${edgeL ? "el" : ""} ${edgeR ? "er" : ""}"
                     style="${style}"></i>`;
        }).join("")}
      </div>
      <div class="w-legend">
        <span><i class="sw" style="background:hsl(200 42% 60%)"></i> 사용 중인 블록 (색이 다르면 다른 블록)</span>
        <span><i class="sw free"></i> 빈 칸</span>
      </div>`;

    ui.stat.innerHTML = `
      <div class="w-nums">
        <span>총 여유 <b>${total}</b>칸</span>
        <span class="${run < BIG ? "bad" : "hl"}">가장 큰 연속 여유 <b>${run}</b>칸</span>
        <span class="${frag > 40 ? "bad" : ""}">단편화 <b>${frag}</b>%</span>
        <span>${BIG}칸 요청 실패 <b>${fails}</b>회</span>
      </div>
      <ul class="w-log">${log.map(l => `<li class="${l.kind}">${l.msg}</li>`).join("")}</ul>`;
  }

  ui.ctrl.append(
    btn("작은 블록 할당", () => alloc(2 + Math.floor(Math.random() * 3), "작은 블록"), "primary"),
    btn("무작위 해제", freeRandom),
    btn("어지럽히기 ×14", churn),
    btn(`큰 블록 요청 (${BIG}칸)`, () => alloc(BIG, "큰 블록"), ""),
    btn("압축해보기", compact, "ghost"),
    btn("초기화", reset, "ghost")
  );
  reset();
};


/* ------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-widget]").forEach(el => {
    const fn = WIDGETS[el.dataset.widget];
    if (fn) fn(el);
    else el.innerHTML = `<p class="muted">(위젯 '${el.dataset.widget}' 없음)</p>`;
  });
});
