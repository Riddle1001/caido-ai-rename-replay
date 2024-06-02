import { caidoAPI } from "./caidoapi";

function createAssistantSession(prompt, modelId) {
    return caidoAPI.graphql.createAssistantSession({
        input: {
            systemMessage: prompt,
            modelId: modelId,
        },
    });
}

function sendMessageToAssistant(sessionId, message) {
    return caidoAPI.graphql.sendAssistantMessage({
        sessionId: sessionId,
        message: message,
    });
}

function pollForResponse(sessionId) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            caidoAPI.graphql
                .assistantSession({ id: sessionId })
                .then((data) => {
                    if (data.assistantSession.messages.length >= 3) {
                        const response = data.assistantSession.messages[2].content;
                        clearInterval(interval);
                        resolve(response);
                    }
                })
                .catch((error) => {
                    clearInterval(interval);
                    reject(error);
                });
        }, 1000);
    });
}

function deleteAssistantSession(sessionId) {
    return caidoAPI.graphql.deleteAssistantSession({
        id: sessionId,
    });
}

function generateText(prompt, message) {
    let sessionId = null;
    return createAssistantSession(prompt, "gpt-3.5-turbo")
        .then((sessionData) => {
            sessionId = sessionData.createAssistantSession.session.id;
            return sendMessageToAssistant(sessionId, message);
        })
        .then(() => pollForResponse(sessionId))
        .then((response) => {
            return deleteAssistantSession(sessionId).then(() => response);
        })
        .catch((error) => {
            if (sessionId) {
                return deleteAssistantSession(sessionId).then(() => Promise.reject(error));
            }
            return Promise.reject(error);
        });
}

export default generateText;
