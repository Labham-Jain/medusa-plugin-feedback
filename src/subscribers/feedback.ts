class FeedbackSubscriber {
  constructor({ eventBusService }) {
    eventBusService.subscribe("feedback.created", this.handleOrder)
  }

  handleOrder = async (data) => {
    console.log("New Order: " + data.id)
  }
}

export default FeedbackSubscriber