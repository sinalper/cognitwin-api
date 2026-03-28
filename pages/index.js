import { useState, useRef } from "react";
import Head from "next/head";

const ADMIN_PASS = "cogni";

const TOPIC_LIST = [
  {id:1,cat:"A. Sosyal Dünya & İnsan İlişkileri",sub:"Güven (trust)"},
  {id:2,cat:"A. Sosyal Dünya & İnsan İlişkileri",sub:"İşbirliği vs rekabet"},
  {id:3,cat:"A. Sosyal Dünya & İnsan İlişkileri",sub:"Sadakat & bağlılık"},
  {id:4,cat:"A. Sosyal Dünya & İnsan İlişkileri",sub:"Sosyal normlara uyum"},
  {id:5,cat:"A. Sosyal Dünya & İnsan İlişkileri",sub:"Dedikodu / bilgi paylaşımı"},
  {id:6,cat:"A. Sosyal Dünya & İnsan İlişkileri",sub:"Affetme & intikam"},
  {id:7,cat:"B. Kimlik & Grup Dinamikleri",sub:"İç grup / dış grup algısı"},
  {id:8,cat:"B. Kimlik & Grup Dinamikleri",sub:"Ulusal kimlik"},
  {id:9,cat:"B. Kimlik & Grup Dinamikleri",sub:"Kültürel değerler"},
  {id:10,cat:"B. Kimlik & Grup Dinamikleri",sub:"Kimlik tehditi"},
  {id:11,cat:"B. Kimlik & Grup Dinamikleri",sub:"Aidiyet ihtiyacı"},
  {id:12,cat:"B. Kimlik & Grup Dinamikleri",sub:"Kimlik esnekliği vs katılığı"},
  {id:13,cat:"C. Siyaset & Toplumsal Sistemler",sub:"Otoriteye bakış"},
  {id:14,cat:"C. Siyaset & Toplumsal Sistemler",sub:"Demokrasi vs güçlü liderlik"},
  {id:15,cat:"C. Siyaset & Toplumsal Sistemler",sub:"Göç"},
  {id:16,cat:"C. Siyaset & Toplumsal Sistemler",sub:"Toplumsal eşitsizlik"},
  {id:17,cat:"C. Siyaset & Toplumsal Sistemler",sub:"Kamu politikaları"},
  {id:18,cat:"C. Siyaset & Toplumsal Sistemler",sub:"İfade özgürlüğü"},
  {id:19,cat:"D. Ekonomi & Kaynak Dağılımı",sub:"Adil paylaşım"},
  {id:20,cat:"D. Ekonomi & Kaynak Dağılımı",sub:"Risk alma (finansal)"},
  {id:21,cat:"D. Ekonomi & Kaynak Dağılımı",sub:"Tasarruf vs harcama"},
  {id:22,cat:"D. Ekonomi & Kaynak Dağılımı",sub:"Devlet müdahalesi"},
  {id:23,cat:"D. Ekonomi & Kaynak Dağılımı",sub:"Refah devleti"},
  {id:24,cat:"D. Ekonomi & Kaynak Dağılımı",sub:"Fiyat/kalite trade-off"},
  {id:25,cat:"E. Ahlak & Etik Kararlar",sub:"Zarar verme / zarar görme"},
  {id:26,cat:"E. Ahlak & Etik Kararlar",sub:"Niyet vs sonuç"},
  {id:27,cat:"E. Ahlak & Etik Kararlar",sub:"Adalet duyarlılığı"},
  {id:28,cat:"E. Ahlak & Etik Kararlar",sub:"Kurallara uyum"},
  {id:29,cat:"E. Ahlak & Etik Kararlar",sub:"Ahlaki relativizm vs evrenselcilik"},
  {id:30,cat:"F. Bilgi, Gerçeklik & Epistemik Tutumlar",sub:"Bilime güven"},
  {id:31,cat:"F. Bilgi, Gerçeklik & Epistemik Tutumlar",sub:"Uzmanlara güven"},
  {id:32,cat:"F. Bilgi, Gerçeklik & Epistemik Tutumlar",sub:"Komplo inançları"},
  {id:33,cat:"F. Bilgi, Gerçeklik & Epistemik Tutumlar",sub:"Kanıt değerlendirme"},
  {id:34,cat:"F. Bilgi, Gerçeklik & Epistemik Tutumlar",sub:"Şüphecilik vs kolay inanma"},
  {id:35,cat:"F. Bilgi, Gerçeklik & Epistemik Tutumlar",sub:"Bilgi kaynağı tercihleri"},
  {id:36,cat:"G. Risk & Belirsizlik",sub:"Belirsizlik toleransı"},
  {id:37,cat:"G. Risk & Belirsizlik",sub:"Kayıp kaçınma"},
  {id:38,cat:"G. Risk & Belirsizlik",sub:"Sağlık riskleri"},
  {id:39,cat:"G. Risk & Belirsizlik",sub:"Teknolojik riskler"},
  {id:40,cat:"G. Risk & Belirsizlik",sub:"Sosyal riskler"},
  {id:41,cat:"G. Risk & Belirsizlik",sub:"Uzun vadeli vs kısa vadeli düşünme"},
  {id:42,cat:"H. Duygular & Psikolojik Regülasyon",sub:"Öfke kontrolü"},
  {id:43,cat:"H. Duygular & Psikolojik Regülasyon",sub:"Kaygı ile başa çıkma"},
  {id:44,cat:"H. Duygular & Psikolojik Regülasyon",sub:"Empati"},
  {id:45,cat:"H. Duygular & Psikolojik Regülasyon",sub:"Duygusal farkındalık"},
  {id:46,cat:"H. Duygular & Psikolojik Regülasyon",sub:"Duygu bastırma vs ifade"},
  {id:47,cat:"I. Günlük Yaşam & Karar Verme",sub:"Zaman yönetimi"},
  {id:48,cat:"I. Günlük Yaşam & Karar Verme",sub:"Planlılık vs spontane davranış"},
  {id:49,cat:"I. Günlük Yaşam & Karar Verme",sub:"Alışkanlıklar"},
  {id:50,cat:"I. Günlük Yaşam & Karar Verme",sub:"Teknoloji kullanımı"},
  {id:51,cat:"I. Günlük Yaşam & Karar Verme",sub:"Sağlık davranışları"},
  {id:52,cat:"J. Doğa, Çevre & Gelecek",sub:"Çevre duyarlılığı"},
  {id:53,cat:"J. Doğa, Çevre & Gelecek",sub:"İklim değişikliği"},
  {id:54,cat:"J. Doğa, Çevre & Gelecek",sub:"Sürdürülebilirlik"},
  {id:55,cat:"J. Doğa, Çevre & Gelecek",sub:"Gelecek nesillere sorumluluk"}
];

