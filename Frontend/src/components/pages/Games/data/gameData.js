// # Tiles, cards, questions
const tiles = [
    { name: 'We The People', type: 'corner', corner: 'start' },
    { name: 'Equality Right', type: 'right', category: 'rights', question: 'Article 14 guarantees equality before the law. This means...', options: ['Everyone is treated identically', 'The law applies to all citizens without discrimination', 'Only citizens can vote', 'Rich people have more rights'], answer: 1, points: 10 },
    { name: 'Civic Challenge', type: 'challenge' },
    { name: 'Freedom Right', type: 'right', category: 'rights', question: 'Which of these is NOT part of the Freedom Right under Article 19?', options: ['Freedom of speech', 'Assemble peacefully', 'Form associations', 'Right to strike and disrupt'], answer: 3, points: 10 },
    { name: 'Uphold Unity', type: 'duty', category: 'duties', question: 'Which duty involves upholding and protecting the sovereignty, unity, and integrity of India?', options: ['Paying taxes', 'A fundamental duty', 'Voting in elections', 'Following traffic rules'], answer: 1, points: 8, penalty: 4 },
    { name: 'Supreme Court', type: 'institution', category: 'institutions', question: 'What is the primary role of the Supreme Court of India?', options: ['To make laws', 'To enforce laws', 'To interpret the Constitution and laws', 'To elect the President'], answer: 2, points: 12, penalty: 6 },
    { name: 'Right to Education', type: 'right', category: 'rights', question: 'The Right to Education (Article 21A) guarantees free and compulsory education for children of which age group?', options: ['6 to 14 years', '5 to 12 years', 'Up to 18 years', 'All ages'], answer: 0, points: 10 },
    { name: 'Constitution Adopted', type: 'event', category: 'events', question: 'On which date was the Constitution of India adopted by the Constituent Assembly?', options: ['15th Aug 1947', '26th Jan 1950', '26th Nov 1949', '2nd Oct 1869'], answer: 2, points: 15, penalty: 5 },
    { name: 'Honor Struggle', type: 'duty', category: 'duties', question: 'A fundamental duty is to cherish and follow the noble ideals that inspired our national struggle for freedom. True or False?', options: ['True', 'False'], answer: 0, points: 8, penalty: 4 },
    { name: 'Right against Exploitation', type: 'right', category: 'rights', question: 'This right prohibits human trafficking and forced labor.', options: ['Freedom Right', 'Right against Exploitation', 'Equality Right', 'Cultural Rights'], answer: 1, points: 10 },
    { name: 'Amendment Zone', type: 'corner', corner: 'amendment' },
    { name: 'Institution: Parliament', type: 'institution', category: 'institutions', question: 'The Parliament of India consists of the President and which two houses?', options: ['Lok Sabha and Vidhan Sabha', 'Lok Sabha and Rajya Sabha', 'Rajya Sabha and State Council', 'House of Commons and House of Lords'], answer: 1, points: 12, penalty: 6 },
    { name: 'Civic Challenge', type: 'challenge' },
    { name: 'Duty: Protect Environment', type: 'duty', category: 'duties', question: 'Protecting and improving the natural environment including forests, lakes, and wildlife is a...', options: ['Legal obligation for companies only', 'Fundamental Duty for every citizen', 'Optional activity', 'Government responsibility only'], answer: 1, points: 8, penalty: 4 },
    { name: 'Right to Constitutional Remedies', type: 'right', category: 'rights', question: 'Which article is called the "heart and soul" of the Constitution as it allows citizens to move the court if their rights are violated?', options: ['Article 14', 'Article 19', 'Article 32', 'Article 51A'], answer: 2, points: 10 },
    { name: 'Institution: Election Commission', type: 'institution', category: 'institutions', question: 'What is the main function of the Election Commission of India?', options: ['To count votes', 'To conduct free and fair elections', 'To select candidates', 'To fund political parties'], answer: 1, points: 12, penalty: 6 },
    { name: 'Landmark Event: Quit India Movement', type: 'event', category: 'events', question: 'In which year did the Quit India Movement, a major milestone in the freedom struggle, begin?', options: ['1920', '1930', '1942', '1947'], answer: 2, points: 15, penalty: 5 },
    { name: 'Duty: Scientific Temper', type: 'duty', category: 'duties', question: 'Developing scientific temper, humanism, and the spirit of inquiry and reform is a fundamental duty. True or False?', options: ['True', 'False'], answer: 0, points: 8, penalty: 4 },
    { name: 'Civic Challenge', type: 'challenge' },
    { name: 'Cultural and Educational Rights', type: 'right', category: 'rights', question: 'These rights protect the interests of which groups?', options: ['All citizens', 'Only the majority community', 'Religious and linguistic minorities', 'Only foreign visitors'], answer: 2, points: 10 },
    { name: 'Free Parking', type: 'corner', corner: 'parking' },
    { name: 'Right to Information (RTI)', type: 'right', category: 'rights', question: 'The RTI Act allows citizens to access information from...', options: ['Private companies', 'Public authorities (government bodies)', 'Foreign embassies', 'Only the courts'], answer: 1, points: 10 },
    { name: 'Duty: Safeguard Public Property', type: 'duty', category: 'duties', question: 'Damaging public property like buses or monuments violates a fundamental duty. True or False?', options: ['True', 'False'], answer: 0, points: 8, penalty: 4 },
    { name: 'Institution: President of India', type: 'institution', category: 'institutions', question: 'Who is the constitutional head of the Republic of India?', options: ['Prime Minister', 'Chief Justice', 'President', 'Speaker of Lok Sabha'], answer: 2, points: 12, penalty: 6 },
    { name: 'Landmark Event: Dandi March', type: 'event', category: 'events', question: 'The Dandi March, led by Mahatma Gandhi, was a protest against the tax on what?', options: ['Tea', 'Cotton', 'Salt', 'Land'], answer: 2, points: 15, penalty: 5 },
    { name: 'Civic Challenge', type: 'challenge' },
    { name: 'Right to Privacy', type: 'right', category: 'rights', question: 'The Supreme Court declared the Right to Privacy as a fundamental right, intrinsic to...', options: ['Right to Property', 'Right to Life and Personal Liberty (Article 21)', 'Right to Vote', 'Right to Work'], answer: 1, points: 10 },
    { name: 'Duty: Abide by Constitution', type: 'duty', category: 'duties', question: 'The very first fundamental duty listed in the Constitution is to...', options: ['Pay taxes', 'Vote regularly', 'Abide by the Constitution and respect its ideals', 'Serve in the army'], answer: 2, points: 8, penalty: 4 },
    { name: 'Institution: Panchayati Raj', type: 'institution', category: 'institutions', question: 'Panchayati Raj refers to the system of local self-government in which area?', options: ['Urban areas', 'Rural areas', 'Metropolitan cities', 'Union Territories'], answer: 1, points: 12, penalty: 6 },
    { name: 'Landmark Event: First General Election', type: 'event', category: 'events', question: 'India held its first-ever general elections in which period?', options: ['1947-48', '1951-52', '1961-62', '1971-72'], answer: 1, points: 15, penalty: 5 },
    { name: 'Go to Challenge', type: 'corner', corner: 'go_to_challenge' },
    { name: 'Freedom Right of Religion', type: 'right', category: 'rights', question: 'This right allows citizens to profess, practice, and propagate any religion of their choice. True or False?', options: ['True', 'False'], answer: 0, points: 10 },
    { name: 'Duty: Strive for Excellence', type: 'duty', category: 'duties', question: 'To strive towards excellence in all spheres of individual and collective activity is a...', options: ['Fundamental Right', 'Directive Principle', 'Fundamental Duty', 'Preamble goal'], answer: 2, points: 8, penalty: 4 },
    { name: 'Civic Challenge', type: 'challenge' },
    { name: 'Institution: Reserve Bank of India', type: 'institution', category: 'institutions', question: 'Which institution is responsible for issuing currency and regulating India\'s financial system?', options: ['State Bank of India', 'Ministry of Finance', 'NITI Aayog', 'Reserve Bank of India'], answer: 3, points: 12, penalty: 6 },
    { name: 'Landmark Event: Green Revolution', type: 'event', category: 'events', question: 'The Green Revolution in India primarily increased the production of which food grains?', options: ['Pulses and millets', 'Fruits and vegetables', 'Rice and wheat', 'Oilseeds'], answer: 2, points: 15, penalty: 5 },
    { name: 'Duty: Provide Education Opportunity', type: 'duty', category: 'duties', question: 'It is a duty for a parent or guardian to provide opportunities for education to their child between the ages of 6 and 14. True or False?', options: ['True', 'False'], answer: 0, points: 8, penalty: 4 },
    { name: 'Civic Challenge', type: 'challenge' },
    { name: 'Right to Life', type: 'right', category: 'rights', question: 'Article 21 protects the Right to Life and...', options: ['Property', 'Personal Liberty', 'Work', 'Vote'], answer: 1, points: 10 },
    { name: 'Institution: NITI Aayog', type: 'institution', category: 'institutions', question: 'NITI Aayog replaced which former body as the premier policy think tank of the Indian government?', options: ['Finance Commission', 'Planning Commission', 'Law Commission', 'Election Commission'], answer: 1, points: 12, penalty: 6 },
];
export default tiles;

