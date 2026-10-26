export type TutorSeed = {
  question: string
  answer: string
}

const API_URL = '/api/ml'
const STUDENT_ID_KEY = 'edumind-student-id'

export function getStudentId(): string {
  const existing = localStorage.getItem(STUDENT_ID_KEY)
  if (existing) return existing

  const studentId = crypto.randomUUID()
  localStorage.setItem(STUDENT_ID_KEY, studentId)
  return studentId
}

export async function mlRequest<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`ML service returned an invalid response (HTTP ${response.status}).`)
  }

  if (!response.ok) {
    const error = data && typeof data === 'object' && 'detail' in data
      ? data.detail
      : data && typeof data === 'object' && 'error' in data
        ? data.error
        : undefined
    throw new Error(typeof error === 'string' ? error : `ML service returned HTTP ${response.status}.`)
  }
  return data as T
}
