export type Category = {
  _id: string
  title: string
  description: string
  isActive?: boolean
}

export type Product = {
  _id: string
  title: string
  description: string
  images: string[]
  stockQty: number
  mrpPrice: number
  sellingPrice: number
  rating: number
  noOfReviews: number
  brand: string
  categoryId: string | Category
  isActive?: boolean
}
