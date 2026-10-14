async function handleResponse(response: Response) {
  const ct = response.headers.get("Content-Type");

  if (ct?.includes("application/json")) {
    return await response.json();
  } else if (ct?.includes("text/plain")) {
    return await response.text();
  } else {
    return response;
  }
}

async function bfetch(input: string | Request | URL, options?: RequestInit) {
  const response = await fetch(input, options);

  if (!response.ok) {
    throw await handleResponse(response);
  }

  return await handleResponse(response);
}

export default bfetch;
