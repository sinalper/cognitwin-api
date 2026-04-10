import { useState, useRef } from "react";
import Head from "next/head";

const ADMIN_PASS = "cogni";
const TOTAL_CYCLES = 3;

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
    if (d.value) { try { used = typeof d.value === "string" ? JSON.parse(d.value) : (Array.isArray(d.value) ? d.value : []); } catch(_) { used = []; } }
    const available = TOPIC_LIST.filter(t => !used.includes(t.id));
    const pool = available.length > 0 ? available : TOPIC_LIST;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const newUsed = available.length > 0 ? [...used, chosen.id] : [chosen.id];
    await fetch("/api/data", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({key:"_used_topics",value:JSON.stringify(newUsed)}) });
    return chosen;
  } catch(e) { return TOPIC_LIST[Math.floor(Math.random() * TOPIC_LIST.length)]; }
}

const SYS_INIT = `You are conducting a FALSIFICATIONIST cognitive profiling assessment. Your goal is to understand HOW a participant thinks by generating hypotheses about their reasoning patterns and then systematically trying to DISPROVE them.

You will be given a SPECIFIC topic. You MUST use this exact topic.

METHODOLOGY — FALSIFICATION (Popperian approach):
- You do NOT try to confirm hypotheses. You try to FALSIFY them.
- Each hypothesis makes PREDICTIONS about how the participant would answer.
- If the participant's answer CONTRADICTS a hypothesis's prediction, that hypothesis is weakened or eliminated.
- A hypothesis that SURVIVES repeated falsification attempts is the winner.
- You are looking for reasoning PATTERNS (how they think), not preferences (what they think).

YOUR TASK:
1. Generate a binary (A/B) scenario question in Turkish about the given subtopic
   - Realistic dilemma, clear everyday Turkish
   - Options should reveal different REASONING STYLES
2. Generate hypotheses about possible reasoning patterns
   - Include ALL patterns you consider plausible — do not artificially limit the number
   - Each hypothesis must make a clear, testable PREDICTION (A or B) for this question
   - Each hypothesis describes a WAY OF THINKING

RESPOND WITH ONLY VALID JSON (no markdown):
{"category":"given category","subtopic":"given subtopic","question":{"scenario":"Turkish 2-3 sentences","option_a":"Turkish","option_b":"Turkish"},"hypotheses":[{"id":"H1","label":"Short English label","description":"English reasoning pattern","prediction":"A or B"},{"id":"H2","label":"...","description":"...","prediction":"A or B"}]}`;

const SYS_UPDATE = `You are continuing a FALSIFICATIONIST cognitive profiling session.

FALSIFICATION RULES (STRICT):

1. For EACH alive hypothesis, evaluate: does the participant's answer + explanation CONTRADICT this hypothesis's prediction?

2. Assign ONE verdict per alive hypothesis:
   - "clear_contradiction": Answer directly and unambiguously contradicts the prediction. Both choice AND explanation incompatible. → HARD STRIKE.
   - "partial_contradiction": Answer somewhat conflicts — choice matches but reasoning doesn't, or vice versa. → SOFT STRIKE.
   - "no_contradiction": Answer compatible with hypothesis. → NO STRIKE.

3. ELIMINATION RULES (RIGID):
   - 1 clear_contradiction → IMMEDIATELY ELIMINATED
   - 2 strikes of any kind → ELIMINATED
   - "no_contradiction" = 0 strikes, hypothesis just survives (does NOT get stronger)

4. After updating:
   - 1 hypothesis alive → "sole_survivor": true
   - 0 alive → "all_eliminated": true (generate up to 3 NEW hypotheses)
   - 2+ alive → generate next question to FALSIFY one of them

5. QUESTION DESIGN: Pick one alive hypothesis. "If this is true, participant answers Y in scenario X." Design scenario X so contradiction is testable.

RESPOND WITH ONLY VALID JSON:
{"hypothesis_updates":[{"id":"H1","label":"...","status":"alive|eliminated","verdict":"clear_contradiction|partial_contradiction|no_contradiction","strikes_before":0,"strikes_after":0,"evidence":"Why, referencing choice AND explanation"}],"new_hypotheses":[],"alive_count":2,"sole_survivor":false,"all_eliminated":false,"reasoning":"What was learned","next_question":{"scenario":"Turkish (null if sole_survivor)","option_a":"Turkish","option_b":"Turkish","target_hypothesis":"Which hypothesis to falsify","falsification_logic":"If H is true, should answer Y. If answers Z, H is falsified."}}`;

