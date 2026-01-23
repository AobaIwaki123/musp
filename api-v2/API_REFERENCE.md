# MuSP API Reference

**Version:** 1.0.0

MuSP is a web application that downloads audio from YouTube links and separates the audio and vocals using Demucs. This API specification provides endpoints for job creation, status checking, and retrieving separated audio files.

**Base URL:** `http://localhost:8000`

## Authentication

**Type:** API Key
**Header Name:** `X-API-KEY`

## Endpoints

### Create a new job

Creates a job to download audio from a YouTube link and separate the audio and vocals.

**URL:** `/video`
**Method:** `POST`
**Auth Required:** Yes

#### Request Body

**Content-Type:** `application/json`

| Field | Type | Description | Required | Constraints |
|---|---|---|---|---|
| `user_id` | string | User ID | Yes | Max length: 100 |
| `youtube_url` | string | YouTube video link | Yes | Max length: 100, Pattern: YouTube URL regex |

**Example:**
```json
{
  "user_id": "testUser",
  "youtube_url": "https://www.youtube.com/watch?v=57Q4Hp46oXc"
}
```

#### Responses

**200 OK**
The video is already registered.

```json
{
  "status_code": 200,
  "status_message": "The video is already registered",
  "youtube_id": "57Q4Hp46oXc"
}
```

**400 Bad Request**
Invalid request.

```json
{
  "error": "error"
}
```

---

### Retrieve a list of YouTube IDs and Wav URLs for a user

Retrieves a list of YouTube IDs and Wav URLs created by a user.

**URL:** `/{user_id}`
**Method:** `GET`
**Auth Required:** Yes

#### Parameters

| Name | In | Type | Description | Required |
|---|---|---|---|---|
| `user_id` | Path | string | User ID | Yes |

#### Responses

**200 OK**
Retrieved the list of YouTube IDs and Wav URLs for the user.

```json
{
  "status_code": 200,
  "status_message": "Retrieved the list of YouTube IDs and Wav URLs for the user",
  "data": [
    {
      "youtube_id": "57Q4Hp46oXc",
      "vocal_wav_url": "http://localhost:8000/57Q4Hp46oXc/vocal.wav",
      "inst_wav_url": "http://localhost:8000/57Q4Hp46oXc/instrumental.wav"
    }
  ]
}
```

**400 Bad Request**
Invalid request.

```json
{
  "error": "error"
}
```

---

### Register user information

Registers user information.

**URL:** `/users`
**Method:** `POST`
**Auth Required:** Yes

#### Request Body

**Content-Type:** `application/json`

| Field | Type | Description | Required | Constraints |
|---|---|---|---|---|
| `google_id` | string | Google user ID | Yes | Max length: 100 |

**Example:**
```json
{
  "google_id": "testGoogleID"
}
```

#### Responses

**200 OK**
User already exists.

```json
{
  "status_code": 200,
  "status_message": "User already exists",
  "user_id": "testUser"
}
```

**400 Bad Request**
Invalid request.

```json
{
  "error": "error"
}
```

---

### Refresh signed URLs

Refreshes signed URLs for all videos.

**URL:** `/refresh-urls`
**Method:** `POST`
**Auth Required:** Yes

#### Responses

**200 OK**
Signed URLs refreshed successfully.

```json
{
  "status_code": 200,
  "status_message": "Refreshed 100 videos",
  "updated_count": 0
}
```

**400 Bad Request**
Invalid request.

```json
{
  "error": "error"
}
```

## Data Models

### PostVideoRequest

| Field | Type | Description | Required |
|---|---|---|---|
| `user_id` | string | User ID | Yes |
| `youtube_url` | string | YouTube video link | Yes |

### PostVideoResponse

| Field | Type | Description | Required |
|---|---|---|---|
| `status_code` | integer | Status code | Yes |
| `status_message` | string | Status message | Yes |
| `youtube_id` | string | YouTube video ID | Yes |

### VideoIDAndWavURL

| Field | Type | Description | Required |
|---|---|---|---|
| `youtube_id` | string | YouTube video ID | Yes |
| `vocal_wav_url` | string | Separated audio file URL | Yes |
| `inst_wav_url` | string | Separated instrumental file URL | Yes |

### GetVideoIDAndWavURLResponse

| Field | Type | Description | Required |
|---|---|---|---|
| `status_code` | integer | Status code | Yes |
| `status_message` | string | Status message | Yes |
| `data` | array[VideoIDAndWavURL] | List of video data | Yes |

### PostUserRequest

| Field | Type | Description | Required |
|---|---|---|---|
| `google_id` | string | Google user ID | Yes |

### PostUserResponse

| Field | Type | Description | Required |
|---|---|---|---|
| `status_code` | integer | Status code | Yes |
| `status_message` | string | Status message | Yes |
| `user_id` | string | User ID | Yes |

### RefreshUrlsResponse

| Field | Type | Description | Required |
|---|---|---|---|
| `status_code` | integer | Status code | Yes |
| `status_message` | string | Status message | Yes |
| `updated_count` | integer | Number of videos updated | No |

### ErrorResponse400

| Field | Type | Description | Required |
|---|---|---|---|
| `error` | string | Error message | Yes |
