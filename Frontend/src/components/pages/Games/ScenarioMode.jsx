import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RxExit } from "react-icons/rx";

const MAX_STEPS_PER_SCENARIO = 15;

const SCENARIOS = [
  {
    id: "scenario1",
    title: "Midnight Police Search",
    topic: "Fundamental Rights",
    difficulty: "medium",
    tags: ["Article 21", "Search & Seizure", "Writs"],
    intro:
      "Police enter Aman's house at midnight without showing any warrant and start searching.",
    steps: {
      start: {
        text: "At midnight, police officers arrive at Aman's house. Without showing any warrant, they enter his home and begin searching his rooms. They seize his laptop and some documents.",
        image: "/images/midnight-police.jpg",
        imageCaption: "Police entering Aman's house without a warrant.",
        question: "What is the FIRST thing Aman should think about legally?",
        choices: [
          {
            text: "Are my Fundamental Rights being violated?",
            nextStepId: "rights_step",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Correct. Whenever State authorities act, Fundamental Rights are crucial."
          },
          {
            text: "Which IPC section applies to laptop seizure?",
            nextStepId: "wrong_focus",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback:
              "IPC may be relevant later, but the core issue is constitutional."
          }
        ]
      },
      rights_step: {
        text: "Aman recalls that the Constitution protects people from arbitrary action by the State.",
        image: "/images/constitution-book.jpg",
        imageCaption:
          "Thinking about Fundamental Rights in the Constitution.",
        question: "Which Fundamental Right is MOST relevant in this situation?",
        choices: [
          {
            text: "Article 21 – Protection of life and personal liberty",
            nextStepId: "writ_step",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Yes. Arbitrary intrusion into privacy and liberty connects to Article 21."
          },
          {
            text: "Article 19(1)(a) – Freedom of speech and expression",
            nextStepId: "writ_step_hint",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback: "Important, but not the central right in this situation."
          },
          {
            text: "Article 25 – Freedom of religion",
            nextStepId: "writ_step_hint",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback: "Not directly related here."
          }
        ]
      },
      writ_step: {
        text: "Aman is now sure that his personal liberty and privacy might have been violated under Article 21.",
        image: "/images/high-court.jpg",
        imageCaption:
          "Considering approaching the High Court under writ jurisdiction.",
        question:
          "What is the BEST constitutional remedy he can use against this State action?",
        choices: [
          {
            text: "File a writ petition in the High Court under Article 226",
            nextStepId: "end_success",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Correct. High Courts can issue writs for enforcement of Fundamental Rights."
          },
          {
            text: "File only a civil suit for damages",
            nextStepId: "end_partial",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback:
              "A civil suit is possible, but a writ petition directly challenges State action."
          },
          {
            text: "Do nothing, police always have unrestricted powers",
            nextStepId: "end_partial",
            scoreChange: 0,
            feedbackType: "bad",
            feedback:
              "State power is limited by the Constitution; citizens can challenge wrongful acts."
          }
        ]
      },
      wrong_focus: {
        text: "Aman starts thinking only in terms of criminal sections and forgets that State action itself might be unconstitutional.",
        question:
          "What is the risk if Aman ignores his Fundamental Rights here?",
        choices: [
          {
            text: "He may miss the chance to directly challenge State action in the High Court.",
            nextStepId: "rights_step",
            scoreChange: 0,
            feedbackType: "good",
            feedback:
              "Exactly. Fundamental Rights and writs are powerful tools against arbitrary State action."
          }
        ]
      },
      writ_step_hint: {
        text: "You thought of remedies before clearly identifying the main right.",
        question: "Try again: which Fundamental Right is primarily at stake?",
        choices: [
          {
            text: "Re-evaluate the rights involved.",
            nextStepId: "rights_step",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback:
              "Go back and focus on which right is being directly affected."
          }
        ]
      },
      end_success: {
        end: true,
        resultText: "You handled this scenario very well!",
        learning:
          "You correctly thought in terms of Fundamental Rights, identified Article 21 as the key right, and chose a writ petition under Article 226 as the best remedy against arbitrary State action."
      },
      end_partial: {
        end: true,
        resultText:
          "You spotted some legal issues, but missed the strongest constitutional remedy.",
        learning:
          "In cases of arbitrary State action, always consider which Fundamental Right is affected and whether a writ petition under Article 226 (High Court) or Article 32 (Supreme Court) is appropriate."
      }
    }
  },
  {
    id: "scenario2",
    title: "Censorship of a Movie",
    topic: "Freedom of Speech",
    difficulty: "easy",
    tags: ["Article 19(1)(a)", "Reasonable Restrictions", "Censorship"],
    intro:
      "A political movie is denied certification by the board due to its criticism of government policies.",
    steps: {
      start: {
        text: "A director makes a political movie strongly criticising government policies. The censor board refuses to certify the film, stating that it may create dissatisfaction against the government.",
        image: "/images/movie-censorship.jpg",
        imageCaption: "A film poster under review by the board.",
        question: "Which constitutional freedom is MOST directly involved?",
        choices: [
          {
            text: "Article 19(1)(a) – Freedom of speech and expression",
            nextStepId: "ground_step",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Correct. Films are a form of expression protected by Article 19(1)(a)."
          },
          {
            text: "Article 25 – Freedom of religion",
            nextStepId: "alt_path",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback: "This is not mainly about religion."
          },
          {
            text: "Article 32 – Right to constitutional remedies",
            nextStepId: "alt_path",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback:
              "This is about enforcing rights, not the primary right itself."
          }
        ]
      },
      ground_step: {
        text: "The director argues that criticism of the government is essential in a democracy.",
        question:
          "Under Article 19(2), which ground could the State LEGITIMATELY use to restrict this film?",
        choices: [
          {
            text: "Security of the State or public order, if there is clear incitement to violence",
            nextStepId: "remedy_step",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Yes. Restrictions must fall under specific grounds like security of the the State or public order."
          },
          {
            text: "Because the film embarrasses the ruling party",
            nextStepId: "remedy_step",
            scoreChange: 0,
            feedbackType: "bad",
            feedback:
              "Embarrassment of a ruling party is not, by itself, a valid ground under Article 19(2)."
          }
        ]
      },
      remedy_step: {
        text: "The board has denied certification. The director believes the decision is arbitrary and violates freedom of expression.",
        image: "/images/courtroom.jpg",
        imageCaption: "Challenging censorship before the court.",
        question: "What is the BEST legal step the director can take?",
        choices: [
          {
            text: "File a writ petition in the High Court challenging the board's order",
            nextStepId: "end_success",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Correct. The board is a public authority and its order can be challenged via writ."
          },
          {
            text: "Organise an informal street protest only, without any legal action",
            nextStepId: "end_partial",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback:
              "Protests may create awareness, but do not directly challenge the legality of the order."
          }
        ]
      },
      alt_path: {
        text: "You focused on a right that is not central to this scenario.",
        question:
          "Which right should you re-examine in the context of media and political criticism?",
        choices: [
          {
            text: "Freedom of speech and expression under Article 19(1)(a)",
            nextStepId: "ground_step",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback:
              "Yes, go back and analyse this as a free speech issue."
          }
        ]
      },
      end_success: {
        end: true,
        resultText: "Strong understanding of free speech!",
        learning:
          "You correctly treated the issue as one of free speech under Article 19(1)(a), recognised that only specific grounds in Article 19(2) justify restrictions, and chose a writ petition as the proper remedy."
      },
      end_partial: {
        end: true,
        resultText:
          "You recognised the problem, but missed the best legal challenge.",
        learning:
          "While public pressure is useful, in constitutional law the key is to challenge arbitrary decisions of public authorities through writ petitions in appropriate courts."
      }
    }
  },
  {
    id: "scenario3",
    title: "Reservation in Promotions",
    topic: "Equality & Reservation",
    difficulty: "hard",
    tags: ["Article 14", "Reservation", "Reasonable Classification"],
    intro:
      "The State introduces reservation in promotions for a particular backward class in government services.",
    steps: {
      start: {
        text: "A State government introduces reservation in promotions for a particular backward class in government services. Some employees claim it violates equality.",
        question:
          "Which constitutional principle is MOST relevant to examine this policy?",
        choices: [
          {
            text: "Article 14 – Equality before law and equal protection of the laws",
            nextStepId: "eq_step",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Correct. The policy must satisfy reasonable classification under Article 14."
          },
          {
            text: "Article 25 – Freedom of religion",
            nextStepId: "eq_hint",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback: "Not directly relevant to reservation in promotions."
          }
        ]
      },
      eq_step: {
        text: "The court examines whether there is an intelligible differentia and a rational nexus with the object of the law.",
        question: "What is the key test under Article 14 for such a classification?",
        choices: [
          {
            text: "There must be an intelligible differentia and a rational nexus with the object of the law.",
            nextStepId: "eq_remedy",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Exactly. This is the classic test for reasonable classification."
          },
          {
            text: "All laws must treat every person identically in all situations.",
            nextStepId: "eq_remedy",
            scoreChange: 0,
            feedbackType: "bad",
            feedback:
              "Article 14 permits reasonable classification; identical treatment is not always required."
          }
        ]
      },
      eq_hint: {
        text: "You selected a right that is not central here.",
        question:
          "Which Article deals primarily with equality and reasonable classification?",
        choices: [
          {
            text: "Article 14",
            nextStepId: "eq_step",
            scoreChange: 0,
            feedbackType: "neutral",
            feedback: "Correct. Go back and apply Article 14's test."
          }
        ]
      },
      eq_remedy: {
        text: "If the reservation policy satisfies the test of reasonable classification and is backed by data on backwardness and inadequate representation, it may be upheld.",
        question:
          "If an employee believes the policy still violates equality, what can they do?",
        choices: [
          {
            text: "Challenge the policy before the High Court via a writ petition",
            nextStepId: "end_success",
            scoreChange: 1,
            feedbackType: "good",
            feedback:
              "Yes. Constitutionality of State policy can be challenged through writ jurisdiction."
          },
          {
            text: "Do nothing, as Article 14 can never be enforced by courts",
            nextStepId: "end_partial",
            scoreChange: 0,
            feedbackType: "bad",
            feedback:
              "Courts regularly enforce Article 14 by striking down arbitrary or discriminatory laws."
          }
        ]
      },
      end_success: {
        end: true,
        resultText: "Good grasp of equality and classification.",
        learning:
          "You applied Article 14 correctly, understood the test of reasonable classification, and identified writ jurisdiction as the right forum to challenge a potentially discriminatory policy."
      },
      end_partial: {
        end: true,
        resultText:
          "You understood the issue, but underestimated judicial review.",
        learning:
          "Article 14 is enforceable in courts. Judicial review allows courts to strike down arbitrary or unreasonable classifications in State policies."
      }
    }
  }
];

