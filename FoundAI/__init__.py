"""FoundAI package initializer."""
import flask

# app is a single object used by all the code modules in this package
app = flask.Flask(__name__)  # pylint: disable=invalid-name

# Read settings from config module (insta485/config.py)
app.config.from_object('FoundAI.config')

# Overlay settings read from a Python file whose path is set in the environment
# variable. Setting this environment variable is optional.
# Docs: http://flask.pocoo.org/docs/latest/config/
app.config.from_envvar('INSTA485_SETTINGS', silent=True)

# Tell our app about views and model.  This is dangerously close to a
# circular import, which is naughty, but Flask was designed that way.
# (Reference http://flask.pocoo.org/docs/patterns/packages/)  We're
# going to tell pylint and pycodestyle to ignore this coding style violation.
import FoundAI.views  # noqa: E402  pylint: disable=wrong-import-position
import FoundAI.model  # noqa: E402  pylint: disable=wrong-import-position
