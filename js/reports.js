/* 入力式・印刷対応 鑑定書テンプレート */
document.addEventListener("DOMContentLoaded", () => {
  const configs = {
    general: { title:"月の宿 総合鑑定書", focus:"総合的に見る今のテーマ", label:"総合テーマ鑑定" },
    love: { title:"月の宿 恋愛鑑定書", focus:"恋愛傾向とご縁の育て方", label:"恋愛テーマ鑑定" },
    work: { title:"月の宿 仕事・適職鑑定書", focus:"才能が活きる働き方", label:"仕事・適職テーマ鑑定" },
    relationship: { title:"月の宿 人間関係鑑定書", focus:"人との距離感と関係の整え方", label:"人間関係テーマ鑑定" },
    compatibility: { title:"月の宿 相性鑑定書", focus:"二人の宿から見る関係の育て方", label:"相性テーマ鑑定" }
  };

  let currentTemplate = "general";
  let primaryCalculation = null;
  let partnerCalculation = null;

  const field = id => document.getElementById(id);
  const textOrFallback = (value, fallback="未入力") => value && value.trim() ? value.trim() : fallback;

  function setOutput(name, value, fallback="未入力"){
    document.querySelectorAll(`[data-output="${name}"]`).forEach(node => {
      node.textContent = textOrFallback(value, fallback);
    });
  }

  function syncField(input){
    const name = input.dataset.reportField;
    if(name) setOutput(name, input.value);
  }

  function setField(id, value){
    const input = field(id);
    if(!input) return;
    input.value = value || "";
    syncField(input);
  }

  function todayValue(){
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0,10);
  }

  function readableDate(value){
    if(!value) return "";
    const [year,month,day] = value.split("-");
    return `${year}年${Number(month)}月${Number(day)}日`;
  }

  function updateDateOutputs(){
    document.getElementById("report-birth-output").textContent = readableDate(field("report-birth").value) || "未入力";
    setOutput("date", readableDate(field("report-date").value));
  }

  function cautionNames(shuku){
    if(typeof getCautionShukuList !== "function") return "";
    return getCautionShukuList(shuku.id).map(item => item.replace(/（[安壊]）/g, "")).join("、");
  }

  function buildThemeText(shuku){
    const cautions = cautionNames(shuku);
    if(currentTemplate === "love"){
      return `${shuku.love}\n\n恋愛では、相手の反応だけで自分の価値を決めないことが大切です。嬉しいこと、不安なこと、望んでいる距離感を短い言葉で伝えてください。特に${cautions || "安壊に当たる宿"}とは、強く惹かれる一方で期待のずれが起きやすいため、約束と境界線を曖昧にしないことが関係を守ります。`;
    }
    if(currentTemplate === "work"){
      return `${shuku.work}\n\n${shuku.behavior}得意な部分を自分で引き受け、苦手な部分は早めに共有すると、無理なく成果へつなげられます。評価を待つだけでなく、これまで人から感謝されたことを三つ書き出し、次に活かす役割を選んでください。`;
    }
    if(currentTemplate === "relationship"){
      return `${shuku.relationships}\n\n${shuku.emotion}相手に合わせ続けて疲れる前に、自分ができることとできないことを伝えてください。分かってもらえるまで我慢するのではなく、小さな違和感の段階で言葉にすることが、家族・友人・職場の関係を長く保つ鍵です。`;
    }
    if(currentTemplate === "compatibility"){
      return partnerCalculation ? buildCompatibilityText(shuku, partnerCalculation.shuku) : "お二人の生年月日を入力すると、相性分類と関係の育て方が表示されます。";
    }
    return `${shuku.behavior}\n\n${shuku.emotion}外から見える姿と内面の両方を理解すると、無理に自分を変えなくても力の使い方を選べるようになります。人から繰り返し頼まれることを才能として受け取り、疲れる前に休む予定まで先に決めてください。`;
  }

  function buildCompatibilityText(primary, partner){
    const type = getShukuDistanceType(primary.id, partner.id);
    const groupKey = getShukuGroup6(primary.id, partner.id);
    const group = RELATION_GROUP6.find(item => item.key === groupKey);
    if(!group) return "二人の関係性を確認してください。";
    setField("report-compatibility", `${group.label}・${type}の関係`);
    return `${primary.name}から見た${partner.name}は「${type}」、六分類では${group.label}です。${group.meaning}\n\n${group.happens}${group.grow}\n\n注意したいのは、${group.caution}良い・悪いだけで決めず、二人の違いを役割として言葉にし、約束を具体的にしてください。`;
  }

  function fillReading(){
    if(!primaryCalculation) return;
    const shuku = primaryCalculation.shuku;
    setField("report-essence", `${shuku.personality}\n\n${shuku.emotion}周囲には平気そうに見せても、内側では多くのことを受け取っています。気持ちを整理する時間を持つほど、本来の判断力を取り戻しやすくなります。`);
    setField("report-strength", `${shuku.strength}\n\n自分では普通だと思っている行動ほど、周囲から見ると頼もしい才能です。人から繰り返し頼まれること、感謝されることを軽く扱わず、役割として育ててください。`);
    setField("report-challenge", `${shuku.weakness}\n\n疲れがたまると、${shuku.tired}これは欠点ではなく、余裕が減っている合図です。大きな決断を急がず、予定と人間関係を一度整理してください。`);
    setField("report-focus", buildThemeText(shuku));
    setField("report-action", `${shuku.lucky}\n\nまず一つだけ実行し、できた事実を自分で認めてください。運を待つより、自分の性質を理解して使い方を選ぶことが、流れを変える最初の一歩です。`);
    setField("report-closing", `${shuku.judge}長所だけを伸ばそうとせず、短所が出る前の小さな違和感にも気づいてください。自分の性質を責めるのではなく、場面に合わせて使い分けることで、あなたらしい選択がしやすくなります。`);
  }

  function calculatePrimary(){
    const birth = field("report-birth").value;
    primaryCalculation = birth ? calculateShukuFromGregorian(birth) : null;
    updateDateOutputs();
    if(!primaryCalculation) return;
    setField("report-lunar", lunarLabel(primaryCalculation));
    setField("report-shuku", `${primaryCalculation.shuku.name}（${primaryCalculation.shuku.yomi}）`);
    fillReading();
  }

  function calculatePartner(){
    const birth = field("report-partner-birth").value;
    partnerCalculation = birth ? calculateShukuFromGregorian(birth) : null;
    if(!partnerCalculation){
      setField("report-partner-shuku", "");
      setField("report-compatibility", "");
      return;
    }
    setField("report-partner-shuku", `${partnerCalculation.shuku.name}（${partnerCalculation.shuku.yomi}）`);
    if(primaryCalculation) setField("report-focus", buildCompatibilityText(primaryCalculation.shuku, partnerCalculation.shuku));
  }

  function applyTemplate(type){
    currentTemplate = type;
    document.querySelectorAll(".template-choice").forEach(button => button.classList.toggle("active", button.dataset.template === type));
    const config = configs[type];
    setOutput("title", config.title);
    setOutput("focusTitle", config.focus);
    field("report-focus-label").textContent = config.label;
    const compatibility = type === "compatibility";
    document.querySelectorAll(".compatibility-fields,.compatibility-output").forEach(node => node.hidden = !compatibility);
    if(primaryCalculation) fillReading();
  }

  document.querySelectorAll("[data-report-field]").forEach(input => {
    input.addEventListener("input", () => {
      syncField(input);
      if(input.id === "report-date") updateDateOutputs();
      if(input.id === "report-reader" && !field("report-signature").value){
        setField("report-signature", input.value);
      }
    });
  });

  document.querySelectorAll(".template-choice").forEach(button => button.addEventListener("click", () => applyTemplate(button.dataset.template)));
  field("report-birth").addEventListener("change", calculatePrimary);
  field("report-partner-birth").addEventListener("change", calculatePartner);
  field("report-fill").addEventListener("click", () => { calculatePrimary(); calculatePartner(); fillReading(); });
  field("report-print").addEventListener("click", () => window.print());
  field("report-clear").addEventListener("click", () => {
    document.querySelector(".report-form").querySelectorAll("input,textarea").forEach(input => input.value = "");
    primaryCalculation = null;
    partnerCalculation = null;
    document.querySelectorAll("[data-report-field]").forEach(syncField);
    field("report-date").value = todayValue();
    updateDateOutputs();
    document.getElementById("report-birth-output").textContent = "未入力";
    applyTemplate(currentTemplate);
  });

  field("report-date").value = todayValue();
  updateDateOutputs();
  applyTemplate("general");

  const savedBirth = localStorage.getItem("shukuyo_profile_birth");
  if(savedBirth){
    field("report-birth").value = savedBirth;
    calculatePrimary();
  }
});
