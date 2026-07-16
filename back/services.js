import { wait } from "./utils.js";

const VIRUSTOTAL_URL = "https://www.virustotal.com/api/v3";



export async function scanUrl(apiKey, url) {
  const res = await fetch(`${VIRUSTOTAL_URL}/urls`, {
    method: "POST",
    headers: {
      "x-apikey": apiKey,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ url }),
  });

  const data = await res.json();
  const id = data?.data?.id;

  if (!id) throw new Error("no analysis id");

  return waitForAnalysis(apiKey, id);
}

export async function scanFile(apiKey, file, hashFileFn) {

  const hash = hashFileFn(file.buffer);

  const res = await fetch(`${VIRUSTOTAL_URL}/files/${hash}`, {
    headers: { "x-apikey": apiKey },
  });

  const data = await res.json();

  if (res.ok) return data;

  const formData = new FormData();
  formData.append("file", new Blob([file.buffer]), file.originalname);

  const upload = await fetch(`${VIRUSTOTAL_URL}/files`, {
    method: "POST",
    headers: { "x-apikey": apiKey },
    body: formData,
  });

  const uploadData = await upload.json();
  const id = uploadData?.data?.id;

  if (!id) throw new Error("upload failed");

  return waitForAnalysis(apiKey, id);
}


async function waitForAnalysis(apiKey, analysisId) {
  const maxAttempts = 60;

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${VIRUSTOTAL_URL}/analyses/${analysisId}`, {
      headers: { "x-apikey": apiKey },
    });

    const data = await res.json();
    const status = data?.data?.attributes?.status;

    if (status === "completed") return data;
    if (status === "failed") throw new Error("failed");

    await wait(3000);
  }

  throw new Error("timeout");
}