import { useState, useRef } from "react";
import Head from "next/head";

const ADMIN_PASS = "cogni";

const TOPICS = `A. Sosyal Dünya & İnsan İlişkileri: Güven, İşbirliği vs rekabet, Sadakat & bağlılık, Sosyal normlara uyum, Dedikodu / bilgi paylaşımı, Affetme & intikam
B. Kimlik & Grup Dinamikleri: İç grup / dış grup algısı, Ulusal kimlik, Kültürel değerler, Kimlik tehditi, Aidiyet ihtiyacı, Kimlik esnekliği vs katılığı
C. Siyaset & Toplumsal Sistemler: Otoriteye bakış, Demokrasi vs güçlü liderlik, Göç, Toplumsal eşitsizlik, Kamu politikaları, İfade özgürlüğü
D. Ekonomi & Kaynak Dağılımı: Adil paylaşım, Risk alma (finansal), Tasarruf vs harcama, Devlet müdahalesi, Refah devleti, Fiyat/kalite trade-off
E. Ahlak & Etik Kararlar: Zarar verme / zarar görme, Niyet vs sonuç, Adalet duyarlılığı, Kurallara uyum, Ahlaki relativizm vs evrenselcilik
F. Bilgi, Gerçeklik & Epistemik Tutumlar: Bilime güven, Uzmanlara güven, Komplo inançları, Kanıt değerlendirme, Şüphecilik vs kolay inanma, Bilgi kaynağı tercihleri
G. Risk & Belirsizlik: Belirsizlik toleransı, Kayıp kaçınma, Sağlık riskleri, Teknolojik riskler, Sosyal riskler, Uzun vadeli vs kısa vadeli düşünme
H. Duygular & Psikolojik Regülasyon: Öfke kontrolü, Kaygı ile başa çıkma, Empati, Duygusal farkındalık, Duygu bastırma vs ifade
I. Günlük Yaşam & Karar Verme: Zaman yönetimi, Planlılık vs spontane davranış, Alışkanlıklar, Teknoloji kullanımı, Sağlık davranışları
J. Doğa, Çevre & Gelecek: Çevre duyarlılığı, İklim değişikliği, Sürdürülebilirlik, Gelecek nesillere sorumluluk`;

const SYS_INIT = `You are conducting an adaptive cognitive profiling assessment. Your goal is to understand HOW a participant thinks about a specific topic — not WHAT they think, but their underlying reasoning patterns, cognitive style, and decision-making heuristics.

AVAILABLE TOPICS:
${TOPICS}

YOUR TASK:
1. Randomly select ONE category (A-J) and ONE subtopic within it
2. Generate a binary (A/B) scenario question in Turkish about that subtopic
   - The question must present a realistic dilemma or choice
   - Options A and B should reveal different REASONING STYLES, not just different opinions
   - Write in clear, everyday Turkish
3. Generate 2-4 hypotheses about the reasoning patterns that could lead someone to choose A or B
   - Each hypothesis describes a WAY OF THINKING, not just a preference
   - Example: "Loss-averse thinker who prioritizes avoiding negative outcomes over pursuing gains"
   - Example: "Principle-based reasoner who applies universal rules regardless of context"

NOTE: The participant will provide BOTH a choice (A/B) AND a written explanation in Turkish. Your hypotheses should consider what different reasoning styles might look like in their explanations.

RESPOND WITH ONLY VALID JSON (no markdown, no backticks):
{
  "category": "Letter and name",
  "subtopic": "Subtopic name",
  "question": {
    "scenario": "Turkish scenario text (2-3 sentences)",
    "option_a": "Turkish option A",
    "option_b": "Turkish option B"
  },
  "hypotheses": [
    {"id": "H1", "label": "Short English label", "description": "English description of reasoning pattern", "predicts": "A or B"},
    {"id": "H2", "label": "Short English label", "description": "English description of reasoning pattern", "predicts": "A or B"}
  ]
}`;