const feedbackColors = {
  good: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
  bad: "text-rose-300 border-rose-500/40 bg-rose-500/10",
  neutral: "text-sky-300 border-sky-500/40 bg-sky-500/10"
};

const feedbackEmoji = {
  good: "✅",
  bad: "⚠",
  neutral: "💡"
};

const ScenarioModeGame = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("any");
  const [difficulty, setDifficulty] = useState("any");

  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentStepId, setCurrentStepId] = useState("start");
  const [score, setScore] = useState(0);
  const [stepsTaken, setStepsTaken] = useState(0);

  const [preMessage, setPreMessage] = useState("");
  const [isScenarioScreen, setIsScenarioScreen] = useState(false);

  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [scoreBump, setScoreBump] = useState(false);

  const currentStep = useMemo(() => {
    if (!currentScenario) return null;
    return currentScenario.steps[currentStepId] || null;
  }, [currentScenario, currentStepId]);

  useEffect(() => {
    if (!feedback) return;
    if (feedback.scoreDelta && feedback.scoreDelta > 0) {
      setScoreBump(true);
      const t = setTimeout(() => setScoreBump(false), 500);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  useEffect(() => {
    setSelectedChoiceIndex(null);
    setIsLocked(false);
  }, [currentStepId]);

  const handleStartScenario = () => {
    const filtered = SCENARIOS.filter((s) => {
      const topicMatch = topic === "any" || s.topic === topic;
      const diffMatch = difficulty === "any" || s.difficulty === difficulty;
      return topicMatch && diffMatch;
    });

    if (filtered.length === 0) {
      setPreMessage(
        "No scenario matches these filters. Try choosing 'Any topic' or 'Any difficulty'."
      );
      return;
    }

    const randomScenario =
      filtered[Math.floor(Math.random() * filtered.length)];

    setCurrentScenario(randomScenario);
    setCurrentStepId("start");
    setScore(0);
    setStepsTaken(0);
    setFeedback(null);
    setPreMessage("");
    setIsScenarioScreen(true);
  };

  const handleChoiceClick = (choice, index) => {
    if (isLocked || !currentStep || currentStep.end) return;
    if (stepsTaken >= MAX_STEPS_PER_SCENARIO) return;

    setIsLocked(true);
    setSelectedChoiceIndex(index);

    const delta = choice.scoreChange || 0;
    setScore((prev) => prev + delta);
    setStepsTaken((prev) => prev + 1);

    setFeedback({
      text: choice.feedback,
      type: choice.feedbackType || "neutral",
      scoreDelta: delta
    });

    const nextStepId = choice.nextStepId;

    if (nextStepId) {
      setTimeout(() => {
        setCurrentStepId(nextStepId);
        setIsLocked(false);
      }, 600);
    } else {
      setIsLocked(false);
    }
  };

  const handleBackToFilters = () => {
    setIsScenarioScreen(false);
    setCurrentScenario(null);
    setCurrentStepId("start");
    setFeedback(null);
    setStepsTaken(0);
    setScore(0);
  };

  const handleRestartScenario = () => {
    if (!currentScenario) return;
    setCurrentStepId("start");
    setScore(0);
    setStepsTaken(0);
    setFeedback(null);
    setIsLocked(false);
    setSelectedChoiceIndex(null);
  };

  const progressPercent = Math.min(
    100,
    Math.round((stepsTaken / MAX_STEPS_PER_SCENARIO) * 100)
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-50">
      <button
        type="button"
        onClick={() => navigate('/games')}
        className="fixed right-4 flex gap-1 items-center bottom-4 z-50 rounded-full border border-white/30 bg-black/50 px-5 py-2 text-xl font-semibold text-white backdrop-blur transition hover:bg-black/70"
      >
        Exit <span className='text-xl text-red-500 font-bold'><RxExit /></span>
      </button>
      {/* Animated blurred gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-16 h-72 w-72 rounded-full bg-indigo-500/40 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-emerald-500/30 blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      </div>

      {/* Overlay pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06)_0,_transparent_60%)]" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 md:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/70 shadow-[0_0_60px_rgba(15,23,42,0.9)] backdrop-blur-xl px-4 py-5 md:px-8 md:py-7"
        >
          {/* Top bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Samvidhan Seekho
              </div>
              <h1 className="mt-2 flex items-center gap-2 text-xl font-semibold text-slate-50 md:text-3xl">
                Scenario Mode
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300 border border-emerald-500/40">
                  Learn by Doing
                </span>
              </h1>
              <p className="mt-1 text-xs text-slate-300 md:text-sm">
                Face real-life constitutional situations, step by step.
              </p>
              {/* <p className="text-[11px] text-slate-400">
                वास्तविक परिस्थितियों के माध्यम से भारतीय संविधान सीखिए।
              </p> */}
            </div>

            <div className="text-right text-[11px] text-slate-300 md:text-xs">
              <div>
                <span className="font-semibold text-slate-100">Mode:</span>{" "}
                Scenario-based learning
              </div>
              <div>
                <span className="font-semibold text-slate-100">Limit:</span>{" "}
                max {MAX_STEPS_PER_SCENARIO} steps
              </div>
              <div className="mt-2 hidden text-[10px] text-slate-500 md:block">
                Tip: Read slowly, think like a lawyer, then choose.
              </div>
            </div>
          </div>

          {/* XP / Progress bar */}
          <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Scenario Progress</span>
              <span>{progressPercent}% complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]"
              />
            </div>
          </div>

          {/* Content sections with animated switch */}
          <AnimatePresence mode="wait">
            {!isScenarioScreen && (
              <motion.section
                key="pre-screen"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="grid gap-5 md:grid-cols-[1.3fr_1fr] md:items-start"
              >
                {/* Left: controls */}
                <div>
                  <h2 className="mb-2 text-base font-semibold text-slate-50 md:text-lg">
                    Choose your practice focus
                  </h2>
                  <p className="mb-4 text-xs text-slate-300 md:text-sm">
                    Select a topic and difficulty. The system will pick a matching
                    scenario. You can always replay or switch filters later.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="topic-select"
                        className="block text-[11px] font-medium text-slate-200"
                      >
                        What topic do you want to practice?
                      </label>
                      <div className="relative">
                        <select
                          id="topic-select"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 shadow-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/70"
                        >
                          <option value="any">Any topic</option>
                          <option value="Fundamental Rights">
                            Fundamental Rights
                          </option>
                          <option value="Freedom of Speech">
                            Freedom of Speech
                          </option>
                          <option value="Equality & Reservation">
                            Equality & Reservation
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400">
                          ▼
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="difficulty-select"
                        className="block text-[11px] font-medium text-slate-200"
                      >
                        Difficulty level
                      </label>
                      <div className="relative">
                        <select
                          id="difficulty-select"
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 shadow-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/70"
                        >
                          <option value="any">Any difficulty</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400">
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartScenario}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:brightness-110 active:scale-95"
                  >
                    {/* <span className="text-base">▶</span> */}
                    <span>Start Scenario</span>
                  </button>

                  <p className="mt-3 text-[11px] text-slate-400">
                    Pro tip: Start with <span className="font-semibold">easy</span>{" "}
                    to get familiar, then move to{" "}
                    <span className="font-semibold">hard</span> for debate-level
                    thinking.
                  </p>

                  {preMessage && (
                    <div className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] font-medium text-rose-200">
                      {preMessage}
                    </div>
                  )}
                </div>

                {/* Right: visual card */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-inner">
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-2xl" />
                  <div className="absolute -bottom-12 left-4 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl" />

                  <div className="relative z-10 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      How it works
                    </p>
                    <h3 className="text-base font-semibold text-slate-50">
                      Turn the Constitution into a story game
                    </h3>
                    <ul className="space-y-2 text-[11px] text-slate-300">
                      <li>• Read the real-life situation carefully.</li>
                      <li>• Think which Fundamental Right or principle applies.</li>
                      <li>• Choose the next step like a constitutional lawyer.</li>
                      <li>• Get instant feedback and learning notes.</li>
                    </ul>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-2">
                        <div className="text-slate-200">Think</div>
                        <div className="text-[10px] text-indigo-200">
                          Identify the right & remedy.
                        </div>
                      </div>
                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">
                        <div className="text-slate-200">Act</div>
                        <div className="text-[10px] text-emerald-200">
                          Choose the strongest constitutional path.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {isScenarioScreen && currentScenario && (
              <motion.section
                key="scenario-screen"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Scenario
                    </div>
                    <h2 className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold text-slate-50 md:text-xl">
                      {currentScenario.title}
                      <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-0.5 text-[10px] text-slate-300">
                        {currentScenario.topic}
                      </span>
                    </h2>
                    <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-300">
                      <span className="rounded-full bg-slate-800 px-2 py-0.5">
                        Difficulty: {currentScenario.difficulty}
                      </span>
                      {currentScenario.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-indigo-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-300">
                    <motion.div
                      animate={scoreBump ? { scale: 1.12 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14 }}
                      className="mb-1 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200"
                    >
                      <span className="text-[10px] uppercase tracking-[0.15em]">
                        Score
                      </span>
                      <span className="text-sm font-bold text-emerald-300">
                        {score}
                      </span>
                    </motion.div>
                    <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-200">
                      <span>Steps:</span>
                      <span className="font-semibold">
                        {stepsTaken}/{MAX_STEPS_PER_SCENARIO}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepId}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    {/* Story / result box */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 shadow-inner">
                      {currentStep?.end ? (
                        <>
                          <div className="mb-1 text-[13px] font-semibold text-emerald-200">
                            {currentStep.resultText}
                          </div>
                          <p className="text-[12px] text-slate-200">
                            {currentStep.learning}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="mb-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Situation
                          </div>
                          {currentStep?.text && (
                            <p className="leading-relaxed text-[13px] md:text-sm">
                              {currentStep.text}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Image */}
                    {/* {!currentStep?.end &&
                      currentStep?.image &&
                      currentStep?.imageCaption && (
                        <div className="mt-1 flex flex-col items-center gap-2">
                          <div className="relative max-h-72 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg">
                            <motion.img
                              src={currentStep.image}
                              alt={currentStep.imageCaption}
                              initial={{ scale: 1.03, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.4 }}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {currentStep.imageCaption}
                          </p>
                        </div>
                      )} */}

                    {/* Question and options */}
                    {!currentStep?.end && (
                      <>
                        {currentStep?.question && (
                          <div className="mt-2 text-[13px] font-semibold text-slate-100 md:text-sm">
                            {currentStep.question}
                          </div>
                        )}

                        <div className="mt-2 flex flex-col gap-2">
                          {currentStep?.choices?.map((choice, index) => {
                            const isSelected = index === selectedChoiceIndex;

                            let base =
                              "border-slate-700 bg-slate-900/80 hover:border-slate-500 hover:bg-slate-900";
                            if (isSelected && feedback) {
                              if (feedback.type === "good") {
                                base =
                                  "border-emerald-500/70 bg-emerald-500/10 shadow-[0_0_20px_rgba(34,197,94,0.35)]";
                              } else if (feedback.type === "bad") {
                                base =
                                  "border-rose-500/70 bg-rose-500/10 shadow-[0_0_20px_rgba(248,113,113,0.35)]";
                              } else {
                                base =
                                  "border-sky-500/70 bg-sky-500/10 shadow-[0_0_18px_rgba(56,189,248,0.35)]";
                              }
                            }

                            return (
                              <motion.button
                                key={choice.text}
                                type="button"
                                onClick={() => handleChoiceClick(choice, index)}
                                disabled={isLocked}
                                whileHover={
                                  !isLocked
                                    ? { scale: 1.01, x: 2 }
                                    : undefined
                                }
                                whileTap={
                                  !isLocked
                                    ? { scale: 0.98 }
                                    : undefined
                                }
                                className={`w-full rounded-2xl border px-3 py-2.5 text-left text-[13px] md:text-sm transition-all ${
                                  isLocked
                                    ? "cursor-default opacity-80"
                                    : "cursor-pointer"
                                } ${base}`}
                              >
                                {choice.text}
                              </motion.button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Feedback */}
                    {feedback && !currentStep?.end && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={`mt-2 flex items-start gap-2 rounded-2xl border px-3 py-2 text-[12px] ${
                          feedbackColors[feedback.type] ||
                          feedbackColors.neutral
                        }`}
                      >
                        <span className="text-lg">
                          {feedbackEmoji[feedback.type] ||
                            feedbackEmoji.neutral}
                        </span>
                        <div>
                          <div className="text-[11px] font-semibold">
                            Why this matters
                          </div>
                          <p className="text-[11px] leading-relaxed">
                            {feedback.text}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300">
                  <button
                    type="button"
                    onClick={handleBackToFilters}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 transition hover:border-slate-500 hover:bg-slate-900"
                  >
                    ← Change topic/difficulty
                  </button>

                  <p className="flex-1 px-2 text-center text-[10px] text-slate-400">
                    Think like a constitutional lawyer. Identify{" "}
                    <span className="font-semibold">Right</span> →{" "}
                    <span className="font-semibold">Violation</span> →{" "}
                    <span className="font-semibold">Remedy</span>.
                  </p>

                  <button
                    type="button"
                    onClick={handleRestartScenario}
                    className="inline-flex items-center gap-1 rounded-full border border-indigo-500/50 bg-indigo-500/10 px-3 py-1 text-indigo-100 transition hover:bg-indigo-500/20"
                  >
                    🔁 Restart this scenario
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Custom keyframes for floating blobs */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
};

export default ScenarioModeGame;