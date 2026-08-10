// ==========================================================
// Clean AI Coach Response
// ==========================================================

export const getCoachResponse = (coach) => {

    if (!coach) {
        return "";
    }

    // ------------------------------------------------------
    // Case 1: Direct object
    // ------------------------------------------------------

    if (typeof coach === "object") {

        if (
            typeof coach.recommended_response === "string"
        ) {
            return cleanRecommendedResponse(
                coach.recommended_response
            );
        }

        return "";
    }


    // ------------------------------------------------------
    // Case 2: String
    // ------------------------------------------------------

    if (typeof coach === "string") {

        const text = coach.trim();

        // Try normal JSON parsing first
        try {

            const parsed = JSON.parse(text);

            if (
                parsed &&
                typeof parsed === "object" &&
                typeof parsed.recommended_response === "string"
            ) {
                return cleanRecommendedResponse(
                    parsed.recommended_response
                );
            }

            // Handle double encoded JSON
            if (typeof parsed === "string") {

                try {

                    const parsedAgain = JSON.parse(parsed);

                    if (
                        parsedAgain &&
                        typeof parsedAgain.recommended_response === "string"
                    ) {
                        return cleanRecommendedResponse(
                            parsedAgain.recommended_response
                        );
                    }

                } catch {
                    // Continue to fallback extraction
                }
            }

        } catch {
            // Continue to fallback extraction
        }


        // --------------------------------------------------
        // Case 3:
        // JSON-like string where normal JSON.parse fails
        // --------------------------------------------------

        const match = text.match(
            /["']recommended_response["']\s*:\s*["']([\s\S]*?)["']\s*,\s*["']suggested_actions["']/
        );

        if (match && match[1]) {

            return cleanRecommendedResponse(
                match[1]
            );
        }


        // --------------------------------------------------
        // Case 4: Already normal AI text
        // --------------------------------------------------

        return cleanRecommendedResponse(text);
    }


    return "";
};


// ==========================================================
// Clean escaped characters
// ==========================================================

function cleanRecommendedResponse(text) {

    if (!text) {
        return "";
    }

    return String(text)

        // Convert escaped new lines
        .replace(/\\n/g, "\n")

        // Convert escaped tabs
        .replace(/\\t/g, " ")

        // Remove escaped quotes
        .replace(/\\"/g, '"')

        // Remove extra spaces before new lines
        .replace(/[ \t]+\n/g, "\n")

        // Prevent too many blank lines
        .replace(/\n{3,}/g, "\n\n")

        .trim();
}