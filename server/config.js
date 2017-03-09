 var config = {};

config.host = process.env.HOST || "https://sam.documents.azure.com:443";
config.authKey = process.env.AUTH_KEY || "sXq+OODey+TCCQVNyikb2dMbzwtdhO8Xf629+45YF2tc2Kp/rKek4PH6wxG+y3paYuo+SyEnEs/OqScxCOMYew==";
config.databaseId = "CodeWhite";
config.collectionId = "codewhiteitems";

 module.exports = config;