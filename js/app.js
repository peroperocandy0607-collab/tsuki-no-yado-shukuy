/* =========================================================================
   月の宿で自分を知る やさしい27宿・宿曜占星術講座 — アプリケーションロジック
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderShukuWheel();
  renderDayCycle();
  renderShukuBasicTable();
  renderShukuCards();
  renderShukuDetailTable();
  renderRelationCards();
  renderRelationTable();
  renderMatrix();
  renderDayFortuneTable();
  renderNgTable();
  buildHonmyoshukuSelect();
  buildRelativeSelect();
  buildCheckerSelects();
  buildDayFortuneSelects();
  buildPromptSelect();
  bindSharedProfile();
  bindAutoShukuInputs();
  renderSavedProfileGuides();
  bindNav();
  bindJumpFab();
  bindCopyButtons();
  bindChecklists();
  bindHonmyoshukuForm();
  bindRelativeForm();
  bindChecker();
  bindDayFortuneForm();
  bindPromptBuilder();
  bindDetailClose();
  enhanceExpandableTables();
  renderStepQuiz();
});

/* ---------------------------------------------------------------------
   アイコン生成（27宿シンボル）
--------------------------------------------------------------------- */
const ICON_PALETTE = ["#6d4aff","#e64980","#c9971d","#16a34a","#2563eb","#f97316"];

function shukuIconSvg(shuku, size = 56){
  const color = ICON_PALETTE[shuku.id % ICON_PALETTE.length];
  const ch = shuku.name.charAt(0);
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g${shuku.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.55"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#g${shuku.id})"/>
    <circle cx="32" cy="32" r="30" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>
    <text x="32" y="40" font-size="26" text-anchor="middle" fill="#fff" font-family="Hiragino Sans, sans-serif" font-weight="700">${ch}</text>
    <circle cx="14" cy="14" r="2.2" fill="#fff" opacity="0.85"/>
    <circle cx="50" cy="18" r="1.6" fill="#fff" opacity="0.7"/>
    <circle cx="48" cy="48" r="1.8" fill="#fff" opacity="0.6"/>
  </svg>`;
}

/* ---------------------------------------------------------------------
   27宿円環図（STEP1 / STEP2）
--------------------------------------------------------------------- */
function renderShukuWheel(){
  const el = document.getElementById("shuku-wheel");
  if(!el) return;
  const size = 420, cx = size/2, cy = size/2, r = 175, dotR = 15;
  let dots = "";
  SHUKU_DATA.forEach((s, i) => {
    const angle = (i / 27) * Math.PI * 2 - Math.PI/2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const color = ICON_PALETTE[s.id % ICON_PALETTE.length];
    dots += `
      <g>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotR}" fill="${color}" opacity="0.9"/>
        <text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">${s.id}</text>
      </g>`;
  });
  el.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" width="100%" style="max-width:420px">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e7e3da" stroke-width="1.5" stroke-dasharray="4 4"/>
      ${dots}
      <circle cx="${cx}" cy="${cy}" r="70" fill="#f4f0ff" stroke="#6d4aff" stroke-width="1.5"/>
      <text x="${cx}" y="${cy-6}" font-size="15" text-anchor="middle" fill="#4b2fce" font-weight="800">本命宿</text>
      <text x="${cx}" y="${cy+16}" font-size="11" text-anchor="middle" fill="#6b6a74">27宿が円環に</text>
      <text x="${cx}" y="${cy+32}" font-size="11" text-anchor="middle" fill="#6b6a74">並んでいます</text>
    </svg>`;
}

/* ---------------------------------------------------------------------
   日運サイクル図（STEP6）— 11種の運気を円状に表示
--------------------------------------------------------------------- */
function renderDayCycle(){
  const el = document.getElementById("day-cycle-wheel");
  if(!el) return;
  const size = 380, cx = size/2, cy = size/2, r = 150;
  const colors = ["#6d4aff","#e64980","#c9971d","#16a34a","#2563eb","#f97316","#dc2626","#0d9488","#9333ea","#0284c7","#65a30d"];
  let segs = "";
  DAY_FORTUNE.forEach((d, i) => {
    const angle = (i / DAY_FORTUNE.length) * Math.PI * 2 - Math.PI/2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    segs += `
      <g>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="26" fill="${colors[i % colors.length]}" opacity="0.92"/>
        <text x="${x.toFixed(1)}" y="${(y+1).toFixed(1)}" font-size="12" text-anchor="middle" fill="#fff" font-weight="800">${d.key}</text>
        <text x="${x.toFixed(1)}" y="${(y+12).toFixed(1)}" font-size="7.5" text-anchor="middle" fill="#fff">${d.yomi}</text>
      </g>`;
  });
  el.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" width="100%" style="max-width:380px">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e7e3da" stroke-width="1.5" stroke-dasharray="4 4"/>
      ${segs}
      <text x="${cx}" y="${cy-4}" font-size="13" text-anchor="middle" fill="#4b2fce" font-weight="800">日運11種</text>
      <text x="${cx}" y="${cy+14}" font-size="10.5" text-anchor="middle" fill="#6b6a74">本命宿からの距離で決まる</text>
    </svg>`;
}

/* ---------------------------------------------------------------------
   STEP2: 27宿 基本早見表
--------------------------------------------------------------------- */
function renderShukuBasicTable(){
  const tbody = document.querySelector("#shuku-basic-table tbody");
  if(!tbody) return;
  tbody.innerHTML = SHUKU_DATA.map(s => `
    <tr>
      <td class="kw" data-label="宿">${s.id}. ${s.name}</td>
      <td data-label="読み">${s.yomi}</td>
      <td data-label="キーワード">${s.keyword}</td>
      <td data-label="基本性格">${s.personality}</td>
      <td data-label="強み">${s.strength}</td>
      <td data-label="注意点">${s.weakness}</td>
      <td data-label="恋愛">${s.love}</td>
      <td data-label="仕事">${s.work}</td>
      <td data-label="鑑定文例">${s.judge}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   STEP2: 27宿 SVGカード
--------------------------------------------------------------------- */
function renderShukuCards(){
  const grid = document.getElementById("shuku-card-grid");
  if(!grid) return;
  grid.innerHTML = SHUKU_DATA.map(s => `
    <div class="shuku-card" data-id="${s.id}" tabindex="0">
      <div class="icon-wrap">${shukuIconSvg(s)}</div>
      <div class="card-body">
        <div class="name">${s.id}. ${s.name}</div>
        <div class="yomi">${s.yomi}</div>
        <div class="kw">${s.keyword}</div>
      </div>
    </div>`).join("");

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".shuku-card");
    if(!card) return;
    openDetailPanel(Number(card.dataset.id));
  });
  grid.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
      const card = e.target.closest(".shuku-card");
      if(card) openDetailPanel(Number(card.dataset.id));
    }
  });
}

