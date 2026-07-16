import openai from "./AI_config.js";

function slimVtData(vtData, scanType) {
  const attrs = vtData?.data?.attributes ?? {};
  return {
    scanType,
    status: attrs.status,
    target: scanType === "url"
      ? attrs.url
      : attrs.meaningful_name || vtData?.meta?.file_info?.sha256,
    stats: attrs.stats ?? attrs.last_analysis_stats ?? {},
  };
}

function fallbackSummary(slim) {
  const { malicious = 0, suspicious = 0, harmless = 0 } = slim.stats;

  if (malicious > 0) {
    return {
      verdict: "malicious",
      headline: `${malicious} engine(s) flagged this as malicious`,
      explanation: `The scan reported ${malicious} malicious and ${suspicious} suspicious detection(s).`,
      recommendation: "Avoid opening this. Do not download or share it further.",
    };
  }

  if (suspicious > 0) {
    return {
      verdict: "suspicious",
      headline: `${suspicious} engine(s) marked this as suspicious`,
      explanation: `No malicious flags, but ${suspicious} engine(s) found it suspicious.`,
      recommendation: "Proceed with caution or avoid if you are unsure.",
    };
  }

  return {
    verdict: "safe",
    headline: "No threats detected",
    explanation: `${harmless} engine(s) reported this as harmless with no malicious detections.`,
    recommendation: "Still be careful with unknown links and files.",
  };
}

export async function summarizeScan(vtData, scanType) {
  const slim = slimVtData(vtData, scanType);

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return fallbackSummary(slim);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Explain VirusTotal ${scanType} scan results briefly. Return JSON only: { "verdict": "safe|suspicious|malicious|unknown", "headline": "one short line", "explanation": "1-2 sentences", "recommendation": "one sentence" }`,
        },
        {
          role: "user",
          content: JSON.stringify(slim),
        },
      ],
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.warn("OpenAI failed, using fallback summary:", error.message);
    return fallbackSummary(slim);
  }
}
