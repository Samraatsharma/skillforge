
// RULE-BASED EVALUATION ENGINE (No Gemini)

export interface EvaluationResult {
    score: number;
    clarity: number;
    confidence: number;
    structure: number;
    mastery: number;
    verdict: string;
    flags: string[];
}

export function checkStructure(text: string): EvaluationResult {
    const lowerText = text.toLowerCase();
    const words = text.split(' ');

    // 1. Structure Score
    let structure = 50; // Base score
    if (lowerText.includes('first') || lowerText.includes('firstly')) structure += 15;
    if (lowerText.includes('second') || lowerText.includes('secondly') || lowerText.includes('also')) structure += 15;
    if (lowerText.includes('final') || lowerText.includes('lastly') || lowerText.includes('conclusion')) structure += 15;
    if (lowerText.includes('example') || lowerText.includes('instance')) structure += 10;

    // 2. Confidence Score
    let confidence = 70;
    if (lowerText.includes('i think') || lowerText.includes('maybe') || lowerText.includes('sort of')) confidence -= 20;
    if (lowerText.includes('probably') || lowerText.includes('guess')) confidence -= 15;
    if (words.length < 10) confidence -= 30; // Too short
    if (words.length > 50) confidence += 10;

    // 3. Mastery Score
    let mastery = 40;
    const techKeywords = ['principle', 'core', 'fundamental', 'architecture', 'scalability', 'react', 'hook', 'state', 'optimization', 'complexity'];
    techKeywords.forEach(kw => {
        if (lowerText.includes(kw)) mastery += 5;
    });

    // 4. Clarity Setup (Simple Readability proxy)
    let clarity = 60;
    if (text.includes('.')) clarity += 10; // Sentences exist
    if (text.split('.').length > 3) clarity += 10; // Multiple sentences

    // Clamp values 0-100
    structure = Math.min(100, Math.max(0, structure));
    confidence = Math.min(100, Math.max(0, confidence));
    mastery = Math.min(100, Math.max(0, mastery));
    clarity = Math.min(100, Math.max(0, clarity));

    const totalScore = Math.round((structure + confidence + mastery + clarity) / 4);

    // Determine Identity Flags
    const flags = [];
    if (confidence < 50) flags.push('underconfident');
    if (structure > 80) flags.push('structured');
    if (mastery > 70) flags.push('mastery');

    let verdict = "Adequate response, but lacking depth.";
    if (totalScore > 80) verdict = "Exceptional articulation. Strong leadership potential.";
    else if (totalScore > 60) verdict = "Solid logic, but could be more decisive.";
    else if (totalScore < 40) verdict = "Response fragmented. Structure required.";

    // Track Identity Update
    updateIdentityProfile(totalScore, flags);

    return {
        score: totalScore,
        clarity,
        confidence,
        structure,
        mastery,
        verdict,
        flags
    };
}

function updateIdentityProfile(lastScore: number, flags: string[]) {
    if (typeof window === 'undefined') return;

    const current = localStorage.getItem('skillforge_identity_type') || 'Wanderer';
    let newIdentity = current;

    // "Strategist" → clarity high, hesitation low
    if (lastScore > 75 && flags.includes('structured')) newIdentity = 'Strategist';

    // "Builder" → clarity mid, mastery high
    else if (flags.includes('mastery')) newIdentity = 'Builder';

    // "Phoenix" → repeated failure but increasing resilience (simulated by low score but high count)
    else if (lastScore < 50) newIdentity = 'Phoenix'; // Temporary simplification

    localStorage.setItem('skillforge_identity_type', newIdentity);
}
