const Joi = require("joi");

/**
 * Middleware factory: validates req.body against a Joi schema
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(422).json({ success: false, errors: messages });
  }
  next();
};

// ── Shared Schemas ────────────────────────────────────────────────────────────
const schemas = {
  registerTree: Joi.object({
    lat:              Joi.number().min(-90).max(90).required(),
    lng:              Joi.number().min(-180).max(180).required(),
    treeSpecies:      Joi.string().min(2).max(80).required(),
    planterAccountId: Joi.string().pattern(/^0\.0\.\d+$/).required(),
    deviceSignature:  Joi.string().required(),
  }),

  uploadCulturalAsset: Joi.object({
    title:             Joi.string().min(3).max(120).required(),
    assetType:         Joi.string().valid("oral_story","song","dance","craft","ceremony","language","symbol","artifact").required(),
    tribalAttribution: Joi.string().required(),
    fpicConsentHash:   Joi.string().length(66).required(),
    cid:               Joi.string().required(),
    creatorAccountId:  Joi.string().pattern(/^0\.0\.\d+$/).required(),
    accessTags:        Joi.array().items(Joi.string()).default([]),
  }),

  wellnessCheckIn: Joi.object({
    accountId:            Joi.string().pattern(/^0\.0\.\d+$/).required(),
    selfAssessmentScore:  Joi.number().min(1).max(10).required(),
    categories:           Joi.array().items(Joi.string()).optional(),
    consentHash:          Joi.string().optional(),
  }),
};

module.exports = { validate, schemas };
