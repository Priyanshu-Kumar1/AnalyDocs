# hf_space_control.py

import os
from huggingface_hub import HfApi


class HuggingFaceSpaceManager:
    def __init__(self, space_id: str, token_env_var: str = "HF_TOKEN"):
        """
        :param space_id: Your Space ID in the format "username/space_name".
        :param token_env_var: The name of the environment variable that stores the Hugging Face token.
        """
        token = os.getenv(token_env_var)
        if not token:
            raise ValueError(f"Environment variable '{token_env_var}' not set or empty.")

        self.api = HfApi(token=token)
        self.space_id = space_id

    def pause(self) -> str:
        """Pause the Hugging Face Space."""
        try:
            runtime = self.api.pause_space(repo_id=self.space_id)
            return f"Space '{self.space_id}' paused. Status: {runtime.stage}"
        except Exception as e:
            return f"Failed to pause space: {str(e)}"

    def restart(self) -> str:
        """Restart the Hugging Face Space."""
        try:
            runtime = self.api.restart_space(repo_id=self.space_id)
            return f"Space '{self.space_id}' restarted. Status: {runtime.stage}"
        except Exception as e:
            return f"Failed to restart space: {str(e)}"
