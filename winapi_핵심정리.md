# WinAPI 핵심정리

> 국비 게임클라이언트(Unity) 과정 실습 코드 기반 복습/면접 자료.
> 원본 코드 위치: `C:\Study\API\API_ST`, `C:\Study\API\DrawingAPI`, `C:\Study\API\ImageToDot`, `C:\Study\API\TETORIS`
> (원본은 CP949 인코딩 — 필요하면 UTF-8로 재변환해서 볼 것)
> `C:\Study\D3D\BOARD\Engine`은 개인적으로 별도 진행 중인 프로젝트라 이번 정리에서 제외했다. `C:\Study\API\CPP_PLUS`는 WinAPI가 아니라 C++ 중급/고급 내용이라 `cpp_핵심정리.md`로 옮겼다.

## 목차

1. [`WinMain` 진입점과 윈도우 생성](#1-winmain-진입점과-윈도우-생성)
2. [메시지 루프 — `GetMessage`/`PeekMessage`/`TranslateMessage`/`DispatchMessage`](#2-메시지-루프--getmessagepeekmessagetranslatemessagedispatchmessage)
3. [`WndProc` 콜백과 자식 컨트롤 생성](#3-wndproc-콜백과-자식-컨트롤-생성)
4. [GDI 기초 — 디바이스 컨텍스트와 도형 그리기](#4-gdi-기초--디바이스-컨텍스트와-도형-그리기)
5. [더블 버퍼링과 비트맵 출력](#5-더블-버퍼링과-비트맵-출력)
6. [마우스/키보드 입력 메시지](#6-마우스키보드-입력-메시지)
7. [타이머 기반 게임 루프](#7-타이머-기반-게임-루프)
8. [사용자 정의 메시지 (`WM_USER`)](#8-사용자-정의-메시지-wm_user)
9. [공용 대화상자 + GDI+](#9-공용-대화상자--gdi)
10. [엔진/윈도우 책임 분리 설계](#10-엔진윈도우-책임-분리-설계)
11. [서드파티 라이브러리 연동 — FMOD 사운드](#11-서드파티-라이브러리-연동--fmod-사운드)
12. [x64 마이그레이션 이슈](#12-x64-마이그레이션-이슈)
13. [종합 대표 예제 — TETORIS](#13-종합-대표-예제--tetoris)

---

## 1. `WinMain` 진입점과 윈도우 생성

- **한 줄 정의**: 콘솔 프로그램의 `main()`에 대응하는 GUI 프로그램의 진입점이 `WinMain`이며, 창을 띄우기 전에 `WNDCLASSEX` 구조체로 "이 창이 어떤 속성/동작을 가질지"를 정의해 `RegisterClassEx`로 등록하고, `CreateWindowEx`로 실제 창을 만든다.
- **왜 중요한가**: WinAPI/MFC/게임엔진 창 생성 코드 전부가 이 절차의 변형이다. "창 하나가 실제로 뜨기까지 어떤 단계를 거치는가"를 순서대로 설명할 수 있는지가 기본기 확인 질문으로 자주 나옴.
- **내 코드에서 어떻게 썼는지**: `API/API_ST/API_ST/Ex1.cpp:51-162`
  ```cpp
  int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd)
  {
      WNDCLASSEX WndEx;
      WndEx.cbSize = sizeof(WndEx);
      WndEx.lpfnWndProc = WndProc;              // 메시지 처리 콜백 지정
      WndEx.hInstance = hInstance;
      WndEx.hbrBackground = (HBRUSH)GetStockObject(WHITE_BRUSH);
      WndEx.lpszClassName = szClass;
      RegisterClassEx(&WndEx);                   // 창의 "설계도"를 등록

      hWnd = CreateWindowEx(NULL, szClass, szTitle, WS_OVERLAPPEDWINDOW,
          CW_USEDEFAULT, CW_USEDEFAULT, 320, 240, NULL, NULL, hInstance, NULL);

      ShowWindow(hWnd, nShowCmd);
      UpdateWindow(hWnd);
      ...
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `RegisterClassEx`(설계도 등록)와 `CreateWindowEx`(실제 생성)를 왜 나누는가? (하나의 클래스로 여러 개의 창 인스턴스를 만들 수 있게 하기 위함)
  - `HINSTANCE`와 `HWND`의 차이는? (코드 주석에 직접 정리되어 있음 — `HINSTANCE`는 "실행 중인 프로그램 인스턴스"의 식별자, `HWND`는 그 프로그램이 띄운 "개별 창"의 식별자. 한 인스턴스가 여러 `HWND`를 가질 수 있음)
- **최신 동향**: Win32 `WinMain`/`WNDCLASSEX` 절차 자체는 지금도 네이티브 Windows 데스크톱 앱의 기본이며 바뀌지 않았다. 다만 새 데스크톱 앱을 만든다면 이 저수준 API를 직접 쓰기보다 WinUI 3, Win32 위에 얹힌 Qt/wxWidgets, 혹은 게임이라면 아예 게임 엔진(Unity/Unreal)이 창 생성을 대신 처리해주는 경우가 대부분이다.

## 2. 메시지 루프 — `GetMessage`/`PeekMessage`/`TranslateMessage`/`DispatchMessage`

- **한 줄 정의**: Windows는 키 입력, 마우스 클릭, 타이머, 그리기 요청 등 모든 이벤트를 "메시지"로 큐에 쌓아두고, 프로그램은 무한루프를 돌며 메시지를 하나씩 꺼내(`GetMessage`/`PeekMessage`) 처리 가능한 형태로 바꾼 뒤(`TranslateMessage`) 실제 처리 함수로 전달한다(`DispatchMessage`).
- **왜 중요한가**: "이벤트 기반 프로그래밍"이 실제로 어떻게 동작하는지 보여주는 가장 밑바닥 예시. 게임 루프(업데이트-렌더 반복)와 메시지 루프의 관계를 이해하고 있는지 확인하는 질문으로 이어짐.
- **내 코드에서 어떻게 썼는지**: `API/API_ST/API_ST/Ex1.cpp:178-192`
  ```cpp
  while (TRUE)
  {
      if (PeekMessage(&mSg, NULL, 0, 0, PM_NOREMOVE))   // 큐에 메시지가 있는지만 확인(제거 안 함)
      {
          if (!GetMessage(&mSg, NULL, 0, 0))
              break;                                      // WM_QUIT을 받으면 루프 종료
          TranslateMessage(&mSg);                          // 가상키 -> WM_CHAR 등으로 변환
          DispatchMessage(&mSg);                           // WndProc으로 전달
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `GetMessage`와 `PeekMessage`의 차이는? (`GetMessage`는 메시지가 올 때까지 블로킹, `PeekMessage`는 즉시 반환 — 그래서 게임처럼 메시지가 없을 때도 매 프레임 렌더링을 계속해야 하는 프로그램은 `PeekMessage`를 선호)
  - 이 코드는 `PeekMessage`로 확인만 하고 실제로는 다시 `GetMessage`(블로킹)를 호출하는데, 이러면 `PeekMessage`를 쓴 의미가 있는가? (이 예제는 사실상 `GetMessage`만으로 충분한 단순 대기형 루프 — TETORIS 같은 실시간 렌더링이 필요한 경우엔 `PeekMessage` + `PM_REMOVE`로 논블로킹 처리 후 나머지 시간에 게임 로직/렌더링을 도는 것이 정석. 이 차이를 스스로 짚을 수 있으면 좋은 신호)
  - `DispatchMessage`가 호출하는 함수는 어떻게 결정되는가? (메시지의 대상 `HWND`가 등록된 윈도우 클래스의 `lpfnWndProc`으로 결정됨)
- **최신 동향**: 메시지 루프의 구조 자체는 Win32 API가 바뀌지 않는 한 그대로 유효하다. 게임엔진은 이 루프를 내부적으로 감싸서 개발자에게는 `Update()`/`OnEvent()` 같은 콜백 형태로만 노출하는 경우가 많다.

## 3. `WndProc` 콜백과 자식 컨트롤 생성

- **한 줄 정의**: 특정 창으로 온 모든 메시지를 처리하는 콜백 함수 `WndProc`을 만들고, `switch(uMsg)`로 메시지 종류별 분기 처리한다. 버튼 같은 자식 컨트롤도 결국 `CreateWindow`로 만들어진 또 하나의 "윈도우"다.
- **왜 중요한가**: MFC의 메시지 맵(`BEGIN_MESSAGE_MAP`)이 바로 이 `switch-case`를 매크로로 자동 생성해주는 것이라는 걸 알면, WinAPI ↔ MFC를 잇는 핵심 연결고리가 된다(mfc_핵심정리.md 2번 항목과 대응).
- **내 코드에서 어떻게 썼는지**: `API/API_ST/API_ST/Ex1.cpp:199-306` — 버튼도 `CreateWindow`로 만들고, 버튼 클릭은 `WM_COMMAND`로 들어옴
  ```cpp
  case WM_CREATE:
      hButtPrint = CreateWindow(L"BUTTON", TEXT("시작"),
          WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
          10, 180, 90, 30, hWnd, (HMENU)1, NULL, NULL);   // 버튼 ID = 1
      return FALSE;

  case WM_COMMAND:
      switch (LOWORD(wParam))       // wParam 하위 워드에 컨트롤 ID가 들어있음
      {
      case 1: SetTimer(hWnd, 1, 100, NULL); break;   // ID 1번 버튼 클릭
      }
      return FALSE;
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `switch(uMsg)`에서 처리하지 않은 메시지는 어떻게 되는가? (반드시 `DefWindowProc`으로 넘겨야 시스템 기본 동작(최소화, 리사이즈 등)이 깨지지 않음 — 이 코드 맨 끝의 `return DefWindowProc(...)`이 그 역할)
  - 버튼의 "부모 윈도우"를 지정하는 `hWnd` 인자는 왜 필요한가? (자식 컨트롤은 항상 부모 창의 좌표계 안에서 위치가 정해지고, 부모가 파괴되면 자식도 함께 파괴됨)
- **최신 동향**: 개념은 불변이지만, `switch(uMsg)`가 메시지 종류가 늘어날수록 거대해지는 문제는 실무에서 메시지-핸들러 매핑 테이블이나 MFC/ATL의 메시지 맵으로 해결한다.

## 4. GDI 기초 — 디바이스 컨텍스트와 도형 그리기

- **한 줄 정의**: 화면에 무언가를 그리려면 먼저 "그리기 도구 모음"인 디바이스 컨텍스트(`HDC`)를 얻어야 하고, `WM_PAINT` 메시지가 오면 `BeginPaint`/`EndPaint` 사이에서 펜/브러시를 골라(`SelectObject`) 도형을 그린다.
- **왜 중요한가**: 모든 2D 렌더링(게임 UI, 커스텀 컨트롤)의 기초. "왜 아무 때나 그리지 않고 `WM_PAINT`에서만 그려야 하는가"를 설명할 수 있어야 함.
- **내 코드에서 어떻게 썼는지**: `API/API_ST/API_ST/Ex1.cpp:466-480` (원 그리기), `API/DrawingAPI/DrawingAPI/Drawing.cpp:372-463` (마우스로 도형 그리기 — `WM_LBUTTONDOWN`에서 시작점 기록, `WM_MOUSEMOVE`로 미리보기, `WM_LBUTTONUP`에서 확정 후 실제로 `LineTo`/`Ellipse`/`Rectangle`)
  ```cpp
  case WM_PAINT:
      hDC = BeginPaint(hWnd, &pS);
      hPen = CreatePen(PS_SOLID, 2, RGB(255, 0, 0));
      SelectObject(hDC, hPen);
      Ellipse(hDC, nX1, nY1, nX2, nY2);
      EndPaint(hWnd, &pS);
      DeleteObject(hPen);          // 만든 GDI 객체는 반드시 해제
      return FALSE;
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `CreatePen`으로 만든 `hPen`을 `DeleteObject`로 해제하지 않으면? (GDI 리소스 누수 — 운영체제가 관리하는 핸들 테이블이 꽉 차면 더 이상 GDI 객체를 만들 수 없게 됨)
  - `GetDC`/`ReleaseDC`와 `BeginPaint`/`EndPaint`의 차이는? (`BeginPaint`는 `WM_PAINT` 안에서만 쓰고 무효화된 영역을 자동으로 검증(validate)하지만, `GetDC`는 아무 때나 즉시 그릴 때 씀 — 이 코드의 `WM_TIMER` 핸들러가 `GetDC`/`ReleaseDC`를 쓰는 이유)
- **최신 동향**: GDI는 오래된 기술이지만 지금도 Win32 데스크톱 앱의 기본 2D 렌더링 API로 유효하다. 다만 성능이 중요한 그래픽(게임, 애니메이션)은 GDI 대신 Direct2D/Direct3D를 쓰는 것이 정석 — 5번 항목의 더블 버퍼링도 결국 GDI의 성능 한계를 우회하기 위한 기법이다.

## 5. 더블 버퍼링과 비트맵 출력

- **한 줄 정의**: 화면에 직접 그리면 매 프레임 깜빡임(flickering)이 생기므로, 메모리 상의 별도 디바이스 컨텍스트(`CreateCompatibleDC`)에 미리 다 그려놓고 완성된 화면을 한 번에 `BitBlt`로 복사해서 보여주는 기법.
- **왜 중요한가**: 게임/애니메이션에서 프레임 깜빡임을 막는 가장 고전적이고 기본적인 기법. 렌더링 파이프라인(백버퍼 → 프론트버퍼 스왑) 개념의 원형이라 게임 프로그래밍 면접에서 자주 나옴.
- **내 코드에서 어떻게 썼는지**: `API/API_ST/API_ST/Ex1.cpp:309-387` (주사위 비트맵 출력), `API/TETORIS/TETORIS/TETORISMAIN.cpp:1393-1438` (줄 삭제 시 화면을 위로 밀어올리는 애니메이션)
  ```cpp
  hMemDC = CreateCompatibleDC(hDC);        // 화면과 호환되는 메모리 DC 생성
  SelectObject(hMemDC, hBmpJ1);            // 비트맵을 메모리 DC에 선택
  BitBlt(hDC, 0, 0, 88, 88, hMemDC, 0, 0, SRCCOPY);   // 완성된 그림을 화면에 한 번에 복사
  DeleteDC(hMemDC);
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `SelectObject`로 비트맵을 DC에 선택하면 리턴값(이전에 선택되어 있던 객체)을 왜 보관해야 하는가? (다 쓴 뒤 원래 객체로 되돌려놔야 리소스 누수/오작동을 피할 수 있음 — 이 코드는 그 부분이 생략되어 있어 개선 여지로 지적할 수 있음)
  - `BitBlt`의 `SRCCOPY` 대신 다른 래스터 연산(`SRCAND`, `SRCPAINT` 등)을 쓰면 어떻게 다른가? (마스킹을 이용한 투명 효과 등에 활용)
- **최신 동향**: 더블 버퍼링 개념은 지금도 모든 그래픽 파이프라인(DirectX, OpenGL, 브라우저 렌더링)의 기본 원리로 살아있다. GDI `BitBlt` 수준의 더블 버퍼링은 레거시 스타일이고, 실무에서는 DirectX의 스왑체인(swap chain)이나 게임엔진이 알아서 처리한다.

## 6. 마우스/키보드 입력 메시지

- **한 줄 정의**: 마우스 클릭/이동/키보드 입력도 전부 `WM_LBUTTONDOWN`, `WM_MOUSEMOVE`, `WM_KEYDOWN` 같은 메시지로 들어오며, `lParam`에서 좌표를, `wParam`에서 가상키 코드를 꺼내 처리한다.
- **왜 중요한가**: 입력 처리는 모든 인터랙티브 프로그램의 핵심. "마우스 좌표가 `lParam`의 어느 워드에 들어있는가"처럼 구체적으로 아는지 확인하는 질문이 나옴.
- **내 코드에서 어떻게 썼는지**: `API/DrawingAPI/DrawingAPI/Drawing.cpp:372-463`(그리기 시작/이동/종료), `API/TETORIS/TETORIS/TETORISMAIN.cpp:635`(방향키로 블록 조작)
  ```cpp
  case WM_LBUTTONDOWN:
      startX = LOWORD(lParam);   // lParam 하위 워드 = x좌표
      startY = HIWORD(lParam);   // lParam 상위 워드 = y좌표
      ...
  case WM_KEYDOWN:
      switch (wParam)            // wParam = 가상키 코드(VK_LEFT, VK_RIGHT ...)
      { /* 블록 이동/회전 처리 */ }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `WM_KEYDOWN`과 `WM_CHAR`의 차이는? (`WM_KEYDOWN`은 물리적 키(가상키 코드), `WM_CHAR`는 `TranslateMessage`를 거쳐 조합된 실제 문자 — Shift+A 같은 조합을 다룰 때 차이가 드러남)
  - 마우스 왼쪽 버튼을 누른 채로 드래그하는 상태를 어떻게 유지하는가? (`ImageToDot`의 `m_isLMousePressed` 같은 불리언 플래그로 상태를 저장해두고 `WM_MOUSEMOVE`에서 이 플래그를 확인하는 패턴)
- **최신 동향**: Win32 메시지 기반 입력 처리는 지금도 유효하지만, 게임에서는 프레임마다 키 상태를 직접 폴링하는 방식(`GetAsyncKeyState`, 혹은 DirectInput/XInput)을 병행하는 경우가 많다 — 메시지 기반은 "이벤트가 발생했을 때"에 강하고, 폴링은 "지금 이 순간 눌려있는가"를 매 프레임 확인하는 데 강하다는 차이가 있다.

## 7. 타이머 기반 게임 루프

- **한 줄 정의**: `SetTimer`로 일정 간격마다 `WM_TIMER` 메시지가 오도록 예약해두고, 그 핸들러 안에서 게임 상태를 한 스텝씩 진행시키는(블록 낙하, 애니메이션 프레임 갱신) 방식.
- **왜 중요한가**: 정교한 게임 루프(고정 타임스텝, 델타타임)로 넘어가기 전 단계의 가장 단순한 형태. "이 방식의 한계가 뭔가"를 설명할 수 있으면 더 발전된 게임 루프 설계를 이해하고 있다는 신호가 됨.
- **내 코드에서 어떻게 썼는지**: `API/TETORIS/TETORIS/TETORISMAIN.cpp:703-736`
  ```cpp
  case WM_TIMER:
      if (PlayerState == ALIVE)
      {
          DownMove();                              // 블록을 한 칸 내림
          second++;
          if (second % (20 - Level) == 0) { second = 0; UpObstacle(); }  // 레벨이 높을수록 더 자주 장애물 추가
          frameIndex = (frameIndex + 1) % 4;        // 캐릭터 애니메이션 프레임 갱신
          InvalidateRect(hWnd, &charRect, TRUE);    // 필요한 영역만 다시 그리도록 요청
      }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `WM_TIMER`의 간격(예: 1000ms)이 곧 게임의 프레임레이트가 되는데, 이 방식의 문제는? (타이머 정밀도가 낮고(보통 15ms 단위), 시스템 부하에 따라 간격이 밀릴 수 있어 정확한 델타타임 기반 루프보다 부정확함)
  - `InvalidateRect`에서 전체 화면이 아니라 특정 `RECT`만 지정하는 이유는? (화면 전체를 다시 그리는 것보다 실제로 바뀐 영역만 다시 그리는 게 훨씬 빠름 — 부분 갱신 최적화)
- **최신 동향**: `SetTimer` 기반 게임 루프는 학습용으로는 충분하지만, 실무/게임엔진에서는 고정 타임스텝(fixed timestep) + 델타타임(delta time) 기반 루프가 표준이다 — 프레임마다 실제로 흐른 시간을 측정해서 이동/애니메이션 속도를 프레임레이트와 무관하게 일정하게 유지하는 방식. Unity의 `Update()`/`FixedUpdate()`가 바로 이 개념 위에 만들어져 있다(Unity 정리 단계에서 다시 연결할 예정).

## 8. 사용자 정의 메시지 (`WM_USER`)

- **한 줄 정의**: 시스템이 이미 쓰고 있는 메시지 번호와 충돌하지 않도록, 프로그래머가 직접 새 메시지를 정의할 때는 `WM_USER`(0x400) 이후의 예약 구간에서 `WM_USER + n` 형태로 번호를 매겨야 한다.
- **왜 중요한가**: 컴포넌트 간에 "커스텀 이벤트"를 메시지로 전달하는 패턴의 기초. 매직 넘버를 직접 쓰면 안 되는 이유를 구체적으로 설명할 수 있는지를 봄.
- **내 코드에서 어떻게 썼는지**: `API/TETORIS/TETORIS/TETORISMAIN.cpp:26-52` — 처음엔 `#define WM_NewBlock 100`처럼 매직넘버로 시도했다가, 그게 왜 위험한지 스스로 주석에 정리하고 올바른 방식으로 고친 과정이 그대로 남아있음
  ```cpp
  // 처음 시도 (위험) - 100은 시스템이 내부적으로 예약한 메시지 값과 겹칠 수 있음
  // #define WM_NewBlock 100

  // 올바른 방식 - WM_USER(0x400) 이후 구간만 프로그래머가 자유롭게 사용 가능
  #define WM_NewBlock WM_USER + 1
  ...
  SendMessage(hWnd, WM_NewBlock, 0, 0);   // 새 블록이 필요할 때 스스로에게 메시지를 보냄
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `SendMessage`와 `PostMessage`의 차이는? (`SendMessage`는 대상 윈도우 프로시저가 처리를 마칠 때까지 동기적으로 대기, `PostMessage`는 큐에 넣고 바로 리턴하는 비동기 방식)
  - 이 코드처럼 자기 자신에게(`hWnd`) 메시지를 보내는 이유는? (현재 실행 흐름을 끊지 않고, 메시지 큐를 거쳐 다음 메시지 처리 사이클에 새 블록 생성 로직을 자연스럽게 끼워 넣기 위함)
- **최신 동향**: `WM_USER` 기반 사용자 정의 메시지는 여전히 유효한 Win32 관용구다(단, DLL 간 통신처럼 더 넓은 범위가 필요하면 `RegisterWindowMessage`로 시스템 전역에서 고유한 메시지 번호를 발급받는 방법도 있음). 최신 이벤트 기반 아키텍처(옵저버 패턴, C# 이벤트/델리게이트, Unity의 `UnityEvent`)는 같은 문제(느슨한 결합의 알림)를 메시지 번호 없이 타입-안전하게 해결한다.

## 9. 공용 대화상자 + GDI+

- **한 줄 정의**: 파일 열기/저장 창처럼 운영체제가 기본 제공하는 UI를 `OPENFILENAME` 구조체 + `GetOpenFileName` 함수로 띄우고, 이미지 처리에는 GDI보다 상위 레벨인 GDI+(`Gdiplus::Bitmap`, `Graphics`)를 사용.
- **왜 중요한가**: "OS가 이미 만들어둔 UI를 재사용하는 법"과 "GDI vs GDI+"의 차이를 아는지 확인하는 실무형 질문.
- **내 코드에서 어떻게 썼는지**: `API/ImageToDot/ImageToDot/ImageToDot/MainWindow.cpp:255-268`
  ```cpp
  WCHAR szFile[MAX_PATH] = { 0 };
  OPENFILENAME ofn = { 0 };
  // ... ofn 구조체에 필터, 초기 폴더 등 설정 ...
  if (GetOpenFileName(&ofn)) {   // 사용자가 파일을 고르면 szFile에 경로가 채워짐
      m_pEngine->LoadImageFile(szFile);
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - GDI(`HDC`, `BitBlt`)와 GDI+(`Gdiplus::Bitmap`, `Graphics`)의 차이는? (GDI+는 객체지향 API, 알파블렌딩/안티앨리어싱 등 더 풍부한 기능을 제공하지만 GDI보다 느림)
  - `GetOpenFileName`이 실패/취소되면 어떻게 처리해야 하는가? (반환값 `FALSE` 체크 없이 `szFile`을 그대로 쓰면 이전 값이나 빈 문자열을 잘못 사용하게 됨)
- **최신 동향**: GDI+는 여전히 유효하지만 신규 프로젝트에서는 더 발전된 이미지 처리 API(WIC - Windows Imaging Component)나 아예 Direct2D를 선호하는 추세. 공용 대화상자(`GetOpenFileName`)는 지금도 표준이지만, 최신 앱(UWP/WinUI)에서는 `IFileOpenDialog` COM 인터페이스를 쓰는 것이 권장된다.

## 10. 엔진/윈도우 책임 분리 설계

- **한 줄 정의**: 창을 만들고 메시지를 처리하는 코드(`MainWindow`)와, 실제 이미지 변환 로직(`PixelEngine`)을 서로 다른 클래스로 분리해서, 창 처리 코드가 "이미지를 어떻게 픽셀아트로 바꾸는지"는 몰라도 되게 설계.
- **왜 중요한가**: WinAPI 코드는 자칫하면 `WndProc` 하나에 UI 처리와 비즈니스 로직이 뒤섞이기 쉬운데, 이 프로젝트는 그걸 의도적으로 나눴다는 점에서 설계 감각을 보여줄 수 있는 예. C++ 정리(Part 1, 10번)의 컴포지션 원칙이 WinAPI 프로젝트에도 그대로 적용된 사례.
- **내 코드에서 어떻게 썼는지**: `API/ImageToDot/ImageToDot/ImageToDot/MainWindow.h`(창/입력 처리) + `PixelEngine.h`(이미지 변환 로직)
  ```cpp
  // MainWindow: "어떻게 보여줄지"만 담당
  class PixelEngine* m_pEngine;   // 실제 변환은 엔진에 위임

  // PixelEngine: "어떻게 변환할지"만 담당, 창이 있는지 전혀 모름
  class PixelEngine {
  public:
      bool LoadImageFile(const WCHAR* filePath);
      void ApplyPaletteToCanvas();
      Gdiplus::Bitmap* GetPixelatedImage() const { return m_pPixelatedImg; }
  };
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이렇게 분리하면 테스트하기 왜 더 쉬워지는가? (`PixelEngine`은 창이 없어도 단위 테스트가 가능 — `WndProc`에 로직이 섞여 있으면 창을 띄우지 않고는 테스트할 방법이 없음)
  - `MainWindow`가 `PixelEngine`을 포인터로 들고 있는데, 이 관계는 소유(ownership)인가 참조인가? (소유라면 소멸자에서 `delete` 책임이 있는가 — 7번 항목의 가상 소멸자 논의와 연결지어 확인해볼 지점)
- **최신 동향**: "UI 계층과 로직 계층을 분리하라"는 원칙은 MVC/MVVM 같은 아키텍처 패턴의 기본 정신이며, Unity에서도 MonoBehaviour(뷰에 가까움)와 순수 C# 클래스(로직)를 분리하는 설계로 이어진다(Unity 정리 단계에서 다시 다룰 예정).

## 11. 서드파티 라이브러리 연동 — FMOD 사운드

- **한 줄 정의**: 운영체제가 기본 제공하지 않는 기능(고품질 오디오 재생/믹싱)을 위해 외부 라이브러리(FMOD)를 프로젝트에 링크하고, 그 라이브러리의 API를 감싼 얇은 래퍼 함수(`AddSoundFile`, `EffectPlay`, `BGPlay`)로 게임 로직과 분리해서 사용.
- **왜 중요한가**: 실무에서는 사운드/물리/네트워크 등 대부분 서드파티 라이브러리를 갖다 쓴다. "라이브러리를 직접 감싸서 쓰는 이유"(교체 용이성, 의존성 격리)를 설명할 수 있으면 좋은 인상을 줌.
- **내 코드에서 어떻게 썼는지**: `API/TETORIS/TETORIS/FmodSound.h` + `TETORISMAIN.cpp`
  ```cpp
  // FmodSound.h - FMOD API를 직접 노출하지 않고 게임이 필요로 하는 동작만 함수로 감싸둠
  int  AddSoundFile(std::string _FullPath, bool IsLoop = false);
  void EffectPlay(int _SoundNum);
  void BGPlay(int _SoundNum);

  // TETORISMAIN.cpp - 게임 로직은 FMOD를 전혀 몰라도 됨
  int TETORISBGSound = AddSoundFile("./resourse/Sound/....mp3", true);
  ...
  EffectPlay(EffectSoundDie);   // 게임오버 효과음
  BGStop();
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 게임 로직 코드에서 FMOD 헤더를 직접 include하지 않고 이 래퍼 함수만 쓰는 이유는? (사운드 라이브러리를 나중에 다른 것으로 교체해도 게임 로직 코드는 건드릴 필요가 없어짐 — 의존성 역전의 초보적 형태)
  - `AddSoundFile`이 반환하는 `int`(사운드 번호)는 왜 핸들 자체(포인터)가 아니라 정수 ID로 설계했을까? (내부 구현(FMOD 핸들)을 외부에 노출하지 않기 위한 캡슐화)
- **최신 동향**: FMOD는 지금도 게임업계 표준급 오디오 미들웨어로 실무에서 널리 쓰인다(Wwise와 함께 양대 산맥). Unity에도 FMOD 공식 통합 패키지가 있어, Unity 프로젝트에서 기본 AudioSource로는 부족한 고급 믹싱/이펙트가 필요할 때 여전히 많이 도입된다.

## 12. x64 마이그레이션 이슈

- **한 줄 정의**: 32비트(x86) 시절에 쓰던 일부 WinAPI 함수(`GetWindowLong`, `SetClassLong` 등)는 포인터 크기를 `LONG`(32비트)으로 가정하고 설계되어, 64비트(x64) 환경에서는 포인터가 잘릴 위험이 있어 `*Ptr` 접미사가 붙은 새 버전(`GetWindowLongPtr` 등)으로 대체해야 한다.
- **왜 중요한가**: "오래된 WinAPI 코드를 최신 환경으로 포팅해본 경험이 있는가"라는, 실무형 레거시 유지보수 질문에 바로 답할 수 있는 근거가 됨.
- **내 코드에서 어떻게 썼는지**: `API/API_ST/API_ST/Ex1.cpp:894-935`에 이 마이그레이션 대응표가 그대로 정리되어 있음
  ```
  GetClassLong   → GetClassLongPtr
  GetWindowLong  → GetWindowLongPtr
  SetWindowLong  → SetWindowLongPtr
  GWL_WNDPROC    → GWLP_WNDPROC
  ...
  SetWindowLongPtr(hWnd1, GWLP_WNDPROC, (DWORD_PTR)WndProc1);  // LONG -> DWORD_PTR로 캐스팅 변경
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 왜 하필 포인터 관련 함수들만 이 문제가 생기는가? (x86에서는 포인터가 32비트라 `LONG`에 그대로 들어갔지만, x64에서는 포인터가 64비트라 32비트 `LONG`에 담으면 상위 비트가 잘려나감)
  - 이 문제를 컴파일 타임에 미리 잡을 수 있는 방법은? (프로젝트 설정에서 x64 빌드를 활성화하고 컴파일 경고를 확인하는 것이 기본, 최신 SDK 헤더는 구 버전 함수 사용 시 경고를 띄워줌)
- **최신 동향 (확인 필요)**: 이 이슈는 Windows XP/Vista 시절 32비트→64비트 전환기에 특히 부각되었던 문제로, 최신 Visual Studio/Windows SDK로 새로 시작하는 프로젝트라면 처음부터 `*Ptr` 버전 함수만 쓰면 되므로 실무에서 마주칠 일은 크게 줄었다. 다만 **오래된 WinAPI 코드베이스를 유지보수하는 상황(레거시 산업 소프트웨어, 오래된 사내 툴 등)에서는 여전히 실제로 부딪히는 이슈**라는 점은 각 회사/프로젝트마다 다를 수 있어 확인이 필요하다.

## 13. 종합 대표 예제 — TETORIS

`API/TETORIS/` 프로젝트는 위에서 다룬 WinAPI 개념들이 실제 게임 하나에 다 녹아있는, 이 폴더에서 가장 완성도 높은 예제다.

- **구조**: `WinMain`으로 창을 띄우고(1번), 메시지 루프(2번)를 돌며, `WndProc`에서 `WM_TIMER`(7번, 블록 자동 낙하)·`WM_KEYDOWN`(6번, 좌우/회전 조작)·`WM_NewBlock`(8번, 사용자 정의 메시지로 다음 블록 생성 트리거)을 처리하고, 화면은 더블 버퍼링(5번)으로 그리며, 배경음악/효과음은 FMOD 래퍼(11번)로 재생한다.
- **면접에서 이 프로젝트로 답할 수 있는 질문들**:
  - "WinAPI로 실시간성이 있는 프로그램을 만들어본 경험은?" → 테트리스의 `WM_TIMER` 기반 낙하 로직과 `WM_KEYDOWN` 입력 처리를 함께 설명.
  - "커스텀 이벤트/메시지를 설계해본 적 있는가?" → `WM_NewBlock`을 매직넘버가 아니라 `WM_USER + 1`로 올바르게 정의한 과정(8번 항목)을 스스로 고쳐나간 스토리로 답변 가능.
  - "이 코드에서 개선하고 싶은 부분은?" → `SelectObject`로 얻은 이전 GDI 객체를 복원하지 않는 부분(5번 항목), `WM_TIMER` 기반 게임 루프의 프레임 정밀도 한계(7번 항목)를 스스로 지적하면 좋은 인상.

---

## 이 폴더에서 확인한, 고쳐볼 만한 부분 (요약)

1. **GDI 객체 복원 누락** (5번 항목) — `SelectObject`로 비트맵/펜을 DC에 선택할 때 반환되는 이전 객체를 보관해뒀다가 작업이 끝나면 되돌려놓아야 하는데, 여러 곳에서 이 과정이 생략되어 있음. 리소스 누수나 미묘한 렌더링 버그로 이어질 수 있음.
2. **`GetOpenFileName` 실패 시 처리 없음** (9번 항목) — 사용자가 파일 선택을 취소해도 이후 코드가 이를 감지하지 못하고 진행될 수 있는 지점이 있어, 반환값 체크를 명시적으로 강화할 여지가 있음.
3. **`WM_TIMER` 기반 게임 루프의 정밀도 한계** (7번 항목) — 실무 수준으로 발전시키려면 델타타임 기반 루프로 전환하는 것이 정석(Unity 단계에서 비교 예정).