async function getRandomTopic() {
  try {
    const r = await fetch("/api/data?key=_used_topics");
    const d = await r.json();
    let used = [];
    if (d.value) {
      try { used = typeof d.value === "string" ? JSON.parse(d.value) : (Array.isArray(d.value) ? d.value : []); } catch(_) { used = []; }
    }
    const available = TOPIC_LIST.filter(t => !used.includes(t.id));
    const pool = available.length > 0 ? available : TOPIC_LIST;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const newUsed = available.length > 0 ? [...used, chosen.id] : [chosen.id];
    await fetch("/api/data", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ key: "_used_topics", value: JSON.stringify(newUsed) }) });
    return chosen;
  } catch(e) {
    return TOPIC_LIST[Math.floor(Math.random() * TOPIC_LIST.length)];
  }
}

const SYS_INIT = `You are conducting an adaptive cognitive profiling assessment. Your goal is to understand HOW a participant thinks about a specific topic — their underlying reasoning patterns, cognitive style, and decision-making heuristics. Not WHAT they think, but WHY and HOW.

You will be given a SPECIFIC topic. You MUST use this exact topic.

YOUR TASK:
1. Generate a binary (A/B) scenario question in Turkish about the given subtopic
   - Realistic dilemma or choice relevant to everyday life
   - Options should reveal different REASONING STYLES, not just opinions
   - Clear, everyday Turkish — no academic jargon
2. Generate 2-4 hypotheses about reasoning patterns
   - Each hypothesis = a WAY OF THINKING, not a preference
   - Example: "Loss-averse thinker who prioritizes avoiding negative outcomes"
   - Example: "Principle-based reasoner who applies universal rules regardless of context"

The participant will provide BOTH a choice (A/B) AND a written explanation in Turkish.

RESPOND WITH ONLY VALID JSON (no markdown):
{"category":"given category","subtopic":"given subtopic","question":{"scenario":"Turkish 2-3 sentences","option_a":"Turkish","option_b":"Turkish"},"hypotheses":[{"id":"H1","label":"Short English","description":"English reasoning pattern","predicts":"A or B"},{"id":"H2","label":"Short English","description":"English reasoning pattern","predicts":"A or B"}]}`;

