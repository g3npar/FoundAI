"""FoundAI development configuration."""

import pathlib

# Root of this application, useful if it doesn't occupy an entire domain
APPLICATION_ROOT = '/'

# Secret key for encrypting cookies
SECRET_KEY = b'\xbd\x1d<\x02Z\x02[\x94*\xbf\x94\xe1~9\x14\x9al\x0e\x9aJvU\xb3)'
SESSION_COOKIE_NAME = 'login'

# File Upload to var/uploads/
FOUNDAI_ROOT = pathlib.Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = FOUNDAI_ROOT/'var'/'uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
MAX_CONTENT_LENGTH = 16 * 1024 * 1024

# Database file is var/insta485.sqlite3
DATABASE_FILENAME = FOUNDAI_ROOT/'var'/'FoundAI.sqlite3'