function openDetailPanel(id){
  const s = findShuku(id);
  if(!s) return;
  const panel = document.getElementById("shuku-detail-panel");
  panel.innerHTML = `
    <button class="close-dp" aria-label="閉じる">✕</button>
    <div class="dp-head">
      ${shukuIconSvg(s, 64)}
      <div>
        <h3>${s.id}. ${s.name}<span class="pill" style="margin-left:8px;">${s.keyword}</span></h3>
        <div class="yomi">読み：${s.yomi}</div>
      </div>
    </div>
    <p>${s.personality}</p>
    <div class="detail-grid">
      <div class="item"><b>強み</b><span>${s.strength}</span></div>
      <div class="item"><b>注意点</b><span>${s.weakness}</span></div>
      <div class="item"><b>感情パターン</b><span>${s.emotion}</span></div>
      <div class="item"><b>行動パターン</b><span>${s.behavior}</span></div>
      <div class="item"><b>恋愛傾向</b><span>${s.love}</span></div>
      <div class="item"><b>仕事傾向</b><span>${s.work}</span></div>
      <div class="item"><b>金運傾向</b><span>${s.money}</span></div>
      <div class="item"><b>人間関係</b><span>${s.relationships}</span></div>
      <div class="item"><b>疲れた時に出やすい反応</b><span>${s.tired}</span></div>
      <div class="item"><b>開運行動</b><span>${s.lucky}</span></div>
    </div>
    <div class="point-box" style="margin-top:16px;"><span class="tag">鑑定文例</span><p>${s.judge}</p></div>
  `;
  panel.classList.add("open");
  panel.scrollIntoView({behavior:"smooth", block:"center"});
}

function bindDetailClose(){
  document.addEventListener("click", (e) => {
    if(e.target.classList.contains("close-dp")){
      document.getElementById("shuku-detail-panel").classList.remove("open");
    }
  });
}

