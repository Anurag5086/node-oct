export type AssistantMentionedProduct = {
  _id: string
  title: string
  brand: string
  sellingPrice: number
  mrpPrice: number
  stockQty?: number
  stockQuantity?: number
  images: string[]
}

export type AssistantChatResponse = {
  success: boolean
  message: string
  response: string
  products: AssistantMentionedProduct[]
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  products?: AssistantMentionedProduct[]
  error?: boolean
}
