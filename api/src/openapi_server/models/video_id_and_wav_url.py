# coding: utf-8

"""
    MuSP API

    MuSP is a web application that downloads audio from YouTube links and separates the audio and vocals using Demucs. This API specification provides endpoints for job creation, status checking, and retrieving separated audio files. 

    The version of the OpenAPI document: 1.0.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
import pprint
import re  # noqa: F401
import json




from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Any, ClassVar, Dict, List, Optional
from typing_extensions import Annotated
try:
    from typing import Self
except ImportError:
    from typing_extensions import Self

class VideoIDAndWavURL(BaseModel):
    """
    VideoIDAndWavURL
    """ # noqa: E501
    youtube_id: Annotated[str, Field(strict=True)] = Field(description="YouTube video ID")
    wav_url: Optional[Annotated[str, Field(strict=True)]] = Field(default=None, description="Separated audio file URL")
    __properties: ClassVar[List[str]] = ["youtube_id", "wav_url"]

    @field_validator('youtube_id')
    def youtube_id_validate_regular_expression(cls, value):
        """Validates the regular expression"""
        if not re.match(r"^[a-zA-Z0-9_-]{11}$", value):
            raise ValueError(r"must validate the regular expression /^[a-zA-Z0-9_-]{11}$/")
        return value

    model_config = {
        "populate_by_name": True,
        "validate_assignment": True,
        "protected_namespaces": (),
    }


    def to_str(self) -> str:
        """Returns the string representation of the model using alias"""
        return pprint.pformat(self.model_dump(by_alias=True))

    def to_json(self) -> str:
        """Returns the JSON representation of the model using alias"""
        # TODO: pydantic v2: use .model_dump_json(by_alias=True, exclude_unset=True) instead
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, json_str: str) -> Self:
        """Create an instance of VideoIDAndWavURL from a JSON string"""
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        """Return the dictionary representation of the model using alias.

        This has the following differences from calling pydantic's
        `self.model_dump(by_alias=True)`:

        * `None` is only added to the output dict for nullable fields that
          were set at model initialization. Other fields with value `None`
          are ignored.
        """
        _dict = self.model_dump(
            by_alias=True,
            exclude={
            },
            exclude_none=True,
        )
        return _dict

    @classmethod
    def from_dict(cls, obj: Dict) -> Self:
        """Create an instance of VideoIDAndWavURL from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "youtube_id": obj.get("youtube_id"),
            "wav_url": obj.get("wav_url")
        })
        return _obj