/* ---------------------------------------------------------------------
   STEP4: 27宿 性格・才能 詳細表
--------------------------------------------------------------------- */
function renderShukuDetailTable(){
  const tbody = document.querySelector("#shuku-detail-table tbody");
  if(!tbody) return;
  tbody.innerHTML = SHUKU_DATA.map(s => `
    <tr>
      <td class="kw" data-label="宿">${s.id}. ${s.name}</td>
      <td data-label="性格">${s.personality}</td>
      <td data-label="感情">${s.emotion}</td>
      <td data-label="行動">${s.behavior}</td>
      <td data-label="恋愛">${s.love}</td>
      <td data-label="仕事">${s.work}</td>
      <td data-label="金運">${s.money}</td>
      <td data-label="注意点">${s.weakness}</td>
      <td data-label="開運行動">${s.lucky}</td>
      <td data-label="鑑定文例">${s.judge}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   STEP5: 相性六分類 カード＆表
--------------------------------------------------------------------- */
function renderRelationCards(){
  const grid = document.getElementById("relation-card-grid");
  if(!grid) return;
  grid.innerHTML = RELATION_GROUP6.map(g => `
    <div class="relation-card" style="background:${g.color}">
      <div class="g-label">相性六分類</div>
      <h4>${g.label}</h4>
      <p><b>意味：</b>${g.meaning}</p>
      <p><b>優しい鑑定表現：</b>「${g.gentle}」</p>
    </div>`).join("");
}

function renderRelationTable(){
  const tbody = document.querySelector("#relation-table tbody");
  if(!tbody) return;
  tbody.innerHTML = RELATION_GROUP6.map(g => `
    <tr>
      <td class="kw" data-label="相性分類">${g.label}</td>
      <td data-label="意味">${g.meaning}</td>
      <td data-label="起きやすいこと">${g.happens}</td>
      <td data-label="伸びる点">${g.grow}</td>
      <td data-label="注意点">${g.caution}</td>
      <td data-label="優しい鑑定表現">${g.gentle}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   STEP5: 27×27 相性マトリクス
--------------------------------------------------------------------- */
function renderMatrix(){
  const wrap = document.getElementById("matrix-wrap");
  const legend = document.getElementById("matrix-legend");
  if(!wrap) return;

  if(legend){
    legend.innerHTML = RELATION_GROUP6.map(g => `
      <div class="lg"><span class="sw" style="background:${g.color}"></span>${g.label}</div>`).join("");
  }

  let html = `<div class="matrix-accordion">`;
  SHUKU_DATA.forEach(rowS => {
    html += `<details class="record-fold matrix-fold">
      <summary><span>${rowS.id}. ${rowS.name}（${rowS.yomi}）</span><small>この宿から見る相性</small></summary>
      <div class="matrix-pair-list">`;
    SHUKU_DATA.forEach(colS => {
      const group = getShukuGroup6(rowS.id, colS.id);
      const g = RELATION_GROUP6.find(item => item.key === group);
      html += `<button type="button" class="matrix-pair" data-a="${rowS.id}" data-b="${colS.id}">
        <span>${colS.id}. ${colS.name}（${colS.yomi}）</span><b style="color:${g.color}">${g.label}</b>
      </button>`;
    });
    html += `</div></details>`;
  });
  html += `</div>`;
  wrap.innerHTML = html;

  wrap.addEventListener("click", (e) => {
    const cell = e.target.closest(".matrix-pair");
    if(!cell) return;
    const a = findShuku(cell.dataset.a), b = findShuku(cell.dataset.b);
    const group = getShukuGroup6(a.id, b.id);
    const g = RELATION_GROUP6.find(r => r.key === group);
    const box = document.getElementById("matrix-result");
    if(box){
      box.classList.add("show");
      box.innerHTML = `
        <div class="rtitle">${a.name}（${a.id}）× ${b.name}（${b.id}） → ${g.label}</div>
        <p style="margin:0">${g.gentle}</p>`;
    }
  });
}

/* ---------------------------------------------------------------------
   STEP6: 日運11種 早見表
--------------------------------------------------------------------- */
function renderDayFortuneTable(){
  const tbody = document.querySelector("#day-fortune-table tbody");
  if(!tbody) return;
  tbody.innerHTML = DAY_FORTUNE.map(d => `
    <tr>
      <td class="kw" data-label="運気"><ruby>${d.key}<rt>${d.yomi}</rt></ruby>の日</td>
      <td data-label="テーマ">${d.theme}</td>
      <td data-label="向いている行動">${d.action}</td>
      <td data-label="注意点">${d.caution}</td>
      <td data-label="恋愛">${d.love}</td>
      <td data-label="仕事">${d.work}</td>
      <td data-label="鑑定文例">${d.judge}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   NG表現集
--------------------------------------------------------------------- */
function renderNgTable(){
  const tbody = document.querySelector("#ng-table tbody");
  if(!tbody) return;
  tbody.innerHTML = NG_EXPRESSIONS.map(n => `
    <tr>
      <td data-label="NG表現" style="color:var(--red)">✕ ${n.ng}</td>
      <td data-label="言い換えOK表現" style="color:var(--green)">◯ ${n.ok}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   旧暦二十七宿・月宿傍通暦式
   新暦の入力日を旧暦月日に換算し、各月1日の起点宿から順算します。
--------------------------------------------------------------------- */
function getLunisolarDate(dateValue){
  if(!dateValue) return null;
  try{
    const date = new Date(`${dateValue}T12:00:00+09:00`);
    if(Number.isNaN(date.getTime())) return null;
    const formatter = new Intl.DateTimeFormat("en-u-ca-chinese", {
      year: "numeric", month: "numeric", day: "numeric", timeZone: "Asia/Tokyo"
    });
    const parts = formatter.formatToParts(date);
    const monthText = parts.find(part => part.type === "month")?.value || "";
    const dayText = parts.find(part => part.type === "day")?.value || "";
    const yearText = parts.find(part => part.type === "relatedYear")?.value || "";
    const month = Number.parseInt(monthText, 10);
    const day = Number.parseInt(dayText, 10);
    if(!month || !day || !GESSHUKU_MONTH_START[month]) return null;
    return { year: Number.parseInt(yearText, 10), month, day, leap: /bis/i.test(monthText) };
  }catch(error){
    return null;
  }
}

function calculateShukuFromGregorian(dateValue){
  const lunar = getLunisolarDate(dateValue);
  if(!lunar) return null;
  const startId = GESSHUKU_MONTH_START[lunar.month];
  const id = ((startId - 1 + lunar.day - 1) % 27) + 1;
  return { lunar, start: findShuku(startId), shuku: findShuku(id) };
}

function lunarLabel(calculation){
  const { lunar } = calculation;
  return `旧暦${lunar.year}年${lunar.leap ? "閏" : ""}${lunar.month}月${lunar.day}日`;
}

function calculationNote(calculation){
  return `${lunarLabel(calculation)}／${calculation.lunar.leap ? "閏月も同じ月として" : "この月の"}1日＝${calculation.start.name}から${calculation.lunar.day - 1}日進める`;
}

function setCalculatedSelect(birthId, selectId){
  const birth = document.getElementById(birthId);
  const select = document.getElementById(selectId);
  if(!birth || !select || !birth.value) return null;
  const calculation = calculateShukuFromGregorian(birth.value);
  if(calculation) select.value = String(calculation.shuku.id);
  return calculation;
}

function bindAutoShukuInputs(){
  [
    ["honmei-birth", "honmei-select"],
    ["relative-birth", "relative-select"],
    ["checker-birth-a", "checker-a"],
    ["checker-birth-b", "checker-b"],
    ["prompt-birth", "prompt-honmei"],
    ["day-date", "day-today"]
  ].forEach(([birthId, selectId]) => {
    const birth = document.getElementById(birthId);
    if(!birth) return;
    birth.addEventListener("change", () => setCalculatedSelect(birthId, selectId));
    if(birth.value) setCalculatedSelect(birthId, selectId);
  });
}

/* ---------------------------------------------------------------------
   本命宿フォーム（STEP1）
--------------------------------------------------------------------- */
function buildHonmyoshukuSelect(){
  const sel = document.getElementById("honmei-select");
  if(!sel) return;
  sel.innerHTML = `<option value="">-- 宿を選択してください --</option>` +
    SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}（${s.yomi}）</option>`).join("");
}

function buildRelativeSelect(){
  const sel = document.getElementById("relative-select");
  if(!sel) return;
  sel.innerHTML = `<option value="">-- 宿を選択してください --</option>` +
    SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}（${s.yomi}）</option>`).join("");
}

/* ---------------------------------------------------------------------
   STEP間で生年月日と本命宿を引き継ぐ
--------------------------------------------------------------------- */
function bindSharedProfile(){
  const birthKey = "shukuyo_profile_birth";
  const starKey = "shukuyo_profile_honmei";
  const birthInputs = ["birthday-record","honmei-birth","prompt-birth","checker-birth-a"];
  const starSelects = ["honmei-select","prompt-honmei","checker-a","day-honmei"];
  const savedBirth = localStorage.getItem(birthKey) || "";
  const savedStar = localStorage.getItem(starKey) || "";

  birthInputs.forEach(id => {
    const input = document.getElementById(id);
    if(!input) return;
    if(savedBirth && !input.value) input.value = savedBirth;
    input.addEventListener("change", () => {
      if(input.value) localStorage.setItem(birthKey, input.value);
    });
  });

  starSelects.forEach(id => {
    const select = document.getElementById(id);
    if(!select) return;
    if(savedStar && [...select.options].some(option => option.value === savedStar)) select.value = savedStar;
    select.addEventListener("change", () => {
      if(select.value) localStorage.setItem(starKey, select.value);
    });
  });
}

/* ---------------------------------------------------------------------
   登録した「自分の本命宿」を各STEPの講義に表示する
--------------------------------------------------------------------- */
function renderSavedProfileGuides(){
  const targets = document.querySelectorAll("[data-profile-summary]");
  if(!targets.length) return;
  const savedStar = localStorage.getItem("shukuyo_profile_honmei") || "";
  const savedBirth = localStorage.getItem("shukuyo_profile_birth") || "";
  const shuku = savedStar ? findShuku(savedStar) : null;

  targets.forEach(target => {
    target.classList.add("show");
    if(!shuku){
      target.innerHTML = `<div class="rtitle">まずは自分の星を登録しましょう</div>
        <p>まだ本命宿が登録されていません。<a href="step1.html#my-star-first">STEP1の「まずは自分の星を知ってみよう！」</a>で生年月日を記録し、確認済みの本命宿を選んでください。</p>`;
      return;
    }
    target.innerHTML = `<div class="rtitle">この講義で見るあなたの星：${shuku.name}（${shuku.yomi}）</div>
      <p>${savedBirth ? `生年月日：${savedBirth}<br>` : ""}<b>覚える言葉：</b>${shuku.keyword}</p>
      <p><b>まず自分に当てはめる：</b>${shuku.personality}</p>
      <p style="margin-bottom:0"><b>強みとして読む：</b>${shuku.strength}</p>`;
  });
}

function getCautionShukuList(id){
  return SHUKU_DATA
    .filter(other => other.id !== Number(id) && getShukuGroup6(Number(id), other.id) === "安壊")
    .map(other => `${other.name}（${getShukuDistanceType(Number(id), other.id)}）`);
}

function buildHonmeiReadingHtml(s, calculation){
  const cautionList = getCautionShukuList(s.id);
  const cautionNames = cautionList.join("、");
  return `
    <div class="rtitle">あなたの本命宿：${s.id}. ${s.name}（${s.yomi}）</div>
    ${calculation ? `<p><b>算出根拠：</b>${calculationNote(calculation)}</p>` : ""}
    <p><b class="mark">3つの核となる言葉：</b>${s.keyword}</p>

    <h5>あなたの本質</h5>
    <p>${s.personality}</p>
    <p>${s.behavior}迷っているように見える時でも、心の中では自分なりの答えを探しており、納得できるきっかけをつかむと動き方がはっきりします。</p>

    <h5>人に見せにくい内面</h5>
    <p>${s.emotion}周囲には平気そうに見せても、実は言葉や空気をよく受け取っています。無理を重ねるより、気持ちを整理する時間を先に確保した方が、本来の良さを発揮できます。</p>

    <h5>長所と才能</h5>
    <p>${s.strength}</p>
    <p>自分では「普通にやっているだけ」と感じることほど、周囲から見ると頼もしい才能になっています。人から繰り返し頼まれること、感謝されることを軽く扱わず、あなたの強みとして受け取ってください。</p>

    <h5>短所・つまずきやすい点</h5>
    <p>${s.weakness}</p>
    <p>疲れがたまると、${s.tired}これは性格の悪さではなく、余裕が減っている合図です。そんな時は大きな決断を急がず、予定と人間関係を一度整理してください。</p>

    <h5>恋愛</h5>
    <p>${s.love}相手の反応だけで自分の価値を決めず、望んでいることを短い言葉で伝えるほど、関係は安定しやすくなります。</p>

    <h5>仕事・役割</h5>
    <p>${s.work}何でも一人で抱えるより、「自分が得意な部分」と「人に任せる部分」を先に決めると、評価と成果の両方につながります。</p>

    <h5>お金との付き合い方</h5>
    <p>${s.money}気分で決める前に、使う目的を一言で説明できるか確認してください。納得できる使い方に絞るほど、満足感を残しやすくなります。</p>

    <h5>人間関係</h5>
    <p>${s.relationships}ただし、期待に応え続けることと、信頼されることは同じではありません。無理な時には早めに伝える方が、長く続く関係を作れます。</p>

    <h5>摩擦が起きやすく、距離感に注意したい宿</h5>
    <p><b>${cautionNames}</b></p>
    <p>上記は安壊の関係に当たる宿です。「相性が悪いから離れる」と決めつける必要はありませんが、強く惹かれる一方で、主導権・言葉の強さ・期待のずれが表れやすい組み合わせです。結論を急がず、約束と境界線を言葉にしてください。</p>

    <h5>今から意識すること</h5>
    <p>${s.lucky}</p>
    <p>まず一つだけ実行し、できた事実を自分で認めてください。運を待つより、自分の性質を理解して使い方を選ぶことが、流れを変える最初の一歩です。</p>

    <h5>鑑定の要点まとめ</h5>
    <ul>
      <li><b>本質：</b>${s.personality}</li>
      <li><b>強み：</b>${s.strength}</li>
      <li><b>注意点：</b>${s.weakness}</li>
      <li><b>恋愛：</b>${s.love}</li>
      <li><b>仕事：</b>${s.work}</li>
      <li><b>金運：</b>${s.money}</li>
      <li><b>対人関係：</b>${s.relationships}</li>
      <li><b>疲れた時：</b>${s.tired}</li>
      <li><b>相性注意：</b>${cautionNames}</li>
      <li><b>開運行動：</b>${s.lucky}</li>
    </ul>
    <p style="margin-bottom:0"><b>総合鑑定：</b>${s.judge}長所だけを伸ばそうとせず、短所が出る前の小さな違和感にも気づくことが大切です。自分の性質を責めるのではなく、場面に合わせて使い分けてください。</p>`;
}

function bindHonmyoshukuForm(){
  const btn = document.getElementById("honmei-submit");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const birth = document.getElementById("honmei-birth").value;
    const calculation = setCalculatedSelect("honmei-birth", "honmei-select");
    const id = calculation?.shuku.id || document.getElementById("honmei-select").value;
    const result = document.getElementById("honmei-result");
    if(!birth || !id){
      result.classList.add("show");
      result.innerHTML = `<p style="margin:0;color:var(--red)">生年月日を入力してください。旧暦への換算が使えない環境では、本命宿を選択して登録できます。</p>`;
      return;
    }
    const s = findShuku(id);
    localStorage.setItem("shukuyo_profile_birth", birth);
    localStorage.setItem("shukuyo_profile_honmei", String(s.id));
    result.classList.add("show");
    result.innerHTML = buildHonmeiReadingHtml(s, calculation);
    // 自己分析ワークにも反映
    const wk = document.getElementById("honmei-worksheet-name");
    if(wk) wk.value = `${s.id}. ${s.name}`;
  });
}