const SYS_UPDATE = `You are continuing an adaptive cognitive profiling session. The participant provides BOTH a choice (A/B) AND a written explanation in Turkish for each question. Pay close attention to their REASONING in the explanation — it often reveals more than the choice itself.

RULES:
1. Analyze BOTH the choice AND the written explanation to update hypotheses
   - The explanation may confirm, contradict, or add nuance to what the choice alone suggests
   - Look for reasoning patterns: causal thinking, emotional reasoning, principle-based logic, pragmatic calculation, etc.
2. Update each hypothesis: "eliminated", "weakened", "unchanged", or "strengthened"
3. You may ADD new hypotheses if the explanation reveals a pattern you hadn't considered
4. CHECK: Is there only ONE plausible hypothesis remaining?
   - YES: set "ready": true
   - NO: generate a NEW question designed so competing hypotheses predict DIFFERENT answers
5. Same subtopic. Minimum 2 profiling rounds before ready=true.

RESPOND WITH ONLY VALID JSON:
{
  "hypothesis_updates": [
    {"id": "H1", "label": "...", "status": "eliminated|weakened|unchanged|strengthened", "evidence": "Why this status based on their choice AND explanation"}
  ],
  "new_hypotheses": [{"id": "H_new", "label": "...", "description": "...", "predicts": "A or B"}],
  "active_hypotheses_count": 2,
  "ready": false,
  "reasoning": "Why ready or not (1-2 sentences, reference specific things from their explanation)",
  "next_question": {
    "scenario": "Turkish (null if ready=true)",
    "option_a": "Turkish",
    "option_b": "Turkish",
    "discrimination_logic": "English: which hypotheses this question discriminates between and how"
  }
}`;

const SYS_FINAL = `You are completing a cognitive profiling session. You have the participant's choices AND written explanations for all profiling questions. Based on all evidence, you now understand their reasoning pattern.

YOUR TASK:
1. Summarize the participant's reasoning style (2-3 sentences, English)
2. State the winning hypothesis and which hypotheses were eliminated along the way
3. Generate exactly 3 TEST questions about the SAME subtopic
   - New binary A/B scenarios in Turkish, testing DIFFERENT ASPECTS of the subtopic
   - Predict which option this participant will choose based on their identified reasoning pattern
   - Confidence 0.0 to 1.0

RESPOND WITH ONLY VALID JSON:
{
  "participant_profile": "2-3 sentence English summary",
  "winning_hypothesis": {"id": "...", "label": "...", "description": "..."},
  "eliminated_hypotheses": [{"id": "...", "label": "...", "eliminated_at_round": 1, "reason": "..."}],
  "test_questions": [
    {
      "id": "T1",
      "scenario": "Turkish scenario text",
      "option_a": "Turkish option A",
      "option_b": "Turkish option B",
      "prediction": "A or B",
      "confidence": 0.75,
      "prediction_reasoning": "English: why this prediction"
    },
    {"id": "T2", "scenario": "...", "option_a": "...", "option_b": "...", "prediction": "...", "confidence": 0.0, "prediction_reasoning": "..."},
    {"id": "T3", "scenario": "...", "option_a": "...", "option_b": "...", "prediction": "...", "confidence": 0.0, "prediction_reasoning": "..."}
  ]
}`;

async function callAPI(system, prompt) {
  const r = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, prompt })
  });
  const d = await r.json();
  if (d.error) throw new Error(typeof d.error === "string" ? d.error : d.error.message || JSON.stringify(d.error));
  const txt = (d.content || []).map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(txt);
}

