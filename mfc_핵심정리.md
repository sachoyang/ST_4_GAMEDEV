# MFC 핵심정리

> 국비 게임클라이언트(Unity) 과정 실습 코드 기반 복습/면접 자료.
> 원본 코드 위치: `C:\Study\MFC\ExSetting`, `Lotto_peace`, `MFC_prac01`, `MFC_prac1`, `ST_1`, `Wordle_MFC`
> (원본은 CP949 인코딩 — 필요하면 UTF-8로 재변환해서 볼 것)
> WinAPI 개념(메시지 루프, `WndProc`, GDI)을 먼저 정리해둔 `winapi_핵심정리.md`와 짝을 이루는 문서 — MFC는 그 WinAPI 위에 클래스로 만든 껍데기라는 걸 항목마다 대응시켜서 정리했다.

## 목차

1. [MFC 앱 구조 — `CWinApp`/`InitInstance`, 다이얼로그 기반 앱](#1-mfc-앱-구조--cwinappinitinstance-다이얼로그-기반-앱)
2. [메시지 맵(Message Map) — WinAPI `switch-case`의 매크로화](#2-메시지-맵message-map--winapi-switch-case의-매크로화)
3. [DDX/DDV 데이터 교환 — `UpdateData`](#3-ddxddv-데이터-교환--updatedata)
4. [컨트롤 제어 — `GetDlgItem`, 리소스 ID 산술연산](#4-컨트롤-제어--getdlgitem-리소스-id-산술연산)
5. [다이얼로그 간 전환 — 모달 vs 모덜리스](#5-다이얼로그-간-전환--모달-vs-모덜리스)
6. [`OnSysCommand` 오버라이드 — 시스템 메시지 가로채기](#6-onsyscommand-오버라이드--시스템-메시지-가로채기)
7. [종합 대표 예제 — Lotto_peace](#7-종합-대표-예제--lotto_peace)

---

## 1. MFC 앱 구조 — `CWinApp`/`InitInstance`, 다이얼로그 기반 앱

- **한 줄 정의**: MFC는 `winapi_핵심정리.md`의 `WinMain`+메시지 루프를 `CWinApp` 클래스 뒤로 감춰두고, 개발자는 `InitInstance()`를 오버라이드해서 "앱이 시작할 때 어떤 다이얼로그를 띄울지"만 정의하면 된다.
- **왜 중요한가**: "MFC가 결국 WinAPI 위에 무엇을 얹은 것인가"를 설명할 수 있으면 두 기술의 관계를 정확히 이해했다는 신호가 됨.
- **내 코드에서 어떻게 썼는지**: `MFC/ExSetting/ExSetting/ExSetting.cpp`
  ```cpp
  BOOL CExSettingApp::InitInstance()
  {
      CWinApp::InitInstance();      // 내부적으로 WinAPI 초기화(윈도우 클래스 등록 등)를 대신 처리
      ...
      CExSettingDlg dlg;
      m_pMainWnd = &dlg;
      INT_PTR nResponse = dlg.DoModal();   // 여기서부터 메시지 루프가 돌기 시작
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `InitInstance()`는 왜 `WinMain`이 아니라 이 함수를 오버라이드하는가? (`WinMain` 자체는 MFC 프레임워크 내부에 이미 구현되어 있고, 그 안에서 `CWinApp`의 가상함수 `InitInstance`를 호출해주는 구조 — 템플릿 메서드 패턴)
  - `DoModal()` 호출 이후에 `InitInstance` 뒤쪽 코드가 실행되지 않는 이유는? (`DoModal`이 다이얼로그의 메시지 루프를 돌며 블로킹되기 때문 — 다이얼로그가 닫혀야 리턴됨)
- **최신 동향**: MFC 자체가 마이크로소프트의 레거시 프레임워크로 분류되지만, Visual Studio는 지금도 MFC를 계속 지원하고 있고 신규 프로젝트 템플릿도 제공한다. 신규 크로스플랫폼 GUI 개발에는 WinUI 3, Qt, Avalonia 등이 더 권장되지만, **기존 MFC 데스크톱 툴(사내 계측 소프트웨어, 산업/공정 제어 프로그램, 오래된 상용 소프트웨어의 유지보수)은 여전히 현역**이라 "레거시 유지보수" 채용 공고에서 MFC 경험을 요구하는 경우가 실제로 있다.

## 2. 메시지 맵(Message Map) — WinAPI `switch-case`의 매크로화

- **한 줄 정의**: WinAPI에서 직접 짜야 했던 `switch(uMsg)` 분기를, MFC는 `BEGIN_MESSAGE_MAP`/`ON_BN_CLICKED` 같은 매크로로 "이 컨트롤의 이 이벤트가 오면 이 멤버함수를 호출해라"는 표(테이블)로 대체한다.
- **왜 중요한가**: `winapi_핵심정리.md` 3번 항목(`WndProc`)과 정확히 대응되는 개념이라, 두 기술을 비교 설명하는 질문에 바로 답할 수 있게 해줌.
- **내 코드에서 어떻게 썼는지**: `MFC/ST_1/ST_1/ST_1Dlg.cpp:77-87`
  ```cpp
  BEGIN_MESSAGE_MAP(CST1Dlg, CDialogEx)
      ON_BN_CLICKED(IDC_BUTT_EXIT, &CST1Dlg::OnBnClickedButtExit)   // 버튼 클릭 -> 멤버함수 직접 매핑
      ON_EN_CHANGE(IDC_EDIT_A, &CST1Dlg::OnEnChangeEditA)           // 에디트 컨트롤 텍스트 변경 이벤트
  END_MESSAGE_MAP()
  ```
  WinAPI라면 이게 `case WM_COMMAND: switch(LOWORD(wParam)) { case IDC_BUTT_EXIT: ... }` 형태로 직접 분기해야 했을 코드다(`winapi_핵심정리.md` 3번 항목 참고).
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `ON_BN_CLICKED`가 실제로 하는 일은? (매크로를 펼쳐보면 결국 메시지 ID와 컨트롤 ID, 호출할 함수 포인터를 정적 배열에 등록해두고, 내부적으로는 여전히 `WM_COMMAND` 메시지를 받아 이 표에서 검색해 호출해주는 구조 — 즉 겉모습만 바뀌었을 뿐 밑바탕은 WinAPI 메시지 처리 그대로)
  - Visual Studio의 클래스 마법사(리소스 뷰에서 이벤트 더블클릭)로 이 매크로들이 자동 생성되는데, 그 이유는? (사람이 메시지 ID/함수 시그니처를 직접 맞춰 쓰는 실수를 줄이기 위함)
- **최신 동향**: 메시지 맵은 MFC 고유의 오래된(그러나 여전히 동작하는) 관용구다. 최신 UI 프레임워크(WPF, WinUI, 웹 프론트엔드)는 이런 명시적 매핑 테이블 대신 데이터 바인딩과 이벤트 델리게이트/람다로 훨씬 선언적으로 표현하는 방향으로 발전했다.

## 3. DDX/DDV 데이터 교환 — `UpdateData`

- **한 줄 정의**: 다이얼로그의 컨트롤(에디트박스 등)과 클래스의 멤버 변수를 `DoDataExchange`에 등록해두면, `UpdateData(TRUE)`는 "화면 → 변수"로, `UpdateData(FALSE)`는 "변수 → 화면"으로 값을 자동 동기화해준다(DDX = Dialog Data eXchange, DDV = ...Validation).
- **왜 중요한가**: MFC 다이얼로그 프로그래밍에서 가장 자주 실수하는 지점 — "왜 멤버 변수를 바꿔도 화면이 안 바뀌지?"라는 질문의 답이 바로 이것. 방향(`TRUE`/`FALSE`)을 헷갈리지 않고 설명할 수 있는지가 핵심.
- **내 코드에서 어떻게 썼는지**: `MFC/ST_1/ST_1/ST_1Dlg.cpp:290-300` — Edit A에 값을 입력하면 실시간으로 Edit B에도 같은 값이 나타나는 예제
  ```cpp
  void CST1Dlg::OnEnChangeEditA()
  {
      UpdateData(TRUE);    // 화면(Edit A) -> 멤버 변수(m_A)로 읽어옴
      m_B = m_A;            // 멤버 변수끼리 값 복사
      UpdateData(FALSE);   // 멤버 변수(m_B) -> 화면(Edit B)으로 반영
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `UpdateData(TRUE)`를 호출하지 않고 바로 `m_A`를 읽으면 어떻게 되는가? (컨트롤에 방금 입력한 값이 아니라, 마지막으로 `UpdateData(TRUE)`가 호출됐던 시점의 오래된 값이 들어있음)
  - DDV(Validation)는 뭘 검증해주는가? (`DDV_MinMaxInt` 등으로 입력값의 범위를 검사해서, 벗어나면 자동으로 경고 메시지박스를 띄우고 포커스를 되돌려주는 기능)
- **최신 동향**: DDX/DDV 패턴 자체는 MFC 고유의 오래된 방식이지만, "뷰(화면)와 모델(데이터)을 동기화한다"는 개념 자체는 WPF/Xamarin/웹 프론트엔드의 데이터 바인딩, Unity UI의 데이터 바인딩(UI Toolkit)으로 계속 이어지고 있다 — 다만 최신 방식들은 `UpdateData`처럼 명시적으로 호출하지 않아도 값이 바뀌면 자동으로 양쪽이 동기화(two-way binding)되는 방향으로 발전했다.

## 4. 컨트롤 제어 — `GetDlgItem`, 리소스 ID 산술연산

- **한 줄 정의**: 다이얼로그 위의 버튼/체크박스/콤보박스 같은 컨트롤은 리소스 편집기에서 정해진 ID(`IDC_...`)로 식별되며, `GetDlgItem(ID)`로 해당 컨트롤의 포인터를 얻어 `EnableWindow`, `CheckDlgButton` 같은 함수로 상태를 제어한다.
- **왜 중요한가**: 체크박스 45개처럼 컨트롤 개수가 많을 때 하나하나 이름 붙여 다루는 대신, 리소스 ID가 연속된 값이라는 점을 이용해 반복문으로 처리하는 실용적인 테크닉을 보여줌.
- **내 코드에서 어떻게 썼는지**: `MFC/Lotto_peace/Lotto_peace/Lotto_peaceDlg.cpp:166-180` — 로또 번호 체크박스(1~45번, `IDC_CHECK2`부터 순서대로 리소스 ID가 배정됨)를 전부 초기화/선택
  ```cpp
  void CLottopeaceDlg::OnBnClickedButtZero()
  {
      for (int i = 0; i < 45; i++)
      {
          CheckDlgButton(IDC_CHECK2 + i, FALSE);   // IDC_CHECK2, IDC_CHECK2+1, ... 순서로 접근
      }
  }
  // 체크 상태 조회는 GetDlgItem으로 컨트롤 포인터를 얻어서 확인
  CButton* pButton = (CButton*)GetDlgItem(IDC_CHECK2 + i);
  if (pButton->GetCheck() == 1) { ... }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `IDC_CHECK2 + i`처럼 리소스 ID에 정수를 더해 접근하는 방식이 위험할 수 있는 이유는? (리소스 편집기가 항상 ID를 연속된 값으로 자동 배정한다는 보장은 없음 — 중간에 다른 컨트롤을 추가하거나 ID를 수동으로 바꾸면 깨질 수 있는 암묵적 가정에 의존한 코드)
  - 이걸 더 안전하게 짜려면? (컨트롤 배열을 명시적으로 관리하거나, `CArray<CButton*>`처럼 포인터를 미리 모아두는 방식)
- **최신 동향**: 이 패턴 자체는 지금도 MFC 코드에서 흔히 쓰이는 실용적 관용구지만, 컨트롤 수가 많고 동적으로 늘어나는 UI라면 애초에 배열/컬렉션 기반으로 동적 생성하는 편이 유지보수에 더 안전하다는 게 일반적인 견해.

## 5. 다이얼로그 간 전환 — 모달 vs 모덜리스

- **한 줄 정의**: `DoModal()`로 띄운 다이얼로그(모달)는 닫히기 전까지 부모 창을 포함한 다른 입력을 막지만, `Create()` + `ShowWindow()`로 띄운 다이얼로그(모덜리스)는 다른 창과 동시에 조작할 수 있다.
- **왜 중요한가**: "설정 창을 띄웠는데 원래 창을 조작하고 싶다/막고 싶다"는 실무 UI 설계 판단과 직결되는 개념. 두 방식의 구현 코드가 다르다는 것도 알아야 함.
- **내 코드에서 어떻게 썼는지**:
  - 모달: `MFC/Lotto_peace/Lotto_peace/Lotto_peaceDlg.cpp:182-212` — 번호 생성 결과창을 모달로 띄워서, 결과를 확인하기 전엔 원래 창을 조작 못 하게 막음
    ```cpp
    CLottoCreate dlg;
    dlg.LottoArr[i] = ...;   // 모달로 띄우기 전에 데이터를 미리 채워넣음(공용 멤버 변수로 전달)
    dlg.DoModal();            // 이 다이얼로그가 닫힐 때까지 여기서 블로킹
    ```
  - 모덜리스: `MFC/ExSetting/ExSetting/ExSettingDlg.cpp:160-183` — 설정 창(`ExSettingDlg`)에서 메인 창(`MainDlg`)을 모덜리스로 띄우고, 서로 `ShowWindow(SW_SHOW/SW_HIDE)`로 번갈아 숨기고 보여주는 전환 패턴
    ```cpp
    m_pUseMainDlg = new CMainDlg();
    m_pUseMainDlg->Create(IDD_MAIN_DIALOG);   // DoModal이 아니라 Create - 모덜리스로 생성
    m_pUseMainDlg->ShowWindow(SW_SHOW);
    ```
    반대쪽(`MainDlg`)에서는 자신을 숨기고 원래 창을 다시 보여주는 방식으로 전환: `FindWindow(NULL, L"ExSetting")->ShowWindow(TRUE)`.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 모덜리스 다이얼로그는 `new`로 힙에 만드는데, 언제 `delete`되는가? (이 코드는 `DestroyWindow()` 호출이 주석처리되어 있고 `ShowWindow(SW_HIDE)`로만 숨기고 있음 — 즉 창을 닫아도 객체 자체는 메모리에 살아있는 상태. 진짜 종료 시점에 `delete`해주지 않으면 메모리 누수)
  - `FindWindow(NULL, L"ExSetting")`으로 상대 창을 찾는 방식의 단점은? (창 제목(캡션) 문자열에 의존하는 방식이라, 캡션이 바뀌거나 다국어 지원을 하게 되면 깨짐 — 서로의 포인터/핸들을 직접 주고받는 방식이 더 견고함, 실제로 `ExSettingDlg`가 `CMainDlg* m_pUseMainDlg` 멤버로 상대를 직접 들고 있는 것과 대조됨)
- **최신 동향**: 모달/모덜리스 개념 자체는 UI 프레임워크를 막론하고 계속 쓰이는 보편적 개념(웹의 모달 다이얼로그, 모바일의 시트(sheet) 등도 근본적으로 같은 구분). MFC의 구현 방식(`DoModal` vs `Create`+`ShowWindow`)은 레거시지만, "이 창이 닫히기 전까지 다른 조작을 막을 것인가"라는 설계 판단 자체는 지금도 UX 설계에서 그대로 유효하다.

## 6. `OnSysCommand` 오버라이드 — 시스템 메시지 가로채기

- **한 줄 정의**: 창의 오른쪽 위 X 버튼(닫기), 시스템 메뉴 클릭 같은 "시스템 명령"은 `WM_SYSCOMMAND` 메시지로 오는데, `OnSysCommand`를 오버라이드해서 기본 동작(즉시 종료 등) 전에 커스텀 로직(종료 확인 창 등)을 끼워넣을 수 있다.
- **왜 중요한가**: "닫기 버튼을 눌러도 바로 안 꺼지고 확인창이 뜨는" 흔한 UX 패턴을 실제로 어떻게 구현하는지 보여주는 예. 시스템이 보내는 메시지도 결국 가로채서 커스터마이징할 수 있다는 WinAPI/MFC의 유연성을 보여줌.
- **내 코드에서 어떻게 썼는지**: `MFC/ExSetting/ExSetting/MainDlg.cpp:60-88`
  ```cpp
  void CMainDlg::OnSysCommand(UINT nID, LPARAM lParam)
  {
      if (nID == SC_CLOSE)   // X 버튼 클릭
      {
          if (MessageBox(L"프로그램을 종료하시겠습니까?", L"Software EXIT", MB_YESNO) == IDYES)
          {
              FindWindow(NULL, L"ExSetting")->ShowWindow(TRUE);  // 원래 창 복귀
              OnOK();                                             // 진짜로 종료
          }
          // else: 아무것도 안 함 -> 취소하면 창이 안 닫힘
      }
      else
      {
          CDialogEx::OnSysCommand(nID, lParam);   // 처리 안 한 나머지는 기본 동작에 위임
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 마지막 `else` 분기에서 `CDialogEx::OnSysCommand`를 호출하지 않으면 어떻게 되는가? (창 최소화/최대화/이동 같은 다른 시스템 명령들이 전부 동작하지 않게 됨 — WinAPI의 `DefWindowProc`과 정확히 같은 이유)
  - `WM_CLOSE`를 처리하는 것과 `WM_SYSCOMMAND`의 `SC_CLOSE`를 처리하는 것의 차이는? (`SC_CLOSE`는 X버튼/시스템 메뉴로 닫으려는 "명령"이고, `WM_CLOSE`는 그 명령이 받아들여져서 실제로 닫히기 직전에 오는 메시지 — 확인 창은 대개 이 예제처럼 더 이른 시점인 `SC_CLOSE`에서 가로채는 것이 일반적)
- **최신 동향**: 이 패턴(닫기 전 확인창)은 지금도 대부분의 데스크톱/모바일 앱에서 표준적인 UX 관행이다. 구현 방식은 프레임워크마다 다르지만, "종료 전에 가로챌 수 있는 지점이 있다"는 개념 자체는 WPF의 `Closing` 이벤트, Unity의 `OnApplicationQuit()` 등으로 계속 이어진다 — Unity 정리 단계에서 다시 연결할 예정.

## 7. 종합 대표 예제 — Lotto_peace

`MFC/Lotto_peace/` 프로젝트는 위에서 다룬 MFC 개념들이 실제 UI 하나에 다 맞물려 동작하는, 이 폴더에서 가장 완성도 높은 예제다.

- **구조**: 콤보박스(`m_Combo1`)로 "수동/자동"을 선택하면(2번·3번 항목의 메시지 맵 + DDX가 결합) 45개 체크박스 그룹 전체가 활성화/비활성화되고(4번 항목), "생성" 버튼을 누르면 체크된 번호들을 별도의 결과 다이얼로그(`CLottoCreate`)에 담아 모달로 띄운다(5번 항목).
  ```cpp
  void CLottopeaceDlg::OnCbnSelchangeCombo1()
  {
      int nIndex = m_Combo1.GetCurSel();
      if (nIndex == 0)                 // "수동" 선택 -> 체크박스 활성화
          for (int i = 0; i < 45; i++) GetDlgItem(IDC_CHECK2 + i)->EnableWindow(TRUE);
      else if (nIndex == 1)            // "자동" 선택 -> 체크박스 비활성화 + 전체 선택
      { for (int i = 0; i < 45; i++) GetDlgItem(IDC_CHECK2 + i)->EnableWindow(FALSE); OnBnClickedButtSelectall(); }
  }
  ```
- **면접에서 이 프로젝트로 답할 수 있는 질문들**:
  - "MFC로 여러 컨트롤이 상호작용하는 UI를 만들어본 경험은?" → 콤보박스 선택에 따라 체크박스 그룹 전체의 활성 상태가 바뀌는 이 로직으로 설명.
  - "다이얼로그 간 데이터를 어떻게 전달했는가?" → `CLottoCreate dlg`의 `public int LottoArr[45]` 멤버에 값을 미리 채워넣고 `DoModal()`로 넘기는 방식(간단하지만 캡슐화는 약한 방식이라는 점도 함께 언급하면 좋음 — 생성자 인자로 넘기거나 `Setter`를 두는 편이 더 안전).
  - "이 코드에서 개선하고 싶은 부분은?" → `IDC_CHECK2 + i` 방식의 암묵적 ID 연속성 가정(4번 항목), 결과 다이얼로그에 `public` 멤버로 직접 데이터를 꽂아넣는 약한 캡슐화 등을 스스로 지적하면 좋은 인상.

---

## 이 폴더에서 확인한, 고쳐볼 만한 부분 (요약)

1. **모덜리스 다이얼로그의 메모리 해제 누락** (5번 항목) — `ExSettingDlg`가 `new CMainDlg()`로 만든 객체를 닫을 때 `DestroyWindow()`/`delete` 없이 숨기기만 함. 프로그램 종료 시까지는 문제 없지만 여러 번 열고 닫는 흐름이 있다면 누수 위험.
2. **창 제목 문자열로 상대 창을 찾는 방식** (5번 항목) — `FindWindow(NULL, L"ExSetting")`은 캡션이 바뀌면 깨지는 약한 결합. 이미 멤버로 포인터를 들고 있는 곳(`m_pUseMainDlg`)과 방식이 일관되지 않음.
3. **리소스 ID 연속성 가정** (4번, 7번 항목) — `IDC_CHECK2 + i` 같은 산술 접근은 리소스 ID가 항상 그 순서대로 유지된다는 암묵적 가정에 의존.
4. **결과 다이얼로그에 `public` 멤버로 데이터 직접 주입** (7번 항목) — `CLottoCreate::LottoArr`가 `public`이라 캡슐화가 약함. 생성자 인자나 `Setter` 함수로 바꾸면 더 안전.
