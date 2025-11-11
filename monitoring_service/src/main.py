import time
import logging
import hashlib
from datetime import datetime, timezone
import importlib

from . import config
from . import database
from . import notifier
from .providers.base_provider import BaseProvider # Import BaseProvider for type hinting

def setup_logging():
    """Configures the application logging."""
    logging.basicConfig(
        level=config.LOG_LEVEL,
        format='%(asctime)s - %(levelname)s - %(module)s - %(message)s',
        handlers=[logging.StreamHandler()]
    )

def load_providers() -> list[BaseProvider]:
    """Dynamically loads provider instances based on config.ACTIVE_PROVIDERS."""
    providers = []
    for provider_name in config.ACTIVE_PROVIDERS:
        try:
            # Construct the module name (e.g., "dgpa_provider" from "DGPAProvider")
            module_name = provider_name.lower()
            if "_" not in module_name: # Handle cases like "DGPAProvider" -> "dgpaprovider"
                # Insert underscore before "Provider" if it's a single word
                module_name = module_name.replace("provider", "_provider")

            module = importlib.import_module(f".providers.{module_name}", package="src")
            # Get the class from the module
            provider_class = getattr(module, provider_name)
            # Instantiate the provider and add to list
            providers.append(provider_class())
            logging.info(f"Successfully loaded provider: {provider_name}")
        except (ImportError, AttributeError) as e:
            logging.error(f"Failed to load provider {provider_name}: {e}")
        except Exception as e:
            logging.exception(f"An unexpected error occurred while loading provider {provider_name}: {e}")
    return providers

def run_monitoring_cycle(providers: list[BaseProvider]):
    """Runs a single monitoring cycle across all active providers."""
    logging.info("Starting new monitoring cycle.")
    
    for provider in providers:
        try:
            logging.debug(f"Running provider: {provider.name}")
            result = provider.run()

            if result.error:
                logging.error(f"Provider {provider.name} failed: {result.error}")
                # Optionally send error notification here
                continue

            content_hash = hashlib.sha256(result.content.encode('utf-8')).hexdigest()
            last_hash = database.get_last_hash(provider.name)

            if content_hash != last_hash:
                logging.info(f"Change detected for provider: {provider.name}! Headline: {result.headline}")
                
                notifier.send_notification(result)
                
                timestamp = datetime.now(timezone.utc).isoformat()
                database.update_provider_status(provider.name, content_hash, timestamp)
            else:
                logging.info(f"No change for provider: {provider.name}.")

        except Exception as e:
            logging.exception(f"An unexpected error occurred while running provider {provider.name}: {e}")

    logging.info(f"Monitoring cycle finished. Sleeping for {config.MONITORING_INTERVAL_SECONDS} seconds.")


def main():
    """The main entry point for the monitoring service."""
    setup_logging()
    logging.info("Monitoring service starting...")
    
    database.init_db()
    
    active_providers = load_providers()
    
    if not active_providers:
        logging.warning("No active providers loaded. The service will not monitor any sources.")

    logging.info(f"Loaded {len(active_providers)} providers.")

    while True:
        run_monitoring_cycle(active_providers)
        time.sleep(config.MONITORING_INTERVAL_SECONDS)

if __name__ == "__main__":
    main()
