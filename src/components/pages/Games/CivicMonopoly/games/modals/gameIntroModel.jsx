// Game Indtroduction Mdoel 
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { REQUIRED_POINTS_TO_WIN } from "../../data/gameData";


const TABS = [
    { id: "rules", label: "Game Rules" },
    // { id: "power-cards", label: "Power Cards" },
    // { id: "achievements", label: "Achievements" },
    { id: "roles", label: "Player Roles" },
]

const GameIntroModel = ({ open = false, onStart, onClose }) => {
    const [active, setActive] = useState("rules");
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    if (!open) return null;
    return (
        <>
            {/* Backdrop  */}
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onclose} arial-hidden="true" />

            {/* Modal  */}
            <div role="dialog" arial-modal="true"
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-2xl">
                <h2 className="mb-6 text-center text-3xl font-bold text-blue-600">
                    Welcome To Civic Monopoly! 🏛️
                </h2>

                {/* TABS  */}
                <div className="mb-5 flex border-b-2 border-gray-200">
                    {TABS.map((t) => {
                        const isActive = active === t.id;
                        return (
                            <button key={t.id}
                                className={`flex-1 px-5 py-3 font-semibold transition ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-violet-100"
                                    }`}
                                onClick={() => setActive(t.id)}>{t.label}</button>
                        );
                    })}
                </div>

                {/* Content  */}
                <div className="max-h-[60vh] overflow-y-auto space-y-4 px-1">
                    {active === "rules" && (
                        <div className="space-y-4">
                            <section className="rounded-lg border-1-4 border-emerald-500 bg-gray-50 p-4">
                                <h3 className="mb-2 text-xl font-bold text-green-600">🎯Game Objective</h3>
                                <p>
                                    Win by reaching <strong>{REQUIRED_POINTS_TO_WIN} Civic Points</strong> OR by owning assets from
                                    <strong> all 4 categories</strong> (Rights, Duties, Institutions, Events).
                                </p>
                            </section>

                            <section className="rounded-lg border-l-4 border-emerald-500 bg-gray-50 p-4">
                                <h3 className="mb-2 text-xl font-bold text-blue-600">🎲 How to Play</h3>
                                <ul className="list-inside list-disc space-y-2">
                                    <li><strong>Roll Dice:</strong> Move around the board and land on various civic tiles</li>
                                    <li><strong>Answer Questions:</strong> Correctly answer questions to own assets and gain points</li>
                                    <li><strong>Collect Power Cards:</strong> Use strategic cards to gain advantages</li>
                                    <li><strong>Build Assets:</strong> Own multiple assets from different categories for bonus points</li>
                                </ul>
                            </section>

                            <section className="rounded-lg border-l-4 border-emerald-500 bg-gray-50 p-4">
                                <h3 className="mb-2 text-xl font-bold text-purple-600">🏛️ Tile Types</h3>
                                <ul className="list-inside list-disc space-y-2">
                                    <li><strong>Rights (Red):</strong> Fundamental rights - 10 points each</li>
                                    <li><strong>Duties (Orange):</strong> Fundamental duties - 8 points, 4 point penalty if wrong</li>
                                    <li><strong>Institutions (Blue):</strong> Government bodies - 12 points, 6 point penalty, award power cards</li>
                                    <li><strong>Events (Green):</strong> Historical milestones - 15 points, 5 point penalty</li>
                                    <li><strong>Civic Challenge (Yellow):</strong> Real-world scenarios - variable rewards</li>
                                    <li><strong>Corner Tiles:</strong> Special spaces with unique effects</li>
                                </ul>
                            </section>

                            <section className="rounded-lg border-l-4 border-emerald-500 bg-gray-50 p-4">
                                <h3 className="mb-2 text-xl font-bold text-red-600">⚡ Special Features</h3>
                                <ul className="list-inside list-disc space-y-2">
                                    <li><strong>Dynamic Difficulty:</strong> Questions get harder as you improve</li>
                                    <li><strong>Streak Bonus:</strong> Get bonus points for consecutive correct answers</li>
                                    <li><strong>Role Abilities:</strong> Each player has unique special abilities</li>
                                    <li><strong>Auto-Save:</strong> Game saves automatically every 5 rounds</li>
                                </ul>
                            </section>

                        </div>
                    )}

                    {/* Power Card  */}
                    {active === "power-cards" && (
                        <div className="space-y-4">
                            <p className="mb-2 text-gray-700">
                                Power cards are strategic tools that can change the game! Collect them by correctly answering Institution questions.
                            </p>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="rounded-lg border-l-4 border-gray-500 bg-gradient-to-br from-gray-100 to-gray-200 p-3">
                                    <h4 className="mb-2 font-bold text-gray-700">🔘 Common Cards</h4>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Double Points:</strong> Double your next question's points</p>
                                        <p><strong>Re-roll Dice:</strong> Roll the dice again on your turn</p>
                                        <p><strong>Skip Penalty:</strong> Avoid paying rent to other players</p>
                                        <p><strong>Judicial Review:</strong> Protection from negative effects</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border-l-4 border-blue-500 bg-gradient-to-br from-gray-100 to-gray-200 p-3">
                                    <h4 className="mb-2 font-bold text-blue-700">🔷 Rare Cards</h4>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Constitutional Challenge:</strong> Battle for another player's asset</p>
                                        <p><strong>Emergency Session:</strong> Take an extra turn</p>
                                        <p><strong>Tax Collection:</strong> Collect 5 points from all players</p>
                                        <p><strong>Direct Petition:</strong> Move to any tile</p>
                                        <p><strong>Public Interest Litigation:</strong> Force a player to answer a question</p>
                                        <p><strong>Asset Freeze:</strong> Stop all transactions for 2 rounds</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border-l-4 border-violet-500 bg-gradient-to-br from-gray-100 to-gray-200 p-3">
                                    <h4 className="mb-2 font-bold text-purple-700">💎 Epic Cards</h4>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Constitution Assembly:</strong> Swap positions with any player</p>
                                        <p><strong>Referendum:</strong> All players vote on your bonus/penalty</p>
                                        <p><strong>Knowledge Boost:</strong> See the correct answer for your next question</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border-l-4 border-amber-500 bg-gradient-to-br from-gray-100 to-gray-200 p-3">
                                    <h4 className="mb-2 font-bold text-yellow-700">👑 Legendary Cards</h4>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Emergency Powers:</strong> All other players skip their next turn</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 rounded-lg bg-blue-50 p-4">
                                <h4 className="mb-2 font-bold text-blue-800">💡 Strategic Tips:</h4>
                                <ul className="list-inside list-disc space-y-1 text-sm text-blue-700">
                                    <li>Save powerful cards for crucial moments</li>
                                    <li>Use challenge cards when opponents have valuable assets</li>
                                    <li>Timing is everything - some cards are best used defensively</li>
                                    <li>Rarer cards have more game-changing effects</li>
                                </ul>
                            </div>
                        </div>
                    )}
                {active === "achievements" && (
                    <div className="space-y-3">
                        {[
                            { icon: "👶", title: "First Steps", desc: "Answer your first question correctly" },
                            { icon: "🧠", title: "Knowledge Seeker", desc: "Get 5 questions right in a row" },
                            { icon: "📜", title: "Constitution Master", desc: "Own assets from all categories" },
                            { icon: "🏆", title: "Civic Champion", desc: "Win without using any power cards" },
                            { icon: "⚡", title: "Power Player", desc: "Collect 5 power cards in one game" },
                            { icon: "💯", title: "Perfectionist", desc: "Answer 10 questions correctly without a mistake" },
                            { icon: "💰", title: "Wealthy Citizen", desc: "Reach 100 Civic Points" },
                            { icon: "🏃", title: "Speed Demon", desc: "Win in under 10 rounds" },
                        ].map((a) => (
                            <div key={a.title} className="flex items-center rounded bg-gray-100 p-3">
                                <div className="mr-3 text-2xl">{a.icon}</div>
                                <div>
                                    <div className="font-bold">{a.title}</div>
                                    <div className="text-sm text-gray-600">{a.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {active === "roles" && (
                    <div className="space-y-4">
                        <RoleCard color="purple" emoji="⚖️" title="Judge" ability="30% chance to avoid penalties from wrong answers" hint="Perfect for defensive players who want protection from mistakes" />
                        <RoleCard color="green" emoji="👤" title="Citizen" ability="20% bonus points for correct answers" hint="Great for players who focus on accumulating points quickly" />
                        <RoleCard color="yellow" emoji="✊" title="Activist" ability="Enhanced challenge abilities and civic action bonuses" hint="Ideal for aggressive players who like to challenge others" />
                        <RoleCard color="blue" emoji="📚" title="Scholar" ability="Sees hints for difficult questions" hint="Perfect for players who want help with challenging questions" />
                    </div>
                )}

                </div>
                <div className="mt-6 flex justify-center gap-3">
                    {onClose && (
                        <button className="rounded-lg bg-gray-400 px-6 py-3 font-bold text-white hover:bg-gray-500"
                            onClick={()=>{onClose?.(); navigate("/");}} >Back</button>
                    )}
                    <button
                        id="start-intro-btn"
                        className="rounded-lg bg-green-500 px-8 py-3 text-lg font-bold text-white hover:bg-green-600"
                        onClick={onStart}
                    >
                        Let's Play! 🚀
                    </button>
                </div>
            </div>
        </>
    )
};
function RoleCard({color, emoji, title, ability, hint}){
    const colorMap = {
        purple: {bg: "bg-purple-50", border: "border-purple-500", title:"text-purple-700", text: "text-purple-600"},
        green: {bg: "bg-green-50", border: "border-green-500", title:"text-green-700", text: "text-green-600"},
        yellow: {bg: "bg-yellow-50", border: "border-yellow-500", title:"text-yellow-700", text: "text-yellow-600"},
        blue: {bg: "bg-blue-50", border: "border-blue-500", title:"text-blue-700", text: "text-blue-600"},
    }[color] || { bg: "bg-gray-50", border: "border-gray-400", title: "text-gray-800", text: "text-gray-600" };

    return (
    <div className={`rounded-lg border-l-4 ${colorMap.border} ${colorMap.bg} p-4`}>
      <div className="mb-2 flex items-center">
        <span className="mr-3 text-2xl">{emoji}</span>
        <h4 className={`font-bold ${colorMap.title}`}>{title}</h4>
      </div>
      <p className={`text-sm ${colorMap.text}`}>
        <strong>Ability:</strong> {ability}
      </p>
      <p className="mt-1 text-xs text-gray-600">{hint}</p>
    </div>
  );
}

export default GameIntroModel;