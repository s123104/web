import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from .config import SENDGRID_API_KEY, RECIPIENT_EMAIL, SENDER_EMAIL
from .providers.base_provider import ScrapeResult

def send_notification(result: ScrapeResult):
    """
    Sends an email notification using SendGrid when a change is detected.
    """
    if not SENDGRID_API_KEY or not RECIPIENT_EMAIL or not SENDER_EMAIL:
        logging.error("SendGrid API key, recipient email, or sender email is not configured. Cannot send notification.")
        return

    subject = f"[監控通知] {result.provider_name}: {result.headline}"
    html_content = f"""
    <html>
    <body>
        <h2>{result.headline}</h2>
        <p>來源: <a href="{result.url}">{result.url}</a></p>
        <h3>偵測到的內容變化:</h3>
        <pre>{result.content}</pre>
        <p>請前往網站確認最新資訊。</p>
    </body>
    </html>
    """

    message = Mail(
        from_email=SENDER_EMAIL,
        to_emails=RECIPIENT_EMAIL,
        subject=subject,
        html_content=html_content
    )

    try:
        sendgrid_client = SendGridAPIClient(SENDGRID_API_KEY)
        response = sendgrid_client.send(message)
        logging.info(f"Notification sent. Status Code: {response.status_code}")
        if response.status_code >= 400:
            logging.error(f"SendGrid API error: {response.body}")
    except Exception as e:
        logging.exception(f"Failed to send notification via SendGrid: {e}")

