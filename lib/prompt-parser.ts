export interface StableDiffusionParams {
  aspectRatio?: string
  version?: string
  stylize?: string
  quality?: string
  chaos?: string
  niji?: string
  rawStyle?: boolean
  [key: string]: string | boolean | undefined // For other potential parameters
}

export function parseStableDiffusionParams(prompt: string): StableDiffusionParams {
  const params: StableDiffusionParams = {}

  // Regex to find common Stable Diffusion/Midjourney parameters
  const arMatch = prompt.match(/--ar\s+(\d+:\d+)/)
  if (arMatch) params.aspectRatio = arMatch[1]

  const vMatch = prompt.match(/--v\s+([\d.]+)/)
  if (vMatch) params.version = vMatch[1]

  const sMatch = prompt.match(/--s\s+(\d+)/)
  if (sMatch) params.stylize = sMatch[1] // Using 's' for stylize as per common usage

  const qMatch = prompt.match(/--q\s+(\d+)/)
  if (qMatch) params.quality = qMatch[1]

  const chaosMatch = prompt.match(/--chaos\s+(\d+)/)
  if (chaosMatch) params.chaos = chaosMatch[1]

  const nijiMatch = prompt.match(/--niji\s+(\d+)/)
  if (nijiMatch) params.niji = nijiMatch[1]

  if (prompt.includes("--style raw")) {
    params.rawStyle = true
  }

  // Remove parsed parameters from the prompt to get the clean prompt text
  let cleanPrompt = prompt
  cleanPrompt = cleanPrompt.replace(
    /--ar\s+\d+:\d+|--v\s+[\d.]+|--s\s+\d+|--q\s+\d+|--chaos\s+\d+|--niji\s+\d+|--style raw/g,
    "",
  )

  // Trim any extra whitespace
  cleanPrompt = cleanPrompt.trim()

  return params
}
