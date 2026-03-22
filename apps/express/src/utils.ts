import express from "express";

export const validateMessage = (message: unknown, response: express.Response): message is string => {
    if (typeof message !== "string" || !message.trim()) {
        response.status(400).json({ error: "message must be a non-empty string" });
        return false;
    }

    return true;
};