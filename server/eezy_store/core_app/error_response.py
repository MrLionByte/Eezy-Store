def format_error_response(error_code, error_message):
    return {
        "error": error_code,
        "message": error_message
    }