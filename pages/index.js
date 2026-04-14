import { useState, useRef } from "react";
import Head from "next/head";

const ADMIN_PASS = "cogni";
const TOTAL_CYCLES = 5;

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

async function getRandomTopic(){try{const r=await fetch("/api/data?key=_used_topics");const d=await r.json();let used=[];if(d.value){try{used=typeof d.value==="string"?JSON.parse(d.value):(Array.isArray(d.value)?d.value:[]);}catch(_){used=[];}}const av=TOPIC_LIST.filter(t=>!used.includes(t.id));const pool=av.length>0?av:TOPIC_LIST;const ch=pool[Math.floor(Math.random()*pool.length)];const nu=av.length>0?[...used,ch.id]:[ch.id];await fetch("/api/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:"_used_topics",value:JSON.stringify(nu)})});return ch;}catch(e){return TOPIC_LIST[Math.floor(Math.random()*TOPIC_LIST.length)];}}

const SYS_INIT = `You are conducting a FALSIFICATIONIST cognitive profiling. Understand HOW a participant thinks by generating hypotheses and trying to DISPROVE them.

Use the SPECIFIC topic given. FALSIFICATION (Popperian): try to FALSIFY hypotheses, not confirm. Surviving hypothesis wins.

TASK:
1. Generate binary A/B scenario in Turkish (realistic, everyday language)
2. Generate ALL plausible hypotheses — each describes a reasoning PATTERN with testable PREDICTION (A or B)

JSON ONLY:
{"category":"...","subtopic":"...","question":{"scenario":"Turkish","option_a":"Turkish","option_b":"Turkish"},"hypotheses":[{"id":"H1","label":"English","description":"English","prediction":"A or B"}]}`;

const SYS_UPDATE = `FALSIFICATIONIST profiling continuation.

STRICT RULES:
1. Each alive hypothesis: does answer+explanation CONTRADICT its prediction?
2. Verdicts: "clear_contradiction" (hard strike, immediate elimination) | "partial_contradiction" (soft strike, 2nd strike=elimination) | "no_contradiction" (survives, no strengthening)
3. ELIMINATION: 1 clear_contradiction OR 2 any strikes → eliminated
4. After: 1 alive→sole_survivor:true | 0 alive→all_eliminated:true (generate up to 3 new) | 2+→next falsification question
5. Question design: pick alive hypothesis, create scenario where it predicts clearly, test it.

JSON ONLY:
{"hypothesis_updates":[{"id":"H1","label":"...","status":"alive|eliminated","verdict":"clear_contradiction|partial_contradiction|no_contradiction","strikes_before":0,"strikes_after":0,"evidence":"..."}],"new_hypotheses":[],"alive_count":2,"sole_survivor":false,"all_eliminated":false,"reasoning":"...","next_question":{"scenario":"Turkish or null","option_a":"Turkish","option_b":"Turkish","target_hypothesis":"...","falsification_logic":"..."}}`;

const SYS_FINAL = `Complete FALSIFICATIONIST profiling.

TASK: State winning hypothesis, list eliminations, summarize reasoning (2-3 English sentences), generate 3 TEST questions (same subtopic, different aspects, Turkish A/B, predictions with confidence 0.0-1.0).

JSON ONLY:
{"participant_profile":"English","winning_hypothesis":{"id":"...","label":"...","description":"...","strikes":0},"eliminated_hypotheses":[{"id":"...","label":"...","eliminated_at_round":1,"total_strikes":1,"kill_shot":"...","evidence":"..."}],"test_questions":[{"id":"T1","scenario":"Turkish","option_a":"Turkish","option_b":"Turkish","prediction":"A or B","confidence":0.75,"prediction_reasoning":"English"}]}`;

const SYS_REVISE = `You predicted the participant's answer but were WRONG. The participant explained WHY your prediction was incorrect.

Based on this new evidence, should the winning hypothesis be REVISED or REPLACED?

TASK:
1. Analyze the participant's explanation for each misprediction
2. Determine if the winning hypothesis needs revision
3. If yes: provide a revised hypothesis that accounts for the new evidence
4. If no: explain why the hypothesis still holds despite the misprediction

JSON ONLY:
{"needs_revision":true,"original_hypothesis":{"label":"...","description":"..."},"revised_hypothesis":{"label":"...","description":"..."},"revision_reasoning":"English: what the mispredictions revealed","misprediction_analysis":[{"test_id":"T1","predicted":"A","actual":"B","participant_explanation":"...","analysis":"English: why the prediction failed"}]}`;

async function callAPI(s,p){const r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({system:s,prompt:p})});const d=await r.json();if(d.error)throw new Error(typeof d.error==="string"?d.error:d.error.message||JSON.stringify(d.error));const t=(d.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();return JSON.parse(t)}
async function saveData(k,v){await fetch("/api/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:k,value:v})})}
async function loadData(k){const r=await fetch("/api/data?key="+encodeURIComponent(k));const d=await r.json();return d.value}
async function listKeys(){const r=await fetch("/api/data");const d=await r.json();return d.keys||[]}

export default function Home(){
  const [phase,setPhase]=useState("welcome");
  const [gender,setGender]=useState(null);
  const [birthYear,setBirthYear]=useState("");
  const [isBonus,setIsBonus]=useState(null);
  const [bonusCourse,setBonusCourse]=useState("");
  const [studentNo,setStudentNo]=useState("");
  const [cycle,setCycle]=useState(1);
  const [cycleResults,setCycleResults]=useState([]);
  const [topic,setTopic]=useState(null);
  const [currentQ,setCurrentQ]=useState(null);
  const [answer,setAnswer]=useState(null);
  const [reason,setReason]=useState("");
  const [profHist,setProfHist]=useState([]);
  const [profRound,setProfRound]=useState(0);
  const [hypotheses,setHypotheses]=useState([]);
  const [testQs,setTestQs]=useState([]);
  const [testIdx,setTestIdx]=useState(0);
  const [testAns,setTestAns]=useState({});
  const [testFeedback,setTestFeedback]=useState({});  // {idx: "explanation text"}
  const [showFeedback,setShowFeedback]=useState(false);
  const [feedbackText,setFeedbackText]=useState("");
  const [profile,setProfile]=useState(null);
  const [revisedHyp,setRevisedHyp]=useState(null);
  const [elimLog,setElimLog]=useState([]);
  const [pid]=useState("P"+Date.now().toString(36)+Math.random().toString(36).slice(2,5));
  const [loading,setLoading]=useState(false);
  const [loadMsg,setLoadMsg]=useState("");
  const [error,setError]=useState(null);
  const [adminData,setAdminData]=useState(null);
  const [adminPw,setAdminPw]=useState("");
  const [expRow,setExpRow]=useState(null);
  const fullLog=useRef([]);

  const resetCycle=()=>{setTopic(null);setCurrentQ(null);setAnswer(null);setReason("");setProfHist([]);setProfRound(0);setHypotheses([]);setTestQs([]);setTestIdx(0);setTestAns({});setTestFeedback({});setShowFeedback(false);setFeedbackText("");setProfile(null);setRevisedHyp(null);setElimLog([]);fullLog.current=[];};

  const startCycle=async()=>{
    setLoading(true);setLoadMsg("Konu "+cycle+"/"+TOTAL_CYCLES+" seçiliyor...");setError(null);
    try{const ch=await getRandomTopic();const result=await callAPI(SYS_INIT,"ASSIGNED TOPIC:\nID:"+ch.id+"\nCategory:"+ch.cat+"\nSubtopic:"+ch.sub+"\n\nGenerate first question and hypotheses.");
    setTopic({id:ch.id,category:ch.cat,subtopic:ch.sub});setCurrentQ(result.question);
    const iH=result.hypotheses.map(h=>({...h,status:"alive",strikes:0}));setHypotheses(iH);
    fullLog.current=[{round:0,type:"init",hypotheses:iH,question:result.question}];setProfRound(1);setPhase("profiling");
    }catch(e){setError("Bağlantı hatası: "+e.message);setPhase("error");}setLoading(false);};

  const submitProf=async()=>{
    const cT=answer==="A"?currentQ.option_a:currentQ.option_b;
    const entry={round:profRound,scenario:currentQ.scenario,option_a:currentQ.option_a,option_b:currentQ.option_b,answer,answerText:cT,reason};
    const nH=[...profHist,entry];setProfHist(nH);setAnswer(null);setReason("");
    const aH=hypotheses.filter(h=>h.status==="alive");
    if(profRound>=5){await genTest(nH,hypotheses);return;}
    setLoading(true);setLoadMsg("Hipotezler test ediliyor...");setError(null);
    try{let p="TOPIC:"+topic.category+">"+topic.subtopic+"\n\nHISTORY:\n";
    nH.forEach(h=>{p+="R"+h.round+": \""+h.scenario+"\" →"+h.answer+" \""+h.answerText+"\" Reason:\""+h.reason+"\"\n";});
    p+="\nALIVE:\n";aH.forEach(h=>{p+=h.id+" ["+h.label+"] strikes="+h.strikes+" pred="+h.prediction+"\n";});
    p+="\nROUND "+profRound+": Evaluate. Strict falsification.";
    const result=await callAPI(SYS_UPDATE,p);
    let uH=hypotheses.map(h=>{if(h.status==="eliminated")return h;const u=(result.hypothesis_updates||[]).find(u=>u.id===h.id);if(!u)return h;return{...h,strikes:u.strikes_after!=null?u.strikes_after:h.strikes,status:u.status==="eliminated"?"eliminated":"alive"};});
    const nE=(result.hypothesis_updates||[]).filter(u=>u.status==="eliminated").map(u=>({id:u.id,label:u.label,round:profRound,verdict:u.verdict,evidence:u.evidence,strikes:u.strikes_after}));
    setElimLog(prev=>[...prev,...nE]);
    if(result.all_eliminated&&result.new_hypotheses?.length){uH=[...uH,...result.new_hypotheses.map(h=>({...h,status:"alive",strikes:0}))];}
    setHypotheses(uH);fullLog.current.push({round:profRound,type:"update",updates:result.hypothesis_updates,reasoning:result.reasoning});
    const aA=uH.filter(h=>h.status==="alive");
    if(result.sole_survivor||aA.length===1||profRound>=5){await genTest(nH,uH);return;}
    if(result.next_question?.scenario){setCurrentQ(result.next_question);setProfRound(profRound+1);}
    else{await genTest(nH,uH);return;}
    }catch(e){setError("Hata:"+e.message);await genTest(nH,hypotheses);}setLoading(false);};

  const genTest=async(hist,hyps)=>{
    setLoading(true);setLoadMsg("Test soruları oluşturuluyor...");setError(null);
    try{const alive=hyps.filter(h=>h.status==="alive");const winner=alive.length>0?alive.reduce((a,b)=>a.strikes<=b.strikes?a:b):hyps.reduce((a,b)=>(a.strikes||99)<=(b.strikes||99)?a:b);
    let p="TOPIC:"+topic.category+">"+topic.subtopic+"\n\nPROFILING:\n";
    hist.forEach(h=>{p+="R"+h.round+":\""+h.scenario+"\"→"+h.answer+" Reason:\""+h.reason+"\"\n";});
    p+="\nSTATE:\n";hyps.forEach(h=>{p+=h.id+" ["+h.label+"] "+h.status+" strikes="+h.strikes+"\n";});
    p+="\nSURVIVOR:"+winner.id+" ["+winner.label+"]\nGenerate profile, eliminations, 3 test questions.";
    const result=await callAPI(SYS_FINAL,p);setTestQs(result.test_questions);
    setProfile({summary:result.participant_profile,hypothesis:result.winning_hypothesis});
    if(result.eliminated_hypotheses)setElimLog(result.eliminated_hypotheses);
    setTestIdx(0);setTestAns({});setTestFeedback({});setPhase("test");
    }catch(e){setError("Test oluşturulamadı:"+e.message);setPhase("error");}setLoading(false);};

  // Test answer handler — check prediction match
  const submitTestAnswer=()=>{
    const tq=testQs[testIdx];
    const actual=testAns[testIdx];
    const correct=tq.prediction===actual;
    if(correct){
      // Prediction matched — move on
      advanceTest();
    } else {
      // Prediction wrong — ask for explanation
      setShowFeedback(true);
    }
  };

  const submitFeedback=()=>{
    setTestFeedback(prev=>({...prev,[testIdx]:feedbackText}));
    setShowFeedback(false);setFeedbackText("");
    advanceTest();
  };

  const advanceTest=()=>{
    if(testIdx<2){setTestIdx(testIdx+1);}
    else{checkRevision();}
  };

  // After all 3 test questions, check if hypothesis needs revision
  const checkRevision=async()=>{
    const misses=testQs.map((tq,i)=>({...tq,actual:testAns[i],correct:tq.prediction===testAns[i],feedback:testFeedback[i]||null})).filter(t=>!t.correct&&t.feedback);
    if(misses.length===0){finishCycle();return;}
    setLoading(true);setLoadMsg("Hipotez güncelleniyor...");
    try{let p="TOPIC:"+topic.category+">"+topic.subtopic+"\n\n";
    p+="WINNING HYPOTHESIS: "+profile.hypothesis.label+" — "+profile.hypothesis.description+"\n\n";
    p+="MISPREDICTIONS:\n";
    misses.forEach(m=>{p+="  "+m.id+": Predicted "+m.prediction+", Actual "+m.actual+"\n  Participant's explanation: \""+m.feedback+"\"\n\n";});
    p+="Analyze mispredictions and determine if hypothesis needs revision.";
    const result=await callAPI(SYS_REVISE,p);setRevisedHyp(result);
    }catch(e){/* revision failed, proceed without */}
    setLoading(false);finishCycle();
  };

  const finishCycle=()=>{
    const acc=testQs.map((t,i)=>t.prediction===testAns[i]?1:0);
    const cd2={cycle,topic,profiling_rounds:profHist.length,profiling_history:profHist,
      hypotheses_initial:fullLog.current[0]?.hypotheses||[],hypotheses_final:hypotheses,
      elimination_log:elimLog,full_log:[...fullLog.current],profile,winning_hypothesis:profile?.hypothesis,
      revised_hypothesis:revisedHyp,
      test_questions:testQs.map((t,i)=>({...t,actual:testAns[i],correct:acc[i],misprediction_feedback:testFeedback[i]||null})),
      accuracy:{t1:acc[0],t2:acc[1],t3:acc[2],total:acc[0]+acc[1]+acc[2]}};
    const nr=[...cycleResults,cd2];setCycleResults(nr);
    if(cycle<TOTAL_CYCLES){resetCycle();setCycle(cycle+1);setPhase("cycle_transition");}
    else{setCycleResults(nr);setPhase("bonus_info");}
  };

  const saveAll=async()=>{
    const results=cycleResults;
    const totalC=results.reduce((s,c)=>s+c.accuracy.total,0);
    const data={pid,timestamp:new Date().toISOString(),
      demographics:{gender,birth_year:parseInt(birthYear)||null},
      bonus:isBonus?{course:bonusCourse,student_no:studentNo}:null,
      total_cycles:TOTAL_CYCLES,cycles:results,
      overall_accuracy:{correct:totalC,total:TOTAL_CYCLES*3,pct:Math.round(totalC/(TOTAL_CYCLES*3)*100)}};
    try{await saveData("resp:"+pid,JSON.stringify(data));}catch(_){}setPhase("done");};

  const loadAdmin=async()=>{try{const keys=await listKeys();const all=[];for(const k of keys.filter(k=>k.startsWith("resp:"))){const v=await loadData(k);if(v){try{all.push(typeof v==="string"?JSON.parse(v):v);}catch(_){}}}all.sort((a,b)=>(a.timestamp||"").localeCompare(b.timestamp||""));setAdminData(all);}catch(e){setError(e.message);}};
  const clearAllData=async()=>{if(!confirm("Tüm katılımcı verileri silinecek. Emin misiniz?"))return;try{await fetch("/api/data",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({key:"_clear",action:"clear_all"})});setAdminData([]);alert("Tüm veriler silindi.");}catch(e){alert("Hata:"+e.message);}};
  const dlCSV=()=>{if(!adminData?.length)return;
    const f=["pid","timestamp","gender","birth_year","bonus_course","student_no","cycle","topic_id","subtopic","profiling_rounds","initial_hyp","elim_count","winner","revised","T1_pred","T1_actual","T1_ok","T1_feedback","T2_pred","T2_actual","T2_ok","T2_feedback","T3_pred","T3_actual","T3_ok","T3_feedback","cycle_score","overall_pct"];
    const rows=[];adminData.forEach(r=>{(r.cycles||[]).forEach(c=>{rows.push([r.pid,r.timestamp,r.demographics?.gender||"",r.demographics?.birth_year||"",
      '"'+(r.bonus?.course||"").replace(/"/g,'""')+'"',r.bonus?.student_no||"",
      c.cycle,c.topic?.id||"",'"'+(c.topic?.subtopic||"").replace(/"/g,'""')+'"',
      c.profiling_rounds,(c.hypotheses_initial||[]).length,(c.elimination_log||[]).length,
      '"'+(c.winning_hypothesis?.label||c.profile?.hypothesis?.label||"").replace(/"/g,'""')+'"',
      c.revised_hypothesis?.needs_revision?"yes":"no",
      c.test_questions?.[0]?.prediction,c.test_questions?.[0]?.actual,c.accuracy?.t1,'"'+(c.test_questions?.[0]?.misprediction_feedback||"").replace(/"/g,'""')+'"',
      c.test_questions?.[1]?.prediction,c.test_questions?.[1]?.actual,c.accuracy?.t2,'"'+(c.test_questions?.[1]?.misprediction_feedback||"").replace(/"/g,'""')+'"',
      c.test_questions?.[2]?.prediction,c.test_questions?.[2]?.actual,c.accuracy?.t3,'"'+(c.test_questions?.[2]?.misprediction_feedback||"").replace(/"/g,'""')+'"',
      c.accuracy?.total,r.overall_accuracy?.pct+"%"].join(","));});});
    const csv="\uFEFF"+f.join(",")+"\n"+rows.join("\n");
    const b=new Blob([csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="cognitwin_data.csv";a.click();};

  const pg={fontFamily:"'Segoe UI',system-ui,sans-serif",maxWidth:640,margin:"0 auto",padding:"20px 16px",minHeight:"100vh",color:"#1a1a2e"};
  const cd={background:"#fff",borderRadius:12,padding:"24px 20px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",marginBottom:16};
  const bn=on=>({display:"block",width:"100%",padding:"12px 20px",borderRadius:8,border:"none",fontSize:14,fontWeight:600,cursor:on?"pointer":"default",background:on?"#1a1a2e":"#ccc",color:"#fff",marginTop:14});
  const op=sel=>({display:"block",width:"100%",padding:"14px 16px",borderRadius:8,border:sel?"2px solid #1a1a2e":"2px solid #e5e5e5",background:sel?"#f0f0ff":"#fafafa",fontSize:14,cursor:"pointer",textAlign:"left",marginBottom:8,fontWeight:sel?600:400,boxSizing:"border-box"});
  const ta={width:"100%",minHeight:70,padding:12,borderRadius:8,border:"1px solid #ddd",fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",marginTop:8};
  const inp={width:"100%",padding:12,borderRadius:8,border:"1px solid #ddd",fontSize:14,boxSizing:"border-box"};
  const totalSteps=TOTAL_CYCLES*8+2;
  const cycOff=1+(cycle-1)*8;
  const sIC=phase==="profiling"?profRound:phase==="test"?5+testIdx+1:phase==="cycle_transition"?8:0;
  const curStep=phase==="demographics"?1:phase==="bonus_info"?totalSteps-1:phase==="done"?totalSteps:cycOff+sIC;
  const pct=Math.min((curStep/totalSteps)*100,100);
  const bar=<div style={{height:4,background:"#e8e8e8",borderRadius:2,marginBottom:20,overflow:"hidden"}}><div style={{width:pct+"%",height:"100%",background:"#1a1a2e",borderRadius:2,transition:"width .4s"}}/></div>;
  const ok=answer&&reason.length>=20;

  if(loading)return(<div style={pg}><Head><title>CogniTwin</title></Head>{bar}<div style={{...cd,textAlign:"center",padding:"48px 24px"}}><div style={{width:40,height:40,border:"4px solid #e8e8e8",borderTopColor:"#1a1a2e",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 1s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><p style={{fontSize:15,fontWeight:600,margin:"0 0 6px"}}>{loadMsg}</p><p style={{fontSize:12,color:"#999",margin:0}}>Bu işlem birkaç saniye sürebilir</p></div></div>);

  // ADMIN
  if(phase==="admin"){const ag=adminData?{n:adminData.length,correct:adminData.reduce((s,r)=>s+(r.overall_accuracy?.correct||0),0),total:adminData.length*TOTAL_CYCLES*3}:null;
    return(<div style={{...pg,maxWidth:1200}}><Head><title>Admin</title></Head><div style={cd}>
      <h2 style={{fontSize:18,margin:"0 0 16px"}}>Admin Panel</h2>
      {!adminData&&<button onClick={loadAdmin} style={bn(true)}>Verileri Yukle</button>}
      {adminData&&<>{ag&&ag.n>0&&<div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {[["Katılımcı",ag.n,"#1a1a2e"],["Overall",ag.total>0?Math.round(ag.correct/ag.total*100)+"%":"—","#059669"]].map(([l,v,c])=>(<div key={l} style={{background:"#f8f9fa",borderRadius:8,padding:"10px 14px",flex:"1 1 80px",textAlign:"center"}}><div style={{fontSize:10,color:"#888"}}>{l}</div><div style={{fontSize:22,fontWeight:700,color:c}}>{v}</div></div>))}</div>}
        <div style={{display:"flex",gap:8,marginBottom:12}}><button onClick={dlCSV} style={{...bn(true),background:"#059669",flex:1}}>CSV Indir</button><button onClick={clearAllData} style={{...bn(true),background:"#dc2626",flex:1}}>Tüm Verileri Sil</button></div>
        <div style={{maxHeight:600,overflowY:"auto",fontSize:11}}>
          {adminData.map((r,i)=>{const ex=expRow===i;return(<div key={i} style={{border:"1px solid #e5e7eb",borderRadius:8,marginBottom:8,overflow:"hidden"}}>
            <div onClick={()=>setExpRow(ex?null:i)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",cursor:"pointer",background:ex?"#f0f4ff":"#fafafa",flexWrap:"wrap"}}>
              <span style={{fontWeight:700,fontSize:10,minWidth:65}}>{r.pid?.slice(0,8)}</span>
              <span style={{fontSize:9,color:"#888"}}>{r.timestamp?.slice(0,16)}</span>
              <span style={{fontSize:9,background:"#e8e8f8",padding:"1px 6px",borderRadius:8}}>{r.demographics?.gender} {r.demographics?.birth_year}</span>
              {r.bonus&&<span style={{fontSize:9,background:"#fef3c7",padding:"1px 6px",borderRadius:8}}>{r.bonus.student_no}</span>}
              <span style={{fontWeight:700,fontSize:10,marginLeft:"auto"}}>{r.overall_accuracy?.correct}/{r.overall_accuracy?.total} ({r.overall_accuracy?.pct}%)</span>
              <span style={{fontSize:10,color:"#888"}}>{ex?"▲":"▼"}</span>
            </div>
            {ex&&<div style={{padding:"12px 16px",background:"#fff",fontSize:11}}>
              <div style={{marginBottom:8,padding:"6px 10px",background:"#f8f9fa",borderRadius:6,fontSize:10}}><b>Cinsiyet:</b> {r.demographics?.gender} | <b>Doğum:</b> {r.demographics?.birth_year}{r.bonus&&<span> | <b>Ders:</b> {r.bonus.course} | <b>No:</b> {r.bonus.student_no}</span>}</div>
              {(r.cycles||[]).map((c,ci)=>(<div key={ci} style={{marginBottom:16,padding:"10px 12px",background:ci%2?"#fafafa":"#fff",borderRadius:8,border:"1px solid #eee"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:700,fontSize:12,color:"#6366f1"}}>Konu {c.cycle}: #{c.topic?.id} {c.topic?.subtopic}</span><span style={{fontWeight:700,fontSize:12,color:c.accuracy?.total>=2?"#059669":"#dc2626"}}>{c.accuracy?.total}/3</span></div>
                <div style={{marginBottom:6,padding:"6px 10px",background:"#f0fdf4",borderRadius:6}}><div style={{fontWeight:700,fontSize:9,color:"#059669"}}>Hayatta Kalan</div><div style={{fontSize:10}}>{c.winning_hypothesis?.label||c.profile?.hypothesis?.label} — {c.winning_hypothesis?.description||c.profile?.hypothesis?.description}</div><div style={{fontSize:9,color:"#555",marginTop:2}}>{c.profile?.summary}</div></div>
                {c.revised_hypothesis?.needs_revision&&<div style={{marginBottom:6,padding:"6px 10px",background:"#fff7ed",borderRadius:6,border:"1px solid #fed7aa"}}><div style={{fontWeight:700,fontSize:9,color:"#ea580c"}}>Revize Edildi</div><div style={{fontSize:10}}>{c.revised_hypothesis.revised_hypothesis?.label} — {c.revised_hypothesis.revised_hypothesis?.description}</div><div style={{fontSize:9,color:"#888",marginTop:2}}>{c.revised_hypothesis.revision_reasoning}</div></div>}
                {(c.elimination_log||[]).length>0&&<div style={{marginBottom:6,padding:"6px 10px",background:"#fef2f2",borderRadius:6}}><div style={{fontWeight:700,fontSize:9,color:"#dc2626"}}>Elenen ({(c.elimination_log||[]).length})</div>{(c.elimination_log||[]).map((el,ei)=><div key={ei} style={{fontSize:9}}><b>{el.id}</b> R{el.round||el.eliminated_at_round} — {el.verdict||el.kill_shot}</div>)}</div>}
                <div style={{marginBottom:6}}><div style={{fontWeight:700,fontSize:9,color:"#6366f1"}}>Profilleme ({c.profiling_rounds}s)</div>{c.profiling_history?.map((ph,pi)=><div key={pi} style={{fontSize:9,padding:"2px 0",borderBottom:"1px solid #f0f0f0"}}><b>S{ph.round}:</b> {ph.scenario?.slice(0,80)}... → <b>{ph.answer}</b>{ph.reason&&<span style={{color:"#888"}}> — "{ph.reason.slice(0,50)}..."</span>}</div>)}</div>
                <div><div style={{fontWeight:700,fontSize:9,color:"#1a1a2e"}}>Test</div>{c.test_questions?.map((tq,ti)=><div key={ti} style={{fontSize:9,padding:"3px 0",borderBottom:"1px solid #f0f0f0"}}><div>{tq.scenario?.slice(0,60)}...</div><div>P:<b>{tq.prediction}</b> A:<b>{tq.actual}</b> <b style={{color:tq.correct?"#059669":"#dc2626"}}>{tq.correct?"✓":"✗"}</b></div>{tq.misprediction_feedback&&<div style={{color:"#ea580c",fontStyle:"italic"}}>Katılımcı: "{tq.misprediction_feedback.slice(0,80)}..."</div>}</div>)}</div>
              </div>))}
            </div>}
          </div>);})}
        </div>
        <button onClick={()=>{setPhase("welcome");setAdminData(null);setExpRow(null);}} style={{...bn(true),background:"#666",marginTop:12}}>Ankete Dön</button>
      </>}</div></div>);}

  if(phase==="admin_login")return(<div style={pg}><Head><title>Admin</title></Head><div style={cd}><h2 style={{fontSize:18,margin:"0 0 12px"}}>Admin</h2><input type="password" placeholder="Şifre" value={adminPw} onChange={e=>setAdminPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&adminPw===ADMIN_PASS)setPhase("admin");}} style={inp}/><button onClick={()=>{if(adminPw===ADMIN_PASS)setPhase("admin");else setError("Yanlış şifre");}} style={bn(true)}>Giriş</button>{error&&<p style={{color:"#c00",fontSize:12,marginTop:8}}>{error}</p>}</div></div>);

  if(phase==="welcome")return(<div style={pg}><Head><title>CogniTwin</title></Head><div style={cd}><h1 style={{fontSize:22,fontWeight:700,margin:"0 0 8px"}}>Karar Verme Araştırması</h1><p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>Bu çalışmada size 5 farklı konuda karar senaryoları sunulacak. Her senaryoda iki seçenekten birini tercih etmenizi ve nedenini kısaca açıklamanızı istiyoruz.</p><p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>Her konu için sorular cevaplarınıza göre şekillenecek. Doğru ya da yanlış cevap yoktur.</p><p style={{fontSize:13,color:"#999",margin:"0 0 16px"}}>Tahmini süre: 25-40 dakika</p><button onClick={()=>setPhase("demographics")} style={bn(true)}>Başla</button><button onClick={()=>setPhase("admin_login")} style={{background:"none",border:"none",color:"#ddd",fontSize:10,cursor:"pointer",display:"block",margin:"12px auto 0"}}>admin</button></div></div>);

  if(phase==="demographics"){const canGo=gender&&birthYear.length===4&&parseInt(birthYear)>=1940&&parseInt(birthYear)<=2010;
    return(<div style={pg}><Head><title>CogniTwin</title></Head>{bar}<div style={cd}><h2 style={{fontSize:16,fontWeight:600,margin:"0 0 16px"}}>Demografik Bilgiler</h2><div style={{marginBottom:16}}><label style={{fontSize:14,fontWeight:500,display:"block",marginBottom:8}}>Cinsiyetiniz:</label><button onClick={()=>setGender("Kadın")} style={op(gender==="Kadın")}>Kadın</button><button onClick={()=>setGender("Erkek")} style={op(gender==="Erkek")}>Erkek</button><button onClick={()=>setGender("Diğer/Belirtmek istemiyorum")} style={op(gender==="Diğer/Belirtmek istemiyorum")}>Diğer / Belirtmek istemiyorum</button></div><div style={{marginBottom:8}}><label style={{fontSize:14,fontWeight:500,display:"block",marginBottom:8}}>Doğum yılınız:</label><input type="number" placeholder="Örn: 1998" value={birthYear} onChange={e=>setBirthYear(e.target.value)} style={inp} min="1940" max="2010"/></div><button onClick={startCycle} disabled={!canGo} style={bn(canGo)}>Devam</button></div></div>);}

  if(phase==="cycle_transition"){const prev=cycleResults[cycleResults.length-1];
    return(<div style={pg}><Head><title>CogniTwin</title></Head>{bar}<div style={cd}><div style={{textAlign:"center",marginBottom:16}}><p style={{fontSize:13,color:"#059669",fontWeight:600,margin:"0 0 4px"}}>Konu {cycle-1}/{TOTAL_CYCLES} tamamlandı</p><p style={{fontSize:12,color:"#888",margin:0}}>Skor: {prev?.accuracy?.total}/3</p></div><div style={{background:"#f8f9fa",borderRadius:8,padding:"12px 16px",marginBottom:16}}><p style={{fontSize:13,color:"#555",margin:0}}>Şimdi yeni bir konuya geçiyoruz. Kalan: {TOTAL_CYCLES-cycle+1} konu</p></div><button onClick={startCycle} style={bn(true)}>Sonraki Konuya Geç</button></div></div>);}

  if(phase==="error")return(<div style={pg}><Head><title>CogniTwin</title></Head><div style={cd}><p style={{fontSize:14,color:"#c00",margin:"0 0 12px"}}>{error}</p><button onClick={()=>{setPhase("welcome");resetCycle();setCycle(1);setCycleResults([]);}} style={bn(true)}>Başa Dön</button></div></div>);

  if(phase==="profiling"&&currentQ){const alive=hypotheses.filter(h=>h.status==="alive").length;
    return(<div style={pg}><Head><title>Konu {cycle} - Soru {profRound}</title></Head>{bar}<div style={cd}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><p style={{fontSize:12,color:"#6366f1",fontWeight:600,margin:0}}>Konu {cycle}/{TOTAL_CYCLES} — Soru {profRound}</p><div style={{display:"flex",gap:6}}><span style={{fontSize:9,color:"#999",background:"#f3f4f6",padding:"2px 8px",borderRadius:10}}>{topic?.subtopic}</span><span style={{fontSize:9,color:"#6366f1",background:"#f0f0ff",padding:"2px 6px",borderRadius:10}}>{alive}h</span></div></div><h2 style={{fontSize:15,fontWeight:600,margin:"0 0 16px",lineHeight:1.6}}>{currentQ.scenario}</h2><button onClick={()=>setAnswer("A")} style={op(answer==="A")}><b style={{marginRight:8}}>A.</b>{currentQ.option_a}</button><button onClick={()=>setAnswer("B")} style={op(answer==="B")}><b style={{marginRight:8}}>B.</b>{currentQ.option_b}</button>{answer&&<div style={{marginTop:14}}><label style={{fontSize:14,fontWeight:500}}>Neden bu seçeneği tercih ettiniz?</label><textarea style={ta} placeholder="Lütfen en az 20 karakter yazınız..." value={reason} onChange={e=>setReason(e.target.value)}/><p style={{fontSize:11,color:reason.length>=20?"#059669":"#999",margin:"4px 0 0"}}>{reason.length} / min 20</p></div>}<button onClick={submitProf} disabled={!ok} style={bn(ok)}>Devam</button></div></div>);}

  // TEST — with feedback for wrong predictions
  if(phase==="test"&&testQs.length>0&&testIdx<testQs.length){
    const tq=testQs[testIdx];
    // If showing feedback prompt (prediction was wrong)
    if(showFeedback){
      const predText=tq.prediction==="A"?tq.option_a:tq.option_b;
      const predReason=tq.prediction_reasoning||"";
      return(<div style={pg}><Head><title>Konu {cycle} - Geri Bildirim</title></Head>{bar}<div style={cd}>
        <div style={{padding:"12px 16px",background:"#fef2f2",borderRadius:8,marginBottom:16}}>
          <p style={{fontSize:13,fontWeight:600,color:"#dc2626",margin:"0 0 8px"}}>Tahminimiz tutmadı</p>
          <p style={{fontSize:13,color:"#555",lineHeight:1.6,margin:"0 0 8px"}}>Önceki cevaplarınıza dayanarak, bu soruda <b>"{predText}"</b> seçeneğini tercih edeceğinizi düşünmüştük.</p>
          <p style={{fontSize:12,color:"#888",margin:0,fontStyle:"italic"}}>Gerekçemiz: {predReason}</p>
        </div>
        <p style={{fontSize:14,fontWeight:500,margin:"0 0 8px"}}>Neden farklı bir tercih yaptınız? Tahminimizin neden yanlış olduğunu açıklar mısınız?</p>
        <textarea style={ta} placeholder="Lütfen en az 20 karakter yazınız..." value={feedbackText} onChange={e=>setFeedbackText(e.target.value)}/>
        <p style={{fontSize:11,color:feedbackText.length>=20?"#059669":"#999",margin:"4px 0 0"}}>{feedbackText.length} / min 20</p>
        <button onClick={submitFeedback} disabled={feedbackText.length<20} style={bn(feedbackText.length>=20)}>Devam</button>
      </div></div>);
    }
    // Normal test question
    return(<div style={pg}><Head><title>Konu {cycle} - Test {testIdx+1}</title></Head>{bar}<div style={cd}><p style={{fontSize:12,color:"#999",margin:"0 0 12px"}}>Konu {cycle}/{TOTAL_CYCLES} — Test {testIdx+1}/3</p><h2 style={{fontSize:15,fontWeight:600,margin:"0 0 16px",lineHeight:1.6}}>{tq.scenario}</h2><button onClick={()=>setTestAns(p=>({...p,[testIdx]:"A"}))} style={op(testAns[testIdx]==="A")}><b style={{marginRight:8}}>A.</b>{tq.option_a}</button><button onClick={()=>setTestAns(p=>({...p,[testIdx]:"B"}))} style={op(testAns[testIdx]==="B")}><b style={{marginRight:8}}>B.</b>{tq.option_b}</button><button onClick={submitTestAnswer} disabled={!testAns[testIdx]} style={bn(!!testAns[testIdx])}>{testIdx===2?(cycle<TOTAL_CYCLES?"Konuyu Tamamla":"Son Adıma Geç"):"Sonraki"}</button></div></div>);}

  if(phase==="bonus_info")return(<div style={pg}><Head><title>CogniTwin</title></Head>{bar}<div style={cd}><h2 style={{fontSize:16,fontWeight:600,margin:"0 0 16px"}}>Son Bir Adım</h2><p style={{fontSize:14,color:"#555",lineHeight:1.6,margin:"0 0 16px"}}>Bu çalışmaya bir ders kapsamında bonus puan karşılığı mı katılıyorsunuz?</p><button onClick={()=>setIsBonus(true)} style={op(isBonus===true)}>Evet — bonus puan için katılıyorum</button><button onClick={()=>setIsBonus(false)} style={op(isBonus===false)}>Hayır — gönüllü katılıyorum</button>{isBonus===true&&<div style={{marginTop:16}}><label style={{fontSize:14,fontWeight:500,display:"block",marginBottom:8}}>Hangi ders için katılıyorsunuz?</label><input type="text" placeholder="Ders adı" value={bonusCourse} onChange={e=>setBonusCourse(e.target.value)} style={{...inp,marginBottom:12}}/><label style={{fontSize:14,fontWeight:500,display:"block",marginBottom:8}}>Öğrenci numaranız:</label><input type="text" placeholder="Öğrenci numarası" value={studentNo} onChange={e=>setStudentNo(e.target.value)} style={inp}/></div>}<button onClick={saveAll} disabled={isBonus===null||(isBonus&&(!bonusCourse||!studentNo))} style={bn(isBonus===false||(isBonus&&bonusCourse&&studentNo))}>Anketi Tamamla</button></div></div>);

  if(phase==="done"){const tc=cycleResults.reduce((s,c)=>s+c.accuracy.total,0);
    return(<div style={pg}><Head><title>CogniTwin</title></Head><div style={{...cd,textAlign:"center",padding:"36px 20px"}}><div style={{fontSize:48,marginBottom:12}}>&#10004;&#65039;</div><h2 style={{fontSize:20,fontWeight:700,margin:"0 0 8px"}}>Teşekkürler!</h2><p style={{fontSize:14,color:"#555",margin:"0 0 12px"}}>{TOTAL_CYCLES} konudaki cevaplarınız başarıyla kaydedildi.</p><div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>{cycleResults.map((c,i)=>(<div key={i} style={{background:"#f8f9fa",borderRadius:8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:8,color:"#888"}}>K{i+1}</div><div style={{fontSize:8,color:"#999"}}>{c.topic?.subtopic?.slice(0,15)}</div><div style={{fontSize:14,fontWeight:700,color:c.accuracy.total>=2?"#059669":"#dc2626"}}>{c.accuracy.total}/3</div></div>))}</div><p style={{fontSize:12,color:"#999"}}>Katılımcı: {pid}</p></div></div>);}

  return<div style={pg}><div style={{...cd,textAlign:"center",padding:40}}><p>Yükleniyor...</p></div></div>;
}
