import {
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import { ProductFeedback } from "../models/product-feedback"

export const FeedbackRepository = dataSource.getRepository(ProductFeedback)

export default FeedbackRepository