import express, { Router } from "express"
import FeedbackService from "../../../../../services/feedback";
import type { ProductFeedback as Feedback } from "../../../../../models/product-feedback";


type TProductFeedbackProps = {
  router: Router;
}

const ProductFeedback = ({ router }: TProductFeedbackProps) => {
  // add review
  router.use('/products/:id/feedback', express.json());
  router.post('/products/:id/feedback', async (req, res) => {
    const feedbackService = req.scope.resolve('feedbackService') as FeedbackService;
    const { body, customer_id, product_id, rating, title } = req.body as Partial<Feedback>;

    if (!customer_id || !product_id || !rating) {
      return res.status(403).send("Missing Parameters!.")
    }

    const result = await feedbackService.createFeedback({ body, customer_id, product_id, rating, title });

    return res.json(result)
  });

}


export default ProductFeedback;