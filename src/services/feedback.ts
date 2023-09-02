import { TransactionBaseService } from '@medusajs/medusa'
import { FeedbackRepository } from '../repositories/feedback'
import { Repository } from 'typeorm'
import { ProductFeedback } from '../models/product-feedback'
import FeedbackEventBusService from './event-bus-feedback'

export default class FeedbackService extends TransactionBaseService {
  protected readonly productFeedbackRepository_: typeof FeedbackRepository
  protected readonly feedbackRepository: Repository<ProductFeedback>;
  protected readonly eventBusService_: FeedbackEventBusService

  static EVENTS = {
    CREATED: 'feedback.created',
    UPDATED: 'feedback.updated',
    DELETED: 'feedback.deleted',
  }

  constructor({ eventBusService }: { eventBusService: FeedbackEventBusService }) {
    super(arguments[0])
    this.feedbackRepository = this.activeManager_.withRepository(FeedbackRepository);
    this.eventBusService_ = eventBusService;
  }


  async createFeedback(props: Pick<ProductFeedback, 'product_id' | 'customer_id' | 'rating'> & Partial<Pick<ProductFeedback, 'title' | 'body'>>) {
    const createFeedbackInstance = await this.feedbackRepository.create({ ...props, approved: false });
    const result = await this.feedbackRepository.save(createFeedbackInstance)
    this.eventBusService_.emit(FeedbackService.EVENTS.CREATED, result);
    return result;
  }


  async getFeedbacksByProduct(product_id: string) {
    return await this.feedbackRepository.find({ where: { product_id } });
  }

  async getFeedbacksByCustomer(customer_id: string) {
    return await this.feedbackRepository.find({ where: { customer_id } });
  }

  async updateFeedback(feedback_id: string, payload: Partial<Pick<ProductFeedback, 'title' | 'body' | 'rating' | 'approved'>>) {
    const result = await this.feedbackRepository.update({ id: feedback_id }, payload)
    this.eventBusService_.emit(FeedbackService.EVENTS.UPDATED, result);
    return result;
  }

  async delete(id) {
    const feedback = await this.feedbackRepository.findOne({ where: { id: id } });

    if (feedback) {
      await this.feedbackRepository.delete({ id });
      this.eventBusService_.emit(FeedbackService.EVENTS.DELETED, feedback);
    }

    return feedback;
  }
} 