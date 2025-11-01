# Lab Controller

A web dashboard for monitoring and managing a Proxmox homelab environment. The project's development was heavily assisted by AI tools, and a detailed reflection on this process can be found in the [Thoughts on AI](#thoughts-on-ai-written-by-author) section.

This application provides a web-based interface to display live information about virtual machines, containers, and nodes from a Proxmox server. It is designed to be portable and securely accessible from anywhere using Tailscale.

## Features

- View the status and details of all virtual machines and containers.
- Get live resource usage from Proxmox nodes.
- Secure, portable deployment using Docker.
- React-based frontend with a Node.js backend API.

## Architecture

The application runs in Docker and is orchestrated with Docker Compose. The networking relies on the **host machine** being connected to a Tailscale network.

-   **Host Machine**: Must be running Tailscale. It provides the secure network tunnel for the backend container to reach the Proxmox server.
-   **Frontend & Backend Containers**: The `frontend` and `backend` services run on a private, shared Docker network. The backend sends its API calls to the Proxmox server out through the host's Tailscale connection.

## Getting Started

### Prerequisites

-   `git`
-   `docker` and `docker-compose`
-   A [Tailscale](https://tailscale.com/) account.
-   A host machine that is connected to your Tailnet.

### Deployment Steps

1.  **Prepare the Host**
    Ensure your host machine is running and connected to your Tailnet via `tailscale up`.

2.  **Clone the Repository**
    ```bash
    git clone <your-github-repo-url>
    cd lab-controller
    ```

3.  **Create Environment Files**

    Copy the provided `.template` file to create your local `.env` configurations.

        ```bash
        cp backend/.env.template backend/.env
        ```
    
    After copying, edit `backend/.env` to add your Proxmox credentials.

    > **Important**: Your Proxmox server must also be on your Tailnet. Use its Tailscale IP or MagicDNS name for the `PROXMOX_HOST` variable in `backend/.env`.

4.  **Launch the Application**

    Use Docker Compose to build the images and start all services in the background.
    ```bash
    docker compose up --build -d
    ```

## Accessing the Application

-   **Web Interface**: Navigate to the IP address of the machine hosting Docker (e.g., `http://<docker-host-lan-ip>`).

## AI-Assisted Development (written by AI)

This project was developed with significant assistance from AI tools. Their use was crucial for architecture design, implementation, and troubleshooting.

-   **Microsoft 365 Copilot web app**: Used for general-purpose code completion and suggestions during development.

-   **Gemini CLI (`gemini-cli`)**: Used for a variety of tasks, including:
    -   Configuring Docker and `docker-compose.yml`.
    -   Troubleshooting container networking issues.
    -   Designing and implementing the Tailscale sidecar integration for secure, portable networking.
    -   Explaining complex technical concepts.
    -   Generating and updating this README file.

# Thoughts on AI (written by author)

This project was done for the course "Web programming 1" and it was the first time I used AI heavily in my programming. I have to say I am impressed by the speedup of using it. Especially at the finishing stages of the project when I used `gemini-cli` and could reference to specific files and the AI could see the whole context of the project.

So far in my IT-studies I have tried to use AI as little as possible. I hold a strong opinion that using AI to solve my problems will cause my own problem solving skills to atrophy and my learning to stagnate. After this project I am mostly convinced that I was right. AI has it's uses and I will continue using it in very specific places in development cycle.

Web development was new to me and after completing this task, I still don't consider learning the syntax or much else about it. AI did the work and I can see the end result, but I can't have "ownership" of the code if I don't fully understand it. I can see the code and I believe I understand what it does, but I have not written it and I could only do minor changes with confidence.

I believe AI could and should be used for:
- Code review for consistency and typo checking
- Explain technical concepts
- Make repetitive work, ie. user writes boilerplate/model and AI implements it to large codebase
- Implementation of technologies that user doesn't want or need to learn

### Conclusion (written by AI)

In conclusion, this project demonstrated AI's immense power to accelerate development, but also solidified my view that it is a double-edged sword. To truly learn and grow as a developer, I must continue to use it as a specialized tool rather than as a substitute for my own critical thinking and effort.
