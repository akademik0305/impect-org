export type TCartProduct = {
  product_id: number,
  product_name: string,
  quantity: number,
  price: number,
  imageUrl: string,

}
export type TCart = TCartProduct[]