const SYS_FINAL = `You are completing a FALSIFICATIONIST cognitive profiling session.

TASK:
1. State WINNING hypothesis (survived falsification)
2. List ALL eliminated hypotheses with round, verdict, evidence
3. Summarize reasoning style (2-3 sentences English)
4. Generate exactly 3 TEST questions — same subtopic, different aspects, Turkish A/B
5. Predict answers based on winning hypothesis, confidence 0.0-1.0

RESPOND WITH ONLY VALID JSON:
{"participant_profile":"2-3 sentences English","winning_hypothesis":{"id":"...","label":"...","description":"...","strikes":0},"eliminated_hypotheses":[{"id":"...","label":"...","eliminated_at_round":1,"total_strikes":1,"kill_shot":"clear_contradiction|second_strike","evidence":"..."}],"test_questions":[{"id":"T1","scenario":"Turkish","option_a":"Turkish","option_b":"Turkish","prediction":"A or B","confidence":0.75,"prediction_reasoning":"English"},{"id":"T2","scenario":"Turkish","option_a":"Turkish","option_b":"Turkish","prediction":"A or B","confidence":0.7,"prediction_reasoning":"..."},{"id":"T3","scenario":"Turkish","option_a":"Turkish","option_b":"Turkish","prediction":"A or B","confidence":0.7,"prediction_reasoning":"..."}]}`;

