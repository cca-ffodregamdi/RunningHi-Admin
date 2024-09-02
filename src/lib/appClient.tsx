export async function fetchWithToken(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers || {});

    // localStorage에서 JWT 토큰을 가져옴
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        // JWT 토큰을 요청 헤더에 추가
        headers.set('Authorization', `${accessToken}`);
        console.log(accessToken)
    }

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

    const fetchOptions: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            // 서버가 2xx 범위를 벗어나는 상태 코드로 응답한 경우
            const errorData = await response.json();
            console.error('Response error:', errorData);
            console.error('Status:', response.status);
            console.error('Headers:', response.headers);

            if (response.status === 401) {
                // 권한이 없는 접근 시 처리 (예: 로그인 페이지로 리디렉션)
                console.error('Unauthorized access');
                window.location.href = '/auth';
            }

            throw new Error(`Response error: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Fetch error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw new Error(`Fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export default fetchWithToken;