function bindRelativeForm(){
  const btn = document.getElementById("relative-submit");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const birth = document.getElementById("relative-birth").value;
    const calculation = setCalculatedSelect("relative-birth", "relative-select");
    const id = calculation?.shuku.id || document.getElementById("relative-select").value;
    const result = document.getElementById("relative-result");
    if(!birth || !id){
      result.classList.add("show");
      result.innerHTML = `<p style="margin:0;color:var(--red)">身近な人の生年月日を入力してください。</p>`;
      return;
    }
    const s = findShuku(id);
    result.classList.add("show");
    result.innerHTML = `<div class="rtitle">身近な人の本命宿：${s.name}（${s.yomi}）</div>
      ${calculation ? `<p><b>算出根拠：</b>${calculationNote(calculation)}</p>` : ""}
      <p><b class="mark">観察する言葉：</b>${s.keyword}</p>
      <p><b>性格の見方：</b>${s.personality}</p>
      <p><b>強みとして見る：</b>${s.strength}</p>
      <p style="margin:0"><b>決めつけない伝え方：</b>${s.judge}</p>`;
    const wk = document.getElementById("honmei-worksheet-name");
    if(wk) wk.value = `${s.id}. ${s.name}`;
  });
}

/* ---------------------------------------------------------------------
   相性チェッカー（STEP5ツール）
--------------------------------------------------------------------- */
function buildCheckerSelects(){
  ["checker-a","checker-b"].forEach(id => {
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = `<option value="">-- 宿を選択 --</option>` +
      SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}</option>`).join("");
  });
}

function bindChecker(){
  const btn = document.getElementById("checker-submit");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const birthA = document.getElementById("checker-birth-a")?.value || "";
    const birthB = document.getElementById("checker-birth-b")?.value || "";
    const calcA = setCalculatedSelect("checker-birth-a", "checker-a");
    const calcB = setCalculatedSelect("checker-birth-b", "checker-b");
    const a = calcA?.shuku.id || document.getElementById("checker-a").value;
    const b = calcB?.shuku.id || document.getElementById("checker-b").value;
    const box = document.getElementById("checker-result");
    if(!birthA || !birthB || !a || !b){
      box.classList.add("show");
      box.innerHTML = `<p style="margin:0;color:var(--red)">2人分の生年月日を入力してください。</p>`;
      return;
    }
    const sa = findShuku(a), sb = findShuku(b);
    const group = getShukuGroup6(sa.id, sb.id);
    const g = RELATION_GROUP6.find(r => r.key === group);
    box.classList.add("show");
    box.innerHTML = `
      <div class="rtitle">${sa.name} × ${sb.name} → <span style="color:${g.color}">${g.label}</span></div>
      ${calcA && calcB ? `<p><b>自動算出：</b>1人目 ${lunarLabel(calcA)}＝${sa.name}／2人目 ${lunarLabel(calcB)}＝${sb.name}</p>` : ""}
      <p><b>意味：</b>${g.meaning}</p>
      <p><b>起きやすいこと：</b>${g.happens}</p>
      <p><b>伸びる点：</b>${g.grow}</p>
      <p><b>注意点：</b>${g.caution}</p>
      <p style="margin:0"><b>優しい鑑定表現：</b>「${g.gentle}」</p>`;

    const prompt = document.getElementById("prompt-compatibility");
    const promptBox = document.getElementById("compatibility-prompt-box");
    if(prompt && promptBox){
      prompt.textContent = `あなたは「${GESSHUKU_METHOD_NAME}」を用いる宿曜占星術の相性鑑定文作成サポートです。
以下の情報から、2人の関係を良い・悪いで断定せず、前向きで実用的な相性鑑定文を作ってください。

【1人目】
生年月日：${birthA}
旧暦月日：${calcA ? lunarLabel(calcA) : "入力情報による"}
本命宿：${sa.name}（${sa.yomi}）

【2人目】
生年月日：${birthB}
旧暦月日：${calcB ? lunarLabel(calcB) : "入力情報による"}
本命宿：${sb.name}（${sb.yomi}）

【相性分類】
${g.label}
意味：${g.meaning}
起きやすいこと：${g.happens}
伸びる点：${g.grow}
注意点：${g.caution}

【作成条件】
1. 2人それぞれの本質
2. 関係の強み
3. すれ違いやすい点
4. 関係を整える具体的な行動を3つ
5. 前向きな締め

【文体と的中感の指示】
・バーナム効果を意識し、多くの人が内側に抱えやすい葛藤や、普段は見せにくい本音を、わざとらしくない自然で温かい日本語で織り込んでください。
・抽象的な美辞麗句だけで終わらず、2人の日常で起きそうな会話、距離感、反応の具体例を入れ、「自分たちのことだ」と感じられる的中感の高い文章にしてください。
・良い面だけでなく、すれ違い、依存、遠慮、感情の偏りなどの短所・ネガティブポイントも必ず含めてください。ただし人格を否定せず、関係を整える行動案へつなげてください。
・相談者が前向きな行動を選びたくなるような、示唆的で背中を押す表現を盛り込んでください。命令、脅し、別離の強要はしないでください。
・2〜3文ごとに改行し、長い段落を避けてください。
・アスタリスク記号は1文字も使わないでください。Markdownの強調記号も使わないでください。

【安全上の注意】
断定、不安をあおる表現、相手の気持ちの決めつけ、成就の保証はしないでください。
専門用語はやさしく説明し、800〜1000文字程度で作成してください。`;
      promptBox.hidden = false;
    }
  });
}

/* ---------------------------------------------------------------------
   STEP7：入力内容からChatGPT用の鑑定プロンプトを生成
--------------------------------------------------------------------- */
function buildPromptSelect(){
  const sel = document.getElementById("prompt-honmei");
  if(!sel) return;
  sel.innerHTML = `<option value="">-- 本命宿を選択 --</option>` +
    SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}（${s.yomi}）</option>`).join("");
}

