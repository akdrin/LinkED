function tokenize(text = "") {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
}

function jaccardSimilarity(aTokens, bTokens) {
    const setA = new Set(aTokens)
    const setB = new Set(bTokens)

    if (!setA.size || !setB.size) {
        return 0
    }

    const intersection = [ ...setA ].filter(item => setB.has(item)).length
    const union = new Set([ ...setA, ...setB ]).size

    return intersection / union
}

function recommendMentorsForStudent(student, mentors) {
    const studentSignal = [
        student.branch,
        student.bio,
        ...(student.expertise || [])
    ].join(" ")

    const studentTokens = tokenize(studentSignal)

    return mentors
        .map((mentor) => {
            const mentorSignal = [
                mentor.branch,
                mentor.company,
                mentor.bio,
                ...(mentor.expertise || [])
            ].join(" ")

            const mentorTokens = tokenize(mentorSignal)
            const relevance = jaccardSimilarity(studentTokens, mentorTokens)
            const sameBranchBoost = student.branch && mentor.branch && student.branch.toLowerCase() === mentor.branch.toLowerCase() ? 0.15 : 0
            const score = Math.min(1, relevance + sameBranchBoost)

            return {
                mentor,
                score: Number((score * 100).toFixed(1))
            }
        })
        .sort((a, b) => b.score - a.score)
}

module.exports = {
    recommendMentorsForStudent
}
