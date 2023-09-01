import { TransactionBaseService } from '@medusajs/medusa'
import { FeedbackRepository } from '../repositories/feedback'
import { Repository } from 'typeorm'
import { ProductFeedback } from '../models/product-feedback'


export default class FeedbackService extends TransactionBaseService {
  protected readonly productFeedbackRepository_: typeof FeedbackRepository
  protected readonly feedbackRepository: Repository<ProductFeedback>;

  constructor() {
    super(arguments[0])
    this.feedbackRepository = this.activeManager_.withRepository(FeedbackRepository);
  }


  async createFeedback(props: Pick<ProductFeedback, 'product_id' | 'customer_id' | 'rating'> & Partial<Pick<ProductFeedback, 'title' | 'body'>>) {
    const res = await this.feedbackRepository.create({ ...props, approved: false });
    return await this.feedbackRepository.save(res)
  }


  async getFeedbacksByProduct(product_id: string) {
    return await this.feedbackRepository.find({ where: { product_id } });
  }

  async getFeedbacksByCustomer(customer_id: string) {
    return await this.feedbackRepository.find({ where: { customer_id } });
  }

  async updateFeedback(feedback_id: string, payload: Partial<Pick<ProductFeedback, 'title' | 'body' | 'rating' | 'approved'>>) {
    return await this.feedbackRepository.update({ id: feedback_id }, payload)
  }

  async delete(id) {
    return await this.feedbackRepository.delete({ id });
  }
}