export const powerCardDeck = [
    { id: 'double_points', name: 'Double Points', description: 'Double the points you earn on your next correct answer this turn.', rarity: 'common' },
    { id: 'reroll', name: 'Re-roll Dice', description: 'Not happy with your roll? Use this to roll the dice one more time.', rarity: 'common' },
    { id: 'skip_penalty', name: 'Skip Penalty', description: 'Use this to avoid paying points when you land on another player\'s asset.', rarity: 'common' },
    { id: 'steal_asset', name: 'Constitutional Challenge', description: 'Challenge another player\'s ownership of an asset through a quiz battle.', rarity: 'rare' },
    { id: 'extra_turn', name: 'Emergency Session', description: 'Take an extra turn after your current turn ends.', rarity: 'rare' },
    { id: 'shield', name: 'Judicial Review', description: 'Protect yourself from the next negative effect or penalty.', rarity: 'common' },
    { id: 'tax_collector', name: 'Tax Collection', description: 'Collect 5 points from every other player.', rarity: 'rare' },
    { id: 'teleport', name: 'Direct Petition', description: 'Move directly to any tile of your choice.', rarity: 'rare' },
    { id: 'swap_positions', name: 'Constitution Assembly', description: 'Swap positions with any player of your choice.', rarity: 'epic' },
    { id: 'referendum', name: 'Referendum', description: 'All players vote on a bonus/penalty for you.', rarity: 'epic' },
    { id: 'emergency_powers', name: 'Emergency Powers', description: 'All other players skip their next turn.', rarity: 'legendary' },
    { id: 'public_interest', name: 'Public Interest Litigation', description: 'Force any player to answer a bonus question.', rarity: 'rare' },
    { id: 'knowledge_boost', name: 'Knowledge Boost', description: 'See the correct answer for your next question.', rarity: 'epic' },
    { id: 'asset_freeze', name: 'Asset Freeze', description: 'Prevent all asset transactions for 2 rounds.', rarity: 'rare' }
];

