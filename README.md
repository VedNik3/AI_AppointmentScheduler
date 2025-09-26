# AI-Powered Appointment Scheduler Assistant

This project is a backend service that parses natural language or document-based appointment requests and converts them into structured scheduling data. It uses a multi-step AI pipeline to handle both typed text and image inputs.

## Architecture Overview

This service is built using **Architecture A**, a sequential, multi-step AI pipeline where each core task is handled by a dedicated service making a call to the Google Gemini API. This design provides clear separation of concerns for each step of the process.

The data flows as follows:

1.  **Client Request:** A `POST` request containing text and/or an image is sent to the Express server.
2.  **Controller:** The `appointmentController` orchestrates the pipeline.
3.  **Step 1: OCR Service:** The `ocrService` takes the input and uses the `gemini-2.5-flash` model to extract the raw text.
4.  **Step 2: Entity Extraction Service:** The `entityExtractionService` takes the raw text and uses the `gemini-2.5-flash` model to identify the `date_phrase`, `time_phrase`, and `department`.
5.  **Step 3: Normalization Service:** The `normalizationAiService` takes the extracted entities and uses the `gemini-2.5-flash` model to convert them into a standardized `YYYY-MM-DD` and `HH:mm` format.
6.  **Step 4: Final Assembly:** The controller combines the results from all three steps into a single, comprehensive JSON object and returns it to the client.

## Tech Stack

* **Backend:** Node.js, Express.js
* **AI:** Google Gemini API (`gemini-2.5-flash`)
* **File Uploads:** Multer
* **Environment Variables:** dotenv

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/VedNik3/AI_AppointmentScheduler.git
    cd ai-appointment-scheduler
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:** Create a `.env` file in the root of the project and add your Google Gemini API key.

    ```env
    # .env.example
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    PORT=5000
    ```

4.  **Start the server (with nodemon):**
    ```bash
    npm start
    ```
    (without nodemon)
     ```bash
    node app.js
    ```
    
    The server will be running on `http://localhost:5000`.

## API Usage

The API has a single endpoint for scheduling appointments (Postman for testing).

* **Endpoint:** `POST /api/schedule`
* **Body Type:** `multipart/form-data`

### Parameters

* `text` (optional): A string containing the appointment request (e.g., "Book appointment for next Friday at 3pm").
* `appointmentImage` (optional): An image file containing the appointment request.

You must provide at least one of the two parameters.

---
