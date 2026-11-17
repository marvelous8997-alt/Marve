const UAParser = require("ua-parser-js");

const getDeviceInfo = (req) => {
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    return {
        browser: result.browser.name || "Unknown",
        browserVersion: result.browser.version || "",
        platform: result.os.name || "Unknown",
        platformVersion: result.os.version || "",
        deviceName:
            result.device.model ||
            result.device.vendor ||
            "Desktop",
        userAgent: req.headers["user-agent"],
        ipAddress:
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            req.ip,
    };
};

module.exports = {
    getDeviceInfo,
};