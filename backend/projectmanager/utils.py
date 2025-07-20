def format_drf_errors(errors: dict):
    formatted = []
    for field, messages in errors.items():
        for message in messages:
            formatted.append({
                "field": field,
                "msg": str(message),
                "code": getattr(message, "code", "invalid")
            })
    return formatted
