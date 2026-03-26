# Express Melony App

A simple Express application that demonstrates how to use Melony agents and actions.

## Getting Started

1.  Clone the repository and install dependencies:
    ```bash
    pnpm install
    ```

2.  Run the application in development mode:
    ```bash
    pnpm --filter @melony/app-express dev
    ```

3.  Send a message to the agent:
    ```bash
    curl -X POST http://localhost:7123 \
      -H "Content-Type: application/json" \
      -d '{"message": "What is the weather in London?"}'
    ```