function bindPromptBuilder(){
  const btn = document.getElementById("prompt-generate");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const birthInput = document.getElementById("prompt-birth");
    const calculation = setCalculatedSelect("prompt-birth", "prompt-honmei");
    const id = calculation?.shuku.id || document.getElementById("prompt-honmei").value;
    const error = document.getElementById("prompt-error");
    if(!birthInput.value || !id){
      if(error){
        error.classList.add("show");
        error.innerHTML = `<p style="margin:0;color:var(--red)">生年月日を入力してください。</p>`;
      }
      (!birthInput.value ? birthInput : document.getElementById("prompt-honmei")).focus();
      return;
    }
    if(error){ error.classList.remove("show"); error.innerHTML = ""; }
    const s = findShuku(id);
    const name = document.getElementById("prompt-name").value.trim() || "相談者さん";
    const birth = birthInput.value;
    const genre = document.getElementById("prompt-genre").value;
    const question = document.getElementById("prompt-question").value.trim() || "本質・強み・今後の過ごし方を知りたい";
    const prompt = document.getElementById("prompt-main");
    prompt.textContent = `あなたは「${GESSHUKU_METHOD_NAME}」を用いる宿曜占星術の鑑定文作成サポートです。
以下の情報をもとに、初心者にもわかりやすく、相談者が前向きになれる鑑定文を作成してください。

【相談者情報】
名前：${name}
生年月日：${birth}
旧暦月日：${calculation ? lunarLabel(calculation) : "入力情報による"}
算出方式：${GESSHUKU_METHOD_NAME}
本命宿：${s.name}（${s.yomi}）
キーワード：${s.keyword}
基本性格：${s.personality}
強み：${s.strength}
注意点：${s.weakness}
相談ジャンル：${genre}
相談内容：${question}

【鑑定文の構成】
1. やさしい導入
2. 本命宿から見た本質
3. 強みと才能
4. 注意点をやさしく説明
5. 相談内容への具体的な回答
6. 今日からできる開運行動を3つ
7. 前向きな締め

【文体と的中感の指示】
・バーナム効果を意識し、多くの人が心の奥で感じやすい迷い、外では平気に見せても内側では気にしていることなどを、わざとらしくない自然で温かい日本語で織り込んでください。
・抽象的な美辞麗句だけで逃げず、本命宿の情報から日常の行動、対人場面、疲れたときの反応を具体的に描き、相談者が「自分のことだ」と感じられるところまで的中感を高めてください。
・長所だけでなく、短所、弱さ、迷いやすい点、ネガティブな反応も必ず含めてください。ただし人格を否定せず、強みの裏側や余裕が少ないときの反応として説明してください。
・相談者が自分で一歩を選びたくなるような、示唆的で背中を押す表現を盛り込んでください。命令、脅し、過度な誘導はしないでください。
・2〜3文ごとに改行し、1段落を短くして読みやすくしてください。
・アスタリスク記号は1文字も使わないでください。Markdownの強調記号も使わないでください。

【安全上の注意】
断定しない、不安をあおらない、相手の気持ちを決めつけない、成就を保証しないでください。
専門用語はやさしく説明し、900〜1200文字程度で作成してください。`;
    document.getElementById("main-prompt-box").hidden = false;
    document.getElementById("main-prompt-box").scrollIntoView({behavior:"smooth", block:"center"});
  });
}

