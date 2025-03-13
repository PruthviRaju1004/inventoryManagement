"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDomain = validateDomain;
function validateDomain(email, website) {
    try {
        // Ensure website has a valid URL scheme
        const formattedWebsite = website.startsWith("http://") || website.startsWith("https://")
            ? website
            : `https://${website}`;
        const emailDomain = email.split("@")[1]; // Extract domain from email
        let websiteDomain = new URL(formattedWebsite).hostname; // Extract domain from URL
        // Remove "www." if present
        if (websiteDomain.startsWith("www.")) {
            websiteDomain = websiteDomain.substring(4);
        }
        return emailDomain === websiteDomain;
    }
    catch (error) {
        console.error("Invalid website URL:", website, error);
        return false;
    }
}
