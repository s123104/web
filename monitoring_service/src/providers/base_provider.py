from dataclasses import dataclass
from typing import Optional
from abc import ABC, abstractmethod

@dataclass
class ScrapeResult:
    """Standardized result object from a provider's scrape operation."""
    provider_name: str
    headline: str
    content: str # The core text or HTML snippet that is being monitored.
    url: str
    error: Optional[str] = None # Holds error message if scraping failed.


class BaseProvider(ABC):
    """Abstract base class for all data providers."""
    
    def __init__(self):
        self.name = self.__class__.__name__

    @abstractmethod
    def run(self) -> ScrapeResult:
        """
        Executes the entire scrape and parse process for the provider.
        This is the main entry point for a provider.
        """
        pass