async function callAPI(s,p){const r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:s,prompt:p})});const d=await r.json();if(d.error)throw new Error(typeof d.error==="string"?d.error:d.error.message||JSON.stringify(d.error));const t=(d.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();return JSON.parse(t)}
async function saveData(k,v){await fetch("/api/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:k,value:v})})}
async function loadData(k){const r=await fetch("/api/data?key="+encodeURIComponent(k));const d=await r.json();return d.value}
async function listKeys(){const r=await fetch("/api/data");const d=await r.json();return d.keys||[]}

export default function Home() {
  const [phase, setPhase] = useState("welcome");
  // Cycle state
  const [cycle, setCycle] = useState(1);
  const [cycleResults, setCycleResults] = useState([]);
  // Current cycle state
  const [topic, setTopic] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [reason, setReason] = useState("");
  const [profHist, setProfHist] = useState([]);
  const [profRound, setProfRound] = useState(0);
  const [hypotheses, setHypotheses] = useState([]);
  const [testQs, setTestQs] = useState([]);
  const [testIdx, setTestIdx] = useState(0);
  const [testAns, setTestAns] = useState({});
  const [profile, setProfile] = useState(null);
  const [elimLog, setElimLog] = useState([]);
  const [pid] = useState("P"+Date.now().toString(36)+Math.random().toString(36).slice(2,5));
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [adminPw, setAdminPw] = useState("");
  const [expRow, setExpRow] = useState(null);
  const fullLog = useRef([]);

  const resetCycleState = () => {
    setTopic(null); setCurrentQ(null); setAnswer(null); setReason("");
    setProfHist([]); setProfRound(0); setHypotheses([]);
    setTestQs([]); setTestIdx(0); setTestAns({});
    setProfile(null); setElimLog([]); fullLog.current = [];
  };

  // ===== START CYCLE =====
  const startCycle = async () => {
    setLoading(true); setLoadMsg("Konu "+cycle+"/"+TOTAL_CYCLES+" seçiliyor..."); setError(null);
    try {
      const chosen = await getRandomTopic();
      const prompt = "ASSIGNED TOPIC (you MUST use this):\nID: "+chosen.id+"\nCategory: "+chosen.cat+"\nSubtopic: "+chosen.sub+"\n\nGenerate the first profiling question and your initial hypotheses.";
      const result = await callAPI(SYS_INIT, prompt);
      setTopic({id:chosen.id, category:chosen.cat, subtopic:chosen.sub});
      setCurrentQ(result.question);
      const initHyps = result.hypotheses.map(h=>({...h,status:"alive",strikes:0}));
      setHypotheses(initHyps);
      fullLog.current = [{round:0,type:"init",hypotheses:initHyps,question:result.question}];
      setProfRound(1);
      setPhase("profiling");
    } catch(e) { setError("Bağlantı hatası: "+e.message); setPhase("error"); }
    setLoading(false);
  };

  // ===== SUBMIT PROFILING =====
  const submitProf = async () => {
    const cText = answer==="A"?currentQ.option_a:currentQ.option_b;
    const entry = {round:profRound, scenario:currentQ.scenario, option_a:currentQ.option_a, option_b:currentQ.option_b, answer, answerText:cText, reason};
    const newHist = [...profHist, entry];
    setProfHist(newHist); setAnswer(null); setReason("");
    const aliveHyps = hypotheses.filter(h=>h.status==="alive");

    if (profRound >= 5) { await genTest(newHist, hypotheses); return; }

    setLoading(true); setLoadMsg("Hipotezler test ediliyor..."); setError(null);
    try {
      let p = "TOPIC: "+topic.category+" > "+topic.subtopic+" (ID:"+topic.id+")\n\nFULL PROFILING HISTORY:\n";
      newHist.forEach(h=>{ p+="Round "+h.round+":\n  Q: \""+h.scenario+"\"\n  A: "+h.option_a+"\n  B: "+h.option_b+"\n  Choice: "+h.answer+" (\""+h.answerText+"\")\n  Explanation: \""+h.reason+"\"\n\n"; });
      p+="CURRENT ALIVE HYPOTHESES:\n";
      aliveHyps.forEach(h=>{ p+="  "+h.id+" ["+h.label+"] strikes="+h.strikes+" prediction="+h.prediction+": "+h.description+"\n"; });
      p+="\nROUND "+profRound+": Evaluate each alive hypothesis against the LATEST answer. Apply falsification rules strictly.";

      const result = await callAPI(SYS_UPDATE, p);

      let updatedHyps = hypotheses.map(h=>{
        if(h.status==="eliminated") return h;
        const u = (result.hypothesis_updates||[]).find(u=>u.id===h.id);
        if(!u) return h;
        return {...h, strikes: u.strikes_after!=null?u.strikes_after:h.strikes, status: u.status==="eliminated"?"eliminated":"alive"};
      });

      const newElims = (result.hypothesis_updates||[]).filter(u=>u.status==="eliminated").map(u=>({id:u.id,label:u.label,round:profRound,verdict:u.verdict,evidence:u.evidence,strikes:u.strikes_after}));
      const updatedElimLog = [...elimLog, ...newElims];
      setElimLog(updatedElimLog);

      if (result.all_eliminated && result.new_hypotheses?.length) {
        updatedHyps = [...updatedHyps, ...result.new_hypotheses.map(h=>({...h,status:"alive",strikes:0}))];
      }

      setHypotheses(updatedHyps);
      fullLog.current.push({round:profRound,type:"update",updates:result.hypothesis_updates,new_hyps:result.new_hypotheses,reasoning:result.reasoning});

      const aliveAfter = updatedHyps.filter(h=>h.status==="alive");
      if (result.sole_survivor || aliveAfter.length===1 || profRound>=5) { await genTest(newHist, updatedHyps); return; }

      if (result.next_question?.scenario) {
        fullLog.current[fullLog.current.length-1].target = result.next_question.target_hypothesis;
        setCurrentQ(result.next_question);
        setProfRound(profRound+1);
      } else { await genTest(newHist, updatedHyps); return; }
    } catch(e) { setError("Güncelleme hatası: "+e.message); await genTest(newHist, hypotheses); }
    setLoading(false);
  };

  // ===== GENERATE TEST =====
  const genTest = async (hist, hyps) => {
    setLoading(true); setLoadMsg("Test soruları oluşturuluyor..."); setError(null);
    try {
      const alive = hyps.filter(h=>h.status==="alive");
      const winner = alive.length>0 ? alive.reduce((a,b)=>a.strikes<=b.strikes?a:b) : hyps.reduce((a,b)=>(a.strikes||99)<=(b.strikes||99)?a:b);

      let p = "TOPIC: "+topic.category+" > "+topic.subtopic+"\n\nCOMPLETE PROFILING:\n";
      hist.forEach(h=>{ p+="Round "+h.round+": Q=\""+h.scenario+"\" → "+h.answer+" Explanation: \""+h.reason+"\"\n"; });
      p+="\nFINAL STATE:\n";
      hyps.forEach(h=>{ p+="  "+h.id+" ["+h.label+"] status="+h.status+" strikes="+h.strikes+"\n"; });
      p+="\nSURVIVOR: "+winner.id+" ["+winner.label+"]\nELIMINATION LOG:\n";
      elimLog.forEach(e=>{ p+="  "+e.id+" eliminated round "+e.round+" by "+e.verdict+"\n"; });
      p+="\nGenerate profile, elimination report, and 3 test questions about "+topic.subtopic+".";

      const result = await callAPI(SYS_FINAL, p);
      setTestQs(result.test_questions);
      setProfile({summary:result.participant_profile, hypothesis:result.winning_hypothesis});
      if (result.eliminated_hypotheses) setElimLog(result.eliminated_hypotheses);
      setTestIdx(0); setPhase("test");
    } catch(e) { setError("Test oluşturulamadı: "+e.message); setPhase("error"); }
    setLoading(false);
  };

  // ===== FINISH CYCLE =====
  const finishCycle = () => {
    const acc = testQs.map((t,i)=>t.prediction===testAns[i]?1:0);
    const cycleData = {
      cycle, topic, profiling_rounds:profHist.length, profiling_history:profHist,
      hypotheses_initial: fullLog.current[0]?.hypotheses||[],
      hypotheses_final: hypotheses, elimination_log: elimLog, full_log: [...fullLog.current],
      profile, winning_hypothesis: profile?.hypothesis,
      test_questions: testQs.map((t,i)=>({...t, actual:testAns[i], correct:acc[i]})),
      accuracy: {t1:acc[0], t2:acc[1], t3:acc[2], total:acc[0]+acc[1]+acc[2]}
    };
    const newResults = [...cycleResults, cycleData];
    setCycleResults(newResults);

    if (cycle < TOTAL_CYCLES) {
      resetCycleState();
      setCycle(cycle+1);
      setPhase("cycle_transition");
    } else {
      saveAll(newResults);
    }
  };

  // ===== SAVE ALL =====
  const saveAll = async (results) => {
    const totalAcc = results.reduce((s,r)=>s+r.accuracy.total,0);
    const data = {
      pid, timestamp: new Date().toISOString(),
      total_cycles: TOTAL_CYCLES,
      cycles: results,
      overall_accuracy: { correct: totalAcc, total: TOTAL_CYCLES*3, pct: Math.round(totalAcc/(TOTAL_CYCLES*3)*100) }
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
        if(v) { try { all.push(typeof v==="string"?JSON.parse(v):v); } catch(_){} }
      }
      all.sort((a,b)=>(a.timestamp||"").localeCompare(b.timestamp||""));
      setAdminData(all);
    } catch(e) { setError(e.message); }
  };

  const dlCSV = () => {
    if (!adminData?.length) return;
    const f=["pid","timestamp","cycle","topic_id","subtopic","profiling_rounds","initial_hyp_count","eliminated_count","winner","T1_pred","T1_actual","T1_ok","T2_pred","T2_actual","T2_ok","T3_pred","T3_actual","T3_ok","cycle_score","overall_score","overall_pct"];
    const rows = [];
    adminData.forEach(r=>{
      (r.cycles||[]).forEach(c=>{
        rows.push([
          r.pid, r.timestamp, c.cycle, c.topic?.id||"",
          '"'+(c.topic?.subtopic||"").replace(/"/g,'""')+'"',
          c.profiling_rounds, (c.hypotheses_initial||[]).length, (c.elimination_log||[]).length,
          '"'+(c.winning_hypothesis?.label||c.profile?.hypothesis?.label||"").replace(/"/g,'""')+'"',
          c.test_questions?.[0]?.prediction, c.test_questions?.[0]?.actual, c.accuracy?.t1,
          c.test_questions?.[1]?.prediction, c.test_questions?.[1]?.actual, c.accuracy?.t2,
          c.test_questions?.[2]?.prediction, c.test_questions?.[2]?.actual, c.accuracy?.t3,
          c.accuracy?.total, r.overall_accuracy?.correct, r.overall_accuracy?.pct+"%"
        ].join(","));
      });
    });
    const csv = "\uFEFF"+f.join(",")+"\n"+rows.join("\n");
    const b = new Blob([csv],{type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(b); a.download="cognitwin_data.csv"; a.click();
  };

  // ===== STYLES =====
  const pg={fontFamily:"'Segoe UI',system-ui,sans-serif",maxWidth:640,margin:"0 auto",padding:"20px 16px",minHeight:"100vh",color:"#1a1a2e"};
  const cd={background:"#fff",borderRadius:12,padding:"24px 20px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",marginBottom:16};
  const bn=on=>({display:"block",width:"100%",padding:"12px 20px",borderRadius:8,border:"none",fontSize:14,fontWeight:600,cursor:on?"pointer":"default",background:on?"#1a1a2e":"#ccc",color:"#fff",marginTop:14});
  const op=sel=>({display:"block",width:"100%",padding:"14px 16px",borderRadius:8,border:sel?"2px solid #1a1a2e":"2px solid #e5e5e5",background:sel?"#f0f0ff":"#fafafa",fontSize:14,cursor:"pointer",textAlign:"left",marginBottom:8,fontWeight:sel?600:400,boxSizing:"border-box"});
  const ta={width:"100%",minHeight:70,padding:12,borderRadius:8,border:"1px solid #ddd",fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",marginTop:8};

  const totalSteps = TOTAL_CYCLES * 8;
  const cycleOffset = (cycle-1)*8;
  const stepInCycle = phase==="profiling"?profRound:phase==="test"?5+testIdx+1:phase==="cycle_transition"||phase==="done"?8:0;
  const pct = Math.min(((cycleOffset+stepInCycle)/totalSteps)*100,100);
  const bar=<div style={{height:4,background:"#e8e8e8",borderRadius:2,marginBottom:20,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"#1a1a2e",borderRadius:2,transition:"width .4s"}}/></div>;
  const ok = answer && reason.length>=20;

  // ===== LOADING =====
  if(loading) return(<div style={pg}><Head><title>CogniTwin</title></Head>{bar}
    <div style={{...cd,textAlign:"center",padding:"48px 24px"}}>
      <div style={{width:40,height:40,border:"4px solid #e8e8e8",borderTopColor:"#1a1a2e",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{fontSize:15,fontWeight:600,margin:"0 0 6px"}}>{loadMsg}</p>
      <p style={{fontSize:12,color:"#999",margin:0}}>Bu işlem birkaç saniye sürebilir</p>
    </div></div>);

  // ===== ADMIN =====
  if(phase==="admin"){
    const ag=adminData?{n:adminData.length,
      correct:adminData.reduce((s,r)=>s+(r.overall_accuracy?.correct||0),0),
      total:adminData.length*TOTAL_CYCLES*3,
      avgR:adminData.length?(adminData.reduce((s,r)=>s+((r.cycles||[]).reduce((ss,c)=>ss+(c.profiling_rounds||0),0)),0)/(adminData.length*TOTAL_CYCLES)).toFixed(1):0
    }:null;
    return(<div style={{...pg,maxWidth:1200}}><Head><title>Admin</title></Head><div style={cd}>
      <h2 style={{fontSize:18,margin:"0 0 16px"}}>Admin Panel — 3-Konu Falsification</h2>
      {!adminData && <button onClick={loadAdmin} style={bn(true)}>Verileri Yukle</button>}
      {adminData && <>
        {ag&&ag.n>0 && <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          {[["Katılımcı",ag.n,"#1a1a2e"],["Overall",ag.total>0?Math.round(ag.correct/ag.total*100)+"%":"—","#059669"],["Ort.Soru/Konu",ag.avgR,"#6366f1"]].map(([l,v,c])=>(
            <div key={l} style={{background:"#f8f9fa",borderRadius:8,padding:"10px 14px",flex:"1 1 80px",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#888"}}>{l}</div>
              <div style={{fontSize:22,fontWeight:700,color:c}}>{v}</div>
            </div>))}
        </div>}
        <button onClick={dlCSV} style={{...bn(true),background:"#059669",marginBottom:12}}>CSV Indir</button>
        <div style={{maxHeight:600,overflowY:"auto",fontSize:11}}>
          {adminData.map((r,i)=>{
            const ex=expRow===i;
            return(<div key={i} style={{border:"1px solid #e5e7eb",borderRadius:8,marginBottom:8,overflow:"hidden"}}>
              <div onClick={()=>setExpRow(ex?null:i)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",cursor:"pointer",background:ex?"#f0f4ff":"#fafafa",flexWrap:"wrap"}}>
                <span style={{fontWeight:700,fontSize:10,minWidth:65}}>{r.pid?.slice(0,8)}</span>
                <span style={{fontSize:9,color:"#888",minWidth:85}}>{r.timestamp?.slice(0,16)}</span>
                <span style={{fontSize:10,fontWeight:700,color:"#1a1a2e"}}>{r.overall_accuracy?.correct}/{r.overall_accuracy?.total} ({r.overall_accuracy?.pct}%)</span>
                <span style={{fontSize:10,color:"#888"}}>{ex?"▲":"▼"}</span>
              </div>
              {ex && <div style={{padding:"12px 16px",background:"#fff",fontSize:11}}>
                {(r.cycles||[]).map((c,ci)=>(
                  <div key={ci} style={{marginBottom:16,padding:"10px 12px",background:ci%2?"#fafafa":"#fff",borderRadius:8,border:"1px solid #eee"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontWeight:700,fontSize:12,color:"#6366f1"}}>Konu {c.cycle}: #{c.topic?.id} {c.topic?.subtopic}</span>
                      <span style={{fontWeight:700,fontSize:12,color:c.accuracy?.total>=2?"#059669":"#dc2626"}}>{c.accuracy?.total}/3</span>
                    </div>
                    {/* Winner */}
                    <div style={{marginBottom:8,padding:"6px 10px",background:"#f0fdf4",borderRadius:6}}>
                      <div style={{fontWeight:700,fontSize:9,color:"#059669"}}>Hayatta Kalan</div>
                      <div style={{fontSize:10}}>{c.winning_hypothesis?.label||c.profile?.hypothesis?.label} — {c.winning_hypothesis?.description||c.profile?.hypothesis?.description}</div>
                      <div style={{fontSize:9,color:"#555",marginTop:2}}>{c.profile?.summary}</div>
                    </div>
                    {/* Eliminated */}
                    {(c.elimination_log||[]).length>0 && <div style={{marginBottom:8,padding:"6px 10px",background:"#fef2f2",borderRadius:6}}>
                      <div style={{fontWeight:700,fontSize:9,color:"#dc2626"}}>Elenen ({(c.elimination_log||[]).length})</div>
                      {(c.elimination_log||[]).map((el,ei)=><div key={ei} style={{fontSize:9,marginBottom:2}}><b>{el.id}</b> [{el.label}] R{el.round||el.eliminated_at_round} — {el.verdict||el.kill_shot}</div>)}
                    </div>}
                    {/* Profiling */}
                    <div style={{marginBottom:8}}>
                      <div style={{fontWeight:700,fontSize:9,color:"#6366f1"}}>Profilleme ({c.profiling_rounds} soru)</div>
                      {c.profiling_history?.map((ph,pi)=><div key={pi} style={{fontSize:9,padding:"3px 0",borderBottom:"1px solid #f0f0f0"}}>
                        <b>S{ph.round}:</b> {ph.scenario?.slice(0,80)}... → <b>{ph.answer}</b>
                        {ph.reason && <span style={{color:"#888"}}> — &ldquo;{ph.reason.slice(0,60)}...&rdquo;</span>}
                      </div>)}
                    </div>
                    {/* Tests */}
                    <div>
                      <div style={{fontWeight:700,fontSize:9,color:"#1a1a2e"}}>Test</div>
                      {c.test_questions?.map((tq,ti)=><div key={ti} style={{fontSize:9,padding:"3px 0",borderBottom:"1px solid #f0f0f0"}}>
                        {tq.scenario?.slice(0,60)}... Tahmin:<b>{tq.prediction}</b> Gerçek:<b>{tq.actual}</b> <b style={{color:tq.correct?"#059669":"#dc2626"}}>{tq.correct?"✓":"✗"}</b>
                      </div>)}
                    </div>
                  </div>
                ))}
              </div>}
            </div>);
          })}
        </div>
        <button onClick={()=>{setPhase("welcome");setAdminData(null);setExpRow(null);}} style={{...bn(true),background:"#666",marginTop:12}}>Ankete Dön</button>
      </>}
    </div></div>);
  }

  if(phase==="admin_login") return(<div style={pg}><Head><title>Admin</title></Head><div style={cd}>
    <h2 style={{fontSize:18,margin:"0 0 12px"}}>Admin</h2>
    <input type="password" placeholder="Şifre" value={adminPw} onChange={e=>setAdminPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&adminPw===ADMIN_PASS)setPhase("admin");}} style={{width:"100%",padding:12,borderRadius:8,border:"1px solid #ddd",fontSize:14,boxSizing:"border-box"}}/>
    <button onClick={()=>{if(adminPw===ADMIN_PASS)setPhase("admin");else setError("Yanlış şifre");}} style={bn(true)}>Giriş</button>
    {error && <p style={{color:"#c00",fontSize:12,marginTop:8}}>{error}</p>}
  </div></div>);

  // ===== WELCOME =====
  if(phase==="welcome") return(<div style={pg}><Head><title>CogniTwin</title></Head><div style={cd}>
    <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 8px"}}>Karar Verme Araştırması</h1>
    <p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>Bu çalışmada size 3 farklı konuda karar senaryoları sunulacak. Her senaryoda iki seçenekten birini tercih etmenizi ve nedenini kısaca açıklamanızı istiyoruz.</p>
    <p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>Her konu için sorular cevaplarınıza göre şekillenecek. Doğru ya da yanlış cevap yoktur.</p>
    <p style={{fontSize:13,color:"#999",margin:"0 0 16px"}}>Tahmini süre: 15-25 dakika</p>
    <button onClick={startCycle} style={bn(true)}>Başla</button>
    <button onClick={()=>setPhase("admin_login")} style={{background:"none",border:"none",color:"#ddd",fontSize:10,cursor:"pointer",display:"block",margin:"12px auto 0"}}>admin</button>
  </div></div>);

  // ===== CYCLE TRANSITION =====
  if(phase==="cycle_transition") {
    const prev = cycleResults[cycleResults.length-1];
    return(<div style={pg}><Head><title>CogniTwin</title></Head>{bar}
      <div style={cd}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <p style={{fontSize:13,color:"#059669",fontWeight:600,margin:"0 0 4px"}}>Konu {cycle-1}/{TOTAL_CYCLES} tamamlandı</p>
          <p style={{fontSize:12,color:"#888",margin:0}}>Skor: {prev?.accuracy?.total}/3</p>
        </div>
        <div style={{background:"#f8f9fa",borderRadius:8,padding:"12px 16px",marginBottom:16}}>
          <p style={{fontSize:13,color:"#555",margin:0}}>Şimdi yeni bir konuya geçiyoruz. Kalan: {TOTAL_CYCLES-cycle+1} konu</p>
        </div>
        <button onClick={startCycle} style={bn(true)}>Sonraki Konuya Geç</button>
      </div>
    </div>);
  }

  // ===== ERROR =====
  if(phase==="error") return(<div style={pg}><Head><title>CogniTwin</title></Head><div style={cd}>
    <p style={{fontSize:14,color:"#c00",margin:"0 0 12px"}}>{error}</p>
    <button onClick={()=>{setPhase("welcome");resetCycleState();setCycle(1);setCycleResults([]);}} style={bn(true)}>Başa Dön</button>
  </div></div>);

  // ===== PROFILING =====
  if(phase==="profiling"&&currentQ){
    const alive=hypotheses.filter(h=>h.status==="alive").length;
    return(<div style={pg}><Head><title>Konu {cycle} - Soru {profRound}</title></Head>
      {bar}
      <div style={cd}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <p style={{fontSize:12,color:"#6366f1",fontWeight:600,margin:0}}>Konu {cycle}/{TOTAL_CYCLES} — Soru {profRound}</p>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:9,color:"#999",background:"#f3f4f6",padding:"2px 8px",borderRadius:10}}>{topic?.subtopic}</span>
            <span style={{fontSize:9,color:"#6366f1",background:"#f0f0ff",padding:"2px 6px",borderRadius:10}}>{alive}h</span>
          </div>
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
  }

  // ===== TEST =====
  if(phase==="test"&&testQs.length>0&&testIdx<testQs.length){
    const tq=testQs[testIdx];
    return(<div style={pg}><Head><title>Konu {cycle} - Test {testIdx+1}</title></Head>
      {bar}
      <div style={cd}>
        <p style={{fontSize:12,color:"#999",margin:"0 0 12px"}}>Konu {cycle}/{TOTAL_CYCLES} — Test {testIdx+1}/3</p>
        <h2 style={{fontSize:15,fontWeight:600,margin:"0 0 16px",lineHeight:1.6}}>{tq.scenario}</h2>
        <button onClick={()=>setTestAns(p=>({...p,[testIdx]:"A"}))} style={op(testAns[testIdx]==="A")}><b style={{marginRight:8}}>A.</b>{tq.option_a}</button>
        <button onClick={()=>setTestAns(p=>({...p,[testIdx]:"B"}))} style={op(testAns[testIdx]==="B")}><b style={{marginRight:8}}>B.</b>{tq.option_b}</button>
        <button onClick={()=>{if(testIdx<2)setTestIdx(testIdx+1);else finishCycle();}} disabled={!testAns[testIdx]} style={bn(!!testAns[testIdx])}>{testIdx===2?(cycle<TOTAL_CYCLES?"Konuyu Tamamla":"Anketi Tamamla"):"Sonraki"}</button>
      </div></div>);
  }

  // ===== DONE =====
  if(phase==="done"){
    const totalCorrect = cycleResults.reduce((s,c)=>s+c.accuracy.total,0);
    return(<div style={pg}><Head><title>CogniTwin</title></Head><div style={{...cd,textAlign:"center",padding:"36px 20px"}}>
      <div style={{fontSize:48,marginBottom:12}}>&#10004;&#65039;</div>
      <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 8px"}}>Teşekkürler!</h2>
      <p style={{fontSize:14,color:"#555",margin:"0 0 12px"}}>3 konudaki cevaplarınız başarıyla kaydedildi.</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:12}}>
        {cycleResults.map((c,i)=>(
          <div key={i} style={{background:"#f8f9fa",borderRadius:8,padding:"8px 12px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#888"}}>Konu {i+1}</div>
            <div style={{fontSize:9,color:"#999"}}>{c.topic?.subtopic}</div>
            <div style={{fontSize:16,fontWeight:700,color:c.accuracy.total>=2?"#059669":"#dc2626"}}>{c.accuracy.total}/3</div>
          </div>
        ))}
      </div>
      <p style={{fontSize:12,color:"#999"}}>Katılımcı: {pid}</p>
    </div></div>);
  }

  return <div style={pg}><div style={{...cd,textAlign:"center",padding:40}}><p>Yükleniyor...</p></div></div>;
}
