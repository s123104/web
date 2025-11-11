import os

# --- Core Settings ---
MONITORING_INTERVAL_SECONDS = int(os.getenv("MONITORING_INTERVAL_SECONDS", 60))

# --- Provider Configuration ---
# A list of provider class names to be activated.
ACTIVE_PROVIDERS = [
    "DGPAProvider",
    # "TaipeiGovProvider", # Example for future
]


# --- Notification Settings (SendGrid) ---
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")

# --- Logging ---
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()

# --- Database ---
DATABASE_PATH = os.getenv("DATABASE_PATH", "/app/data/status.db")
