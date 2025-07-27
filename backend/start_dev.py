#!/usr/bin/env python3
"""
Development startup script for Swipr.AI backend
"""

import os
import sys
import subprocess
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        logger.error("Python 3.8 or higher is required")
        sys.exit(1)
    logger.info(f"Python version: {sys.version}")

def install_dependencies():
    """Install Python dependencies"""
    logger.info("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        logger.info("Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to install dependencies: {e}")
        sys.exit(1)

def start_server():
    """Start the FastAPI development server"""
    logger.info("Starting Swipr.AI backend server...")
    logger.info("Server will be available at: http://localhost:8000")
    logger.info("API documentation at: http://localhost:8000/docs")
    
    try:
        subprocess.check_call([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload",
            "--log-level", "info"
        ])
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)

def main():
    """Main function"""
    logger.info("🚀 Starting Swipr.AI Backend Development Server")
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    check_python_version()
    install_dependencies()
    start_server()

if __name__ == "__main__":
    main()