/* ---------------------------------------------------------------------
   STEP別 5問クイズ
--------------------------------------------------------------------- */
function renderStepQuiz(){
  const root = document.querySelector("[data-step-quiz]");
  if(!root || typeof STEP_QUIZZES === "undefined") return;
  const quizKey = root.dataset.stepQuiz;
  const questions = STEP_QUIZZES[quizKey];
  if(!questions?.length) return;

  root.innerHTML = `
    <div class="quiz-heading">
      <span class="quiz-badge">理解度チェック</span>
      <h3>このSTEPの5問クイズ</h3>
      <p>正しいと思う答えを1つずつ選び、「答え合わせ」を押してください。</p>
    </div>
    <div class="quiz-questions">
      ${questions.map((item, index) => `
        <fieldset class="quiz-question" data-question="${index}">
          <legend><span>Q${index + 1}</span>${item.q}</legend>
          <div class="quiz-choices">
            ${item.choices.map((choice, choiceIndex) => `
              <label><input type="radio" name="${quizKey}-q${index}" value="${choiceIndex}"><span>${choice}</span></label>
            `).join("")}
          </div>
          <div class="quiz-explanation" aria-live="polite"></div>
        </fieldset>
      `).join("")}
    </div>
    <button type="button" class="btn quiz-submit">5問の答え合わせをする</button>
    <div class="quiz-result" aria-live="polite"></div>`;

  root.querySelector(".quiz-submit").addEventListener("click", () => {
    const unanswered = questions.some((_, index) => !root.querySelector(`input[name="${quizKey}-q${index}"]:checked`));
    const result = root.querySelector(".quiz-result");
    if(unanswered){
      result.className = "quiz-result show quiz-notice";
      result.textContent = "まだ選んでいない問題があります。5問すべて選んでくださいね。";
      root.querySelector(".quiz-question:not(:has(input:checked))")?.scrollIntoView({behavior:"smooth", block:"center"});
      return;
    }

    let score = 0;
    questions.forEach((item, index) => {
      const fieldset = root.querySelector(`[data-question="${index}"]`);
      const selected = Number(root.querySelector(`input[name="${quizKey}-q${index}"]:checked`).value);
      const isCorrect = selected === item.answer;
      if(isCorrect) score += 1;
      fieldset.classList.toggle("is-correct", isCorrect);
      fieldset.classList.toggle("is-wrong", !isCorrect);
      fieldset.querySelectorAll("label").forEach((label, choiceIndex) => {
        label.classList.toggle("correct-answer", choiceIndex === item.answer);
        label.classList.toggle("selected-wrong", choiceIndex === selected && !isCorrect);
      });
      const explanation = fieldset.querySelector(".quiz-explanation");
      explanation.innerHTML = `<b>${isCorrect ? "正解です！" : "正解は「" + item.choices[item.answer] + "」です。"}</b><p>${item.explanation}</p>`;
    });

    const message = score === 5 ? "全問正解です！ このSTEPの大切なポイントをつかめています。" : score >= 3 ? "よく理解できています。間違えた問題の解説だけ、もう一度読んでみましょう。" : "ここから覚えれば大丈夫です。解説を読んでから、もう一度挑戦してみましょう。";
    result.className = "quiz-result show";
    result.innerHTML = `<strong>${score} / 5 問正解</strong><p>${message}</p>`;
    result.scrollIntoView({behavior:"smooth", block:"center"});
  });
}

