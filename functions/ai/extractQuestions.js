import { requireUser } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';
import { deductCreditsTx } from '../_lib/credits.js';

function determineMimeType(fileName) {
  if (fileName.endsWith('.pdf')) return 'application/pdf';
  if (fileName.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (fileName.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  return 'text/plain';
}

function defaultQuestionsFallback(fileName) {
  const title = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return [
    {
      title: `What is the primary concept discussed in ${title}?`,
      body: `Summarise the main learning objective covered in ${title}.`,
      difficulty: 'Medium',
      category: 'General',
      tags: ['ai', 'fallback'],
      options: [
        { label: 'A', value: 'Concept A', isCorrect: false },
        { label: 'B', value: 'Concept B', isCorrect: true },
        { label: 'C', value: 'Concept C', isCorrect: false },
        { label: 'D', value: 'Concept D', isCorrect: false }
      ],
      explanation: 'This is a placeholder generated because the AI provider did not return a structured payload.'
    }
  ];
}

async function callGemini(env, payload, fileBuffer) {
  if (!env.GEMINI_API_KEY) {
    throw new Error('Gemini API key missing in environment.');
  }

  const model = env.GEMINI_MODEL || 'models/gemini-1.5-flash';
  const encoded = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

  const prompt = `${payload.prompt || 'Extract structured assessment questions in JSON. Include title, body, difficulty (Easy|Medium|Hard|Expert), category, tags, options (label, value, isCorrect), correct answer explanation. Limit to 5 high-quality questions.'}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: determineMimeType(payload.fileName || 'document.txt'),
                data: encoded
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4
      }
    })
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(`Gemini failed: ${response.status} ${errorPayload}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n').trim();
  if (!text) {
    return defaultQuestionsFallback(payload.fileName || 'Document');
  }

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
    return defaultQuestionsFallback(payload.fileName || 'Document');
  } catch (error) {
    return defaultQuestionsFallback(payload.fileName || 'Document');
  }
}

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const supabase = getServiceSupabase(context.env);

  const rateLimit = Number(context.env.AI_RATE_LIMIT_PER_MINUTE || 5);
  const since = new Date(Date.now() - 60 * 1000).toISOString();
  const { data: recentCalls, error: rateError } = await supabase
    .from('ai_logs')
    .select('id')
    .eq('user_id', session.user.id)
    .gte('created_at', since);
  if (rateError) {
    return errorResponse('Unable to evaluate AI quota', 500, rateError);
  }
  if (recentCalls.length >= rateLimit && session.profile.role !== 'admin') {
    return errorResponse('AI rate limit exceeded. Please retry shortly.', 429);
  }

  const body = await context.request.json();
  const requiredFields = ['signedUrl', 'filePath', 'fileName'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return errorResponse(`Missing ${field}`, 400);
    }
  }

  const fetchResponse = await fetch(body.signedUrl);
  if (!fetchResponse.ok) {
    return errorResponse('Unable to download staged file from storage', 502, await fetchResponse.text());
  }
  const buffer = await fetchResponse.arrayBuffer();

  const start = Date.now();
  let questions;
  let status = 'success';
  let errorMessage = null;

  try {
    questions = await callGemini(context.env, body, buffer);
  } catch (error) {
    status = 'failed';
    errorMessage = error.message;
    questions = defaultQuestionsFallback(body.fileName);
  }

  const latencyMs = Date.now() - start;

  const { data: logEntry } = await supabase
    .from('ai_logs')
    .insert({
      user_id: session.user.id,
      file_path: body.filePath,
      status,
      latency_ms: latencyMs,
      metadata: {
        fileName: body.fileName,
        fileSize: body.fileSize,
        error: errorMessage
      }
    })
    .select('*')
    .single();

  return json({
    questions,
    metadata: {
      latencyMs,
      suggestedSetName: `${body.fileName.replace(/\.[^/.]+$/, '')} · ${new Date().getFullYear()}`,
      isPrivate: body.isPrivate || false,
      jobId: logEntry?.id
    }
  });
}
