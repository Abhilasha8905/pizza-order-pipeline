A pizza order pipeline demo application built in React.

Deployed here: https://pizza-order-pipeline.vercel.app/

Solution:
A mock client side service to show various steps that goes into pizza making (doughing, topping, oven and serving).
The service and pipeline should ideally be on server side and client just needs to listen to events (web sockets) for updating the status.
However, for sake of this assignment, I have mocked the pipeline service on frontend itself.

Features:
  - Dockerized React App Application
  - Orders can be added with no of toppings (just accepting no of toppings for sake of assignment)
  - A simple tabular form display to show status of each order
  - Each status updates dynamically as an when it proceeds in pipeline
  - A CSV format downloadable report after all orders are completed

Trade-Offs:
  - Design could have been more creative to show pizza orders,
  - Pipeline service should ideally be a backend service
  - Code quality can be improved
  - Test cases can be added

I have tried to keep things simpler to complete the assignment within suitable time.

