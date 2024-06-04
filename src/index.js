import generateText from "./generate_text.js";
import getSelectedTabIds from "./replaytabs.js";
import { getCurrentPage, addPopupItem } from "./ui.js";
import {
    extractRequestLineHostAndBody,
    getReplayRawRequest,
    isGraphQLBody,
    extractOperationNameFromRawGraphQL,
} from "./http.js";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { caidoAPI, setCaidoAPI } from "./caidoapi.js";

const systemMessage =
    "Given the user's HTTP request, provide a short name for the request one-five words max. Be descriptive and specific.";

const generateReplayNameForReplayID = async (selectedReplayID) => {
    const replayText = await getReplayRawRequest(selectedReplayID);
    const httpRequest = extractRequestLineHostAndBody(replayText);
    const body = httpRequest.split("\n\n")[1];
    if (isGraphQLBody(body)) {
        const operationName = extractOperationNameFromRawGraphQL(body);
        caidoAPI.graphql.renameReplaySession({
            id: selectedReplayID,
            name: `GraphQL: ${operationName}`,
        });
        return;
    }
    return await generateText(systemMessage, httpRequest);
};

export const init = (caido) => {
    const evenBetterAPI = new EvenBetterAPI(caido, {
        manifestID: "ai-rename",
        name: "AI Replay Rename" 
    });

    setCaidoAPI(caido);

    evenBetterAPI.eventManager.on("onContextMenuOpen", (data) => {
        if (getCurrentPage() !== "#/replay") return;
        addPopupItem("Generate Replay Name", async () => {
            const selectedReplayIDs = getSelectedTabIds();

            selectedReplayIDs.map(async (selectedReplayID) => {
                const generatedReplayName = await generateReplayNameForReplayID(selectedReplayID);
                caido.graphql.renameReplaySession({
                    id: selectedReplayID,
                    name: generatedReplayName,
                });
            });
        });
    });
};
