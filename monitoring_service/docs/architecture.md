# Monitoring Service - Comprehensive Specifications

## 1. Overview

This document provides detailed technical specifications for the high-frequency monitoring service. The service's goal is to periodically scrape specified web sources, detect changes, and send notifications.

**Core Architecture:**
- **Execution Environment**: Docker Container, suitable for local development (WSL2/macOS) and cloud deployment (e.g., Zeabur).
- **Orchestration**: A persistent `while` loop within the main Python script, making the container a long-running service.
- **Monitoring Frequency**: Configurable, defaults to 60 seconds.
- **Extensibility**: A "Provider" pattern allows for easily adding new websites to monitor.

---

## 2. Detailed Component Specifications

### 2.1. Database Schema (SQLite)

The service will use a single SQLite database file (`status.db`).

*   **Table:** `provider_status`
    *   This table stores the last known state for each monitored provider.

*   **Columns:**
    *   `provider_name` (TEXT, PRIMARY KEY): A unique identifier for the provider (e.g., `"dgpa"`, `"taipei_gov"`).
    *   `last_content_hash` (TEXT, NOT NULL): The SHA256 hash of the relevant content from the last successful scrape.
    *   `last_update_timestamp` (TEXT, NOT NULL): The ISO 8601 formatted timestamp of the last detected change.

*   **SQL Schema:**
    ```sql
    CREATE TABLE IF NOT EXISTS provider_status (
        provider_name TEXT PRIMARY KEY,
        last_content_hash TEXT NOT NULL,
        last_update_timestamp TEXT NOT NULL
    );
    ```

### 2.2. Configuration Management (`src/config.py`)

All settings will be centralized in a `config.py` file for easy management.

```python
import os

# --- Core Settings ---
MONITORING_INTERVAL_SECONDS = int(os.getenv("MONITORING_INTERVAL_SECONDS", 60))

# --- Provider Configuration ---
# A list of the provider classes to be activated.
# from .providers.dgpa_provider import DGPAProvider
# from .providers.taipei_gov_provider import TaipeiGovProvider
PROVIDERS = [
    # DGPAProvider(),
    # TaipeiGovProvider(),
]

# --- Notification Settings (SendGrid) ---
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

# --- Logging ---
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
```

### 2.3. Standardized Data Structures

To ensure consistency, all provider `parse` methods must return a standardized object. We will use Python's `dataclasses`.

*   **`ScrapeResult` Data Class (`src/providers/base_provider.py`)**

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class ScrapeResult:
    """Standardized result object from a provider's scrape operation."""
    provider_name: str
    headline: str
    content: str # The core text or HTML snippet that is being monitored.
    url: str
    error: Optional[str] = None # Holds error message if scraping failed.
```

### 2.4. Core Application Logic (`src/main.py`)

The main script will orchestrate the entire monitoring loop.

**Logic Flow:**
1.  **Initialization**:
    - Set up logging.
    - Initialize the database connection (`database.init_db()`).
    - Load providers from `config.PROVIDERS`.
2.  **Main Loop (`while True:`)**:
    - Log the start of a new monitoring cycle.
    - For each `provider` in `config.PROVIDERS`:
        a. **Run Provider**: Wrap the execution in a `try...except` block.
            - Call `result = provider.run()` to get a `ScrapeResult` object.
            - If `result.error` is present, log the error and continue to the next provider.
        b. **Process Result**:
            - Calculate the SHA256 hash of `result.content`.
            - Fetch the `last_content_hash` from the database for the current `provider.name`.
        c. **Compare and Notify**:
            - **If hash is different** from `last_content_hash` (or if no previous hash exists):
                - Log a "Change Detected" event.
                - Call `notifier.send_notification(result)`.
                - `UPDATE` the `provider_status` table with the new hash and current timestamp.
            - **If hash is the same**:
                - Log a "No Change" event.
        d. **Handle Exceptions**:
            - Catch specific exceptions (`requests.RequestException`, parsing errors, DB errors).
            - Log detailed error messages.
    - **Sleep**:
        - Log the end of the cycle.
        - `time.sleep(config.MONITORING_INTERVAL_SECONDS)`.

### 2.5. Error Handling and Logging

*   **Library**: Use Python's built-in `logging` module.
*   **Output**: Log to `stdout` to be captured by Docker logs.
*   **Log Level**: Configurable via `LOG_LEVEL` environment variable (DEBUG, INFO, WARNING, ERROR).
*   **Format**: `%(asctime)s - %(levelname)s - %(module)s - %(message)s`
*   **Key Exceptions to Handle**:
    - `requests.exceptions.RequestException`: For network errors during `fetch_content`.
    - `AttributeError`, `IndexError`: For HTML parsing errors in `parse`.
    - `sqlite3.Error`: For database operation failures.

### 2.6. Environment Variables

The application will be configured via the following environment variables:

- **`MONITORING_INTERVAL_SECONDS`**: (Optional) The sleep duration in seconds between monitoring cycles. Defaults to `60`.
- **`SENDGRID_API_KEY`**: (Required) The API key for the SendGrid service.
- **`RECIPIENT_EMAIL`**: (Required) The email address to which notifications will be sent.
- **`SENDER_EMAIL`**: (Required) The "from" email address for notifications.
- **`LOG_LEVEL`**: (Optional) The logging level. Defaults to `INFO`.

### 2.7. Dockerfile Specification

The `Dockerfile` will define the container image for the service.

```dockerfile
# 1. Base Image
FROM python:3.10-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy application source code
COPY ./src .

# 5. Define the command to run the application
CMD ["python", "src/main.py"]
```
---

*This comprehensive specification will serve as the blueprint for our development.*