async function saveData(key, value) {
  await fetch("/api/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
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

export default function Home() {
  const [phase, setPhase] = useState("welcome");
  const [topic, setTopic] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [reason, setReason] = useState("");
  const [profilingHistory, setProfilingHistory] = useState([]);
  const [profilingRound, setProfilingRound] = useState(0);
  const [testQuestions, setTestQuestions] = useState([]);
  const [testIdx, setTestIdx] = useState(0);
  const [testAnswers, setTestAnswers] = useState({});
  const [predictions, setPredictions] = useState(null);
  const [profile, setProfile] = useState(null);
  const [eliminatedHyps, setEliminatedHyps] = useState([]);
  const [pid] = useState("P" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5));
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [adminInput, setAdminInput] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const allHypRef = useRef([]);

  const startProfiling = async () => {
    setLoading(true); setLoadingMsg("Konu seçiliyor ve ilk soru hazırlanıyor..."); setError(null);
    try {
      const result = await callAPI(SYS_INIT, "Select a topic and generate the first profiling question. Be creative — pick randomly.");
      setTopic({ category: result.category, subtopic: result.subtopic });
      setCurrentQ(result.question);
      allHypRef.current = [{ round: 0, hypotheses: result.hypotheses }];
      setProfilingRound(1);
      setPhase("profiling");
    } catch (e) { setError("Baglanti hatasi: " + e.message); }
    setLoading(false);
  };

  const submitProfiling = async () => {
    const choiceText = answer === "A" ? currentQ.option_a : currentQ.option_b;
    const newHistory = [...profilingHistory, {
      round: profilingRound,
      scenario: currentQ.scenario,
      option_a: currentQ.option_a,
      option_b: currentQ.option_b,
      answer,
      answerText: choiceText,
      reason
    }];
    setProfilingHistory(newHistory);
    setAnswer(null);
    setReason("");

    if (profilingRound >= 5) {
      await generateTestQuestions(newHistory);
      return;
    }

    setLoading(true); setLoadingMsg("Cevabınız analiz ediliyor..."); setError(null);
    try {
      let prompt = "TOPIC: " + topic.category + " > " + topic.subtopic + "\n\n";
      prompt += "PROFILING HISTORY:\n";
      newHistory.forEach(h => {
        prompt += "Round " + h.round + ":\n  Question: \"" + h.scenario + "\"\n  A: " + h.option_a + "\n  B: " + h.option_b + "\n  Choice: " + h.answer + " (\"" + h.answerText + "\")\n  Written explanation: \"" + h.reason + "\"\n\n";
      });
      prompt += "CURRENT HYPOTHESES:\n" + JSON.stringify(allHypRef.current[allHypRef.current.length - 1].hypotheses || allHypRef.current[allHypRef.current.length - 1]) + "\n\n";
      prompt += "Profiling round: " + profilingRound + " of max 5. Min 2 required before ready=true.\nUpdate hypotheses based on BOTH the choice and the written explanation.";

      const result = await callAPI(SYS_UPDATE, prompt);
      allHypRef.current.push({ round: profilingRound, updates: result.hypothesis_updates, new_hyp: result.new_hypotheses, reasoning: result.reasoning });

      if (result.ready && profilingRound >= 2) {
        await generateTestQuestions(newHistory);
        return;
      }

      if (result.next_question && result.next_question.scenario) {
        setCurrentQ(result.next_question);
        setProfilingRound(profilingRound + 1);
      } else {
        await generateTestQuestions(newHistory);
        return;
      }
    } catch (e) {
      setError("Guncelleme hatasi: " + e.message);
      await generateTestQuestions(newHistory);
    }
    setLoading(false);
  };

  const generateTestQuestions = async (history) => {
    setLoading(true); setLoadingMsg("Test soruları oluşturuluyor..."); setError(null);
    try {
      let prompt = "TOPIC: " + topic.category + " > " + topic.subtopic + "\n\n";
      prompt += "COMPLETE PROFILING HISTORY:\n";
      history.forEach(h => {
        prompt += "Round " + h.round + ":\n  Question: \"" + h.scenario + "\"\n  Choice: " + h.answer + " (\"" + h.answerText + "\")\n  Explanation: \"" + h.reason + "\"\n\n";
      });
      prompt += "HYPOTHESIS EVOLUTION:\n" + JSON.stringify(allHypRef.current) + "\n\n";
      prompt += "Generate profile summary, list eliminated hypotheses, and create 3 test questions about " + topic.subtopic + ".";

      const result = await callAPI(SYS_FINAL, prompt);
      setTestQuestions(result.test_questions);
      setPredictions(result.test_questions);
      setProfile({ summary: result.participant_profile, hypothesis: result.winning_hypothesis });
      setEliminatedHyps(result.eliminated_hypotheses || []);
      setTestIdx(0);
      setPhase("test");
    } catch (e) {
      setError("Test sorusu olusturulamadi: " + e.message);
      setPhase("error");
    }
    setLoading(false);
  };

  const saveResults = async () => {
    const accuracy = testQuestions.map((tq, i) => tq.prediction === testAnswers[i] ? 1 : 0);
    const data = {
      pid,
      timestamp: new Date().toISOString(),
      topic,
      profiling_rounds: profilingHistory.length,
      profiling_history: profilingHistory,
      hypothesis_evolution: allHypRef.current,
      profile,
      winning_hypothesis: profile?.hypothesis,
      eliminated_hypotheses: eliminatedHyps,
      test_questions: testQuestions.map((tq, i) => ({ ...tq, actual: testAnswers[i], correct: accuracy[i] })),
      accuracy: { t1: accuracy[0], t2: accuracy[1], t3: accuracy[2], total: accuracy.reduce((a, b) => a + b, 0) }
    };
    try { await saveData("resp:" + pid, JSON.stringify(data)); } catch (_) { }
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
      all.sort((a, b) => (a.timestamp || "").localeCompare(b.timestamp || ""));
      setAdminData(all);
    } catch (e) { setError(e.message); }
  };

  const downloadCSV = () => {
    if (!adminData?.length) return;
    const fields = ["pid", "timestamp", "category", "subtopic", "profiling_rounds", "winning_hypothesis", "eliminated_count", "T1_pred", "T1_actual", "T1_correct", "T2_pred", "T2_actual", "T2_correct", "T3_pred", "T3_actual", "T3_correct", "total_correct", "profile"];
    const rows = adminData.map(r => [
      r.pid, r.timestamp,
      '"' + (r.topic?.category || "").replace(/"/g, '""') + '"',
      '"' + (r.topic?.subtopic || "").replace(/"/g, '""') + '"',
      r.profiling_rounds,
      '"' + (r.winning_hypothesis?.label || r.profile?.hypothesis?.label || "").replace(/"/g, '""') + '"',
      (r.eliminated_hypotheses || []).length,
      r.test_questions?.[0]?.prediction, r.test_questions?.[0]?.actual, r.accuracy?.t1,
      r.test_questions?.[1]?.prediction, r.test_questions?.[1]?.actual, r.accuracy?.t2,
      r.test_questions?.[2]?.prediction, r.test_questions?.[2]?.actual, r.accuracy?.t3,
      r.accuracy?.total,
      '"' + (r.profile?.summary || "").replace(/"/g, '""') + '"'
    ].join(","));
    const csv = "\uFEFF" + fields.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "cognitwin_v2_data.csv"; a.click();
  };

  // STYLES
  const pg = { fontFamily: "'Segoe UI',system-ui,sans-serif", maxWidth: 640, margin: "0 auto", padding: "20px 16px", minHeight: "100vh", color: "#1a1a2e" };
  const card = { background: "#fff", borderRadius: 12, padding: "24px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 16 };
  const btnS = (on) => ({ display: "block", width: "100%", padding: "12px 20px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: on ? "pointer" : "default", background: on ? "#1a1a2e" : "#ccc", color: "#fff", marginTop: 14 });
  const optS = (sel) => ({ display: "block", width: "100%", padding: "14px 16px", borderRadius: 8, border: sel ? "2px solid #1a1a2e" : "2px solid #e5e5e5", background: sel ? "#f0f0ff" : "#fafafa", fontSize: 14, cursor: "pointer", textAlign: "left", marginBottom: 8, fontWeight: sel ? 600 : 400, boxSizing: "border-box" });
  const taS = { width: "100%", minHeight: 70, padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", marginTop: 8 };

  const maxSteps = 8;
  const curStep = phase === "profiling" ? profilingRound : phase === "test" ? 5 + testIdx + 1 : phase === "done" ? maxSteps : 0;
  const pct = Math.min((curStep / maxSteps) * 100, 100);
  const bar = <div style={{ height: 4, background: "#e8e8e8", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}><div style={{ width: pct + "%", height: "100%", background: "#1a1a2e", borderRadius: 2, transition: "width .4s" }} /></div>;

  const canSubmitProfiling = answer && reason.length >= 20;

  // ===== ADMIN =====
  if (phase === "admin") {
    const agg = adminData ? {
      n: adminData.length,
      t1: adminData.reduce((s, r) => s + (r.accuracy?.t1 || 0), 0),
      t2: adminData.reduce((s, r) => s + (r.accuracy?.t2 || 0), 0),
      t3: adminData.reduce((s, r) => s + (r.accuracy?.t3 || 0), 0),
      avgR: adminData.length ? (adminData.reduce((s, r) => s + (r.profiling_rounds || 0), 0) / adminData.length).toFixed(1) : 0
    } : null;

    return (<div style={{ ...pg, maxWidth: 1200 }}><Head><title>CognitWin Admin</title></Head><div style={card}>
      <h2 style={{ fontSize: 18, margin: "0 0 16px" }}>Admin Panel</h2>
      {!adminData && <button onClick={loadAdmin} style={btnS(true)}>Verileri Yukle</button>}
      {adminData && <>
        {agg && agg.n > 0 && <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {[["Attempt", agg.n, "#1a1a2e"], ["T1", ((agg.t1 / agg.n) * 100).toFixed(0) + "%", "#059669"], ["T2", ((agg.t2 / agg.n) * 100).toFixed(0) + "%", "#059669"], ["T3", ((agg.t3 / agg.n) * 100).toFixed(0) + "%", "#059669"], ["Overall", (((agg.t1 + agg.t2 + agg.t3) / (agg.n * 3)) * 100).toFixed(0) + "%", "#1a1a2e"], ["Ort.Soru", agg.avgR, "#6366f1"]].map(([l, v, c]) => (
            <div key={l} style={{ background: "#f8f9fa", borderRadius: 8, padding: "10px 14px", flex: "1 1 70px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#888" }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>}
        <button onClick={downloadCSV} style={{ ...btnS(true), background: "#059669", marginBottom: 12 }}>CSV Indir</button>

        <div style={{ maxHeight: 600, overflowY: "auto", fontSize: 11 }}>
          {adminData.map((r, i) => {
            const isExpanded = expandedRow === i;
            return (
              <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
                <div onClick={() => setExpandedRow(isExpanded ? null : i)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", cursor: "pointer", background: isExpanded ? "#f0f4ff" : "#fafafa", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 10, minWidth: 65 }}>{r.pid?.slice(0, 8)}</span>
                  <span style={{ fontSize: 9, color: "#888", minWidth: 85 }}>{r.timestamp?.slice(0, 16)}</span>
                  <span style={{ fontSize: 9, background: "#e8e8f8", padding: "1px 6px", borderRadius: 8 }}>{r.topic?.subtopic}</span>
                  <span style={{ fontSize: 9, color: "#888" }}>{r.profiling_rounds} soru</span>
                  {["t1", "t2", "t3"].map(t => (
                    <span key={t} style={{ fontSize: 11, fontWeight: 700, color: r.accuracy?.[t] ? "#059669" : "#dc2626" }}>{t.toUpperCase()}:{r.accuracy?.[t] ? "Y" : "N"}</span>
                  ))}
                  <span style={{ fontWeight: 700, fontSize: 12, marginLeft: "auto" }}>{r.accuracy?.total}/3</span>
                  <span style={{ fontSize: 10, color: "#888" }}>{isExpanded ? "▲" : "▼"}</span>
                </div>

                {isExpanded && (
                  <div style={{ padding: "12px 16px", background: "#fff", fontSize: 11 }}>
                    {/* Profile */}
                    <div style={{ marginBottom: 12, padding: "8px 12px", background: "#f0fdf4", borderRadius: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 10, color: "#059669", marginBottom: 4 }}>Kazanan Hipotez</div>
                      <div style={{ fontSize: 11 }}>{r.winning_hypothesis?.label || r.profile?.hypothesis?.label} — {r.winning_hypothesis?.description || r.profile?.hypothesis?.description}</div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{r.profile?.summary}</div>
                    </div>

                    {/* Eliminated hypotheses */}
                    {r.eliminated_hypotheses?.length > 0 && (
                      <div style={{ marginBottom: 12, padding: "8px 12px", background: "#fef2f2", borderRadius: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: 10, color: "#dc2626", marginBottom: 4 }}>Elenen Hipotezler</div>
                        {r.eliminated_hypotheses.map((eh, ei) => (
                          <div key={ei} style={{ fontSize: 10, marginBottom: 2 }}>
                            <span style={{ fontWeight: 600 }}>R{eh.eliminated_at_round}:</span> {eh.label} — <span style={{ color: "#888" }}>{eh.reason}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Profiling history */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 10, color: "#6366f1", marginBottom: 4 }}>Profilleme Soruları</div>
                      {r.profiling_history?.map((ph, pi) => (
                        <div key={pi} style={{ padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 10 }}>
                          <div><span style={{ fontWeight: 600 }}>S{ph.round}:</span> {ph.scenario}</div>
                          <div style={{ color: "#444" }}>Cevap: <span style={{ fontWeight: 600 }}>{ph.answer}</span> — {ph.answerText}</div>
                          {ph.reason && <div style={{ color: "#888", fontStyle: "italic" }}>Gerekce: "{ph.reason}"</div>}
                        </div>
                      ))}
                    </div>

                    {/* Test results */}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 10, color: "#1a1a2e", marginBottom: 4 }}>Test Sonuçları</div>
                      {r.test_questions?.map((tq, ti) => (
                        <div key={ti} style={{ padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 10 }}>
                          <div>{tq.scenario}</div>
                          <div>Tahmin: <span style={{ fontWeight: 700 }}>{tq.prediction}</span> (güven: {tq.confidence}) | Gerçek: <span style={{ fontWeight: 700 }}>{tq.actual}</span> | <span style={{ fontWeight: 700, color: tq.correct ? "#059669" : "#dc2626" }}>{tq.correct ? "DOGRU" : "YANLIS"}</span></div>
                          <div style={{ color: "#888", fontSize: 9 }}>{tq.prediction_reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={() => { setPhase("welcome"); setAdminData(null); setExpandedRow(null); }} style={{ ...btnS(true), background: "#666", marginTop: 12 }}>Ankete Don</button>
      </>}
    </div></div>);
  }

  if (phase === "admin_login") {
    return (<div style={pg}><Head><title>CognitWin Admin</title></Head><div style={card}>
      <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>Admin</h2>
      <input type="password" placeholder="Sifre" value={adminInput} onChange={e => setAdminInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && adminInput === ADMIN_PASS) setPhase("admin"); }} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
      <button onClick={() => { if (adminInput === ADMIN_PASS) setPhase("admin"); else setError("Yanlis sifre"); }} style={btnS(true)}>Giris</button>
      {error && <p style={{ color: "#c00", fontSize: 12, marginTop: 8 }}>{error}</p>}
    </div></div>);
  }

  // WELCOME
  if (phase === "welcome") {
    return (<div style={pg}><Head><title>CognitWin</title></Head><div style={card}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Karar Verme Araştırması</h1>
      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: "0 0 8px" }}>Bu çalışmada size çeşitli karar senaryoları sunulacak. Her senaryoda iki seçenekten birini tercih etmenizi ve nedenini kısaca açıklamanızı istiyoruz.</p>
      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: "0 0 8px" }}>Sorular cevaplarınıza göre şekillenecek. Doğru ya da yanlış cevap yoktur.</p>
      <p style={{ fontSize: 13, color: "#999", margin: "0 0 16px" }}>Tahmini süre: 5-10 dakika</p>
      <button onClick={startProfiling} style={btnS(true)}>Başla</button>
      <button onClick={() => setPhase("admin_login")} style={{ background: "none", border: "none", color: "#ddd", fontSize: 10, cursor: "pointer", display: "block", margin: "12px auto 0" }}>admin</button>
    </div></div>);
  }

  // LOADING
  if (loading) {
    return (<div style={pg}><Head><title>CognitWin</title></Head>
      {bar}
      <div style={{ ...card, textAlign: "center", padding: "48px 24px" }}>
        <div style={{ width: 40, height: 40, border: "4px solid #e8e8e8", borderTopColor: "#1a1a2e", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>{loadingMsg || "Yükleniyor..."}</p>
        <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Bu işlem birkaç saniye sürebilir</p>
      </div>
    </div>);
  }

  // ERROR
  if (phase === "error") {
    return (<div style={pg}><Head><title>CognitWin</title></Head><div style={card}>
      <p style={{ fontSize: 14, color: "#c00", margin: "0 0 12px" }}>{error}</p>
      <button onClick={() => { setPhase("welcome"); setProfilingHistory([]); setProfilingRound(0); setAnswer(null); setReason(""); allHypRef.current = []; }} style={btnS(true)}>Basa Don</button>
    </div></div>);
  }

  // PROFILING
  if (phase === "profiling" && currentQ) {
    return (<div style={pg}><Head><title>CognitWin - Soru {profilingRound}</title></Head>
      {bar}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, margin: 0 }}>Soru {profilingRound}</p>
          {topic && <p style={{ fontSize: 10, color: "#999", margin: 0, background: "#f3f4f6", padding: "2px 8px", borderRadius: 10 }}>{topic.subtopic}</p>}
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", lineHeight: 1.6 }}>{currentQ.scenario}</h2>
        <button onClick={() => setAnswer("A")} style={optS(answer === "A")}><span style={{ fontWeight: 700, marginRight: 8 }}>A.</span>{currentQ.option_a}</button>
        <button onClick={() => setAnswer("B")} style={optS(answer === "B")}><span style={{ fontWeight: 700, marginRight: 8 }}>B.</span>{currentQ.option_b}</button>
        {answer && (
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 14, fontWeight: 500 }}>Neden bu seçeneği tercih ettiniz?</label>
            <textarea style={taS} placeholder="Lütfen en az 20 karakter yazınız..." value={reason} onChange={e => setReason(e.target.value)} />
            <p style={{ fontSize: 11, color: reason.length >= 20 ? "#059669" : "#999", margin: "4px 0 0" }}>{reason.length} / min 20</p>
          </div>
        )}
        <button onClick={submitProfiling} disabled={!canSubmitProfiling} style={btnS(canSubmitProfiling)}>Devam</button>
      </div>
    </div>);
  }

  // TEST
  if (phase === "test" && testQuestions.length > 0 && testIdx < testQuestions.length) {
    const tq = testQuestions[testIdx];
    return (<div style={pg}><Head><title>CognitWin - Test {testIdx + 1}</title></Head>
      {bar}
      <div style={card}>
        <p style={{ fontSize: 12, color: "#999", margin: "0 0 12px" }}>Test Sorusu {testIdx + 1} / 3</p>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px", lineHeight: 1.6 }}>{tq.scenario}</h2>
        <button onClick={() => setTestAnswers(p => ({ ...p, [testIdx]: "A" }))} style={optS(testAnswers[testIdx] === "A")}><span style={{ fontWeight: 700, marginRight: 8 }}>A.</span>{tq.option_a}</button>
        <button onClick={() => setTestAnswers(p => ({ ...p, [testIdx]: "B" }))} style={optS(testAnswers[testIdx] === "B")}><span style={{ fontWeight: 700, marginRight: 8 }}>B.</span>{tq.option_b}</button>
        <button onClick={() => { if (testIdx < 2) setTestIdx(testIdx + 1); else saveResults(); }} disabled={!testAnswers[testIdx]} style={btnS(!!testAnswers[testIdx])}>{testIdx === 2 ? "Tamamla" : "Sonraki"}</button>
      </div>
    </div>);
  }

  // DONE
  if (phase === "done") {
    return (<div style={pg}><Head><title>CognitWin</title></Head><div style={{ ...card, textAlign: "center", padding: "36px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>&#10004;&#65039;</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Teşekkürler!</h2>
      <p style={{ fontSize: 14, color: "#555", margin: "0 0 16px" }}>Cevaplarınız başarıyla kaydedildi.</p>
      <p style={{ fontSize: 12, color: "#999" }}>Katılımcı: {pid}</p>
    </div></div>);
  }

  return <div style={pg}><div style={{ ...card, textAlign: "center", padding: 40 }}><p>Yukleniyor...</p></div></div>;
}
