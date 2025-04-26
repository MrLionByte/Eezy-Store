DEV_INSTALLED_APPS = [
    'silk',
    'debug_toolbar',
]

DEV_MIDDLEWARE = [
    "silk.middleware.SilkyMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]
