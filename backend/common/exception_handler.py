from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError
from rest_framework import status

def _flatten_error_detail(detail, parent_loc):
    """
    Recursively walk DRF error dicts/lists and yield
    (loc, msg, code) tuples.
    """
    if isinstance(detail, list):
        for item in detail:
            # list means same loc, nested error
            yield from _flatten_error_detail(item, parent_loc)
    elif isinstance(detail, dict):
        for field, value in detail.items():
            loc = parent_loc + [field]
            yield from _flatten_error_detail(value, loc)
    else:  # detail is ErrorDetail or str
        msg = str(detail)
        code = getattr(detail, "code", "error")
        yield (parent_loc, msg, code)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    print("Custom exception handler called")

    if response is None:
        return response

    # --- Only massage ValidationError ---
    if isinstance(exc, ValidationError):
        flat_errors = [
            {"loc": ["body"] + loc, "msg": msg, "code": code}
            for loc, msg, code in _flatten_error_detail(exc.detail, [])
        ]
        response.data = {
            "status": "error",
            "errors": flat_errors,
        }
        response.status_code = status.HTTP_400_BAD_REQUEST
    else:
        # Anything else: wrap but keep original status
        response.data = {
            "status": "error",
            "errors": [
                {
                    "loc": ["non_field_error"],
                    "msg": response.data.get("detail", "Unhandled error"),
                    "code": "error",
                }
            ],
        }

    return response