/* ---------------------------------------------------------------------
   すべての早見表を、横スクロール不要の行別プルダウンへ変換する。
--------------------------------------------------------------------- */
function enhanceExpandableTables(){
  document.querySelectorAll(".table-wrap table:not(.matrix-table)").forEach(table => {
    if(table.dataset.accordionReady === "1") return;
    const headings = [...table.querySelectorAll("thead th")].map(th => th.textContent.trim());
    const rows = [...table.querySelectorAll("tbody tr")];
    if(!headings.length || !rows.length) return;

    const accordion = document.createElement("div");
    accordion.className = "record-accordion";
    rows.forEach(row => {
      const cells = [...row.children];
      if(!cells.length) return;
      const details = document.createElement("details");
      details.className = "record-fold";
      const summary = document.createElement("summary");
      summary.innerHTML = `<span>${cells[0].innerHTML}</span>${headings[1] === "読み" && cells[1] ? `<small>${cells[1].textContent}</small>` : ""}`;
      const content = document.createElement("div");
      content.className = "record-content";
      cells.slice(1).forEach((cell, index) => {
        const item = document.createElement("div");
        item.className = "record-item";
        item.innerHTML = `<b>${headings[index + 1] || cell.dataset.label || "詳細"}</b><p>${cell.innerHTML}</p>`;
        content.appendChild(item);
      });
      details.append(summary, content);
      accordion.appendChild(details);
    });

    const source = table.closest(".table-scroll") || table;
    source.classList.add("accordion-source-table");
    source.insertAdjacentElement("afterend", accordion);
    table.dataset.accordionReady = "1";
  });

  const openHashTarget = () => {
    if(!location.hash) return;
    const target = document.querySelector(location.hash);
    const first = target?.querySelector("details.record-fold");
    if(first) first.open = true;
  };
  openHashTarget();
  window.addEventListener("hashchange", openHashTarget);

  window.addEventListener("beforeprint", () => {
    document.querySelectorAll("details.record-fold").forEach(details => {
      details.dataset.wasOpen = details.open ? "1" : "0";
      details.open = true;
    });
  });
  window.addEventListener("afterprint", () => {
    document.querySelectorAll("details.record-fold").forEach(details => {
      details.open = details.dataset.wasOpen === "1";
      delete details.dataset.wasOpen;
    });
  });
}

