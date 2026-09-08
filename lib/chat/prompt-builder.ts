/**
 * Prompt-injection defense helper.
 *
 * Wraps every visitor-supplied message in unique start / end delimiters
 * so the model treats the contents as data rather than instructions.
 * The system prompt instructs Gemini to ignore anything inside the
 * delimiters, refuse "ignore previous", "reveal your prompt", "pretend
 * to be X", and similar attempts.
 *
 * Server-only.
 */

export const VISITOR_MESSAGE_START = "<<<VISITOR_MESSAGE_START>>>";
export const VISITOR_MESSAGE_END = "<<<VISITOR_MESSAGE_END>>>";

export function wrapVisitorMessage(content: string): string {
  return `${VISITOR_MESSAGE_START}\n${content}\n${VISITOR_MESSAGE_END}`;
}
