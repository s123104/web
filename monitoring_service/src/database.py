import sqlite3
import logging
import os
from . import config

def get_db_connection():
    """Establishes a connection to the SQLite database."""
    try:
        os.makedirs(os.path.dirname(config.DATABASE_PATH), exist_ok=True)
        conn = sqlite3.connect(config.DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        logging.error(f"Database connection failed: {e}")
        return None

def init_db():
    """Initializes the database and creates the status table if it doesn't exist."""
    logging.info("Initializing database...")
    conn = get_db_connection()
    if conn:
        try:
            with conn:
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS provider_status (
                        provider_name TEXT PRIMARY KEY,
                        last_content_hash TEXT NOT NULL,
                        last_update_timestamp TEXT NOT NULL
                    );
                """)
            logging.info("Database initialized successfully.")
        except sqlite3.Error as e:
            logging.error(f"Database initialization failed: {e}")
        finally:
            conn.close()

def get_last_hash(provider_name: str) -> str | None:
    """Retrieves the last content hash for a given provider."""
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT last_content_hash FROM provider_status WHERE provider_name = ?",
                (provider_name,),
            )
            row = cursor.fetchone()
            return row["last_content_hash"] if row else None
        except sqlite3.Error as e:
            logging.error(f"Failed to get last hash for {provider_name}: {e}")
            return None
        finally:
            conn.close()
    return None

def update_provider_status(provider_name: str, new_hash: str, timestamp: str):
    """Updates or inserts the status for a given provider."""
    conn = get_db_connection()
    if conn:
        try:
            with conn:
                conn.execute(
                    """
                    INSERT INTO provider_status (provider_name, last_content_hash, last_update_timestamp)
                    VALUES (?, ?, ?)
                    ON CONFLICT(provider_name) DO UPDATE SET
                        last_content_hash = excluded.last_content_hash,
                        last_update_timestamp = excluded.last_update_timestamp;
                    """,
                    (provider_name, new_hash, timestamp),
                )
            logging.info(f"Successfully updated status for {provider_name}.")
        except sqlite3.Error as e:
            logging.error(f"Failed to update status for {provider_name}: {e}")
        finally:
            conn.close()

