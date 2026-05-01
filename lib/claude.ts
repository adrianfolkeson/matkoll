import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export interface ScanResult {
  food_name: string
  calories: number
  protein: number
  fat: number
  confidence: number
}

export async function scanFood(imageBase64: string): Promise<ScanResult> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `Analysera denna mat och ge mig näringsvärden. Svara ENBART med JSON i detta format (inget annat):
{
  "food_name": "namn på rätten",
  "calories": kcal per 100g (tal),
  "protein": gram protein per 100g (tal),
  "fat": gram fett per 100g (tal),
  "confidence": 0.0-1.0 (hur säker du är)
}

Om du inte kan identifiera maten, svara med:
{"error": "Kunde inte identifiera maten"}`,
            },
          ],
        },
      ],
    })

    const content = message.content[0]
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Kunde inte parsera svaret')
      }

      const result = JSON.parse(jsonMatch[0])
      
      if (result.error) {
        throw new Error(result.error)
      }

      return {
        food_name: result.food_name || 'Okänd mat',
        calories: result.calories || 0,
        protein: result.protein || 0,
        fat: result.fat || 0,
        confidence: result.confidence || 0.5,
      }
    }

    throw new Error('Kunde inte analysera maten')
  } catch (error) {
    console.error('Claude API error:', error)
    throw error
  }
}
