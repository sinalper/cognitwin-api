import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const ADMIN_PASS = "cogni";

const QUESTIONS = [
  { id:"Q23", text:"Bir etkinlikte size iki seçenek sunuluyor. Hangisini tercih edersiniz?", o1:"150 TL'yi kesin olarak almak", o2:"%40 ihtimalle 500 TL kazanmak, %60 ihtimalle hiçbir şey kazanmamak", open:"Q24" },
  { id:"Q25", text:"Çalıştığınız yerde size iki fırsat sunuluyor. Hangisini tercih edersiniz?", o1:"Başarılı olursanız daha yüksek maaş alacağınız ama başarısız olursanız mevcut konumunuzu kaybedebileceğiniz bir pozisyona geçmek", o2:"Maaşı sabit ve garanti olan mevcut pozisyonda kalmak", open:"Q26" },
  { id:"Q27", text:"Bir spor turnuvasına katıldığınızı düşünün. Hangisini tercih edersiniz?", o1:"Daha zayıf rakiplerle oynayıp küçük ama kesin bir ödül almak", o2:"Daha güçlü rakiplerle oynayıp büyük ödül kazanma şansı elde etmek ama erken elenme ihtimali olmak", open:"Q28" },
  { id:"Q29", text:"Yeni çıkan bir teknoloji ürünü var. Hangisini tercih edersiniz?", o1:"Ürünü erken sipariş verip indirimli fiyata almak ama sorun çıkma ihtimalini kabul etmek", o2:"Ürünü kullananların yorumlarını bekleyip daha sonra normal fiyatla satın almak", open:"Q30" },
  { id:"Q31", text:"Bir tatil planlıyorsunuz. Aynı otelde kalacaksınız. Hangisini tercih edersiniz?", o1:"Daha pahalı ama güvenilir ve sorunsuz olduğu bilinen aracı firmayı seçmek", o2:"Daha ucuz ama son anda rezervasyon iptali yaşanma ihtimali olan aracı firmayı seçmek", open:"Q32" }
];

const TEST_QS = [
  { id:"Q33", text:"Birine kahve içmeyi teklif edeceksiniz. Hangisini tercih edersiniz?", o1:"Sizinle kahve içmeyi büyük ihtimalle kabul edecek biri", o2:"Sizi daha çok heyecanlandıran ama kabul edip etmeyeceğinden emin olmadığınız biri" },
  { id:"Q34", text:"Bir toplantıda söz alacaksınız. Hangisini tercih edersiniz?", o1:"Başarılı olursa büyük etki yaratabilecek ama eleştirilme ihtimali olan yeni bir fikir söylemek", o2:"Daha önce denenmiş ve güvenli bir fikri söylemek" },
  { id:"Q35", text:"Elinizde bir miktar para var. Hangisini tercih edersiniz?", o1:"Daha yüksek kazanç ihtimali olan ama zarar etme riski bulunan bir yere yatırmak", o2:"Parayı düşük getirili ama garanti bir hesapta tutmak" }
];

const SYS_INITIAL = `You are a behavioral psychologist conducting an adaptive risk assessment. A participant answered 5 risk scenarios (choice + Turkish justification). Predict their answers to 3 TEST scenarios.

TEST SCENARIOS (participant has NOT seen these):
Q33 (Social): Invite someone for coffee. 1=Someone likely to accept (safe) 2=Someone exciting but uncertain (risky)
Q34 (Professional): Speak in a meeting. 1=Bold new idea, risks criticism (risky) 2=Safe, tested idea (safe)
Q35 (Financial): Allocate money. 1=Higher return but risk of loss (risky) 2=Low-return guaranteed account (safe)

TASK:
1. Analyze reasoning PATTERNS
2. Generate 2-3 competing hypotheses per test question
3. Identify what you CANNOT distinguish
4. Generate ONE adaptive question (Turkish, binary A/B) that discriminates hypotheses

RULES FOR ADAPTIVE QUESTIONS:
- Binary A/B choice in Turkish
- Must NOT overlap with: financial gamble, career change, sports competition, tech purchase, travel booking, coffee invitation, meeting speaking, investment
- Target the AMBIGUITY ZONE

JSON ONLY:
{"hypotheses":{"Q33":[{"prediction":1,"label":"...","reasoning":"..."},{"prediction":2,"label":"...","reasoning":"..."}],"Q34":[...],"Q35":[...]},"undecidable":"...","adaptive_question":{"scenario":"Turkish","option_a":"Turkish","option_b":"Turkish","discrimination_logic":"English"}}`;

