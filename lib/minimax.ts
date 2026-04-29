import { ScanResult } from '../types'

const MINIMAX_API_URL = 'https://api.minimax.chat/v1/chat/completions'
const MINIMAX_API_KEY = process.env.EXPO_PUBLIC_MINIMAX_API_KEY || 'YOUR_MINIMAX_API_KEY'

export async function scanFood(imageBase64: string): Promise<ScanResult> {
  try {
    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
              {
                type: 'text',
                text: `Analysera denna mat och ge mig näringsvärden. Svara ENBART med JSON i detta format:
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
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message || 'API-fel')
    }

    const content = data.choices?.[0]?.message?.content
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
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
  } catch (error) {
    console.error('MiniMax API error:', error)
    throw error
  }
}