/* ---------------------------------------------------------------------
   日運計算ツール（STEP6） — 見たい日の宿も月宿傍通暦式で自動算出
--------------------------------------------------------------------- */
function buildDayFortuneSelects(){
  ["day-honmei","day-today"].forEach(id => {
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = `<option value="">-- 宿を選択 --</option>` +
      SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}</option>`).join("");
  });
}

function bindDayFortuneForm(){
  const btn = document.getElementById("day-submit");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const honId = document.getElementById("day-honmei").value;
    const calculation = setCalculatedSelect("day-date", "day-today");
    const todayId = calculation?.shuku.id || document.getElementById("day-today").value;
    const box = document.getElementById("day-result");
    if(!honId || !todayId){
      box.classList.add("show");
      box.innerHTML = `<p style="margin:0;color:var(--red)">本命宿を登録し、見たい日付を入力してください。</p>`;
      return;
    }
    const type = getShukuDistanceType(Number(honId), Number(todayId));
    const d = DAY_FORTUNE.find(x => x.key === type);
    box.classList.add("show");
    box.innerHTML = `
      <div class="rtitle"><ruby>${type}<rt>${d.yomi}</rt></ruby>の日 — ${d.theme}</div>
      ${calculation ? `<p><b>その日の宿：</b>${calculation.shuku.name}（${calculation.shuku.yomi}）／${calculationNote(calculation)}</p>` : ""}
      <p><b>向いている行動：</b>${d.action}</p>
      <p><b>注意点：</b>${d.caution}</p>
      <p><b>恋愛：</b>${d.love}</p>
      <p><b>仕事：</b>${d.work}</p>
      <p style="margin:0"><b>鑑定文例：</b>${d.judge}</p>`;
  });
}

/* ---------------------------------------------------------------------
   ナビ（モバイルトグル + スムーススクロール）
--------------------------------------------------------------------- */
function bindNav(){
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if(toggle && nav){
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }
}

/* ---------------------------------------------------------------------
   早見表ジャンプ フローティングメニュー
--------------------------------------------------------------------- */
function bindJumpFab(){
  const btn = document.getElementById("jump-fab-btn");
  const menu = document.getElementById("jump-menu");
  if(!btn || !menu) return;
  btn.addEventListener("click", () => menu.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if(!e.target.closest(".jump-fab")) menu.classList.remove("open");
  });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
}

/* ---------------------------------------------------------------------
   プロンプトコピー機能
--------------------------------------------------------------------- */
function copyTextToClipboard(text){
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => { if(!done){ done = true; resolve(ok); } };

    const fallback = () => {
      try{
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        finish(ok);
      }catch(err){ finish(false); }
    };

    if(navigator.clipboard && window.isSecureContext){
      // クリップボード許可待ちで無期限にハングしないよう、タイムアウトを設ける
      const timer = setTimeout(fallback, 800);
      navigator.clipboard.writeText(text).then(() => {
        clearTimeout(timer); finish(true);
      }).catch(() => {
        clearTimeout(timer); fallback();
      });
    } else {
      fallback();
    }
  });
}

function bindCopyButtons(){
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.dataset.copy);
      if(!target) return;
      const orig = btn.textContent;
      await copyTextToClipboard(target.innerText);
      btn.textContent = "✓ コピーしました！";
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 1800);
    });
  });
}

/* ---------------------------------------------------------------------
   学習完了チェックリスト（localStorage保存）
--------------------------------------------------------------------- */
function bindChecklists(){
  document.querySelectorAll(".check-list input[type=checkbox]").forEach(cb => {
    const key = "shukuyo_" + cb.dataset.key;
    cb.checked = localStorage.getItem(key) === "1";
    cb.addEventListener("change", () => {
      localStorage.setItem(key, cb.checked ? "1" : "0");
      updateProgress();
    });
  });
  updateProgress();
}

function updateProgress(){
  const all = document.querySelectorAll(".check-list input[type=checkbox]");
  if(!all.length) return;
  const done = [...all].filter(c => c.checked).length;
  const note = document.getElementById("progress-note");
  if(note) note.textContent = `学習進捗：${done} / ${all.length} 項目 完了`;
}
