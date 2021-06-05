export const MessageTranslations = {
    [-1]: "error",
    1: "connection",
    2: "status",
    3: "header",
    4: "headersComplete",
    5: "requestFragment",
    6: "requestComplete",
    8: "prepareResponse",
    9: "responseFragment",
    10: "responseComplete"
};
export var MessageValue;
(function (MessageValue) {
    MessageValue[MessageValue["error"] = -1] = "error";
    MessageValue[MessageValue["connection"] = 1] = "connection";
    MessageValue[MessageValue["status"] = 2] = "status";
    MessageValue[MessageValue["header"] = 3] = "header";
    MessageValue[MessageValue["headersComplete"] = 4] = "headersComplete";
    MessageValue[MessageValue["requestFragment"] = 5] = "requestFragment";
    MessageValue[MessageValue["requestComplete"] = 6] = "requestComplete";
    MessageValue[MessageValue["prepareResponse"] = 8] = "prepareResponse";
    MessageValue[MessageValue["responseFragment"] = 9] = "responseFragment";
    MessageValue[MessageValue["responseComplete"] = 10] = "responseComplete";
})(MessageValue || (MessageValue = {}));