export const challengeDeck = [
    { question: 'A new bill is introduced that may restrict online privacy. What is the most effective first step a citizen can take to voice their concern?', options: ['Complain on social media', 'Write to their Member of Parliament (MP)', 'Organize a protest immediately', 'Ignore the bill'], answer: 1 },
    { question: 'You witness a person damaging a public monument. What is the correct civic action to take?', options: ['Confront them physically', 'Ignore it', 'Record a video for social media', 'Report it to the authorities/police'], answer: 3 },
    { question: 'During a natural disaster, what is the most important civic responsibility?', options: ['Post about it on social media', 'Help coordinate relief efforts', 'Blame the government', 'Stay indoors and do nothing'], answer: 1 },
    { question: 'If you notice corruption in a government office, what should be your first action?', options: ['Ignore it', 'File a complaint with anti-corruption authorities', 'Spread rumors', 'Try to benefit from it'], answer: 1 }
];

export const randomEvents = [
    { name: 'Constitutional Amendment', description: 'A new amendment benefits all players. Everyone gains 15 points!', effect: 'all_gain', amount: 15 },
    { name: 'Economic Crisis', description: 'Market instability! All players lose 10 points.', effect: 'all_lose', amount: 10 },
    { name: 'Digital India Initiative', description: 'Technology boost! The current player gains an extra power card.', effect: 'power_card', amount: 1 },
    { name: 'Transparency Drive', description: 'Government audit! The richest player loses 20 points.', effect: 'richest_lose', amount: 20 },
    { name: 'Education Reform', description: 'Knowledge sharing! All players with fewer than 3 assets gain 10 points.', effect: 'poor_gain', amount: 10 },
    { name: 'Civic Awareness Campaign', description: 'Public engagement! Next question answered correctly gives triple points.', effect: 'triple_next', amount: 0 },
    { name: 'Infrastructure Development', description: 'New opportunities! All corner tiles now give 10 bonus points when passed.', effect: 'corner_bonus', amount: 10 }
];

export const achievements = [
    { id: 'first_steps', name: 'First Steps', description: 'Answer your first question correctly', icon: '👶', condition: (player) => player.correctAnswers >= 1 },
    { id: 'knowledge_seeker', name: 'Knowledge Seeker', description: 'Get 5 questions right in a row', icon: '🧠', condition: (player) => player.streak >= 5 },
    {
        id: 'constitution_master', name: 'Constitution Master', description: 'Own assets from all categories', icon: '📜', condition: (player) => {
            const categories = new Set();
            player.ownedTiles.forEach(tileIndex => {
                const tile = tiles[tileIndex];
                if (tile.category) categories.add(tile.category);
            });
            return categories.size >= 4;
        }
    },
    { id: 'civic_champion', name: 'Civic Champion', description: 'Win without using power cards', icon: '🏆', condition: (player) => player.wonWithoutPowerCards },
    { id: 'power_player', name: 'Power Player', description: 'Collect 5 power cards in one game', icon: '⚡', condition: (player) => player.maxPowerCards >= 5 },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Answer 10 questions correctly without a mistake', icon: '💯', condition: (player) => player.perfectStreak >= 10 },
    { id: 'wealthy_citizen', name: 'Wealthy Citizen', description: 'Reach 100 Civic Points', icon: '💰', condition: (player) => player.score >= 100 },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Win in under 10 rounds', icon: '🏃', condition: (player) => player.wonInRounds <= 10 }
];

export const playerColors = ['#ef4444', '#3b82f6', '#22c55e', '#f97316'];
export const playerRoles = [
    { name: 'Judge', icon: '⚖️', ability: 'Extra protection from penalties', color: '#8b5cf6' },
    { name: 'Citizen', icon: '👤', ability: 'Bonus points for correct answers', color: '#10b981' },
    { name: 'Activist', icon: '✊', ability: 'Can challenge more frequently', color: '#f59e0b' },
    { name: 'Scholar', icon: '📚', ability: 'Sees hint for first wrong answer', color: '#3b82f6' }
];