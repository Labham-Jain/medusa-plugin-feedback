import express, { Router } from "express"
import FeedbackService from "../../../../../services/feedback";
import type { ProductFeedback as Feedback } from "../../../../../models/product-feedback";
import { ProductService, requireCustomerAuthentication } from "@medusajs/medusa";


type TProductFeedbackProps = {
  router: Router;
}

const ProductFeedback = ({ router }: TProductFeedbackProps) => {
  // add review
  router.use('/products/:id/feedback', express.json());
  router.use('/customers/feedbacks', express.json());

  router.post('/products/:id/feedback', requireCustomerAuthentication(), async (req, res) => {
    const feedbackService = req.scope.resolve('feedbackService') as FeedbackService;
    const productService = req.scope.resolve('productService') as ProductService;
    const { body, rating, title } = req.body as Partial<Feedback>;

    const customer_id = req.user!.customer_id!; /* requireCustomerAuthentication ensures we get customer id. */
    const product_id = req.params.id;

    const product = await productService.retrieve(product_id)

    if (!product) {
      return res.status(404).send("Failed to find product with this id!")
    }

    if (!rating) {
      return res.status(403).send("Missing rating!.")
    }

    try {
      const result = await feedbackService.createFeedback({ body, customer_id, product_id, rating, title });
      return res.json(result)
    } catch (error) {
      return res.status(500).send("Internal server error occurred!")
    }

  });

  // get reviews by product id

  router.get('/products/:id/feedbacks', async (req, res) => {
    const feedbackService = req.scope.resolve('feedbackService') as FeedbackService;
    const productService = req.scope.resolve('productService') as ProductService;

    const product_id = req.params.id;
    const product = productService.retrieve(product_id);

    if (!product) {
      return res.status(404).send("Failed to find product with this id!");
    }

    const result = await feedbackService.getFeedbacksByProduct(product_id);

    return res.json(result)
  });

  // get reviews by customer

  router.get('/customers/feedbacks', requireCustomerAuthentication(), async (req, res) => {
    const feedbackService = req.scope.resolve('feedbackService') as FeedbackService;
    const result = await feedbackService.getFeedbacksByCustomer(req.user?.customer_id!)
    res.json(result);
  });

}


export default ProductFeedback;