const SYS_UPDATE = `You are continuing an adaptive risk assessment. Update hypotheses based on the latest answer.

TEST SCENARIOS:
Q33: 1=safe 2=risky | Q34: 1=risky 2=safe | Q35: 1=risky 2=safe

Update each hypothesis status. If no reasonable doubt remains for ALL 3 predictions, set ready=true. Otherwise generate another adaptive question (Turkish, A/B, no topic overlap).

JSON ONLY:
{"hypothesis_updates":{"Q33":[{"prediction":1,"label":"...","status":"eliminated|weakened|unchanged|strengthened","evidence":"..."}],"Q34":[...],"Q35":[...]},"ready":true_or_false,"confidence_summary":"...","adaptive_question":{"scenario":"Turkish or null","option_a":"...","option_b":"...","discrimination_logic":"..."}}`;

const SYS_FINAL = `Make final predictions based on ALL evidence.
Q33: 1=safe 2=risky | Q34: 1=risky 2=safe | Q35: 1=risky 2=safe

JSON ONLY:
{"predictions":{"Q33":{"prediction":1,"confidence":0.75,"reasoning":"..."},"Q34":{"prediction":1,"confidence":0.6,"reasoning":"..."},"Q35":{"prediction":2,"confidence":0.85,"reasoning":"..."}},"participant_profile":"2-3 sentences","adaptive_questions_impact":"1-2 sentences"}`;

async function callAPI(system, prompt) {
  const r = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, prompt })
  });
  const d = await r.json();
  if (d.error) throw new Error(typeof d.error === 'string' ? d.error : d.error.message || JSON.stringify(d.error));
  const txt = (d.content || []).map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(txt);
}

async function saveData(key, value) {
  await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value })
  });
}

async function loadData(key) {
  const r = await fetch("/api/data?key=" + encodeURIComponent(key));
  const d = await r.json();
  return d.value;
}

async function listKeys() {
  const r = await fetch("/api/data");
  const d = await r.json();
  return d.keys || [];
}

function buildTrainingPrompt(ans) {
  let p = "PARTICIPANT'S TRAINING DATA:\n\n";
  const descs = [
    ["Q23","Q24","Financial gamble","1=Guaranteed 150TL","2=Gamble 40% chance 500TL"],
    ["Q25","Q26","Career risk","1=Risk career change","2=Stay stable"],
    ["Q27","Q28","Sports competition","1=Weak opponents small prize","2=Strong opponents big prize"],
    ["Q29","Q30","Tech purchase","1=Early discount with risk","2=Wait for reviews"],
    ["Q31","Q32","Travel booking","1=Expensive reliable","2=Cheap risky"]
  ];
  descs.forEach(([qc,qt,label,d1,d2],i) => {
    p += "Scenario " + (i+1) + " (" + label + "): Chose option " + ans[qc] + "\n  " + d1 + " | " + d2 + "\n  Explanation: \"" + (ans[qt]||"") + "\"\n\n";
  });
  return p;
}

