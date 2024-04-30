function extractRequestLineHostAndBody(httpRequest) {
    const lines = httpRequest.split("\n");
    const firstLine = lines[0];
    const secondLine = lines[1];
    const body = lines.join("\n").split("\n\n")[1];
    return firstLine + "\n" + secondLine + "\n\n" + (body || "");
}

async function getReplayRawRequest(id) {
    const replayDetails = (await Caido.graphql.replaySessionEntries({ id: id.toString() })).replaySession.activeEntry;
    console.log(replayDetails);
    if (replayDetails) {
        const reqId = replayDetails.request.id;
        const foundRequest = (await Caido.graphql.request({ id: reqId })).request;
        if (foundRequest) {
            return foundRequest.raw;
        }
    }
}

function isGraphQLBody(body) {
    return body.includes("operationName");
}

function extractOperationNameFromRawGraphQL(rawGraphQLString) {
    const regex = /"operationName"\s*:\s*"([^"]+)"/;
    const match = regex.exec(rawGraphQLString);
    if (match && match[1]) {
        return match[1];
    } else {
        return "BUG!! No operationName found";
    }
}

export { extractRequestLineHostAndBody, getReplayRawRequest, isGraphQLBody, extractOperationNameFromRawGraphQL };
