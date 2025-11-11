import requests
from bs4 import BeautifulSoup
from .base_provider import BaseProvider, ScrapeResult
import logging

class DGPAProvider(BaseProvider):
    """
    Provider for the Directorate-General of Personnel Administration (DGPA)
    website for typhoon-related work/school suspension information.
    """
    URL = "https://www.dgpa.gov.tw/typh/daily/nds.html"

    def __init__(self):
        super().__init__()
        self.name = "dgpa" # Override name for consistency

    def fetch_content(self) -> str:
        """Fetches the raw HTML content from the DGPA website."""
        try:
            response = requests.get(self.URL, timeout=10)
            response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
            response.encoding = 'utf-8' # Ensure correct encoding
            return response.text
        except requests.exceptions.RequestException as e:
            logging.error(f"Failed to fetch content from {self.URL}: {e}")
            raise

    def parse(self, html_content: str) -> ScrapeResult:
        """
        Parses the HTML content to extract relevant work/school suspension information.
        Combines the update time and the main table content for hashing.
        """
        soup = BeautifulSoup(html_content, 'lxml') # Use lxml for better performance

        # Extract update time
        update_time_tag = soup.find('div', class_='Content_Updata')
        update_time_text = ""
        if update_time_tag:
            # Get all text within the div, strip extra whitespace
            update_time_text = update_time_tag.get_text(separator=" ", strip=True)
            # Clean up the text, e.g., remove "更新時間：" and extra links
            update_time_text = update_time_text.replace("更新時間：", "").split("歷次天然災害")[0].strip()
        
        # Extract the main table content
        table = soup.find('table', id='Table')
        table_content_text = ""
        if table:
            # Get all text from the table, preserving some structure with newlines
            table_content_text = table.get_text(separator="\n", strip=True)
        
        # Combine for a comprehensive content hash
        full_content_for_hash = f"Update Time: {update_time_text}\nTable Content:\n{table_content_text}"

        # Create a headline for notification
        headline = f"停班停課資訊更新 ({update_time_text})" if update_time_text else "停班停課資訊更新"

        return ScrapeResult(
            provider_name=self.name,
            headline=headline,
            content=full_content_for_hash,
            url=self.URL
        )

    def run(self) -> ScrapeResult:
        """Executes the fetch and parse process for the DGPA provider."""
        try:
            html_content = self.fetch_content()
            return self.parse(html_content)
        except Exception as e:
            logging.error(f"Error in DGPAProvider.run(): {e}")
            return ScrapeResult(
                provider_name=self.name,
                headline=f"DGPAProvider 執行失敗",
                content="",
                url=self.URL,
                error=str(e)
            )