const SYS_UPDATE = `You are continuing an adaptive cognitive profiling. The participant provides BOTH a choice AND a written Turkish explanation. Their REASONING in the explanation often reveals more than the choice itself.

RULES:
1. Analyze BOTH choice AND explanation
2. Update each hypothesis: "eliminated" / "weakened" / "unchanged" / "strengthened"
3. ADD new hypotheses if the explanation reveals unexpected patterns
4. If only ONE plausible hypothesis remains with no reasonable doubt: "ready": true
5. If multiple plausible hypotheses remain: generate a NEW question where they predict DIFFERENT answers
6. Same subtopic. Minimum 2 rounds before ready=true.

RESPOND WITH ONLY VALID JSON:
{"hypothesis_updates":[{"id":"H1","label":"...","status":"eliminated|weakened|unchanged|strengthened","evidence":"referencing choice AND explanation"}],"new_hypotheses":[{"id":"H_new","label":"...","description":"...","predicts":"A or B"}],"active_hypotheses_count":2,"ready":false,"reasoning":"why ready or not","next_question":{"scenario":"Turkish or null if ready","option_a":"Turkish","option_b":"Turkish","discrimination_logic":"English: which hypotheses and how"}}`;

const SYS_FINAL = `You are completing a cognitive profiling session with all choices AND written explanations.

TASK:
1. Summarize reasoning style (2-3 sentences English)
2. State winning hypothesis and list eliminated ones with round and reason
3. Generate exactly 3 TEST questions — same subtopic, different aspects, Turkish, binary A/B
4. Predict answers with confidence 0.0-1.0

RESPOND WITH ONLY VALID JSON:
{"participant_profile":"2-3 sentences English","winning_hypothesis":{"id":"...","label":"...","description":"..."},"eliminated_hypotheses":[{"id":"...","label":"...","eliminated_at_round":1,"reason":"..."}],"test_questions":[{"id":"T1","scenario":"Turkish","option_a":"Turkish","option_b":"Turkish","prediction":"A or B","confidence":0.75,"prediction_reasoning":"English"},{"id":"T2","scenario":"Turkish","option_a":"Turkish","option_b":"Turkish","prediction":"A or B","confidence":0.7,"prediction_reasoning":"English"},{"id":"T3","scenario":"Turkish","option_a":"Turkish","option_b":"Turkish","prediction":"A or B","confidence":0.7,"prediction_reasoning":"English"}]}`;

async function callAPI(system, prompt) {
  const r = await fetch("/api/generate", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({system,prompt}) });
  const d = await r.json();
  if (d.error) throw new Error(typeof d.error==="string"?d.error:d.error.message||JSON.stringify(d.error));
  const txt = (d.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
  return JSON.parse(txt);
}

async function saveData(key, value) {
  await fetch("/api/data", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key,value})});
}
async function loadData(key) {
  const r = await fetch("/api/data?key="+encodeURIComponent(key));
  const d = await r.json();
  return d.value;
}
async function listKeys() {
  const r = await fetch("/api/data");
  const d = await r.json();
  return d.keys||[];
}