export default function Home() {
  const [phase, setPhase] = useState("welcome");
  const [ans, setAns] = useState({});
  const [qIdx, setQIdx] = useState(0);
  const [adaptiveRound, setAdaptiveRound] = useState(0);
  const [adaptiveHistory, setAdaptiveHistory] = useState([]);
  const [currentAdaptive, setCurrentAdaptive] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [testIdx, setTestIdx] = useState(0);
  const [pid] = useState("P" + Date.now().toString(36) + Math.random().toString(36).slice(2,5));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [adminInput, setAdminInput] = useState("");
  const allHypRef = useRef([]);

  const curQ = phase === "training" ? QUESTIONS[qIdx] : null;
  const curTest = phase === "test" ? TEST_QS[testIdx] : null;

  const canNext = () => {
    if (phase === "training" && curQ) return ans[curQ.id] && (ans[curQ.open]||"").length >= 20;
    if (phase === "adaptive") return ans["AD" + adaptiveRound] != null;
    if (phase === "test" && curTest) return ans[curTest.id] != null;
    return false;
  };

  const startAdaptive = async () => {
    setLoading(true); setError(null);
    try {
      const result = await callAPI(SYS_INITIAL, buildTrainingPrompt(ans) + "\nGenerate hypotheses and first adaptive question.");
      allHypRef.current = [result];
      setCurrentAdaptive(result.adaptive_question);
      setAdaptiveRound(1);
      setPhase("adaptive");
    } catch (e) { setError(e.message); setPhase("adaptive_fallback"); }
    setLoading(false);
  };

  const nextAdaptive = async () => {
    const choice = ans["AD" + adaptiveRound];
    const choiceText = choice === "A" ? currentAdaptive.option_a : currentAdaptive.option_b;
    const newHist = [...adaptiveHistory, { round: adaptiveRound, scenario: currentAdaptive.scenario, option_a: currentAdaptive.option_a, option_b: currentAdaptive.option_b, choice, choiceText, logic: currentAdaptive.discrimination_logic }];
    setAdaptiveHistory(newHist);

    if (adaptiveRound >= 5) { await doFinal(newHist); return; }

    setLoading(true); setError(null);
    try {
      let tp = buildTrainingPrompt(ans) + "ADAPTIVE HISTORY:\n";
      newHist.forEach(h => { tp += "Round " + h.round + ": \"" + h.scenario + "\" -> " + h.choice + " (\"" + h.choiceText + "\")\n"; });
      tp += "\nPREVIOUS HYPOTHESES:\n" + JSON.stringify(allHypRef.current[allHypRef.current.length-1]) + "\n\nUpdate hypotheses.";
      const result = await callAPI(SYS_UPDATE, tp);
      allHypRef.current.push(result);
      if (result.ready) { await doFinal(newHist); return; }
      setCurrentAdaptive(result.adaptive_question);
      setAdaptiveRound(adaptiveRound + 1);
    } catch (e) { setError(e.message); await doFinal(newHist); }
    setLoading(false);
  };

  const doFinal = async (hist) => {
    setLoading(true);
    try {
      let tp = buildTrainingPrompt(ans) + "ADAPTIVE HISTORY:\n";
      hist.forEach(h => { tp += "Round " + h.round + ": \"" + h.scenario + "\" -> " + h.choice + "\n"; });
      tp += "\nMake final predictions.";
      const result = await callAPI(SYS_FINAL, tp);
      setPredictions(result.predictions);
    } catch (e) {
      setPredictions({ Q33:{prediction:0,confidence:0,reasoning:"error"}, Q34:{prediction:0,confidence:0,reasoning:"error"}, Q35:{prediction:0,confidence:0,reasoning:"error"} });
    }
    setPhase("test"); setLoading(false);
  };

  const saveResults = async () => {
    const data = {
      pid, timestamp: new Date().toISOString(), answers: ans,
      adaptive_history: adaptiveHistory, adaptive_rounds: adaptiveHistory.length,
      predictions,
      actuals: { Q33: ans.Q33, Q34: ans.Q34, Q35: ans.Q35 },
      accuracy: {
        Q33: predictions?.Q33?.prediction === ans.Q33 ? 1 : 0,
        Q34: predictions?.Q34?.prediction === ans.Q34 ? 1 : 0,
        Q35: predictions?.Q35?.prediction === ans.Q35 ? 1 : 0,
        total: (predictions?.Q33?.prediction===ans.Q33?1:0)+(predictions?.Q34?.prediction===ans.Q34?1:0)+(predictions?.Q35?.prediction===ans.Q35?1:0)
      }
    };
    try { await saveData("resp:" + pid, JSON.stringify(data)); } catch(_){}
    setPhase("done");
  };

  const loadAdmin = async () => {
    try {
      const keys = await listKeys();
      const respKeys = keys.filter(k => k.startsWith("resp:"));
      const all = [];
      for (const k of respKeys) {
        const val = await loadData(k);
        if (val) all.push(JSON.parse(val));
      }
      all.sort((a,b) => (a.timestamp||"").localeCompare(b.timestamp||""));
      setAdminData(all);
    } catch(e) { setError(e.message); }
  };

  const downloadCSV = () => {
    if (!adminData?.length) return;
    const fields = ["pid","timestamp","Q23","Q24","Q25","Q26","Q27","Q28","Q29","Q30","Q31","Q32","adaptive_rounds","Q33_pred","Q33_conf","Q33_actual","Q33_correct","Q34_pred","Q34_conf","Q34_actual","Q34_correct","Q35_pred","Q35_conf","Q35_actual","Q35_correct","total_correct"];
    const rows = adminData.map(r => [
      r.pid, r.timestamp, r.answers?.Q23, '"'+(r.answers?.Q24||"").replace(/"/g,'""')+'"',
      r.answers?.Q25, '"'+(r.answers?.Q26||"").replace(/"/g,'""')+'"',
      r.answers?.Q27, '"'+(r.answers?.Q28||"").replace(/"/g,'""')+'"',
      r.answers?.Q29, '"'+(r.answers?.Q30||"").replace(/"/g,'""')+'"',
      r.answers?.Q31, '"'+(r.answers?.Q32||"").replace(/"/g,'""')+'"',
      r.adaptive_rounds,
      r.predictions?.Q33?.prediction, r.predictions?.Q33?.confidence, r.actuals?.Q33, r.accuracy?.Q33,
      r.predictions?.Q34?.prediction, r.predictions?.Q34?.confidence, r.actuals?.Q34, r.accuracy?.Q34,
      r.predictions?.Q35?.prediction, r.predictions?.Q35?.confidence, r.actuals?.Q35, r.accuracy?.Q35,
      r.accuracy?.total
    ].join(","));
    const csv = "\uFEFF" + fields.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="cognitwin_data.csv"; a.click();
  };

  // ===== STYLES =====
  const pg = { fontFamily:"'Segoe UI',system-ui,sans-serif", maxWidth:640, margin:"0 auto", padding:"20px 16px", minHeight:"100vh", color:"#1a1a2e" };
  const card = { background:"#fff", borderRadius:12, padding:"24px 20px", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", marginBottom:16 };
  const btn = (on) => ({ display:"block", width:"100%", padding:"12px 20px", borderRadius:8, border:"none", fontSize:14, fontWeight:600, cursor:on?"pointer":"default", background:on?"#1a1a2e":"#ccc", color:"#fff", marginTop:14 });
  const opt = (sel) => ({ display:"block", width:"100%", padding:"14px 16px", borderRadius:8, border:sel?"2px solid #1a1a2e":"2px solid #e5e5e5", background:sel?"#f0f0ff":"#fafafa", fontSize:14, cursor:"pointer", textAlign:"left", marginBottom:8, fontWeight:sel?600:400, boxSizing:"border-box" });
  const ta = { width:"100%", minHeight:80, padding:12, borderRadius:8, border:"1px solid #ddd", fontSize:14, fontFamily:"inherit", resize:"vertical", boxSizing:"border-box", marginTop:8 };

  const totalSteps = 13;
  const curStep = phase==="training"?qIdx+1:phase==="adaptive"?5+adaptiveRound:phase==="test"?10+testIdx+1:13;
  const pct = Math.min((curStep/totalSteps)*100,100);

  // ===== ADMIN =====
  if (phase === "admin") {
    const agg = adminData ? {n:adminData.length, q33:adminData.reduce((s,r)=>s+(r.accuracy?.Q33||0),0), q34:adminData.reduce((s,r)=>s+(r.accuracy?.Q34||0),0), q35:adminData.reduce((s,r)=>s+(r.accuracy?.Q35||0),0)} : null;
    return (<div style={{...pg,maxWidth:1000}}><Head><title>CognitWin Admin</title></Head><div style={card}>
      <h2 style={{fontSize:18,margin:"0 0 16px"}}>Admin Panel</h2>
      {!adminData && <button onClick={loadAdmin} style={btn(true)}>Verileri Yukle</button>}
      {adminData && <>
        {agg && agg.n>0 && <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
          {[["N",agg.n],["Q33",((agg.q33/agg.n)*100).toFixed(0)+"%"],["Q34",((agg.q34/agg.n)*100).toFixed(0)+"%"],["Q35",((agg.q35/agg.n)*100).toFixed(0)+"%"],["Overall",(((agg.q33+agg.q34+agg.q35)/(agg.n*3))*100).toFixed(0)+"%"]].map(([l,v])=>(
            <div key={l} style={{background:"#f8f9fa",borderRadius:8,padding:"12px 16px",flex:"1",textAlign:"center"}}>
              <div style={{fontSize:11,color:"#888"}}>{l}</div>
              <div style={{fontSize:22,fontWeight:700}}>{v}</div>
            </div>
          ))}
        </div>}
        <button onClick={downloadCSV} style={{...btn(true),background:"#059669"}}>CSV Indir</button>
        <div style={{maxHeight:500,overflowY:"auto",fontSize:11,marginTop:12}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["PID","Tarih","Ad.S","Q33P","Q33A","Q33","Q34P","Q34A","Q34","Q35P","Q35A","Q35","Skor"].map(h=><th key={h} style={{padding:4,borderBottom:"2px solid #ddd",fontSize:10}}>{h}</th>)}</tr></thead>
            <tbody>{adminData.map((r,i)=><tr key={i} style={{borderBottom:"1px solid #eee"}}>
              <td style={{padding:4,fontSize:9}}>{r.pid?.slice(0,8)}</td>
              <td style={{padding:4,fontSize:9}}>{r.timestamp?.slice(5,16)}</td>
              <td style={{padding:4,textAlign:"center"}}>{r.adaptive_rounds}</td>
              {["Q33","Q34","Q35"].map(q=>[
                <td key={q+"p"} style={{padding:4,textAlign:"center"}}>{r.predictions?.[q]?.prediction}</td>,
                <td key={q+"a"} style={{padding:4,textAlign:"center"}}>{r.actuals?.[q]}</td>,
                <td key={q+"c"} style={{padding:4,textAlign:"center",fontWeight:700,color:r.accuracy?.[q]?"#059669":"#dc2626"}}>{r.accuracy?.[q]?"Y":"N"}</td>
              ])}
              <td style={{padding:4,textAlign:"center",fontWeight:700}}>{r.accuracy?.total}/3</td>
            </tr>)}</tbody>
          </table>
        </div>
        <button onClick={()=>{setPhase("welcome");setAdminData(null);}} style={{...btn(true),background:"#666",marginTop:12}}>Ankete Don</button>
      </>}
    </div></div>);
  }

  if (phase === "admin_login") {
    return (<div style={pg}><Head><title>CognitWin Admin</title></Head><div style={card}>
      <h2 style={{fontSize:18,margin:"0 0 12px"}}>Admin</h2>
      <input type="password" placeholder="Sifre" value={adminInput} onChange={e=>setAdminInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&adminInput===ADMIN_PASS)setPhase("admin");}} style={{width:"100%",padding:12,borderRadius:8,border:"1px solid #ddd",fontSize:14,boxSizing:"border-box"}} />
      <button onClick={()=>{if(adminInput===ADMIN_PASS)setPhase("admin");else setError("Yanlis sifre");}} style={btn(true)}>Giris</button>
      {error && <p style={{color:"#c00",fontSize:12,marginTop:8}}>{error}</p>}
    </div></div>);
  }

  // ===== WELCOME =====
  if (phase === "welcome") {
    return (<div style={pg}><Head><title>CognitWin</title></Head><div style={card}>
      <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 8px"}}>Karar Verme Araştırması</h1>
      <p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>Bu çalışmada size farklı karar senaryoları sunulacak. Her senaryoda iki seçenekten birini tercih etmenizi ve nedenini açıklamanızı istiyoruz.</p>
      <p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>İlk 5 sorudan sonra, cevaplarınıza göre size özel ek sorular oluşturulacak. Son olarak 3 test sorusu cevaplayacaksınız.</p>
      <p style={{fontSize:13,color:"#999",margin:"0 0 16px"}}>Tahmini süre: 8-12 dakika</p>
      <button onClick={()=>{setPhase("training");setQIdx(0);}} style={btn(true)}>Başla</button>
      <button onClick={()=>setPhase("admin_login")} style={{background:"none",border:"none",color:"#ddd",fontSize:10,cursor:"pointer",display:"block",margin:"12px auto 0"}}>admin</button>
    </div></div>);
  }

  // ===== LOADING =====
  if (loading) {
    return (<div style={pg}><Head><title>CognitWin</title></Head>
      <div style={{height:4,background:"#e8e8e8",borderRadius:2,marginBottom:20,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"#1a1a2e",borderRadius:2}} /></div>
      <div style={{...card,textAlign:"center",padding:"48px 24px"}}>
        <div style={{width:40,height:40,border:"4px solid #e8e8e8",borderTopColor:"#1a1a2e",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite"}} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Cevaplarınız analiz ediliyor...</p>
        <p style={{fontSize:12,color:"#999",margin:0}}>Bu işlem birkaç saniye sürebilir</p>
      </div>
    </div>);
  }

  // ===== TRAINING =====
  if (phase === "training" && curQ) {
    return (<div style={pg}><Head><title>CognitWin - Soru {qIdx+1}</title></Head>
      <div style={{height:4,background:"#e8e8e8",borderRadius:2,marginBottom:20,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"#1a1a2e",borderRadius:2}} /></div>
      <div style={card}>
        <p style={{fontSize:12,color:"#999",margin:"0 0 8px"}}>Soru {qIdx+1} / 5</p>
        <h2 style={{fontSize:16,fontWeight:600,margin:"0 0 16px",lineHeight:1.5}}>{curQ.text}</h2>
        <button onClick={()=>setAns(p=>({...p,[curQ.id]:1}))} style={opt(ans[curQ.id]===1)}><span style={{fontWeight:700,marginRight:8}}>A.</span>{curQ.o1}</button>
        <button onClick={()=>setAns(p=>({...p,[curQ.id]:2}))} style={opt(ans[curQ.id]===2)}><span style={{fontWeight:700,marginRight:8}}>B.</span>{curQ.o2}</button>
        {ans[curQ.id] && <div style={{marginTop:14}}>
          <label style={{fontSize:14,fontWeight:500}}>Neden bu seçeneği tercih ettiniz?</label>
          <textarea style={ta} placeholder="Lütfen en az 20 karakter yazınız..." value={ans[curQ.open]||""} onChange={e=>setAns(p=>({...p,[curQ.open]:e.target.value}))} />
          <p style={{fontSize:11,color:(ans[curQ.open]||"").length>=20?"#059669":"#999",margin:"4px 0 0"}}>{(ans[curQ.open]||"").length} / min 20</p>
        </div>}
        <button onClick={()=>{if(qIdx<4)setQIdx(qIdx+1);else startAdaptive();}} disabled={!canNext()} style={btn(canNext())}>{qIdx===4?"Devam Et":"Sonraki"}</button>
      </div>
    </div>);
  }

  // ===== ADAPTIVE =====
  if (phase === "adaptive" && currentAdaptive) {
    return (<div style={pg}><Head><title>CognitWin - Ek Soru</title></Head>
      <div style={{height:4,background:"#e8e8e8",borderRadius:2,marginBottom:20,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"#1a1a2e",borderRadius:2}} /></div>
      <div style={card}>
        <p style={{fontSize:12,color:"#6366f1",fontWeight:600,margin:"0 0 8px"}}>Ek Soru {adaptiveRound} / max 5</p>
        <h2 style={{fontSize:16,fontWeight:600,margin:"0 0 16px",lineHeight:1.5}}>{currentAdaptive.scenario}</h2>
        <button onClick={()=>setAns(p=>({...p,["AD"+adaptiveRound]:"A"}))} style={opt(ans["AD"+adaptiveRound]==="A")}><span style={{fontWeight:700,marginRight:8}}>A.</span>{currentAdaptive.option_a}</button>
        <button onClick={()=>setAns(p=>({...p,["AD"+adaptiveRound]:"B"}))} style={opt(ans["AD"+adaptiveRound]==="B")}><span style={{fontWeight:700,marginRight:8}}>B.</span>{currentAdaptive.option_b}</button>
        <button onClick={nextAdaptive} disabled={!canNext()} style={btn(canNext())}>Devam</button>
      </div>
    </div>);
  }

  // ===== FALLBACK =====
  if (phase === "adaptive_fallback") {
    return (<div style={pg}><Head><title>CognitWin</title></Head><div style={card}>
      <p style={{fontSize:13,color:"#c00",margin:"0 0 12px"}}>{error}</p>
      <p style={{fontSize:14,color:"#555",margin:"0 0 16px"}}>Adaptif soru oluşturulamadı. Test sorularına geçiliyor.</p>
      <button onClick={()=>{setPredictions({Q33:{prediction:0,confidence:0},Q34:{prediction:0,confidence:0},Q35:{prediction:0,confidence:0}});setPhase("test");}} style={btn(true)}>Devam Et</button>
    </div></div>);
  }

  // ===== TEST =====
  if (phase === "test" && curTest) {
    return (<div style={pg}><Head><title>CognitWin - Test</title></Head>
      <div style={{height:4,background:"#e8e8e8",borderRadius:2,marginBottom:20,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"#1a1a2e",borderRadius:2}} /></div>
      <div style={card}>
        <p style={{fontSize:12,color:"#999",margin:"0 0 8px"}}>Test Sorusu {testIdx+1} / 3</p>
        <h2 style={{fontSize:16,fontWeight:600,margin:"0 0 16px",lineHeight:1.5}}>{curTest.text}</h2>
        <button onClick={()=>setAns(p=>({...p,[curTest.id]:1}))} style={opt(ans[curTest.id]===1)}><span style={{fontWeight:700,marginRight:8}}>A.</span>{curTest.o1}</button>
        <button onClick={()=>setAns(p=>({...p,[curTest.id]:2}))} style={opt(ans[curTest.id]===2)}><span style={{fontWeight:700,marginRight:8}}>B.</span>{curTest.o2}</button>
        <button onClick={()=>{if(testIdx<2)setTestIdx(testIdx+1);else saveResults();}} disabled={!canNext()} style={btn(canNext())}>{testIdx===2?"Tamamla":"Sonraki"}</button>
      </div>
    </div>);
  }

  // ===== DONE =====
  if (phase === "done") {
    return (<div style={pg}><Head><title>CognitWin - Tamamlandi</title></Head><div style={{...card,textAlign:"center",padding:"36px 20px"}}>
      <div style={{fontSize:48,marginBottom:12}}>✅</div>
      <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 8px"}}>Teşekkürler!</h2>
      <p style={{fontSize:14,color:"#555",margin:"0 0 16px"}}>Cevaplarınız başarıyla kaydedildi.</p>
      <p style={{fontSize:12,color:"#999"}}>Katılımcı: {pid}</p>
    </div></div>);
  }

  return <div style={pg}><div style={{...card,textAlign:"center",padding:40}}><p>Yükleniyor...</p></div></div>;
}