export default function Home() {
  const [phase, setPhase] = useState("welcome");
  const [topic, setTopic] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [reason, setReason] = useState("");
  const [profHist, setProfHist] = useState([]);
  const [profRound, setProfRound] = useState(0);
  const [testQs, setTestQs] = useState([]);
  const [testIdx, setTestIdx] = useState(0);
  const [testAns, setTestAns] = useState({});
  const [profile, setProfile] = useState(null);
  const [elimHyps, setElimHyps] = useState([]);
  const [pid] = useState("P"+Date.now().toString(36)+Math.random().toString(36).slice(2,5));
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [adminPw, setAdminPw] = useState("");
  const [expRow, setExpRow] = useState(null);
  const hypRef = useRef([]);

  // ===== START =====
  const start = async () => {
    setLoading(true); setLoadMsg("Konu seçiliyor ve ilk soru hazırlanıyor..."); setError(null);
    try {
      const chosen = await getRandomTopic();
      const prompt = "ASSIGNED TOPIC (you MUST use this):\nID: "+chosen.id+"\nCategory: "+chosen.cat+"\nSubtopic: "+chosen.sub+"\n\nGenerate the first profiling question about this subtopic.";
      const result = await callAPI(SYS_INIT, prompt);
      setTopic({id:chosen.id, category:chosen.cat, subtopic:chosen.sub});
      setCurrentQ(result.question);
      hypRef.current = [{round:0, hypotheses:result.hypotheses}];
      setProfRound(1);
      setPhase("profiling");
    } catch(e) { setError("Bağlantı hatası: "+e.message); setPhase("error"); }
    setLoading(false);
  };

  // ===== SUBMIT PROFILING =====
  const submitProf = async () => {
    const cText = answer==="A"?currentQ.option_a:currentQ.option_b;
    const newHist = [...profHist, {round:profRound, scenario:currentQ.scenario, option_a:currentQ.option_a, option_b:currentQ.option_b, answer, answerText:cText, reason}];
    setProfHist(newHist); setAnswer(null); setReason("");

    if (profRound>=5) { await genTest(newHist); return; }

    setLoading(true); setLoadMsg("Cevabınız analiz ediliyor..."); setError(null);
    try {
      let p = "TOPIC: "+topic.category+" > "+topic.subtopic+" (ID:"+topic.id+")\n\nPROFILING HISTORY:\n";
      newHist.forEach(h => { p+="Round "+h.round+":\n  Q: \""+h.scenario+"\"\n  A: "+h.option_a+"\n  B: "+h.option_b+"\n  Choice: "+h.answer+" (\""+h.answerText+"\")\n  Explanation: \""+h.reason+"\"\n\n"; });
      p+="CURRENT HYPOTHESES:\n"+JSON.stringify(hypRef.current[hypRef.current.length-1])+"\n\nRound "+profRound+" of max 5. Min 2 required.\nUpdate hypotheses based on BOTH choice and explanation.";
      const result = await callAPI(SYS_UPDATE, p);
      hypRef.current.push({round:profRound, updates:result.hypothesis_updates, new_hyp:result.new_hypotheses, reasoning:result.reasoning});
      if (result.ready && profRound>=2) { await genTest(newHist); return; }
      if (result.next_question?.scenario) { setCurrentQ(result.next_question); setProfRound(profRound+1); }
      else { await genTest(newHist); return; }
    } catch(e) { setError("Güncelleme hatası: "+e.message); await genTest(newHist); }
    setLoading(false);
  };

  // ===== GENERATE TEST =====
  const genTest = async (hist) => {
    setLoading(true); setLoadMsg("Test soruları oluşturuluyor..."); setError(null);
    try {
      let p = "TOPIC: "+topic.category+" > "+topic.subtopic+" (ID:"+topic.id+")\n\nCOMPLETE PROFILING:\n";
      hist.forEach(h => { p+="Round "+h.round+":\n  Q: \""+h.scenario+"\"\n  Choice: "+h.answer+" (\""+h.answerText+"\")\n  Explanation: \""+h.reason+"\"\n\n"; });
      p+="HYPOTHESIS EVOLUTION:\n"+JSON.stringify(hypRef.current)+"\n\nGenerate profile, eliminated hypotheses, and 3 test questions about "+topic.subtopic+".";
      const result = await callAPI(SYS_FINAL, p);
      setTestQs(result.test_questions);
      setProfile({summary:result.participant_profile, hypothesis:result.winning_hypothesis});
      setElimHyps(result.eliminated_hypotheses||[]);
      setTestIdx(0); setPhase("test");
    } catch(e) { setError("Test oluşturulamadı: "+e.message); setPhase("error"); }
    setLoading(false);
  };

  // ===== SAVE =====
  const save = async () => {
    const acc = testQs.map((t,i)=>t.prediction===testAns[i]?1:0);
    const data = {
      pid, timestamp:new Date().toISOString(), topic,
      profiling_rounds:profHist.length, profiling_history:profHist,
      hypothesis_evolution:hypRef.current, profile,
      winning_hypothesis:profile?.hypothesis, eliminated_hypotheses:elimHyps,
      test_questions:testQs.map((t,i)=>({...t, actual:testAns[i], correct:acc[i]})),
      accuracy:{t1:acc[0],t2:acc[1],t3:acc[2],total:acc[0]+acc[1]+acc[2]}
    };
    try { await saveData("resp:"+pid, JSON.stringify(data)); } catch(_){}
    setPhase("done");
  };

  // ===== ADMIN =====
  const loadAdmin = async () => {
    try {
      const keys = await listKeys();
      const all = [];
      for (const k of keys.filter(k=>k.startsWith("resp:"))) {
        const v = await loadData(k);
        if (v) { try { all.push(typeof v==="string"?JSON.parse(v):v); } catch(_){} }
      }
      all.sort((a,b)=>(a.timestamp||"").localeCompare(b.timestamp||""));
      setAdminData(all);
    } catch(e) { setError(e.message); }
  };

  const dlCSV = () => {
    if (!adminData?.length) return;
    const f = ["pid","timestamp","topic_id","category","subtopic","profiling_rounds","winning_hypothesis","eliminated_count","T1_pred","T1_actual","T1_correct","T2_pred","T2_actual","T2_correct","T3_pred","T3_actual","T3_correct","total_correct","profile"];
    const rows = adminData.map(r=>[
      r.pid, r.timestamp, r.topic?.id||"",
      '"'+(r.topic?.category||"").replace(/"/g,'""')+'"',
      '"'+(r.topic?.subtopic||"").replace(/"/g,'""')+'"',
      r.profiling_rounds,
      '"'+(r.winning_hypothesis?.label||r.profile?.hypothesis?.label||"").replace(/"/g,'""')+'"',
      (r.eliminated_hypotheses||[]).length,
      r.test_questions?.[0]?.prediction,r.test_questions?.[0]?.actual,r.accuracy?.t1,
      r.test_questions?.[1]?.prediction,r.test_questions?.[1]?.actual,r.accuracy?.t2,
      r.test_questions?.[2]?.prediction,r.test_questions?.[2]?.actual,r.accuracy?.t3,
      r.accuracy?.total,
      '"'+(r.profile?.summary||"").replace(/"/g,'""')+'"'
    ].join(","));
    const csv = "\uFEFF"+f.join(",")+"\n"+rows.join("\n");
    const b = new Blob([csv],{type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(b); a.download="cognitwin_data.csv"; a.click();
  };

  // ===== STYLES =====
  const pg = {fontFamily:"'Segoe UI',system-ui,sans-serif",maxWidth:640,margin:"0 auto",padding:"20px 16px",minHeight:"100vh",color:"#1a1a2e"};
  const cd = {background:"#fff",borderRadius:12,padding:"24px 20px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",marginBottom:16};
  const bn = on=>({display:"block",width:"100%",padding:"12px 20px",borderRadius:8,border:"none",fontSize:14,fontWeight:600,cursor:on?"pointer":"default",background:on?"#1a1a2e":"#ccc",color:"#fff",marginTop:14});
  const op = sel=>({display:"block",width:"100%",padding:"14px 16px",borderRadius:8,border:sel?"2px solid #1a1a2e":"2px solid #e5e5e5",background:sel?"#f0f0ff":"#fafafa",fontSize:14,cursor:"pointer",textAlign:"left",marginBottom:8,fontWeight:sel?600:400,boxSizing:"border-box"});
  const ta = {width:"100%",minHeight:70,padding:12,borderRadius:8,border:"1px solid #ddd",fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",marginTop:8};

  const pct = Math.min(((phase==="profiling"?profRound:phase==="test"?5+testIdx+1:phase==="done"?8:0)/8)*100,100);
  const bar = <div style={{height:4,background:"#e8e8e8",borderRadius:2,marginBottom:20,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"#1a1a2e",borderRadius:2,transition:"width .4s"}}/></div>;
  const ok = answer && reason.length>=20;

  // ===== LOADING (must be first) =====
  if (loading) return (<div style={pg}><Head><title>CognitWin</title></Head>{bar}
    <div style={{...cd,textAlign:"center",padding:"48px 24px"}}>
      <div style={{width:40,height:40,border:"4px solid #e8e8e8",borderTopColor:"#1a1a2e",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{fontSize:15,fontWeight:600,margin:"0 0 6px"}}>{loadMsg}</p>
      <p style={{fontSize:12,color:"#999",margin:0}}>Bu işlem birkaç saniye sürebilir</p>
    </div></div>);

  // ===== ADMIN =====
  if (phase==="admin") {
    const ag = adminData?{n:adminData.length,t1:adminData.reduce((s,r)=>s+(r.accuracy?.t1||0),0),t2:adminData.reduce((s,r)=>s+(r.accuracy?.t2||0),0),t3:adminData.reduce((s,r)=>s+(r.accuracy?.t3||0),0),ar:adminData.length?(adminData.reduce((s,r)=>s+(r.profiling_rounds||0),0)/adminData.length).toFixed(1):0}:null;
    return (<div style={{...pg,maxWidth:1200}}><Head><title>Admin</title></Head><div style={cd}>
      <h2 style={{fontSize:18,margin:"0 0 16px"}}>Admin Panel</h2>
      {!adminData && <button onClick={loadAdmin} style={bn(true)}>Verileri Yukle</button>}
      {adminData && <>
        {ag&&ag.n>0 && <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          {[["Attempt",ag.n,"#1a1a2e"],["T1",((ag.t1/ag.n)*100).toFixed(0)+"%","#059669"],["T2",((ag.t2/ag.n)*100).toFixed(0)+"%","#059669"],["T3",((ag.t3/ag.n)*100).toFixed(0)+"%","#059669"],["Overall",(((ag.t1+ag.t2+ag.t3)/(ag.n*3))*100).toFixed(0)+"%","#1a1a2e"],["Ort.Soru",ag.ar,"#6366f1"]].map(([l,v,c])=>(
            <div key={l} style={{background:"#f8f9fa",borderRadius:8,padding:"10px 14px",flex:"1 1 70px",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#888"}}>{l}</div>
              <div style={{fontSize:20,fontWeight:700,color:c}}>{v}</div>
            </div>))}
        </div>}
        <button onClick={dlCSV} style={{...bn(true),background:"#059669",marginBottom:12}}>CSV Indir</button>
        <div style={{maxHeight:600,overflowY:"auto",fontSize:11}}>
          {adminData.map((r,i)=>{
            const ex = expRow===i;
            return (<div key={i} style={{border:"1px solid #e5e7eb",borderRadius:8,marginBottom:8,overflow:"hidden"}}>
              <div onClick={()=>setExpRow(ex?null:i)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",cursor:"pointer",background:ex?"#f0f4ff":"#fafafa",flexWrap:"wrap"}}>
                <span style={{fontWeight:700,fontSize:10,minWidth:65}}>{r.pid?.slice(0,8)}</span>
                <span style={{fontSize:9,color:"#888",minWidth:85}}>{r.timestamp?.slice(0,16)}</span>
                <span style={{fontSize:9,background:"#e8e8f8",padding:"1px 6px",borderRadius:8}}>#{r.topic?.id} {r.topic?.subtopic}</span>
                <span style={{fontSize:9,color:"#888"}}>{r.profiling_rounds} soru</span>
                {["t1","t2","t3"].map(t=><span key={t} style={{fontSize:11,fontWeight:700,color:r.accuracy?.[t]?"#059669":"#dc2626"}}>{t.toUpperCase()}:{r.accuracy?.[t]?"Y":"N"}</span>)}
                <span style={{fontWeight:700,fontSize:12,marginLeft:"auto"}}>{r.accuracy?.total}/3</span>
                <span style={{fontSize:10,color:"#888"}}>{ex?"▲":"▼"}</span>
              </div>
              {ex && <div style={{padding:"12px 16px",background:"#fff",fontSize:11}}>
                {/* Winning */}
                <div style={{marginBottom:12,padding:"8px 12px",background:"#f0fdf4",borderRadius:6}}>
                  <div style={{fontWeight:700,fontSize:10,color:"#059669",marginBottom:4}}>Kazanan Hipotez</div>
                  <div>{r.winning_hypothesis?.label||r.profile?.hypothesis?.label} — {r.winning_hypothesis?.description||r.profile?.hypothesis?.description}</div>
                  <div style={{fontSize:10,color:"#555",marginTop:4}}>{r.profile?.summary}</div>
                </div>
                {/* Eliminated */}
                {r.eliminated_hypotheses?.length>0 && <div style={{marginBottom:12,padding:"8px 12px",background:"#fef2f2",borderRadius:6}}>
                  <div style={{fontWeight:700,fontSize:10,color:"#dc2626",marginBottom:4}}>Elenen Hipotezler</div>
                  {r.eliminated_hypotheses.map((eh,ei)=><div key={ei} style={{fontSize:10,marginBottom:2}}><b>R{eh.eliminated_at_round}:</b> {eh.label} — <span style={{color:"#888"}}>{eh.reason}</span></div>)}
                </div>}
                {/* Profiling */}
                <div style={{marginBottom:12}}>
                  <div style={{fontWeight:700,fontSize:10,color:"#6366f1",marginBottom:4}}>Profilleme Soruları</div>
                  {r.profiling_history?.map((ph,pi)=><div key={pi} style={{padding:"6px 0",borderBottom:"1px solid #f0f0f0",fontSize:10}}>
                    <div><b>S{ph.round}:</b> {ph.scenario}</div>
                    <div style={{color:"#444"}}>Cevap: <b>{ph.answer}</b> — {ph.answerText}</div>
                    {ph.reason && <div style={{color:"#888",fontStyle:"italic"}}>Gerekçe: &ldquo;{ph.reason}&rdquo;</div>}
                  </div>)}
                </div>
                {/* Test */}
                <div>
                  <div style={{fontWeight:700,fontSize:10,color:"#1a1a2e",marginBottom:4}}>Test Sonuçları</div>
                  {r.test_questions?.map((tq,ti)=><div key={ti} style={{padding:"6px 0",borderBottom:"1px solid #f0f0f0",fontSize:10}}>
                    <div>{tq.scenario}</div>
                    <div>Tahmin: <b>{tq.prediction}</b> (güven: {tq.confidence}) | Gerçek: <b>{tq.actual}</b> | <b style={{color:tq.correct?"#059669":"#dc2626"}}>{tq.correct?"DOĞRU":"YANLIŞ"}</b></div>
                    <div style={{color:"#888",fontSize:9}}>{tq.prediction_reasoning}</div>
                  </div>)}
                </div>
              </div>}
            </div>);
          })}
        </div>
        <button onClick={()=>{setPhase("welcome");setAdminData(null);setExpRow(null);}} style={{...bn(true),background:"#666",marginTop:12}}>Ankete Dön</button>
      </>}
    </div></div>);
  }

  if (phase==="admin_login") return (<div style={pg}><Head><title>Admin</title></Head><div style={cd}>
    <h2 style={{fontSize:18,margin:"0 0 12px"}}>Admin</h2>
    <input type="password" placeholder="Şifre" value={adminPw} onChange={e=>setAdminPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&adminPw===ADMIN_PASS)setPhase("admin");}} style={{width:"100%",padding:12,borderRadius:8,border:"1px solid #ddd",fontSize:14,boxSizing:"border-box"}}/>
    <button onClick={()=>{if(adminPw===ADMIN_PASS)setPhase("admin");else setError("Yanlış şifre");}} style={bn(true)}>Giriş</button>
    {error && <p style={{color:"#c00",fontSize:12,marginTop:8}}>{error}</p>}
  </div></div>);

  // ===== WELCOME =====
  if (phase==="welcome") return (<div style={pg}><Head><title>CognitWin</title></Head><div style={cd}>
    <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 8px"}}>Karar Verme Araştırması</h1>
    <p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>Bu çalışmada size çeşitli karar senaryoları sunulacak. Her senaryoda iki seçenekten birini tercih etmenizi ve nedenini kısaca açıklamanızı istiyoruz.</p>
    <p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>Sorular cevaplarınıza göre şekillenecek. Doğru ya da yanlış cevap yoktur.</p>
    <p style={{fontSize:13,color:"#999",margin:"0 0 16px"}}>Tahmini süre: 5-10 dakika</p>
    <button onClick={start} style={bn(true)}>Başla</button>
    <button onClick={()=>setPhase("admin_login")} style={{background:"none",border:"none",color:"#ddd",fontSize:10,cursor:"pointer",display:"block",margin:"12px auto 0"}}>admin</button>
  </div></div>);

  // ===== ERROR =====
  if (phase==="error") return (<div style={pg}><Head><title>CognitWin</title></Head><div style={cd}>
    <p style={{fontSize:14,color:"#c00",margin:"0 0 12px"}}>{error}</p>
    <button onClick={()=>{setPhase("welcome");setProfHist([]);setProfRound(0);setAnswer(null);setReason("");hypRef.current=[];}} style={bn(true)}>Başa Dön</button>
  </div></div>);

  // ===== PROFILING =====
  if (phase==="profiling"&&currentQ) return (<div style={pg}><Head><title>Soru {profRound}</title></Head>
    {bar}
    <div style={cd}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <p style={{fontSize:12,color:"#6366f1",fontWeight:600,margin:0}}>Soru {profRound}</p>
        {topic && <p style={{fontSize:10,color:"#999",margin:0,background:"#f3f4f6",padding:"2px 8px",borderRadius:10}}>#{topic.id} {topic.subtopic}</p>}
      </div>
      <h2 style={{fontSize:15,fontWeight:600,margin:"0 0 16px",lineHeight:1.6}}>{currentQ.scenario}</h2>
      <button onClick={()=>setAnswer("A")} style={op(answer==="A")}><b style={{marginRight:8}}>A.</b>{currentQ.option_a}</button>
      <button onClick={()=>setAnswer("B")} style={op(answer==="B")}><b style={{marginRight:8}}>B.</b>{currentQ.option_b}</button>
      {answer && <div style={{marginTop:14}}>
        <label style={{fontSize:14,fontWeight:500}}>Neden bu seçeneği tercih ettiniz?</label>
        <textarea style={ta} placeholder="Lütfen en az 20 karakter yazınız..." value={reason} onChange={e=>setReason(e.target.value)}/>
        <p style={{fontSize:11,color:reason.length>=20?"#059669":"#999",margin:"4px 0 0"}}>{reason.length} / min 20</p>
      </div>}
      <button onClick={submitProf} disabled={!ok} style={bn(ok)}>Devam</button>
    </div></div>);

  // ===== TEST =====
  if (phase==="test"&&testQs.length>0&&testIdx<testQs.length) {
    const tq = testQs[testIdx];
    return (<div style={pg}><Head><title>Test {testIdx+1}</title></Head>
      {bar}
      <div style={cd}>
        <p style={{fontSize:12,color:"#999",margin:"0 0 12px"}}>Test Sorusu {testIdx+1} / 3</p>
        <h2 style={{fontSize:15,fontWeight:600,margin:"0 0 16px",lineHeight:1.6}}>{tq.scenario}</h2>
        <button onClick={()=>setTestAns(p=>({...p,[testIdx]:"A"}))} style={op(testAns[testIdx]==="A")}><b style={{marginRight:8}}>A.</b>{tq.option_a}</button>
        <button onClick={()=>setTestAns(p=>({...p,[testIdx]:"B"}))} style={op(testAns[testIdx]==="B")}><b style={{marginRight:8}}>B.</b>{tq.option_b}</button>
        <button onClick={()=>{if(testIdx<2)setTestIdx(testIdx+1);else save();}} disabled={!testAns[testIdx]} style={bn(!!testAns[testIdx])}>{testIdx===2?"Tamamla":"Sonraki"}</button>
      </div></div>);
  }

  // ===== DONE =====
  if (phase==="done") return (<div style={pg}><Head><title>CognitWin</title></Head><div style={{...cd,textAlign:"center",padding:"36px 20px"}}>
    <div style={{fontSize:48,marginBottom:12}}>&#10004;&#65039;</div>
    <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 8px"}}>Teşekkürler!</h2>
    <p style={{fontSize:14,color:"#555",margin:"0 0 16px"}}>Cevaplarınız başarıyla kaydedildi.</p>
    <p style={{fontSize:12,color:"#999"}}>Katılımcı: {pid}</p>
  </div></div>);

  return <div style={pg}><div style={{...cd,textAlign:"center",padding:40}}><p>Yükleniyor...</p></div></div>;
}
