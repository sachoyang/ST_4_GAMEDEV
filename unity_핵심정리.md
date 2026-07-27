# Unity 핵심정리

> 국비 게임클라이언트(Unity) 과정 실습 코드 기반 복습/면접 자료.
> 원본 코드 위치: `C:\Study\Unity\<프로젝트명>` (1~20번), `C:\Users\user\Desktop\<프로젝트명>` (21번 이후 — 생성 시점이 불확실해 목록 맨 뒤에 배치)
> 이 파일은 **프로젝트가 만들어진 시점(생성일) 순서대로** 한 프로젝트씩 정리하며, 각 단계가 끝날 때마다 사용자 확인을 받고 다음 프로젝트로 넘어간다. (다른 언어 파일들처럼 한 번에 다 정리하지 않음 — 진행 상황은 `00_작업계획.md`에도 기록)
> **제외한 폴더**: `ChainRiposte`, `DGC`, `PUZZLE`, `SoulsServer`, `assets`, `SuperMarioBros`(개인적으로 별도 진행한 프로젝트).
> **바탕화면의 `FSM`은 `Study\Unity\FSM`(16번)과 사실상 동일 프로젝트**임을 diff로 확인함 — `Study\Unity\FSM` 쪽이 인코딩이 바르고 `EnemyPatrolState.OnStateExit`가 마저 구현된 더 나중/완성된 버전이라, 16번 항목에서 한 번만 다루고 바탕화면 사본은 별도 처리하지 않는다.
> **`DressUpAsset`, `JSON`(바탕화면)은 학생이 짠 프로젝트가 아니라 강의 PDF/예제 zip**이다(`DressUpAsset`은 ibatstudio 강의자료로 확인됨). 이 두 항목은 "내 코드"가 아니라 "학습한 개념"으로 명시해서 정리한다.

## 프로젝트 목록 (생성일 순)

| # | 프로젝트 | 생성일 | 상태 |
|---|---|---|---|
| 1 | `ST1` | 2026-03-10 | ✅ 완료 |
| 2 | `St2` | 2026-03-10 | ✅ 완료 |
| 3 | `ST_2` | 2026-03-16 | ✅ 완료 |
| 4 | `SpaceShooter` | 2026-03-20 | ✅ 완료 |
| 5 | `3dTO2d` | 2026-03-24 | 🚫 제외 (학생 코드 없음, Unity 공식 StarterAssets 패키지만 있음) |
| 6 | `St3` | 2026-03-30 | ✅ 완료 (Study1~7 폴더별로 분할 진행 — 아래 세부 표 참고) |
| 7 | `3D_ST1` | 2026-04-07 | ✅ 완료 |
| 8 | `TempleRun` | 2026-04-13 | ✅ 완료 |
| 9 | `zombieStudy` | 2026-04-14 | ⏳ 대기 |
| 10 | `VRstudy` | 2026-05-11 | ⏳ 대기 |
| 11 | `ARstudy` | 2026-05-13 | ⏳ 대기 |
| 12 | `ModelURP` | 2026-05-15 | ⏳ 대기 |
| 13 | `VR_meta` | 2026-05-19 | ⏳ 대기 |
| 14 | `UnityDll` | 2026-06-10 | ⏳ 대기 |
| 15 | `URPassets3D` | 2026-06-23 | ⏳ 대기 |
| 16 | `FSM` | 2026-06-24 | ⏳ 대기 |
| 17 | `ShaderST` | 2026-07-07 | ⏳ 대기 |
| 18 | `Localization` | 2026-07-14 | ⏳ 대기 |
| 19 | `Crypt` | 2026-07-21 | ⏳ 대기 |
| 20 | `Art` | 2026-07-23 | ⏳ 대기 |
| 21 | `Astar`(바탕화면) | 불확실 | ⏳ 대기 |
| 22 | `St5`(바탕화면) | 불확실 | ⏳ 대기 |
| 23 | `우선순위HeapSort`(바탕화면) | 불확실 | ⏳ 대기 |
| 24 | `DressUpAsset`(바탕화면, 강의자료) | 불확실 | ⏳ 대기 |
| 25 | `JSON`(바탕화면, 강의자료) | 불확실 | ⏳ 대기 |

---

# 1. ST1 (2026-03-10)

> `C:\Study\Unity\ST1\Assets\2. Scripts` — "틀린그림찾기" 스타일의 작은 게임. 로비→플레이 화면 전환, 사운드 설정, 저장 시스템이 들어있는 소규모지만 밀도 높은 실습 프로젝트.

## 1-1. MonoBehaviour 생명주기 순서

- **한 줄 정의**: Unity는 `Awake → OnEnable → Start → Update → ...` 순서로 정해진 이벤트 함수를 자동 호출하며, 이 순서를 어디에 어떤 초기화 코드를 넣을지 결정하는 기준으로 삼아야 한다.
- **왜 중요한가**: "이 변수가 아직 초기화되기 전에 참조돼서 `null` 에러가 난다"는 Unity 초심자의 가장 흔한 버그가 생명주기 순서를 잘못 이해해서 생긴다. 면접에서 순서를 정확히 나열하고 각 단계에 뭘 넣어야 하는지 설명할 수 있는지 확인함.
- **내 코드에서 어떻게 썼는지**: `SoundManager.cs:30-43`에서 실제로 순서를 지켜 역할을 분리한 예
  ```csharp
  private void Awake()
  {
      audio = GetComponent<AudioSource>();   // 컴포넌트 참조는 Awake에서 미리 캐싱
  }
  void Start()
  {
      LoadData();       // 저장된 값 로드는 Start에서 (다른 오브젝트의 Awake도 이미 끝난 뒤가 보장됨)
      SetSound();
      PlaySoundBtn.SetActive(true);
  }
  ```
  `PlayManager.cs:16-24`의 주석에도 "컴포넌트 활성화 시 호출됨. 순서는 (Awake -> OnEnable -> Start). 순서를 지켜 주자 그래야 코딩도 편해지고 성능이 안좋은 플랫폼에서 문제 발생을 방지"라고 직접 정리되어 있음.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Awake`와 `Start`를 둘 다 초기화에 쓸 수 있는데 언제 뭘 써야 하는가? (`Awake`는 "내 오브젝트만의 준비", `Start`는 "다른 오브젝트도 다 준비된 뒤에 해야 하는 일" — 씬의 모든 오브젝트의 `Awake`가 끝난 뒤에야 `Start`들이 호출되기 시작하기 때문)
  - `OnEnable`은 `Awake`/`Start`와 호출 빈도가 왜 다른가? (`Awake`/`Start`는 오브젝트 생애주기당 1번, `OnEnable`은 `SetActive(true)`로 다시 활성화될 때마다 매번 호출됨)
- **최신 동향**: 생명주기 이벤트 함수 자체(순서 포함)는 Unity 6까지도 그대로 유지되는 핵심 API라 변화가 없다. 다만 최근 아키텍처 트렌드에서는 이 암묵적 순서에만 의존하기보다, 명시적인 `Init()` 메서드를 만들어 의존성을 주입하는 방식(DI 프레임워크 등)으로 초기화 순서를 코드에서 명확히 드러내는 설계도 늘고 있다 — **확인 필요**: 이 프로젝트 규모에서는 과한 얘기이므로, 어디까지나 "더 큰 프로젝트에서는 이런 대안도 있다" 정도로만 알아두면 됨.

## 1-2. 씬 전환 기초 — `SceneManager.LoadScene` + `DontDestroyOnLoad`

- **한 줄 정의**: `SceneManager.LoadScene("씬이름")`으로 다른 씬으로 전환하며, 씬이 바뀌어도 특정 오브젝트를 유지하고 싶으면 `DontDestroyOnLoad(this.gameObject)`로 표시해둔다.
- **왜 중요한가**: 배경음악 매니저, 게임 매니저처럼 "씬을 넘어 계속 살아있어야 하는" 싱글턴성 오브젝트를 다루는 가장 기본적인 방법. C++ 정리의 싱글턴(cpp_핵심정리.md 20번)과 "전역으로 하나만 유지되는 상태"라는 목적은 같지만 구현 방식이 완전히 다르다는 점이 좋은 비교 포인트.
- **내 코드에서 어떻게 썼는지**: `DontDestroy.cs`
  ```csharp
  void Awake()
  {
      DontDestroyOnLoad(this.gameObject);   // 이 오브젝트는 씬 전환시 사라지지 않음
  }
  ```
  `LobbyManager.cs:26-32`에는 옛 API가 주석으로 남아있어 API 변천사를 그대로 보여준다.
  ```csharp
  //Application.LoadLevel("scPlayUi");   // 구버전 API (완전히 제거됨)
  SceneManager.LoadScene("scPlayUI");    // 현재 표준 API
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `DontDestroyOnLoad`를 건 오브젝트가 씬을 다시 로드할 때마다 중복 생성되는 문제는 어떻게 막는가? (씬에 이미 그 오브젝트가 있는지 확인하고, 있으면 새로 생성된 쪽을 `Destroy`하는 싱글턴 가드 로직이 필요 — 이 프로젝트에는 그 가드가 없어서 로비로 돌아왔다 다시 게임을 시작하면 중복 생성될 수 있는 지점)
  - `DontDestroyOnLoad`된 오브젝트는 어느 시점에 완전히 사라지는가? (애플리케이션이 종료될 때까지, 혹은 명시적으로 `Destroy`할 때까지 유지)
- **최신 동향**: `Application.LoadLevel`은 Unity 5 시절에 이미 `Deprecated` 표시되었고 이후 완전히 제거되어 최신 버전에서는 아예 컴파일되지 않는다 — `SceneManager.LoadScene`이 유일한 표준 방법. `DontDestroyOnLoad` 자체는 지금도 표준 기법이지만, 최신 아키텍처에서는 아예 씬을 넘나드는 전역 상태를 별도의 영속적인 "부트스트랩 씬" + 어드레서블(Addressables)/서비스 로케이터 패턴으로 관리하는 경우도 많다.

## 1-3. 비동기 씬 로딩과 로딩바 UI

- **한 줄 정의**: `SceneManager.LoadSceneAsync`로 씬을 백그라운드에서 불러오면서, `AsyncOperation.progress` 값을 폴링해 로딩 퍼센트를 UI에 실시간으로 표시하는 패턴.
- **왜 중요한가**: 로딩 화면은 거의 모든 게임에 있는 UX 요소이고, "왜 동기 로딩 대신 비동기로 하는가"(메인 스레드가 멈추지 않아 로딩 중에도 애니메이션/UI 갱신 가능)를 설명할 수 있어야 함.
- **내 코드에서 어떻게 썼는지**: `PlayManager.cs:34-63`
  ```csharp
  IEnumerator Loading()
  {
      yield return new WaitForSeconds(1.0f);
      AsyncOperation async = SceneManager.LoadSceneAsync("scStage1", LoadSceneMode.Additive);

      while (!async.isDone)
      {
          float progress = async.progress * 100.0f;      // 0~1 값이므로 100을 곱해 %로 변환
          progressText.text = "Loading..." + Mathf.RoundToInt(progress).ToString() + "%";
          yield return true;   // 한 프레임 대기 후 다시 검사
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `LoadSceneMode.Additive`와 기본 `Single` 모드의 차이는? (`Additive`는 기존 씬을 유지한 채로 새 씬을 "추가"로 불러옴 — 로딩 UI를 별도 씬으로 관리하면서 실제 게임 씬을 그 위에 얹을 때 유용)
  - `async.progress`가 실제로는 0.9에서 멈춰있는 현상을 본 적 있는가? (Unity의 `AsyncOperation`은 씬 활성화 직전 단계에서 0.9까지만 자동으로 올라가고, `allowSceneActivation` 옵션을 다뤄야 완전한 100%/자동 전환 타이밍을 제어할 수 있다는 것은 실무에서 흔히 마주치는 디테일 — **확인 필요**: 이 코드 자체에는 `allowSceneActivation` 제어가 없어 실제로 이 현상이 나타나는지는 직접 실행해봐야 확인 가능)
- **최신 동향**: `SceneManager.LoadSceneAsync` 자체는 지금도 표준 API. 대규모 프로젝트에서는 씬 단위보다 더 세밀한 단위로 리소스를 비동기 로드/언로드할 수 있는 Addressables 시스템을 얹어서 쓰는 경우가 많아졌다.

## 1-4. 코루틴(Coroutine)과 `yield return`

- **한 줄 정의**: `IEnumerator`를 반환하는 함수를 `StartCoroutine`으로 실행하면, `yield return` 지점마다 실행을 잠시 멈췄다가 다음 프레임(혹은 지정된 조건)에 이어서 실행되는 "시간에 걸쳐 진행되는 로직"을 짤 수 있다.
- **왜 중요한가**: Unity의 싱글 스레드 게임 루프 안에서 "몇 초 기다렸다가", "매 프레임 조금씩" 같은 로직을 스레드 없이 표현하는 Unity 고유의 방식. 면접에서 매우 자주 나오는 Unity 특화 개념.
- **내 코드에서 어떻게 썼는지**: `LevelManager.cs:38-48`(반복 효과음), `PlayManager.cs:34-63`(로딩)
  ```csharp
  void LightningSound()
  {
      StartCoroutine(this.PlayEffectSound(soundClip));
  }
  IEnumerator PlayEffectSound(AudioClip _clip)
  {
      _sMgr.PlayEffect(transform.position, _clip);
      yield return null;    // 한 프레임만 양보하고 종료
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `yield return null`, `yield return true`, `yield return new WaitForSeconds(1f)`의 차이는? (`null`/`true`는 "한 프레임 대기 후 재개", `WaitForSeconds`는 "지정 시간만큼 대기 후 재개" — 코드 안에 `yield return true`처럼 사실상 `null`과 동일하게 동작하는 관용구도 섞여있는데, 의미상 명확한 `null`을 쓰는 게 더 좋은 스타일이라는 것도 언급할 만함)
  - 코루틴은 진짜 멀티스레드인가? (아니오 — 여전히 메인 스레드에서 실행되는 "협력적 멀티태스킹"에 가까움. C++ 정리의 진짜 OS 스레드(cpp_핵심정리.md 21번)와 헷갈리면 안 됨)
  - 코루틴을 실행 중인 오브젝트가 `SetActive(false)`/`Destroy`되면 코루틴은 어떻게 되는가? (자동으로 중단됨 — 이 특성 때문에 생기는 버그도 실무에서 흔함)
- **최신 동향 (웹서칭 결과)**: Unity 6부터 엔진 차원의 진짜 `async`/`await`를 지원하는 `Awaitable` 타입이 정식 도입되었고, 커뮤니티에서는 코루틴보다 메모리 할당(GC)이 적고 최신 C# 문법을 그대로 쓸 수 있는 서드파티 라이브러리 `UniTask`가 많이 쓰인다. 업계 전반적으로 "코루틴은 점점 레거시화되고 있고, 신규 코드는 `Awaitable`(엔진 내장) 또는 `UniTask`(서드파티)로 옮겨가는 추세"라는 평가가 많다. 다만 코루틴 자체가 폐기된 것은 아니라 지금도 학습 자료와 기존 코드베이스에서는 표준적으로 쓰인다.

## 1-5. `GetComponent` 캐싱 — 세 가지 접근법 비교

- **한 줄 정의**: `GetComponent<T>()`는 호출할 때마다 그 오브젝트에 붙은 컴포넌트 목록을 검색하는 비용이 들기 때문에, 자주 쓰는 컴포넌트 참조는 변수에 미리 저장(캐싱)해두고 재사용하는 것이 정석.
- **왜 중요한가**: Unity 성능 최적화의 가장 기본이자 첫 관문. "왜 `Update()` 안에서 `GetComponent`를 반복 호출하면 안 되는가"는 Unity 면접의 단골 질문.
- **내 코드에서 어떻게 썼는지**: `SoundManager.cs:26-34`에 세 가지 방식이 나란히 비교되어 있음 (스스로 각 방식을 실험해본 흔적)
  ```csharp
  //public AudioSource audio;      // 방법1: 인스펙터에서 직접 드래그-드롭으로 연결
  // GetComponent를 쓸때마다 함수 호출하는 방법     // 방법2: 필요할 때마다 GetComponent<AudioSource>() 호출
  private AudioSource audio;       // 방법3: Awake에서 한 번만 GetComponent 호출해 캐싱 (실제 채택한 방식)

  private void Awake()
  {
      audio = GetComponent<AudioSource>();
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 방법1(인스펙터 직접 연결)과 방법3(코드에서 캐싱)의 장단점은? (인스펙터 연결은 코드가 짧고 실수로 오브젝트 구조를 바꿔도 유연하지만, 다른 프리팹에 재사용할 때마다 매번 수동으로 연결해줘야 함 — 캐싱 방식은 코드만으로 완결되어 재사용성이 좋음)
  - `GetComponent`가 실패해서 `null`을 반환하면 어떻게 방어해야 하는가? (`TryGetComponent`를 쓰면 성공 여부를 `bool`로 즉시 받으면서 예외 처리 오버헤드 없이 더 안전하게 처리 가능)
- **최신 동향 (웹서칭 결과)**: 캐싱이 `GetComponent`를 매번 호출하는 것보다 4~5배 빠르다는 벤치마크가 있어, "자주 쓰는 컴포넌트는 `Awake`/`Start`에서 캐싱하라"는 원칙은 지금도 유효한 표준 실무 관행이다. 다만 Unity 2020.2 이후로는 `GetComponent`/`GameObject.Find`/`Camera.main` 자체의 내부 구현이 과거보다 훨씬 빨라져서, "예전만큼 극단적으로 느리지는 않다"는 점도 같이 알아두면 좋다. 널 체크가 필요한 상황에서는 `TryGetComponent`가 최신 권장 방식이다. ([outscal.com](https://outscal.com/blog/how-to-get-cache-and-modify-components-safely-in-unity), [illogika-studio 벤치마크](https://illogika-studio.gitbooks.io/unity-best-practices/content/performance-benchmarks/getcomponent-versus-cached-component.html))

## 1-6. 저장 시스템 두 가지 비교 — `PlayerPrefs` vs `FileStream`+`BinaryWriter`

- **한 줄 정의**: `PlayerPrefs`는 `int`/`float`/`string` 같은 단순 값을 플랫폼이 알아서 관리하는 위치에 저장해주는 간편한 키-값 저장소이고, `FileStream`+`BinaryWriter`는 개발자가 직접 파일 경로와 바이너리 포맷을 제어하는 저수준 방식이다. 이 프로젝트에는 둘 다 실습되어 있다.
- **왜 중요한가**: "간단한 설정값 저장"과 "복잡한 게임 데이터 저장"에 각각 어떤 방법이 적합한지 구분해서 설명할 수 있어야 하는, 실무에서 실제로 판단해야 하는 문제.
- **내 코드에서 어떻게 썼는지**:
  - `PlayerPrefs` — `SoundManager.cs:128-154` (볼륨/음소거 설정)
    ```csharp
    public void SaveData()
    {
        PlayerPrefs.SetFloat("SOUNDVOLUME", soundVolume);
        // bool형은 저장 함수가 없어서 int로 형변환해서 저장
        PlayerPrefs.SetInt("ISSOUNDMUTE", System.Convert.ToInt32(isSoundMute));
    }
    ```
  - `FileStream`+`BinaryWriter` — `TestSave.cs:23-50` (점수/포인트 저장)
    ```csharp
    FileStream fs = new FileStream(strFilePath, FileMode.Create, FileAccess.Write);
    BinaryWriter sw = new BinaryWriter(fs);   // 기계어(바이너리)로 저장 - 문자열(StreamWriter) 방식도 주석으로 비교되어 있음
    sw.Write(score);
    sw.Write(point);
    sw.Close(); fs.Close();
    ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `PlayerPrefs`로 인벤토리 아이템 목록처럼 구조화된 데이터를 저장하려면 어떻게 해야 하는가? (`PlayerPrefs`는 원시 타입만 지원하므로 직접 지원 불가 — JSON으로 직렬화한 문자열을 `PlayerPrefs.SetString`에 넣거나, 이 코드처럼 파일 시스템으로 내려가야 함)
  - `TestSave.cs`가 파일을 텍스트가 아니라 바이너리로 저장하는 이유는? (파일 크기가 작고, 사용자가 메모장으로 열어 값을 조작하기 어려워짐 — 다만 진짜 변조 방지가 목적이라면 암호화가 별도로 필요함)
  - `FileStream`/`BinaryWriter`를 다 쓴 뒤 `Close()`를 안 하면? (파일 핸들이 계속 점유되어 다음에 같은 파일을 열려고 할 때 실패할 수 있음 — `using` 블록으로 감싸면 예외 상황에서도 자동으로 닫히게 만들 수 있다는 점이 개선 포인트)
- **최신 동향 (웹서칭 결과)**: `PlayerPrefs`는 저장 위치/포맷을 개발자가 통제할 수 없고, 데이터가 암호화되지 않으며, 복잡한 구조의 데이터(인벤토리, 퀘스트 진행상황 등)에는 적합하지 않다는 한계가 실무에서 자주 지적된다. 그래서 "간단한 설정값은 `PlayerPrefs`, 그 외 복잡한 게임 데이터는 `JsonUtility` + 파일 시스템"으로 나눠 쓰는 것이 현재 권장되는 조합이다 — 이 프로젝트가 실제로 두 방식을 상황에 맞게 나눠 쓴 것과 정확히 같은 결론이다. ([Medium: PlayerPrefs vs JSON](https://medium.com/@fulton_shaun/playerprefs-vs-json-in-unity-which-save-system-should-you-actually-use-625f3bd9cf46))

## 1-7. 동적 GameObject 생성 — 3D 위치 사운드 이펙트

- **한 줄 정의**: 미리 배치해둔 오브젝트가 아니라, 코드에서 그때그때 필요할 때 `new GameObject(...)`로 만들고 `AddComponent`로 필요한 컴포넌트를 붙인 뒤, 다 쓰면 `Destroy`로 정리하는 패턴.
- **왜 중요한가**: 총알, 이펙트, 임시 사운드처럼 "언제 몇 개가 필요할지 미리 알 수 없는" 오브젝트를 다루는 기본기. 정리(`Destroy`)를 안 하면 메모리 누수처럼 오브젝트가 계속 쌓이는 실무 버그로 이어짐.
- **내 코드에서 어떻게 썼는지**: `SoundManager.cs:96-126`
  ```csharp
  GameObject _soundObj = new GameObject("sfx");
  _soundObj.transform.position = pos;
  AudioSource _audioSource = _soundObj.AddComponent<AudioSource>();
  _audioSource.clip = sfx;
  _audioSource.Play();

  // 사운드 재생이 끝나는 시점(clip 길이 + 여유시간)에 맞춰 자동으로 정리
  Destroy(_soundObj, sfx.length + 0.3f);
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Destroy(obj, delay)`의 지연 삭제는 내부적으로 어떻게 동작하는가? (내부적으로 지정된 시간이 지난 뒤 실제 삭제를 예약하는 방식 — 코루틴으로 직접 `yield return new WaitForSeconds`후 `Destroy(obj)`를 호출하는 것과 결과는 비슷하지만 코드가 훨씬 간결함)
  - 이 방식을 매 프레임 많은 이펙트에 반복하면 어떤 문제가 생기는가? (매번 `new GameObject`/`AddComponent`로 생성·파괴를 반복하면 가비지 컬렉션(GC) 부담이 커짐 — 실무에서는 오브젝트 풀링(Object Pooling)으로 미리 만들어둔 오브젝트를 재활용하는 것이 정석적인 해법)
- **최신 동향**: 이 자체(동적 생성+지연삭제) 패턴은 소규모/저빈도 이펙트에는 지금도 무난하지만, 총알처럼 초당 수십 개씩 생성/삭제되는 경우는 Unity의 오브젝트 풀링 API(`ObjectPool<T>`, Unity 2021+ 내장)를 쓰는 것이 현재 표준 권장 사항이다.

## 1-8. `Time.time` 기반 폴링으로 주기적 이벤트 구현

- **한 줄 정의**: 매 프레임 `Update()`에서 "현재 시간이 다음 실행 예정 시각을 넘었는가"를 비교해서, 별도 타이머 없이 일정 간격마다 로직을 실행하는 패턴.
- **왜 중요한가**: 코루틴의 `WaitForSeconds`와 같은 목적(주기적 실행)을 다른 방식으로 구현한 것 — 두 방식의 장단점을 비교할 수 있으면 좋은 인상을 줌.
- **내 코드에서 어떻게 썼는지**: `LevelManager.cs:26-35`, `BtnCtrl.cs:32-47`(스프라이트 애니메이션)
  ```csharp
  void Update()
  {
      if (Time.time > soundTime)         // 다음 실행 예정 시각을 넘었는지 매 프레임 확인
      {
          LightningSound();
          soundTime = Time.time + 3.5f;   // 다음 실행 예정 시각 갱신
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이 방식과 코루틴(`yield return new WaitForSeconds(3.5f)`)의 차이는? (기능적으로는 거의 동일하지만, `Update()` 안에 여러 타이밍 로직이 섞이면 가독성이 떨어짐 — 반대로 이 방식은 코루틴 시작/정지 관리가 필요 없어 더 단순한 경우도 있음)
  - `Time.time`(누적 시간) 대신 `Time.deltaTime`(프레임 간 경과 시간)을 누적해서 쓰는 방식과의 차이는? (`Time.time`은 게임 시작부터 누적된 절대 시간이라 오래 실행될수록 부동소수점 정밀도 문제가 생길 수 있음 — 아주 장시간 실행되는 앱이라면 `deltaTime` 누적 방식이 더 안전하다는 것도 알아두면 좋음)
- **최신 동향**: `Time.time` 비교 패턴은 여전히 흔히 쓰이는 관용구. 다만 여러 곳에서 반복되는 "일정 주기마다 실행" 로직이 많아지면, 직접 `Update()`에 흩어놓기보다 스케줄러/타이머 유틸리티 클래스로 모아서 관리하는 것이 유지보수 측면에서 더 낫다는 것이 일반적인 설계 조언.

## 1-9. `Instantiate` 문법의 버전별 변화

- **한 줄 정의**: 프리팹으로부터 실제 게임오브젝트를 만드는 `Instantiate` 함수의 반환 타입 처리 방식이 Unity 버전에 따라 달라져 왔다 — 예전엔 명시적 캐스팅이 필요했지만 최신 버전은 제네릭으로 타입이 자동 추론된다.
- **왜 중요한가**: 오래된 튜토리얼/스택오버플로우 코드와 최신 코드의 차이를 구분하지 못하면 컴파일 에러의 원인을 못 찾는 경우가 실무에서 흔함. 이 프로젝트 코드 자체가 그 변천사를 스스로 기록해둔 좋은 사례.
- **내 코드에서 어떻게 썼는지**: `BtnCtrl.cs:86-93`
  ```csharp
  //GameObject bomb = Instantiate(bombPreFab, new Vector3(0,0,0), Quaternion.identity); // 오래된(2018) 버전 방식
  //GameObject bomb = (GameObject)Instantiate(bombPreFab, ...);   // Object를 캐스팅해야 했던 방식
  //GameObject bomb = Instantiate(bombPreFab, ...) as GameObject;  // as 캐스팅 방식
  RectTransform bomb = Instantiate(bombPreFab, new Vector3(0,0,0), Quaternion.identity) as RectTransform;  // 실제 채택
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 왜 옛날엔 `Instantiate`의 반환값을 캐스팅해야 했는가? (예전 API는 반환 타입이 `Object`(비-제네릭)였기 때문에 실제로 쓰려는 구체 타입으로 다운캐스팅이 필요했음 — 이후 제네릭 오버로드(`Instantiate<T>`)가 추가되면서 캐스팅 없이 바로 원하는 타입으로 받을 수 있게 됨)
  - 이 코드가 `as` 캐스팅을 쓰는 이유는? (`as`는 캐스팅 실패 시 예외 대신 `null`을 반환해서 더 안전 — 다만 지금은 애초에 제네릭 `Instantiate<RectTransform>(...)`로 캐스팅 자체가 필요 없게 짤 수 있다는 점을 알고 있으면 더 좋은 답변)
- **최신 동향**: 현재 Unity의 `Instantiate<T>`는 제네릭을 지원해 `Instantiate<RectTransform>(prefab, ...)`처럼 캐스팅 없이 바로 원하는 타입을 받을 수 있다. 이 코드의 마지막 줄(`as RectTransform`)도 여전히 동작은 하지만, 최신 스타일 가이드 기준으로는 굳이 캐스팅 연산자를 쓸 필요 없이 제네릭 오버로드를 직접 쓰는 편이 더 간결하고 안전하다.

---

## 이 프로젝트에서 확인한, 고쳐볼 만한 부분

1. **`DontDestroyOnLoad` 중복 생성 가드 없음** (1-2번 항목) — 씬을 다시 로드했을 때 이미 존재하는 오브젝트를 확인하고 새로 생긴 쪽을 파괴하는 로직이 없어, 로비↔플레이를 왕복하면 중복 생성될 여지가 있음.
2. **`FileStream`/`BinaryWriter`에 `using` 미사용** (1-6번 항목) — 예외가 발생하면 `Close()`가 호출되지 않아 파일 핸들이 남을 수 있음. `using` 블록으로 감싸는 것이 더 안전.
3. **`PlayerPrefs` 저장에 검증/암호화 없음** (1-6번 항목) — 사운드 설정 정도라 문제는 적지만, 스코어/재화 등 민감한 값을 같은 방식으로 저장한다면 사용자가 값을 직접 조작할 수 있는 위험이 있음.

---

# 2. St2 (2026-03-10)

> `C:\Study\Unity\St2\Assets\Study\2. Scripts` — 탑다운 시점의 폭탄 던지기 액션 게임(플레이어가 폭탄을 던져 몬스터를 처치, 폭탄/라이프 아이템 드랍). ST1보다도 더 오래된 스타일의 Unity API가 섞여 있어 "지금은 제거된 레거시 API"를 식별하는 훈련에 좋은 프로젝트.

## 2-1. 태그/레이어 기반 탐색 + 물리 오버랩 판정

- **한 줄 정의**: `GameObject.FindGameObjectWithTag`로 특정 태그가 붙은 오브젝트를 찾고, `Physics2D.OverlapCircleAll` + `LayerMask`로 특정 레이어에 속한 콜라이더만 골라서 원형 범위 판정을 한다.
- **왜 중요한가**: 폭발 범위 공격, 스킬 판정처럼 "이 위치 주변에 있는 특정 종류의 대상만 찾기"는 게임 로직에서 매우 흔한 패턴. 태그/레이어를 코드에서 어떻게 실제로 활용하는지 구체적으로 아는지 확인하는 질문.
- **내 코드에서 어떻게 썼는지**: `Bomb.cs:19-25, 50-80`
  ```csharp
  void Awake()
  {
      // 태그로 특정 오브젝트를 찾아 참조 캐싱 (ST1의 GetComponent 캐싱과 같은 목적)
      if (GameObject.FindGameObjectWithTag("Player"))
          layBombs = GameObject.FindGameObjectWithTag("Player").GetComponent<LayBombs>();
  }

  public void Explode()
  {
      // Enemies 레이어에 속한 콜라이더만 골라서 폭발 반경 안에 있는지 검사
      Collider2D[] enemies = Physics2D.OverlapCircleAll(transform.position, bombRadius, 1 << LayerMask.NameToLayer("Enemies"));
      foreach (Collider2D en in enemies)
      {
          Vector3 force = (en.transform.position - transform.position).normalized * bombForce;
          en.GetComponent<Rigidbody2D>().AddForce(force);   // 폭발 방향으로 밀어내는 넉백
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `1 << LayerMask.NameToLayer("Enemies")`에서 왜 비트 시프트(`<<`)를 쓰는가? (레이어 마스크는 각 레이어를 비트 하나씩으로 표현하는 32비트 정수라, "Enemies 레이어의 번호"를 "그 레이어만 포함하는 비트마스크"로 바꾸려면 그 번호만큼 왼쪽으로 시프트해야 함)
  - `FindGameObjectWithTag`를 `Update()` 안에서 반복 호출하면 어떤 문제가 있는가? (ST1의 `GetComponent` 캐싱 논의와 동일 — 매번 씬 전체를 태그로 검색하는 비용이 들어 `Awake`에서 한 번만 캐싱하는 것이 정석)
  - `AddForce`로 넉백을 주는 것과 직접 `transform.position`을 옮기는 것의 차이는? (`AddForce`는 물리 엔진이 충돌/질량/저항 등을 고려해 자연스럽게 계산해주지만, 위치를 직접 옮기면 물리 법칙을 무시하고 순간이동하듯 움직여 부자연스러움)
- **최신 동향**: 태그/레이어 기반 탐색과 `Physics2D.OverlapCircleAll`은 지금도 2D 물리 판정의 표준 방법이다. 다만 태그 문자열(`"Player"`, `"Enemies"`)에 오타가 나면 컴파일 타임에 잡히지 않고 런타임에 조용히 실패하는 문제가 있어, 최신 코드에서는 문자열 대신 `CompareTag()`(내부적으로 조금 더 빠름) 사용이나, 아예 태그 상수를 별도 클래스로 관리하는 방식을 권장하는 경우가 많다.

## 2-2. 2D 트리거 충돌 처리 — `OnTriggerEnter2D`

- **한 줄 정의**: `Collider2D`의 `Is Trigger` 옵션을 켜면 실제 물리적 충돌(밀림) 없이 "겹침이 발생했다"는 이벤트(`OnTriggerEnter2D`)만 받을 수 있다 — 총알 명중 판정, 아이템 획득 판정에 널리 쓰인다.
- **왜 중요한가**: `OnCollisionEnter2D`(물리적 충돌)와 `OnTriggerEnter2D`(통과 가능한 겹침 감지)의 차이를 정확히 구분하는 것은 2D/3D 게임플레이 프로그래밍의 기본기.
- **내 코드에서 어떻게 썼는지**: `Bullet.cs:25-34`, `BombPickup.cs:20-37`
  ```csharp
  void OnTriggerEnter2D(Collider2D col)
  {
      if (col.gameObject.tag != "Player")   // 플레이어가 아닌 것과 부딪히면
      {
          OnExplode();
          Destroy(gameObject);
      }
  }
  ```
  `BombPickup.cs`는 같은 트리거 콜백 안에서 두 가지 다른 상황(플레이어 획득 / 바닥에 착지)을 태그로 분기하는 패턴도 함께 보여준다.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 두 오브젝트가 부딪혔는데 어느 쪽에도 `Rigidbody2D`가 없으면? (트리거/충돌 이벤트 자체가 발생하지 않음 — 최소 한쪽에는 `Rigidbody2D`가 있어야 물리 이벤트가 발생한다는 것은 자주 놓치는 함정)
  - `OnTriggerEnter2D`와 `OnTriggerStay2D`의 차이는? (`Enter`는 겹치기 시작한 첫 프레임에 한 번만, `Stay`는 겹쳐 있는 동안 매 프레임 호출됨)
- **최신 동향**: 트리거/콜리전 이벤트 시스템 자체는 Unity 물리 엔진(Box2D 기반)의 핵심으로 지금도 변화 없이 쓰인다.

## 2-3. 정적 원샷 사운드 재생 — `AudioSource.PlayClipAtPoint`

- **한 줄 정의**: 별도의 `AudioSource` 컴포넌트나 사운드 매니저 없이, 정적(static) 메서드 호출 한 줄로 특정 위치에서 소리를 한 번 재생하는 방법 — Unity가 내부적으로 임시 오브젝트를 만들어 재생 후 자동으로 정리해준다.
- **왜 중요한가**: ST1의 `SoundManager`(매니저가 사운드를 관리)와 이 프로젝트의 방식(코드 한 줄로 즉석 재생)을 비교하면 "언제 매니저 패턴이 필요하고 언제 필요 없는지" 판단 기준을 세울 수 있음.
- **내 코드에서 어떻게 썼는지**: `Bomb.cs:40`, `LayBombs.cs:35`, `BombPickup.cs:29`
  ```csharp
  AudioSource.PlayClipAtPoint(bombsAway, transform.position);   // 매니저 없이 즉시 재생
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `PlayClipAtPoint`로는 할 수 없는 것은? (볼륨/음소거 같은 전역 설정을 나중에 일괄 제어하기 어려움 — ST1의 `SoundManager`가 볼륨/뮤트를 `PlayerPrefs`와 연동해서 관리했던 것과 대조됨. 배경음악처럼 "계속 재생/제어해야 하는 사운드"에는 부적합하고, "짧고 한 번 재생하고 끝나는" 효과음에 적합)
  - 이 함수는 내부적으로 어떻게 구현되어 있을까? (임시 `GameObject`를 만들어 `AudioSource`를 붙이고 재생한 뒤, 클립 길이가 끝나면 자동으로 파괴 — 결국 ST1의 `SoundManager.PlayEffect`가 직접 구현했던 것과 원리가 같고, Unity가 이미 편의 함수로 제공해둔 것)
- **최신 동향**: `PlayClipAtPoint`는 지금도 표준 API로 유효하며, "설정 가능한 배경음악/믹싱이 필요하면 `AudioMixer`+매니저, 짧은 효과음은 `PlayClipAtPoint`"로 구분해 쓰는 것이 일반적인 실무 관행이다.

## 2-4. 레거시 API 모음 — 구 Input Manager와 `GUITexture`

- **한 줄 정의**: `Input.GetButtonDown("Fire2")`은 프로젝트 설정(Input Manager)에 미리 등록해둔 이름으로 입력을 받는 오래된(하지만 여전히 동작하는) 방식이고, `GUITexture`는 Unity 초창기(2005년)의 UI 컴포넌트로 현재는 완전히 제거되어 최신 Unity에서는 컴파일조차 되지 않는다.
- **왜 중요한가**: "오래된 튜토리얼/에셋 코드를 최신 Unity로 옮길 때 뭐가 깨지는가"를 직접 보여주는 사례. 실무에서 레거시 코드/에셋을 다룰 때 반드시 마주치는 문제.
- **내 코드에서 어떻게 썼는지**: `LayBombs.cs:6-42`
  ```csharp
  private GUITexture bombHUD;    // 지금 버전 Unity에서는 컴파일 자체가 안 되는 타입
  void Awake() { bombHUD = GameObject.Find("ui_bombHUD").GetComponent<GUITexture>(); }
  void Update()
  {
      if (Input.GetButtonDown("Fire2") && !bombLaid && bombCount > 0) { ... }   // 구 Input Manager
      bombHUD.enabled = bombCount > 0;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `GUITexture`가 제거된 뒤 이 기능을 최신 Unity로 옮기려면 뭘 대체해야 하는가? (`UI.Image` + `Canvas` 기반 uGUI, 혹은 최신 UI Toolkit으로 교체해야 함)
  - `Input.GetButtonDown("Fire2")`가 지금도 동작하는 이유는? (구 Input Manager 자체는 제거되지 않고 지금도 "Input Manager (Old)"로 남아있음 — `GUITexture`처럼 완전히 삭제된 것과는 다른 상태라는 걸 구분해서 설명할 수 있어야 함)
- **최신 동향 (웹서칭 결과)**: `GUITexture`/`GUIText`는 Unity 4.6(2014)에 도입된 uGUI(`UI.Image`/`UI.Text`)로 대체되며 이후 버전에서 완전히 제거되어, 지금은 이 코드를 최신 Unity 프로젝트에 그대로 가져오면 컴파일 에러가 난다. 구 Input Manager(`Input.GetButtonDown`)는 아직 제거되지는 않았고 소규모 프로젝트/프로토타입에는 여전히 무난하지만, 크로스플랫폼 대응·리바인딩(키 재설정)·로컬 멀티플레이가 필요한 신규 상용 프로젝트라면 새 Input System 패키지로 옮기는 것이 2026년 현재도 권장되는 방향이다. ([Unity Discussions: GUITexture obsolete](https://discussions.unity.com/t/error-cs0619-guitexture-is-obsolete-guitexture-has-been-removed-use-ui-image-instead/854270), [Input System vs Old Input Manager 비교](https://jishnuksivan.com/unity-input-system-vs-old-input-manager-which-should-you-use-in-2026/))

## 2-5. 재사용 가능한 유틸리티 컴포넌트 + 애니메이션 이벤트 연동

- **한 줄 정의**: "일정 시간 뒤 자신/자식 오브젝트를 파괴한다"는 기능을 특정 게임 로직에 종속시키지 않고 `Destructor`라는 독립된 범용 컴포넌트로 만들어, 어떤 프리팹에든 붙여서 재사용할 수 있게 설계. 이 안의 함수들은 애니메이션 클립에 심어둔 "애니메이션 이벤트"에서 직접 호출되도록 만들어졌다.
- **왜 중요한가**: 특정 기능을 재사용 가능한 독립 컴포넌트로 뽑아내는 설계 감각을 보여줌. "애니메이션 이벤트"는 코드와 애니메이션 데이터를 연결하는 실무적으로 중요한 기법인데도 초심자가 놓치기 쉬운 부분.
- **내 코드에서 어떻게 썼는지**: `Destructor.cs`
  ```csharp
  // 이 함수는 Animation Event로부터 호출될수있다
  void DestroyChildGameObject()
  {
      if (transform.Find(namedChild).gameObject != null)
          Destroy(transform.Find(namedChild).gameObject);
  }
  ```
  인스펙터에서 `destroyOnAwake`/`findChild`/`namedChild` 값만 바꾸면 다양한 상황(자기 자신을 딜레이 파괴, 특정 이름의 자식만 파괴)에 재사용 가능하도록 옵션으로 분기.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - "애니메이션 이벤트"란 정확히 무엇인가? (애니메이션 클립의 특정 프레임(타임라인 위치)에 "이 함수를 호출하라"는 표시를 걸어두는 Unity 에디터 기능 — 예를 들어 캐릭터가 상자를 여는 애니메이션의 "뚜껑이 열리는 프레임"에서 `DestroyChildGameObject()`를 호출하도록 연결)
  - 이런 함수들이 `public`이 아니라 `private`(기본 접근자)으로 선언되어 있는데도 애니메이션 이벤트에서 호출 가능한 이유는? (Unity의 리플렉션 기반 메시징 시스템은 접근 제한자와 무관하게 컴포넌트에 붙은 메서드 이름으로 직접 호출하기 때문)
- **최신 동향**: 애니메이션 이벤트는 지금도 Unity 애니메이션 시스템의 표준 기능. 다만 문자열/이름 기반 호출이라 함수 이름을 바꾸면 애니메이션 클립에서 깨지는 게 조용히 실패하는 문제는 여전히 남아있어, 실무에서는 이런 연결부를 테스트/검증하는 절차를 별도로 두는 경우가 많다.

## 2-6. 런타임에 컴포넌트 동적 추가로 상태 전환

- **한 줄 정의**: 오브젝트가 특정 상태에 도달했을 때(예: 착지) `AddComponent`로 새 컴포넌트(`Rigidbody2D`)를 붙여서, "그 전까지는 물리 영향을 받지 않다가 그 이후부터 물리 법칙의 지배를 받는" 상태 전환을 구현.
- **왜 중요한가**: "컴포넌트를 미리 다 붙여두고 `enabled` 플래그로 껐다 켰다 하는 방식"과 "필요한 시점에 아예 붙였다 떼는 방식"의 트레이드오프를 이해하고 있는지 확인하는 질문으로 이어짐.
- **내 코드에서 어떻게 썼는지**: `BombPickup.cs:31-42`
  ```csharp
  else if (other.tag == "ground" && !landed)
  {
      anim.SetTrigger("Land");        // 착지 애니메이션 재생
      transform.parent = null;        // 부모(운반 중이던 오브젝트)에서 분리
      gameObject.AddComponent<Rigidbody2D>();   // 이 시점부터 물리 시뮬레이션의 대상이 됨
      landed = true;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Rigidbody2D`를 처음부터 붙여두고 `simulated = false`로 꺼뒀다가 켜는 방식과, 이렇게 나중에 `AddComponent`하는 방식의 차이는? (`AddComponent`는 이후 `GetComponent`로 찾아야 다시 제어할 수 있고, 컴포넌트 추가 자체에 약간의 런타임 비용이 있음 — 반대로 처음부터 붙여두고 `enabled`/`simulated`만 토글하는 쪽이 더 가볍고 예측 가능한 경우가 많음)
  - `landed` 같은 상태 플래그를 두지 않으면 어떤 버그가 생기는가? (같은 트리거 콜백이 여러 번 호출될 때마다 `AddComponent<Rigidbody2D>()`가 중복 호출되어 같은 오브젝트에 리지드바디가 여러 개 붙는 문제로 이어질 수 있음)
- **최신 동향**: 런타임 컴포넌트 추가/제거 자체는 여전히 유효한 패턴이지만, 빈번하게 반복되는 상황(예: 총알 수백 개)에서는 컴포넌트 추가/제거 비용도 누적되므로, 그런 경우엔 처음부터 컴포넌트를 붙여두고 활성화 플래그만 바꾸는 쪽을 실무에서 더 권장하는 편이다.

## 2-7. 플레이어 상태 기반 동적 밸런싱 스폰

- **한 줄 정의**: 무작위로만 아이템을 드랍하는 게 아니라, 플레이어의 현재 체력 수치를 참조해서 체력이 낮으면 회복 아이템을, 체력이 높으면 공격 아이템을 우선 드랍하는 "동적 난이도 조절"의 초보적 형태.
- **왜 중요한가**: 순수 랜덤보다 한 단계 더 나아간 게임 밸런싱 로직 설계 감각을 보여줌 — "재미있는 무작위"를 만드는 실무적 기법.
- **내 코드에서 어떻게 썼는지**: `PickupSpawner.cs:31-57`
  ```csharp
  if (playerLife.life >= highLifeThreshold)
      Instantiate(pickups[0], dropPos, Quaternion.identity);   // 체력 충분 -> 폭탄만 드랍
  else if (playerLife.life <= lowHealthThreshold)
      Instantiate(pickups[1], dropPos, Quaternion.identity);   // 체력 위험 -> 회복만 드랍
  else
      Instantiate(pickups[Random.Range(0, pickups.Length)], dropPos, Quaternion.identity);  // 그 외엔 랜덤
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이 방식의 한계는? (임계값(`75`, `25`)이 하드코딩되어 있어 게임 난이도 조절 시 코드를 직접 고쳐야 함 — 기획자가 값을 조정할 수 있도록 `ScriptableObject` 등으로 외부화하는 것이 실무적 개선 방향)
  - "동적 난이도 조절(Dynamic Difficulty Adjustment)"이라는 더 큰 개념과 이 코드의 관계는? (이 코드는 그 개념의 아주 단순한 형태 — 실제 상용 게임은 더 복잡한 지표(연속 실패 횟수, 플레이 시간 등)를 종합해서 조절하는 경우가 많음)
- **최신 동향**: 동적 밸런싱 개념 자체는 여전히 게임 디자인의 표준 기법. 다만 하드코딩된 임계값 대신 `ScriptableObject` 기반 설정 데이터로 분리해서 기획자가 코드 수정 없이 값을 튜닝할 수 있게 하는 것이 최신 Unity 프로젝트의 일반적인 아키텍처 관행이다.

## 2-8. 코루틴 자기 재귀 호출 + 레거시 코루틴 문법

- **한 줄 정의**: 코루틴이 자기 자신을 다시 `StartCoroutine`으로 호출해서 "영원히 반복되는 스폰 루프"를 만들 수 있다. 같은 파일 안에 코루틴을 문자열 이름으로 호출하는 옛 방식(`StartCoroutine("Spawn")`)과 함수 참조로 호출하는 방식(`StartCoroutine(Spawn())`)이 섞여 있어 비교하기 좋다.
- **왜 중요한가**: "무한 루프를 코루틴으로 어떻게 안전하게 표현하는가", 그리고 "문자열 기반 API가 왜 위험한가"라는 두 가지를 한 번에 짚을 수 있는 사례.
- **내 코드에서 어떻게 썼는지**: `BackgroundPropSpawner.cs`
  ```csharp
  void Start()
  {
      StartCoroutine("Spawn");   // 문자열로 코루틴 이름을 지정 (오래된 방식)
  }
  IEnumerator Spawn()
  {
      yield return new WaitForSeconds(waitTime);
      ... // prop 생성 로직
      StartCoroutine(Spawn());   // 함수 호출 결과(IEnumerator)를 넘기는 방식 (권장되는 방식) - 재귀적으로 스스로를 다시 시작
      while (propInstance != null) { yield return null; }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 두 `StartCoroutine` 호출 방식의 실질적 차이는? (문자열 방식은 오타가 나도 컴파일 타임에 못 잡고 런타임에 조용히 실패하며, 매개변수 전달도 제한적이고 내부적으로 리플렉션을 써서 느림 — 함수 참조 방식은 컴파일 타임에 함수 존재 여부가 검증되고 더 빠름)
  - `StopCoroutine("Spawn")`처럼 이름으로 멈추는 것과 코루틴 참조(`Coroutine` 객체)를 저장해뒀다가 멈추는 것 중 어떤 게 더 안전한가? (참조를 저장해두는 쪽이 명확하고 안전 — 이 코드도 `Coroutine` 참조를 저장하지 않아서, 이 컴포넌트가 여러 개 켜지면 스폰 루프를 개별적으로 제어하기 어려움)
  - 같은 파일의 `Random.seed = System.DateTime.Now.Millisecond;`는 왜 지금은 쓸 수 없는가? (아래 항목 참고)
- **최신 동향 (웹서칭 결과)**: 문자열 기반 `StartCoroutine`은 지금도 컴파일은 되지만(하위 호환), 오타에 취약하고 느리다는 이유로 실무에서는 오래전부터 함수 참조 방식이 표준으로 자리잡았다. 같은 파일에 있는 `Random.seed`는 이미 Deprecated 처리되어 `Random.InitState(seed)`로 대체해야 하며, 특정 시드값을 나중에 복원해 리플레이하고 싶다면 `Random.state` 프로퍼티를 저장/복원하는 방식을 쓰라는 것이 공식 권장 사항이다. ([Unity Discussions: Random.seed deprecated](https://discussions.unity.com/t/questions-about-changes-to-unityengine-random-random-seed-deprecated/184013))

## 2-9. Sorting Layer로 렌더링 순서 제어

- **한 줄 정의**: 2D 게임에서 스프라이트/파티클이 서로 겹칠 때 어떤 게 위에, 어떤 게 아래에 그려질지는 Z축 깊이가 아니라 "Sorting Layer"와 그 안의 "Order in Layer" 값으로 결정된다.
- **왜 중요한가**: 2D 게임에서 "왜 이 이펙트가 캐릭터 뒤에 가려서 안 보이지?" 같은 문제를 해결하는 기본 지식. 3D의 깊이 기반 렌더링과 다른 2D만의 개념이라는 걸 구분해서 설명할 수 있어야 함.
- **내 코드에서 어떻게 썼는지**: `ParcticleSortingLayerSet.cs`
  ```csharp
  void Start()
  {
      GetComponent<ParticleSystem>().GetComponent<Renderer>().sortingLayerName = sortingLayerName;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 같은 Sorting Layer 안에서 그리기 순서를 더 세밀하게 조절하려면? (`sortingOrder`(Order in Layer) 값을 추가로 조정 — 레이어가 같다면 이 값이 큰 쪽이 위에 그려짐)
  - 파티클 시스템에는 왜 `sortingLayerName`을 코드로 설정해줘야 했을까(인스펙터에서 미리 설정하면 안 되나)? (프리팹을 여러 씬/상황에서 재사용할 때 상황에 따라 다른 레이어에 그려야 한다면, 코드로 동적으로 지정하는 게 더 유연함 — 이 스크립트가 `sortingLayerName`을 `public`으로 노출해서 인스펙터에서 상황별로 다르게 값을 넣을 수 있게 해둔 것과 일치)
- **최신 동향**: Sorting Layer 시스템은 지금도 Unity 2D 렌더링의 표준 방식으로 변화 없이 쓰인다.

---

## 이 프로젝트에서 확인한, 고쳐볼 만한 부분

1. **`Random.seed`, 문자열 기반 `StartCoroutine`** (2-8번 항목) — 둘 다 Deprecated된 구식 API. `Random.InitState()`와 함수 참조 기반 `StartCoroutine(Spawn())`으로 통일하는 것이 안전.
2. **`GUITexture` 사용** (2-4번 항목) — 최신 Unity에서는 아예 컴파일이 안 됨. `UI.Image`/uGUI(Canvas)로 전면 교체가 필요.
3. **`BombPickup`의 `AddComponent<Rigidbody2D>()` 중복 호출 가능성** (2-6번 항목) — `landed` 플래그로 어느 정도 방어하고 있지만, 트리거 콜백이 같은 프레임에 여러 번 겹쳐 들어오는 예외 상황까지 완벽히 막지는 못함.
4. **`PickupSpawner`의 임계값 하드코딩** (2-7번 항목) — `highLifeThreshold`/`lowHealthThreshold`가 코드에 박혀있어 밸런스 조정 시 재컴파일이 필요.

---

# 3. ST_2 (2026-03-16)

> `C:\Study\Unity\ST_2\Assets\2. Scripts\Penut` — St2의 폭탄게임을 확장한 버전(플레이어 이동/점프/조롱, 적 AI, 카메라 추적, 모바일 UI 대응까지 추가). `9. Etc` 폴더에는 서드파티 조이스틱 에셋(`UltimateJoystick`, 정리에서 제외)과 함께, 커스텀 에디터 확장/이징 곡선/FPS 카운터 같은 별도 도구들이 섞여 있다.
> `PlayerCtrl.cs`의 이동 입력은 `UltimateJoystick.GetHorizontalAxis()`를 쓰는데, 이 조이스틱 에셋 자체의 내부 구현은 서드파티 코드라 다루지 않고 "학생 코드가 이 에셋의 API를 어떻게 소비하는지"만 다룬다.

## 3-1. `FixedUpdate` vs `Update` + 물리 기반 캐릭터 이동

- **한 줄 정의**: `Update()`는 매 프레임(가변 간격)마다, `FixedUpdate()`는 물리 엔진과 동기화된 고정된 시간 간격마다 호출된다 — 그래서 `Rigidbody`/`AddForce`처럼 물리 연산이 들어가는 코드는 반드시 `FixedUpdate()`에 넣어야 한다.
- **왜 중요한가**: "왜 이동 로직이 어떨 땐 버벅이고 어떨 땐 부드러운가"의 원인이 되는, Unity 물리 프로그래밍의 가장 기본적인 구분. 면접에서 거의 반드시 나오는 질문.
- **내 코드에서 어떻게 썼는지**: `PlayerCtrl.cs:53-124`
  ```csharp
  void Update()
  {
      // 물리와 무관한 상태 체크(땅에 닿았는지)는 Update에서도 무방
      grounded = Physics2D.Linecast(transform.position, groundCheck.position, 1 << LayerMask.NameToLayer("Ground"));
  }

  void FixedUpdate()
  {
      float h = UltimateJoystick.GetHorizontalAxis("JS");
      if (h * rigidbody2D.velocity.x < maxSpeed)
          rigidbody2D.AddForce(Vector2.right * h * moveForce);   // 힘을 가하는 물리 연산은 FixedUpdate에서
      if (Mathf.Abs(rigidbody2D.velocity.x) > maxSpeed)
          rigidbody2D.velocity = new Vector2(Mathf.Sign(rigidbody2D.velocity.x) * maxSpeed, rigidbody2D.velocity.y);
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 입력값(`h`)을 읽는 코드를 `FixedUpdate`에 넣었는데, 이게 안전한 이유는? (조이스틱/키보드 입력값 자체는 프레임마다 갱신되는 상태값이라 `FixedUpdate`에서 읽어도 최신 값을 가져올 수 있음 — 다만 `Input.GetButtonDown`처럼 "그 프레임에만 true인" 이벤트성 입력은 `FixedUpdate`에서 놓칠 수 있어 `Update`에서 캐치해야 함, 이 프로젝트도 `jump` 플래그를 `Update`가 아닌 별도 `btnjump()`로 밖에서 설정받는 방식으로 우회함)
  - 속도를 `maxSpeed`로 제한하는 이 방식의 이름은? (속도 클램핑(velocity clamping) — 힘을 계속 가하되 결과 속도의 상한선만 걸어주는 방식)
- **최신 동향**: `FixedUpdate`/`Update`의 구분은 Unity 물리 엔진 아키텍처의 근본이라 지금도 변화 없다. 다만 최신 Unity는 `Time.fixedDeltaTime`을 프로젝트 세팅에서 조정하거나, DOTS/ECS 환경에서는 물리 스텝을 더 세밀하게 제어하는 방식도 등장했다는 정도는 참고할 만하다.

## 3-2. Raycast/Overlap 기반 상태 판정

- **한 줄 정의**: 눈에 보이지 않는 가상의 선(`Linecast`)이나 점(`OverlapPoint`)을 쏴서 특정 레이어에 뭔가 있는지 검사하는, 물리 판정을 활용한 "센서" 구현 기법.
- **왜 중요한가**: 캐릭터가 "땅에 닿아 있는가", "앞에 벽이 있는가" 같은 판정은 충돌 이벤트만으로는 애매한 경우가 많아, 명시적으로 쏘아보는 방식이 실무에서 표준적으로 쓰인다.
- **내 코드에서 어떻게 썼는지**: `PlayerCtrl.cs:57`(땅 체크), `Enemy.cs:34-46`(전방 장애물 체크로 방향 전환)
  ```csharp
  // 플레이어 위치 ~ groundCheck 위치를 잇는 선에 Ground 레이어가 걸리는지 검사
  grounded = Physics2D.Linecast(transform.position, groundCheck.position, 1 << LayerMask.NameToLayer("Ground"));

  // 몬스터 바로 앞 지점에 Obstacle 태그가 있으면 방향 전환
  Collider2D[] frontHits = Physics2D.OverlapPointAll(frontCheck.position, 1);
  foreach (Collider2D c in frontHits)
      if (c.tag == "Obstacle") { Flip(); break; }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이 방식이 `OnCollisionEnter2D`만으로 처리하기 어려운 이유는? ("지금 이 순간 땅에 닿아있는 상태인가"처럼 지속적인 상태 확인은 이벤트 콜백보다 매 프레임 직접 검사하는 쪽이 더 명확하고 제어하기 쉬움)
  - `groundCheck`/`frontCheck`처럼 빈 자식 오브젝트를 만들어 위치 기준점으로 쓰는 이유는? (레이캐스트의 시작점을 코드 상수가 아니라 씬 에디터에서 시각적으로 배치/조정할 수 있게 하기 위함)
- **최신 동향**: `Linecast`/`Raycast`/`OverlapPoint` 계열 API는 지금도 2D/3D 물리 판정의 표준. `Physics2D.OverlapPointAll(frontCheck.position, 1)`처럼 레이어마스크에 매직넘버(`1`)를 직접 쓰는 것은 가독성이 떨어져, `LayerMask.NameToLayer`/`LayerMask.GetMask`로 이름 기반으로 명시하는 것이 더 권장되는 스타일이다 — 실제로 같은 파일 주석에 `1 << LayerMask.NameToLayer("Default")`로 쓰려다 `1`로 단순화한 흔적이 남아있어 좋은 비교 사례.

## 3-3. `OnCollisionEnter2D` + 무적시간(Invincibility Frame) 패턴

- **한 줄 정의**: 물리적으로 실제 부딪히는 충돌은 `OnTriggerEnter2D`(통과 가능)가 아니라 `OnCollisionEnter2D`로 받으며, 적과 계속 맞닿아 있어도 매 프레임 데미지가 들어가지 않도록 "마지막으로 맞은 시각 + 재피격 대기시간"을 비교해 일정 시간 동안은 다시 데미지를 받지 않게 만든다.
- **왜 중요한가**: 대부분의 액션 게임에 있는 필수 시스템(맞았을 때 잠깐 무적). 2-2번 항목(St2의 `OnTriggerEnter2D`)과 짝지어 "충돌(Collision)과 트리거(Trigger)를 실전에서 각각 언제 쓰는가"를 구체적 사례로 비교할 수 있음.
- **내 코드에서 어떻게 썼는지**: `PlayerLife.cs:39-53`
  ```csharp
  void OnCollisionEnter2D(Collision2D col)
  {
      if (col.gameObject.tag == "Enemy")
      {
          if (Time.time > lastHitTime + repeatDamagePeriod)   // 재피격 대기시간이 지났는지 확인
          {
              if (life > 0f) { TakeDamage(col.transform); lastHitTime = Time.time; }
              else { /* 사망 처리 */ }
          }
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `OnTriggerEnter2D`가 아니라 `OnCollisionEnter2D`를 쓴 이유는? (플레이어가 적과 실제로 물리적으로 부딪혀 밀려나야(넉백) 하므로 물리적 충돌이 필요 — 아이템 획득처럼 "통과하면서 주움"이 아니라 "부딪힘" 자체가 게임플레이의 일부)
  - `OnCollisionEnter2D`는 계속 맞닿아 있어도 한 번만 호출되는데, 이 코드가 지속 피격을 어떻게 처리하는가? (실제로는 `OnCollisionStay2D`가 매 프레임 불려야 지속 데미지가 들어갈 텐데, 이 코드는 `OnCollisionEnter2D`만 쓰고 있어 "닿는 순간"에만 데미지 판정이 걸림 — 실제로 지속 접촉 데미지를 원한다면 `OnCollisionStay2D`로 바꿔야 한다는 점은 이 코드의 잠재적 개선 포인트)
- **최신 동향**: 무적시간(iframe) 패턴 자체는 지금도 액션 게임의 표준 기법. `Time.time` 비교 방식은 여전히 흔히 쓰이지만, 여러 종류의 쿨다운을 관리해야 하는 큰 프로젝트에서는 개별 타이머 변수 대신 공용 쿨다운 관리 클래스로 통합하는 경우가 많다.

## 3-4. 체력바 UI 표현 — `Color.Lerp` + `localScale`

- **한 줄 정의**: 체력바를 이미지 슬라이더가 아니라, 스프라이트의 가로 `localScale`을 체력 비율만큼 줄이고 색상은 `Color.Lerp`로 초록→빨강 서서히 전환시켜 표현하는 방식.
- **왜 중요한가**: UI 슬라이더 컴포넌트 없이도 체력바를 표현할 수 있다는 걸 보여주는 실용적 기법이자, `Lerp`가 위치뿐 아니라 색상에도 똑같이 적용되는 범용 보간 함수라는 걸 보여주는 좋은 예.
- **내 코드에서 어떻게 썼는지**: `PlayerLife.cs:110-117`
  ```csharp
  public void UpdateLifeBar()
  {
      // 체력 100%일 때 초록, 0%에 가까울수록 빨강
      lifeBar.material.color = Color.Lerp(Color.green, Color.red, 1 - life * 0.01f);
      // 체력 비율만큼 가로 스케일 축소
      lifeBar.transform.localScale = new Vector3(lifeScale.x * life * 0.01f, 1, 1);
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `localScale`로 체력바를 줄이면 생기는 문제는? (스케일을 줄이면 앵커 위치에 따라 바가 중앙을 기준으로 양쪽에서 줄어들 수 있어, 왼쪽 끝을 고정하고 싶다면 피벗(pivot)을 왼쪽으로 맞춰야 함)
  - `Color.Lerp`의 세 번째 인자(`1 - life * 0.01f`)가 왜 이런 식으로 계산됐는가? (`life`가 100일 때 결과가 0이 되어야 시작 색(초록)이 나오고, `life`가 0일 때 결과가 1이 되어야 끝 색(빨강)이 나오므로 `1 - (비율)`로 반전시킨 것)
- **최신 동향**: 실무에서는 uGUI의 `Image.fillAmount`(Filled 타입 이미지)를 쓰는 방식이 더 표준적이지만, `localScale`+`Color.Lerp` 방식도 여전히 가볍고 흔히 쓰이는 대안이다.

## 3-5. 카메라 추적 시스템 — `LateUpdate` + `Mathf.Lerp` + `Mathf.Clamp`

- **한 줄 정의**: 카메라가 플레이어를 즉시 따라가지 않고 일정 여유(margin) 이상 멀어졌을 때만 `Lerp`로 부드럽게 따라가며, 맵 경계를 벗어나지 않도록 `Clamp`로 좌표를 제한하는 2D 사이드스크롤 카메라의 표준 구현.
- **왜 중요한가**: "카메라를 왜 `Update`가 아니라 `LateUpdate`에서 움직여야 하는가"는 Unity의 실행 순서를 정확히 이해하는지 확인하는 좋은 질문.
- **내 코드에서 어떻게 썼는지**: `FollowCamera.cs`
  ```csharp
  void LateUpdate() { TrackPlayer(); }   // 모든 오브젝트의 이동이 끝난 뒤에 카메라를 움직임

  void TrackPlayer()
  {
      float targetX = transform.position.x;
      if (CheckXMargin())   // 플레이어가 margin 이상 벗어났을 때만
          targetX = Mathf.Lerp(transform.position.x, player.position.x, xSmooth * Time.deltaTime);
      targetX = Mathf.Clamp(targetX, minXAndY.x, maxXAndY.x);   // 맵 경계를 벗어나지 않게 제한
      transform.position = new Vector3(targetX, targetY, transform.position.z);
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `LateUpdate`를 안 쓰고 `Update`에서 카메라를 움직이면 어떤 문제가 생기는가? (플레이어의 `Update`/`FixedUpdate`가 아직 그 프레임에 다 끝나지 않은 상태에서 카메라가 먼저 이동해버리면, 카메라가 한 프레임 뒤처진 플레이어 위치를 쫓아가는 미세한 떨림(jitter)이 생길 수 있음 — `LateUpdate`는 "이 프레임의 모든 `Update`가 끝난 뒤" 실행이 보장됨)
  - `xSmooth * Time.deltaTime`을 `Lerp`의 세 번째 인자로 쓰는 이 방식이 프레임레이트에 안정적인 이유는? (프레임 간격(`Time.deltaTime`)을 반영해서, 프레임레이트가 달라져도 초당 따라가는 비율이 일정하게 유지되도록 보정)
- **최신 동향**: 이 방식(마진+Lerp+Clamp)은 지금도 2D 게임 카메라의 대표적인 구현 패턴. Cinemachine(Unity 공식 카메라 패키지)이 이런 로직을 훨씬 정교하게(데드존, 컨파인 등) 미리 구현해서 제공하기 때문에, 최신 프로젝트에서는 이걸 직접 짜기보다 Cinemachine을 쓰는 경우가 많다는 것도 알아두면 좋다.

## 3-6. 주기적 실행의 3가지 방법 종합비교

- **한 줄 정의**: Unity에서 "일정 시간마다 반복 실행"을 구현하는 방법은 최소 세 가지다 — ①`Update()` 안에서 `Time.time` 비교(ST1의 1-8번), ②코루틴의 `WaitForSeconds`(St2의 2-8번), ③`InvokeRepeating("함수이름", 시작지연, 반복주기)`(이 프로젝트에서 새로 등장).
- **왜 중요한가**: 세 방법 모두 결과는 비슷해 보이지만 내부 동작과 트레이드오프가 달라서, "이 세 가지의 차이를 설명해보라"는 질문에 실제 코드 예시로 명확히 답할 수 있으면 강한 인상을 줌 — 지금까지 정리한 세 프로젝트를 관통하는 좋은 종합 사례이기도 함.
- **내 코드에서 어떻게 썼는지**: `Spawner.cs:11-16`
  ```csharp
  void Start()
  {
      // spawnDelay 초 후 시작해서, spawnTime 초 간격으로 Spawn() 함수를 계속 반복 호출
      InvokeRepeating("Spawn", spawnDelay, spawnTime);
  }
  void Spawn() { Instantiate(enemies[Random.Range(0, enemies.Length)], transform.position, transform.rotation); }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `InvokeRepeating`도 문자열로 함수를 지정하는데, St2에서 지적했던 문자열 기반 `StartCoroutine`과 같은 문제(오타에 취약, 리플렉션 오버헤드)를 그대로 가지고 있는가? (그렇다 — `InvokeRepeating`은 애초에 문자열 기반 API만 존재해서 이 문제를 피할 수 없다는 것이 코루틴과의 중요한 차이점)
  - 이 스포너를 멈추려면 어떻게 해야 하는가? (`CancelInvoke("Spawn")` 또는 `CancelInvoke()`(이 오브젝트의 모든 Invoke 취소) — 코드에는 이 취소 로직이 없어, 게임오버 이후에도 계속 몬스터가 스폰될 수 있는 잠재적 버그 지점)
- **최신 동향 (웹서칭 결과)**: 세 방식의 성능 차이는 실측 벤치마크 기준으로 크지 않다 — `Update` 직접 비교가 가장 가볍고, `InvokeRepeating`이 코루틴보다 아주 약간 더 가볍다는 정도. 실무적으로는 성능보다 "이 로직이 게임 내내 항상 도는가(→`Update`), 아니면 특정 상황에서만 시작/종료되는가(→코루틴 또는 `InvokeRepeating`)"로 선택 기준을 삼는 것이 합리적이라는 것이 일반적인 결론이며, `InvokeRepeating`은 문자열 기반이라는 단점 때문에 최신 코드에서는 코루틴이나 `Awaitable`/`UniTask`(1-4번 항목 참고)가 더 선호되는 편이다. ([InvokeRepeating vs Coroutine 성능 비교](https://www.linkedin.com/pulse/invokerepeating-vs-coroutine-rakib-jahan))

## 3-7. `Time.timeScale`로 일시정지 구현

- **한 줄 정의**: `Time.timeScale`은 게임 전체의 시간 흐름 속도를 조절하는 전역 값으로, `0`으로 설정하면 물리 연산과 `Time.deltaTime` 기반의 모든 움직임이 멈춰 사실상 일시정지 상태가 된다.
- **왜 중요한가**: 일시정지는 거의 모든 게임에 있는 기능이지만, "정확히 무엇이 멈추고 무엇이 안 멈추는지"를 아는 사람은 의외로 적다 — 실무에서 자주 겪는 "일시정지했는데 UI 애니메이션도 같이 멈춰버렸다" 같은 문제의 원인이 됨.
- **내 코드에서 어떻게 썼는지**: `Pauser.cs`
  ```csharp
  if (Input.GetKeyUp(KeyCode.P)) paused = !paused;
  Time.timeScale = paused ? 0 : 1;
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Time.timeScale = 0`일 때 멈추지 않는 것은 무엇인가? (`Update()`는 여전히 매 프레임 호출됨 — `Time.deltaTime`만 0이 되는 것이지 `Update` 자체가 멈추는 게 아님. 그래서 UI 입력 처리는 계속 가능하고, 이 코드의 `Input.GetKeyUp(KeyCode.P)` 검사도 정지 중에 계속 동작해서 다시 풀 수 있음)
  - 일시정지 메뉴의 버튼 애니메이션은 왜 멈추지 않게 만들 수 있는가? (Animator/코루틴 중 `Time.timeScale`의 영향을 받지 않는 `unscaledDeltaTime` 계열 API를 사용하면 됨 — 이 코드는 그런 예외 처리가 없어 모든 것이 같이 멈추는 단순한 버전)
- **최신 동향**: `Time.timeScale` 기반 일시정지는 지금도 표준 기법. 다만 정교한 UI를 위해서는 `Time.unscaledDeltaTime`/`Time.unscaledTime`을 함께 활용해 "게임은 멈추되 UI만은 계속 움직이는" 구현이 실무에서 일반적이다.

## 3-8. 모바일 대응 — 조이스틱 입력 + 해상도별 UI 스케일링

- **한 줄 정의**: PC의 키보드 입력(`Input.GetAxis`) 대신 화면 터치 기반 가상 조이스틱 에셋의 API(`UltimateJoystick.GetHorizontalAxis`)로 이동 입력을 받고, 기기마다 다른 화면 해상도에 맞춰 UI 크기를 코드에서 동적으로 재계산(`RectTransform.SetSizeWithCurrentAnchors`)하는 모바일 대응 기법.
- **왜 중요한가**: 모바일 게임 개발에서 반드시 마주치는 "다양한 화면 크기/비율 대응" 문제를 실제로 다뤄본 경험을 보여줄 수 있음.
- **내 코드에서 어떻게 썼는지**: `PlayerCtrl.cs:78`(조이스틱 입력), `ScreenSet.cs`(해상도 대응)
  ```csharp
  float h = UltimateJoystick.GetHorizontalAxis("JS");   // 키보드 대신 가상 조이스틱에서 입력값을 받음

  // Screen.width/height 기준으로 UI 요소 크기를 실시간 재계산
  rect[0].SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, Screen.width / scaleX);
  rect[0].SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, Screen.height / scaleY);
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - Unity uGUI의 `Canvas Scaler`가 이미 해상도 대응 기능을 제공하는데, 왜 코드로 직접 크기를 계산했을까? (`Canvas Scaler`의 "Scale With Screen Size" 모드로 상당 부분 해결 가능하지만, 특정 요소만 다른 비율로 커스터마이징하고 싶을 때는 이렇게 코드로 직접 개입하는 경우도 있음 — 다만 `Canvas Scaler`를 먼저 검토하지 않고 처음부터 코드로 해결한 것이라면 과한 접근일 수 있다는 점도 비판적으로 짚을 만함)
  - `ScreenSet.cs`의 `Update()`에 있는 로직이 `Start()`와 똑같이 매 프레임 반복되게 짜여 있다가 주석 처리된 이유는? (해상도가 런타임에 거의 바뀌지 않는 모바일 환경에서는 매 프레임 재계산이 불필요한 비용이라 판단해 주석 처리한 것으로 보임 — 실제로 리사이즈 가능한 PC 창 환경이라면 필요하지만, 모바일이라면 `Start()`에서 한 번만 계산해도 충분하다는 걸 스스로 실험해본 흔적)
- **최신 동향**: 최신 Unity 프로젝트는 `Canvas Scaler` + 앵커/피벗 조합만으로 대부분의 해상도 대응을 처리하고, 정말 세밀한 커스터마이징이 필요할 때만 코드 개입을 추가하는 것이 일반적인 순서다.

## 3-9. Deprecated API 마이그레이션 실사례

- **한 줄 정의**: `Application.loadedLevel`(현재 씬의 인덱스를 가져오는 옛 API)이 Deprecated 경고를 띄우자, 권장되는 대체 API인 `SceneManager.GetActiveScene().buildIndex`로 직접 교체한 실제 사례.
- **왜 중요한가**: "Deprecated 경고를 만났을 때 실제로 어떻게 대응하는가"를 코드와 함께 보여줄 수 있는 살아있는 사례 — 오래된 튜토리얼 코드를 유지보수해본 경험을 구체적으로 설명할 수 있게 해줌.
- **내 코드에서 어떻게 썼는지**: `Remover.cs`에 이 마이그레이션 과정 자체가 주석으로 자세히 남아있음
  ```csharp
  IEnumerator ReloadGame()
  {
      yield return new WaitForSeconds(2);
      //Application.LoadLevel(Application.loadedLevel);   // 옛 API (경고 발생)
      SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);   // 대체 API
  }
  /* 추가 설명: Application.loadedLevel은 사용되지 않습니다. "Use SceneManager to determine
     what scenes have been loaded" 라는 경고 메시지... 이럴 땐 SceneManager.GetActiveScene().buildIndex를 사용 */
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `SceneManager.LoadScene(buildIndex)`로 "현재 씬을 다시 로드"하는 이 방식과, 씬 이름으로 직접 불러오는 것의 차이는? (빌드 인덱스는 Build Settings의 씬 등록 순서에 의존하므로, 씬 순서가 바뀌면 의도와 다른 씬이 로드될 위험이 있음 — 이름 기반(`SceneManager.LoadScene("씬이름")`)이 더 명시적이고 안전하다는 반론도 가능)
- **최신 동향**: `Application.loadedLevel`/`LoadLevel` 계열은 완전히 제거된 지 오래고 `SceneManager`가 유일한 표준. 이 항목은 API 자체보다 "레거시 코드에서 Deprecated 경고에 어떻게 대응하는가"라는 실무 태도를 보여주는 사례로서 가치가 있다.

## 3-10. 커스텀 Editor 확장 — `EditorWindow`와 `Gizmos`/`Handles`

- **한 줄 정의**: Unity 에디터 자체의 기능을 확장하는 두 가지 대표적인 방법 — 독립된 도구 창을 만드는 `EditorWindow`(`[MenuItem]`+`OnGUI`)와, 씬 뷰 안에서 오브젝트를 시각적으로 조작하게 해주는 `Gizmos`/`Handles`(커스텀 `Editor` 클래스의 `OnSceneGUI`).
- **왜 중요한가**: 게임 로직이 아니라 "개발 도구를 만드는" 역량을 보여주는 항목 — 팀 프로젝트에서 기획자/아티스트가 더 쉽게 콘텐츠를 넣을 수 있도록 에디터 도구를 만드는 능력은 실무에서 실제로 크게 평가받는 부분.
- **내 코드에서 어떻게 썼는지**: `9. Etc/3DSortEditor/Editor/PositionOrdererWindow.cs`(오브젝트들을 줄/표/큐브 형태로 자동 정렬해주는 독립 도구창), `9. Etc/2DEditor/Editor/RopeEditor.cs`(씬 뷰에서 로프의 마디를 직접 드래그해서 편집)
  ```csharp
  // EditorWindow: 독립된 도구 창
  [MenuItem("Window/Position Orderer")]
  private static void Init()
  {
      var window = GetWindow(typeof(PositionOrdererWinodw), true, "Position Orderer") as PositionOrdererWinodw;
      window.Show();
  }
  private void OnGUI()   // 이 창 안의 UI를 즉시 모드(IMGUI)로 직접 그림
  {
      if (GUILayout.Button("Add")) { /* 선택된 오브젝트들을 정렬 대상 리스트에 추가 */ }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이런 에디터 확장 스크립트를 왜 반드시 `Editor` 폴더 안에 둬야 하는가? (`Editor` 폴더 안의 스크립트는 빌드에 포함되지 않고 에디터 실행 시에만 컴파일됨 — 실수로 게임 빌드에 에디터 전용 코드/DLL 참조가 섞여 들어가는 것을 방지)
  - `OnGUI`(IMGUI, 즉시 모드 GUI)와 런타임 UI(uGUI, `Canvas` 기반)의 관계는? (완전히 다른 시스템 — `OnGUI`/에디터 확장은 지금도 IMGUI를 쓰지만, 게임 런타임 UI는 uGUI나 UI Toolkit을 쓰는 것이 표준. 에디터 도구 개발과 게임 UI 개발에 쓰는 기술이 서로 다르다는 걸 구분해서 설명할 수 있어야 함)
- **최신 동향**: `EditorWindow`+IMGUI(`OnGUI`)는 지금도 에디터 확장의 표준 방법이지만, Unity는 최근 에디터 확장에도 웹 기술 기반의 UI Toolkit(`UIElements`) 사용을 권장하는 방향으로 가고 있다 — 다만 기존 IMGUI 기반 에디터 코드가 폐기된 것은 아니라 지금도 흔히 쓰인다.

## 3-11. `AnimationCurve`로 커스텀 이징(Easing) 곡선 구현

- **한 줄 정의**: 인스펙터에서 그래프로 직접 그릴 수 있는 `AnimationCurve` 타입을 만들어두고, 시간 진행률(0~1)을 `curve.Evaluate()`에 넣어 "가속하다가 감속" 같은 비선형적인 움직임 곡선을 코드 수정 없이 디자인할 수 있게 하는 기법.
- **왜 중요한가**: 단순 `Lerp`(등속 보간)보다 훨씬 자연스러운 움직임을 코드 재작성 없이 시각적으로 튜닝할 수 있다는 것을 보여줌 — "이징 함수"라는 개념을 실제로 응용해본 경험을 증명하는 좋은 예.
- **내 코드에서 어떻게 썼는지**: `9. Etc/Mask/Scripts/Curve.cs:33-38`
  ```csharp
  public AnimationCurve curve = AnimationCurve.Linear(0.0f, 0.0f, 1.0f, 1.0f);   // 인스펙터에서 그래프로 편집 가능

  if (playTimer <= PlayTime)
  {
      // curve.Evaluate(진행률)의 결과값으로 Lerp의 보간 비율을 대체 -> 등속이 아니라 곡선을 따라 움직임
      transform.localPosition = Vector3.Lerp(startPos.localPosition, destPos.localPosition, curve.Evaluate(playTimer / PlayTime));
      playTimer += Time.deltaTime;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `curve.Evaluate(x)`의 입력과 출력 범위는 항상 0~1인가? (아니오 — `AnimationCurve`는 임의의 X/Y 범위를 가질 수 있음. 이 코드처럼 0~1 구간의 이징 곡선으로 쓰려면 커브 자체를 그렇게 설계해야 함 — 예를 들어 `Evaluate`가 1을 넘는 값을 반환하도록 그리면 오버슈트(목표를 지나쳤다가 돌아오는) 효과도 만들 수 있음)
  - 이 방식과 일반적인 이징 함수 라이브러리(예: `EaseInOutQuad` 같은 수식 기반 함수)의 차이는? (수식 기반은 코드로 곡선 모양이 고정되지만, `AnimationCurve`는 기획자/디자이너가 코드를 몰라도 인스펙터에서 그래프를 직접 그려 튜닝할 수 있다는 실무적 장점이 있음)
- **최신 동향**: `AnimationCurve` 자체는 Unity의 안정적인 핵심 API로 지금도 트윈/이징에 널리 쓰인다. 다만 더 복잡한 트윈 시퀀스(여러 동작을 순서대로/동시에)가 필요하면 DOTween 같은 트위닝 전용 라이브러리를 쓰는 경우가 실무에서는 더 흔하다.

## 3-12. 런타임 FPS 카운터

- **한 줄 정의**: 매 프레임 `Time.deltaTime`을 지수 이동 평균으로 완만하게 누적해서 순간적인 튐 없이 안정적인 FPS 수치를 계산하고, `OnGUI`로 화면에 실시간 출력하는 디버그용 도구. 게임 시작 시 `Application.targetFrameRate`로 프레임을 강제 고정하는 것도 함께 다룸.
- **왜 중요한가**: 성능 프로파일링의 가장 기초적인 자체 제작 도구 — 유니티 프로파일러를 쓰기 전 단계에서 빠르게 프레임 상태를 확인하는 실무적 습관을 보여줌. 특히 모바일 게임에서 "왜 프레임을 일부러 낮게 고정하는가"를 설명할 수 있으면 실전 감각을 보여줄 수 있음.
- **내 코드에서 어떻게 썼는지**: `9. Etc/Mask/Scripts/FrameChecker.cs`
  ```csharp
  void Awake() { Application.targetFrameRate = 40; }   // 프레임을 의도적으로 40으로 고정

  void Update() { deltaTime += (Time.deltaTime - deltaTime) * 0.1f; }   // 지수 이동 평균으로 완만하게 계산

  void OnGUI()
  {
      float fps = 1.0f / deltaTime;
      if (fps < worstFps) worstFps = fps;   // 최저 프레임(worst case) 기록
      GUI.Label(rect, msec + "ms (" + fps + ") //worst : " + worstFps, style);
  }
  ```
  파일 맨 아래 주석에 "굳이 최고 성능보다 안정적인 프레임이 낫다", "VSync를 꺼야 targetFrameRate가 실제로 적용된다"는 것까지 스스로 실험하고 정리해둠.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 왜 `Time.deltaTime`을 그대로 안 쓰고 지수 이동 평균(`* 0.1f`)으로 완만하게 만들었는가? (프레임 하나하나의 순간적인 편차 때문에 숫자가 매 프레임 심하게 떨리면 읽기 어려워서, 최근 값에 더 큰 가중치를 두면서도 부드럽게 변하는 값으로 보정)
  - `Application.targetFrameRate`가 실제로 적용되지 않는 흔한 원인은? (VSync가 켜져 있으면 디스플레이 주사율에 맞춰 강제로 동기화되어 `targetFrameRate` 설정이 무시됨 — Quality Settings에서 VSync를 꺼야 한다는 것을 코드 밖 주석에 직접 정리해둔 부분)
- **최신 동향**: 이런 자체 제작 FPS 카운터는 여전히 빠른 확인 용도로 쓰이지만, 정식 성능 분석은 Unity Profiler나 Unity의 공식 성능 오버레이(Stats 창, 최신 버전의 Rendering Debugger 등)로 하는 것이 표준이다. `OnGUI`(IMGUI) 기반 디버그 오버레이 자체도 여전히 가볍고 빠르게 쓸 수 있어 개발 중 디버그 도구로는 지금도 흔히 쓰인다.

---

## 이 프로젝트에서 확인한, 고쳐볼 만한 부분

1. **`OnCollisionEnter2D`만으로는 지속 접촉 데미지가 반영되지 않음** (3-3번 항목) — 적과 계속 붙어있어도 최초 충돌 순간에만 판정되므로, 의도가 "붙어있는 동안 주기적 데미지"라면 `OnCollisionStay2D`로 바꿔야 함.
2. **`Spawner`에 스폰 중지 로직 없음** (3-6번 항목) — `CancelInvoke()`가 없어 게임오버 후에도 몬스터가 계속 생성될 수 있음.
3. **레이어마스크 매직넘버** (3-2번 항목) — `Physics2D.OverlapPointAll(frontCheck.position, 1)`에서 `1`이 어떤 레이어를 의미하는지 코드만 봐서는 알 수 없음. `LayerMask.GetMask("레이어이름")`으로 명시하는 게 안전.
4. **`AnimationEvent`라는 클래스 이름이 Unity 내장 타입(`UnityEngine.AnimationEvent`)과 겹침** (전체 검토 중 발견) — 실제 충돌은 네임스페이스로 피해가지만, 협업 시 혼동을 유발할 수 있는 네이밍.

---

# 4. SpaceShooter (2026-03-20)

> `C:\Study\Unity\SpaceShooter\Assets\2. Scripts` — Unity의 대표적인 입문 튜토리얼 장르인 2D 종스크롤 슈팅 게임. 스크립트 9개, 530줄로 작지만, 오브젝트 풀링을 직접 구현하는 등 밀도 높은 실습.

## 4-1. 정적 인스턴스 기반 매니저 패턴

- **한 줄 정의**: 클래스마다 `public static X instance` 필드를 두고 `Awake()`에서 `if (instance == null) instance = this;`로 자기 자신을 등록해두면, 다른 스크립트에서 `GameObject.Find` 없이 `X.instance.메서드()`로 바로 접근할 수 있다.
- **왜 중요한가**: `GameManager`, `csPlayer`, `csObjectManager`, `SoundManager` 네 스크립트 전부가 이 패턴을 쓰고 있어, "여러 매니저 클래스가 서로를 참조해야 할 때"의 실무적으로 가장 흔한 해법을 보여준다. C++ 정리(cpp_핵심정리.md 20번)의 "진짜" 싱글턴과 비교하면 좋은 통찰을 보여줄 수 있음.
- **내 코드에서 어떻게 썼는지**: `GameManager.cs:8, 18-24`, 동일 패턴이 `csPlayer`/`csObjectManager`/`SoundManager`에도 반복됨
  ```csharp
  public static GameManager instance;
  void Awake() { if (GameManager.instance == null) { GameManager.instance = this; } }
  ```
  다른 스크립트에서는 이렇게 접근: `GameManager.instance.AddScore(killScore);`, `SoundManager.instance.PlaySoundLaser();`
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이 패턴과 cpp_핵심정리.md의 "진짜" 싱글턴(생성자를 `private`으로 막는)의 차이는? (이 MonoBehaviour 패턴은 생성자를 막을 수 없음 — MonoBehaviour는 `new`로 생성하지 않고 씬에 오브젝트로 배치하기 때문. 그래서 실수로 같은 컴포넌트를 씬에 두 개 배치하면 `instance`가 덮어써지는 걸 막을 수 없다는 게 이 패턴의 구조적 한계)
  - `if (instance == null)`만 있고 `else`(이미 있으면 자신을 파괴)가 없는데, 이게 왜 잠재적 문제인가? (같은 컴포넌트가 씬에 두 번 배치되면 나중에 로드된 쪽이 `instance`를 덮어쓰지 않고 무시되긴 하지만, 그 오브젝트 자체는 계속 살아남아 `Update()` 등이 중복 실행될 수 있음 — 보통은 `else { Destroy(gameObject); }`를 추가해서 확실히 막음)
- **최신 동향**: 이런 "MonoBehaviour + static instance" 패턴은 Unity 실무에서 매우 흔하지만, 프로젝트가 커지면 전역 상태가 여기저기서 암묵적으로 얽히는 문제가 생겨 최근에는 Zenject/VContainer 같은 의존성 주입(DI) 프레임워크로 대체하는 경우도 늘고 있다. 소규모~중규모 프로젝트에서는 여전히 실용적인 선택으로 널리 쓰인다.

## 4-2. 오브젝트 풀링(Object Pooling) 직접 구현

- **한 줄 정의**: 총알/적처럼 자주 생성·파괴되는 오브젝트를 매번 `Instantiate`/`Destroy`하는 대신, 미리 여러 개 만들어두고 `SetActive(true/false)`로 껐다 켜며 재사용하는 성능 최적화 기법.
- **왜 중요한가**: St1의 2-8번(코루틴 반복)과 함께, Unity 성능 최적화 질문의 단골 주제. "왜 `Instantiate`/`Destroy`가 비싼가"부터 "풀을 직접 구현해본 경험"까지 이어지는 뎁스 있는 대화가 가능한 부분.
- **내 코드에서 어떻게 썼는지**: `csObjectManager.cs`
  ```csharp
  List<GameObject> bullets = new List<GameObject>();

  void Start() { CreateBullets(5); }   // 시작할 때 5개를 미리 만들어둠

  public GameObject GetBullet(Vector3 pos)
  {
      GameObject reqBullet = null;
      for (int i = 0; i < bullets.Count; i++)
          if (bullets[i].activeSelf == false) { reqBullet = bullets[i]; break; }   // 비활성(=재사용 가능) 오브젝트를 찾음

      if (reqBullet == null)   // 풀에 여유가 없으면 새로 만들어서 풀에 추가(동적 확장)
      {
          GameObject newBullet = Instantiate(laserPrefab) as GameObject;
          bullets.Add(newBullet);
          reqBullet = newBullet;
      }
      reqBullet.SetActive(true);
      reqBullet.transform.position = pos;
      return reqBullet;
  }
  ```
  회수 쪽은 `csLaser.OnBecameInvisible()`/`csRemoveZone.OnTriggerEnter2D()`에서 `Destroy` 대신 `gameObject.SetActive(false)`로 처리(4-5번 항목과 연결).
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Instantiate`/`Destroy`가 매 프레임 반복되면 왜 성능 문제가 되는가? (메모리 할당/해제와 가비지 컬렉션(GC) 비용이 누적됨 — 특히 모바일에서는 GC 스파이크가 프레임 드랍으로 직접 이어짐)
  - 이 구현의 검색 방식(`for`문으로 비활성 오브젝트를 선형 탐색)의 한계는? (풀 크기가 커지면 매번 순회 비용이 커짐 — 별도의 "사용 가능 큐"를 유지하면 O(1)로 개선 가능)
  - `ClearBullets()`/`ClearEnemies()`(게임오버 시 전체 오브젝트를 비활성화)가 필요한 이유는? (게임을 재시작할 때 이전 라운드의 잔여 오브젝트가 화면에 남아있지 않도록 풀 전체를 초기 상태로 되돌리기 위함)
- **최신 동향 (웹서칭 결과)**: Unity 2021부터 `UnityEngine.Pool` 네임스페이스에 제네릭 `ObjectPool<T>`(및 `IObjectPool<T>`)가 엔진 표준으로 추가되어, 이런 풀을 직접 구현하지 않고도 `Get()`/`Release()`만으로 동일한 기능을 쓸 수 있게 됐다. 최신 프로젝트라면 이 표준 API를 우선 검토하는 것이 권장되지만, "왜 필요한지, 내부적으로 어떻게 동작하는지"를 이해하기 위해 이렇게 직접 구현해본 경험은 여전히 가치가 있다. ([Unity 공식 문서: ObjectPool](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/Pool.ObjectPool_1.html))

## 4-3. 뷰포트 좌표계로 해상도 독립적 위치 계산

- **한 줄 정의**: `Camera.main.WorldToViewportPoint`/`ViewportToWorldPoint`로 월드 좌표와 "화면을 0~1 비율로 표현한 뷰포트 좌표"를 서로 변환하면, 실제 픽셀 해상도나 카메라 크기와 무관하게 "화면의 왼쪽 끝", "화면의 80% 지점" 같은 위치를 계산할 수 있다.
- **왜 중요한가**: 다양한 화면 비율(모바일 세로/가로, PC 와이드스크린)에 대응해야 하는 실무 문제를 해결하는 핵심 기법. 이 프로젝트는 이 기법을 두 군데(플레이어 이동 제한, 적 스폰 위치)에 서로 다른 목적으로 응용해서 보여준다.
- **내 코드에서 어떻게 썼는지**:
  - 플레이어가 화면 밖으로 못 나가게 제한: `csPlayer.cs:41-45`
    ```csharp
    Vector3 viewPos = Camera.main.WorldToViewportPoint(transform.position);
    viewPos.x = Mathf.Clamp01(viewPos.x);           // 뷰포트 좌표는 항상 0~1이 화면 안
    transform.position = Camera.main.ViewportToWorldPoint(viewPos);
    ```
  - 적이 등장할 5개 위치를 화면 비율 기준으로 계산: `csSpawnManager.cs:30-43`
    ```csharp
    float viewposX = gapX + gapX * i;   // 화면을 6등분한 위치 중 5곳
    Vector3 worldPos = Camera.main.ViewportToWorldPoint(new Vector3(viewposX, 1.2f, 0));
    ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 왜 월드 좌표를 직접 하드코딩(`x = -5, 5` 같은 값)하지 않고 굳이 뷰포트 좌표를 거치는가? (카메라의 시야각/직교 크기가 바뀌거나 화면 비율이 다른 기기에서 실행돼도, 뷰포트 좌표 `0~1` 기준으로 계산하면 항상 "화면 가장자리"를 정확히 잡을 수 있음 — 월드 좌표 하드코딩은 특정 화면 비율에서만 맞음)
  - 뷰포트 좌표계와 스크린 좌표계(`Camera.main.WorldToScreenPoint`, 픽셀 단위)의 차이는? (뷰포트는 0~1 정규화 비율, 스크린은 실제 픽셀 값 — 해상도에 무관한 계산이 필요하면 뷰포트, UI 픽셀 배치가 필요하면 스크린 좌표를 씀)
- **최신 동향**: 이 기법 자체는 Unity 카메라 시스템의 안정적인 핵심 API로 지금도 변화 없이 쓰인다. UI 요소의 해상도 대응은 `Canvas Scaler`(ST_2의 3-8번 항목)가 담당하지만, 게임 월드 안의 오브젝트 배치는 지금도 이런 뷰포트 좌표 계산이 표준적인 접근이다.

## 4-4. 무한 스크롤 배경 — UV 오프셋 애니메이션

- **한 줄 정의**: 배경 오브젝트를 실제로 이동시키는 대신, 그 위에 입혀진 텍스처의 UV 오프셋(`Material.mainTextureOffset`)을 매 프레임 조금씩 이동시켜서 무한히 흘러가는 것처럼 보이게 만드는 기법.
- **왜 중요한가**: 오브젝트를 이동시키는 방식은 결국 화면 밖으로 나가면 다시 앞으로 되돌려놔야 하는 번거로움이 있는데, UV 오프셋 방식은 오브젝트 자체는 고정한 채 "텍스처가 흐르는 것처럼" 보이게 해서 이 문제를 근본적으로 피해간다는 걸 보여주는 좋은 사례.
- **내 코드에서 어떻게 썼는지**: `csBackScroll.cs`
  ```csharp
  Material myMaterial;
  void Start() { myMaterial = GetComponent<Renderer>().material; }
  void Update()
  {
      float newOffsetY = myMaterial.mainTextureOffset.y + scrollSpeed * Time.deltaTime;
      myMaterial.mainTextureOffset = new Vector2(0, newOffsetY);   // 텍스처 좌표만 흘려보냄
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 텍스처의 Wrap Mode가 "Repeat"이 아니라면 이 코드는 어떻게 보이는가? (텍스처가 반복되지 않고 끝에서 끊기거나 늘어나 보임 — 이 기법은 반드시 텍스처 임포트 설정의 Wrap Mode가 Repeat이어야 성립)
  - `GetComponent<Renderer>().material`을 매 프레임 호출하지 않고 `Start()`에서 한 번만 캐싱한 이유는? (ST1의 1-5번 `GetComponent` 캐싱 원칙과 동일한 이유 — 매 프레임 재조회할 필요가 없는 참조는 한 번만 가져다 쓰는 것이 기본)
- **최신 동향**: UV 스크롤링 기법 자체는 지금도 2D/모바일 게임에서 배경, 물/용암 셰이더 등에 흔히 쓰인다. 더 정교한 효과(패럴랙스, 여러 레이어 배경)가 필요하면 Shader Graph로 구현하는 경우도 많아졌지만, 이 정도의 단순 스크롤은 지금도 코드 몇 줄로 처리하는 것이 일반적이다.

## 4-5. `OnBecameInvisible()`로 화면 밖 오브젝트 자동 회수

- **한 줄 정의**: 오브젝트의 `Renderer`가 카메라 시야에서 완전히 벗어나면 Unity가 자동으로 호출해주는 콜백 — 화면 밖으로 나간 총알을 명시적으로 위치를 검사하지 않고도 감지할 수 있다.
- **왜 중요한가**: "화면 밖으로 나갔다"는 것을 매 프레임 좌표 비교로 직접 검사하는 대신 엔진이 제공하는 콜백을 활용하는 방법을 보여줌 — 불필요한 코드를 줄이는 실용적 선택.
- **내 코드에서 어떻게 썼는지**: `csLaser.cs`
  ```csharp
  void OnBecameInvisible()
  {
      gameObject.SetActive(false);   // Destroy 대신 비활성화 -> 오브젝트 풀로 반환(4-2번 항목)
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `OnBecameInvisible()`이 호출되려면 어떤 컴포넌트가 필요한가? (`Renderer`(예: `SpriteRenderer`, `MeshRenderer`)가 붙어있어야 함 — 렌더러가 없는 오브젝트에는 이 콜백이 호출되지 않음)
  - 씬에 카메라가 여러 대라면 이 콜백의 동작은? (어느 한 카메라에서라도 보이는 상태면 호출되지 않고, 모든 카메라의 시야에서 벗어나야 호출됨)
- **최신 동향**: 이 콜백 자체는 지금도 유효한 표준 API. 다만 성능이 매우 중요한 대규모 프로젝트에서는 가시성 판정을 렌더러 콜백에 맡기기보다, 명시적인 경계 검사(화면 밖 좌표 범위 체크)나 컬링 시스템과 결합해 더 세밀하게 제어하기도 한다.

## 4-6. 사운드 재생 방식 종합비교

- **한 줄 정의**: 지금까지의 Unity 프로젝트들에서 사운드를 재생하는 세 가지 서로 다른 방식이 등장했다 — ①매니저가 `PlayerPrefs`와 연동해 볼륨/뮤트까지 관리하는 방식(ST1), ②정적 메서드로 즉석에서 재생하는 `AudioSource.PlayClipAtPoint`(St2, ST_2), ③전용 매니저가 자신의 `AudioSource` 하나를 계속 재사용하며 `PlayOneShot`으로 겹쳐 재생하는 방식(이 프로젝트).
- **왜 중요한가**: 사운드 재생 하나에도 여러 구현 방식이 있고 각각 트레이드오프가 다르다는 걸 프로젝트 4개를 관통해서 실제 코드로 비교할 수 있는, 이 정리 전체에서 몇 안 되는 "종합 비교" 항목.
- **내 코드에서 어떻게 썼는지**: `SoundManager.cs`
  ```csharp
  public static SoundManager instance;
  AudioSource myAudio;
  void Start() { myAudio = GetComponent<AudioSource>(); }   // AudioSource 하나만 씀(계속 재사용)

  public void PlaySoundLaser() { myAudio.PlayOneShot(sndLaser); }   // 겹쳐서 재생 가능(레이저를 연사해도 소리가 안 끊김)
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `PlayOneShot`과 `AudioSource.Play()`의 차이는? (`Play()`는 현재 재생 중인 클립을 중단하고 새로 재생하지만, `PlayOneShot`은 기존 재생과 겹쳐서(오버랩) 추가로 재생함 — 연사 총소리처럼 짧게 겹쳐야 하는 효과음에 적합)
  - `PlayOneShot`(하나의 `AudioSource` 재사용)과 St2의 `PlayClipAtPoint`(매번 임시 오브젝트 생성)의 트레이드오프는? (`PlayOneShot`은 오브젝트 생성 비용이 없어 더 가볍지만, 3D 위치 기반 공간음향이 그 `AudioSource`가 붙은 위치로 고정됨 — `PlayClipAtPoint`는 정확한 발생 위치에서 소리가 나지만 매번 임시 오브젝트를 만드는 비용이 있음)
- **최신 동향**: 세 방식 모두 지금도 유효한 표준 API로, 상황에 따라 골라 쓰는 것이 일반적이다. 규모가 커지면 이 모든 걸 추상화한 오디오 매니저(믹서 그룹, 페이드, 풀링까지 포함)를 직접 만들거나 FMOD/Wwise(winapi_핵심정리.md 11번 항목 참고) 같은 전문 오디오 미들웨어로 옮기는 경우가 많다.

## 4-7. `Invoke`를 이용한 단발성 지연 실행 + 코루틴 반복

- **한 줄 정의**: `Invoke("함수이름", 지연시간)`은 "한 번만" 일정 시간 뒤에 함수를 실행하는 예약 기능이며(3-6번 항목의 `InvokeRepeating`은 이것의 반복 버전), 코루틴은 "Ready" 텍스트를 3번 깜빡이는 것처럼 여러 스텝에 걸친 시간 기반 시퀀스를 표현하는 데 쓰인다 — 이 프로젝트는 게임 시작 연출에 두 가지를 함께 쓴다.
- **왜 중요한가**: `Invoke`가 St2/ST_2에서 다룬 "주기적 실행 3가지 방법"의 사촌 격인 "단발성 지연 실행"이라는 걸 짚어주는 항목 — Unity의 시간 기반 실행 도구를 총정리하는 마지막 조각.
- **내 코드에서 어떻게 썼는지**: `GameManager.cs`
  ```csharp
  void Start()
  {
      Invoke("StartGame", 3.0f);      // 3초 뒤 딱 한 번 StartGame() 실행
      StartCoroutine(showReady());    // 그 3초 동안 "Ready" 텍스트를 깜빡이는 코루틴
  }

  IEnumerator showReady()
  {
      int count = 0;
      while (count < 3)
      {
          readyText.SetActive(true);  yield return new WaitForSeconds(0.5f);
          readyText.SetActive(false); yield return new WaitForSeconds(0.5f);
          count++;
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Invoke("StartGame", 3.0f)`와 `showReady()` 코루틴의 3초(0.5초×6번)가 정확히 맞아떨어지게 설계된 것을 어떻게 알 수 있는가? (매직 넘버 두 곳(`3.0f`와 `0.5f`×3세트)이 서로 다른 곳에 흩어져 있어, 한쪽만 수정하면 연출이 어긋날 수 있는 잠재적 유지보수 리스크 — 상수 하나로 통합하는 게 더 안전)
  - `Invoke`도 문자열 기반 API인데, St2에서 지적했던 문제(오타에 취약)를 그대로 가지고 있는가? (그렇다 — `InvokeRepeating`과 마찬가지로 이름 기반이라 리팩터링 시 함수명을 바꾸면 조용히 깨질 수 있음)
- **최신 동향**: `Invoke` 계열은 지금도 간단한 지연 실행에 흔히 쓰이지만, 문자열 기반의 한계 때문에 최신 코드에서는 코루틴(`yield return new WaitForSeconds(3f); StartGame();`)이나 `Awaitable`/`UniTask` 기반 지연 실행으로 대체하는 경우가 늘고 있다.

## 4-8. 트리거 기반 화면 밖 처리 구역과 충돌을 통한 게임 흐름 제어

- **한 줄 정의**: 화면 하단에 보이지 않는 트리거 콜라이더(`RemoveZone`)를 배치해서 그 영역에 들어온 적을 자동으로 회수하고, 플레이어와 적의 충돌(`csEnemy.OnTriggerEnter2D`)이 곧바로 게임오버/점수 획득 같은 게임 전체 상태 전환의 트리거가 되도록 구성.
- **왜 중요한가**: 개별 오브젝트의 충돌 처리가 어떻게 `GameManager`라는 중앙 상태와 연결되는지 보여주는, 이 프로젝트의 아키텍처를 관통하는 항목 — "충돌 이벤트 → 오브젝트 자신의 처리 → 전역 게임 상태 갱신"이라는 흐름을 코드로 명확히 설명할 수 있어야 함.
- **내 코드에서 어떻게 썼는지**: `csEnemy.cs:31-49`
  ```csharp
  void OnTriggerEnter2D(Collider2D col)
  {
      if (col.gameObject.tag == "Player")
      {
          Instantiate(explosionPrefab, transform.position, Quaternion.identity);
          GameManager.instance.KillPlayer();          // 개별 충돌이 전역 게임 상태를 바꿈
          col.gameObject.SetActive(false);
          gameObject.SetActive(false);                 // 자신은 풀로 반환
      }
      else if (col.gameObject.tag == "Laser")
      {
          GameManager.instance.AddScore(killScore);
          col.gameObject.SetActive(false);
          gameObject.SetActive(false);
      }
  }
  ```
  화면 밖으로 빠져나간 적은 `csRemoveZone.OnTriggerEnter2D`에서 별도로 회수: `if (col.gameObject.tag == "Enemy") col.gameObject.SetActive(false);`
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 왜 적을 처치했을 때와 화면 밖으로 놓쳤을 때 모두 "회수"라는 같은 결과로 이어지게 설계했을까? (오브젝트 풀 입장에서는 "더 이상 화면에 필요 없어진 적"이라는 점에서 두 상황이 동일하기 때문 — 풀링 시스템과 게임 로직이 자연스럽게 분리되어 있음을 보여줌)
  - 이 구조에서 `csEnemy`가 `GameManager`를 직접 참조하는 것(4-1번의 static instance)의 장단점은? (구현이 간단하지만, `csEnemy`가 `GameManager`의 존재에 강하게 결합되어(tightly coupled) 있어 `csEnemy`만 따로 떼어내 재사용하거나 테스트하기 어려워짐 — 이벤트/델리게이트 기반으로 느슨하게 연결하는 대안도 있음)
- **최신 동향**: 트리거 존을 이용한 화면 밖 처리, 충돌 시 중앙 매니저에 알리는 구조 모두 지금도 흔히 쓰이는 실용적 패턴이다. 다만 프로젝트가 커지면 4-1번 항목에서 언급한 것처럼 직접 참조 대신 이벤트 시스템(C#의 `event`/`Action`, 또는 ScriptableObject 기반 이벤트 채널)으로 결합도를 낮추는 방향으로 리팩터링하는 경우가 많다.

---

## 이 프로젝트에서 확인한, 고쳐볼 만한 부분

1. **static instance에 중복 생성 가드 없음** (4-1번 항목) — `if (instance == null)`만 있고 이미 있을 때 자신을 파괴하는 처리가 없어, 씬에 같은 매니저가 두 번 배치되면 예기치 않은 중복 컴포넌트가 계속 살아있게 됨.
2. **게임 시작 연출의 시간값이 여러 곳에 흩어진 매직 넘버** (4-7번 항목) — `Invoke`의 `3.0f`와 코루틴의 `0.5f`×3회가 서로 맞아떨어져야 하는데 상수로 묶여있지 않음.
3. **오브젝트 풀의 선형 탐색** (4-2번 항목) — 비활성 오브젝트를 매번 `for`문으로 순회해서 찾음. 풀 크기가 커지면 별도의 "사용 가능 큐"로 개선할 여지가 있음.
4. **`csEnemy`가 `GameManager`/`SoundManager`에 강하게 결합됨** (4-8번 항목) — 정적 인스턴스를 직접 참조해서 재사용성이 떨어짐.

---

# 5. St3 (2026-03-30)

> `C:\Study\Unity\St3\Assets` — 60개 스크립트, 6676줄에 달하는 C# 중급/고급 커리큘럼. `Study1`~`Study7` 폴더로 나뉘어 있어 규모상 여러 단계로 쪼개 진행한다.

**St3 하위 진행 표**

| 단계 | 폴더 | 주제 | 상태 |
|---|---|---|---|
| St3-A | `Study1`+`Study2` | C# 언어 기초(델리게이트/이벤트/람다) + 싱글톤 개론 | ✅ 완료 |
| St3-B | `Study3`+`Study4` | 자료구조/인터페이스/추상클래스 + 제네릭 싱글톤 + UI 이벤트 후킹 | ✅ 완료 |
| St3-C | `Study5` | 에디터 확장 기초 + AssetBundle 로딩 | ✅ 완료 |
| St3-D | `Study6` | 인벤토리 시스템 + 커스텀 PropertyAttribute/Drawer + 에디터 툴 | ✅ 완료 |
| St3-E | `Study7` | 프로시저럴 메시 생성 + 커스텀 기즈모 | ✅ 완료 (St3 전체 완료) |

## St3-A. C# 언어 기초 (`Study1`+`Study2`)

### 5-1. `SendMessage`/`SendMessageUpwards`/`BroadcastMessage` — 리플렉션 기반 메시징과 그 한계

- **한 줄 정의**: `gameObject.SendMessage("메서드이름", 인자)`는 같은 게임오브젝트(또는 부모/자식)에 붙은 모든 컴포넌트에서 그 이름의 메서드를 찾아 호출해주는, 컴파일 타임 타입 체크 없이 문자열만으로 메서드를 호출하는 방식이다. `SendMessageUpwards`는 자신+부모 방향, `BroadcastMessage`는 자신+자식 방향으로 전파된다.
- **왜 중요한가**: "컴포넌트가 서로를 몰라도 통신할 수 있게 해주는" 가장 오래되고 직관적인 방법이지만, 뒤에 나오는 이벤트(5-3번)로 왜 대체되는지를 설명하는 데 필요한 비교 대상.
- **내 코드에서 어떻게 썼는지**: `Study1/ExampleClass1.cs`+`ExampleClass2.cs`(같은 오브젝트에 붙여 실험), `Study1/ExampleClass3.cs`(오버로딩 문제 재현)
  ```csharp
  // ExampleClass1, ExampleClass2가 같은 GameObject에 붙어있으면 둘 다 호출됨
  gameObject.SendMessage("ApplyDamage", 5.0f);
  // => ExampleClass1 Damage: 5
  // => ExampleClass2 Damage: 5

  // ExampleClass3: 같은 이름의 오버로드가 있으면 오작동
  void ApplyDamage() { Debug.Log("Damage: Ignored"); }       // 이쪽이 호출됨(인자 무시)
  void ApplyDamage(float damage) { Debug.Log("Damage: " + damage); }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `SendMessage`가 오버로딩된 메서드를 만나면 왜 엉뚱한 쪽이 호출되는가? (.NET 리플렉션으로 이름만 보고 "처음 찾은" 메서드를 실행하기 때문 — 컴파일 타임에 정확한 오버로드를 찾아주는 일반 함수 호출과 근본적으로 다름)
  - `SetActive(false)`로 비활성화된 오브젝트는 `SendMessage`를 받는가? (받지 않음)
- **최신 동향 (웹서칭 결과)**: `SendMessage`는 리플렉션 기반이라 일반 델리게이트/이벤트 호출보다 훨씬 느리고(실측 벤치마크로도 확인됨), 지금은 실무에서 지양되는 방식으로 분류된다. Unity의 최신 UI 시스템도 `SendMessage`의 문제를 피하기 위해 인터페이스 기반 메시징(예: `IPointerClickHandler`, 5-B 단계의 `csEventHookingAll`과 연결)으로 설계되어 있다. 정리하면 "코드 안에서만 쓸 거면 C# 델리게이트/이벤트, 인스펙터에 노출해야 하면 `UnityEvent`, 다수의 컴포넌트에 느슨하게 방송해야 하면 인터페이스 기반 메시징"이 현재 권장되는 선택 기준이다. ([Unity Discussions: SendMessage vs Delegates](https://discussions.unity.com/t/send-broadcast-message-vs-delegates-and-events/31617))

### 5-2. 델리게이트(Delegate) 기초와 C# 문법 변천사

- **한 줄 정의**: 델리게이트는 "함수를 가리키는 변수"로, 어떤 함수를 실행할지를 런타임에 바꿔 끼울 수 있게 해준다. C#은 이 개념을 델리게이트(1.0) → 무명 메서드(2.0) → 람다식(3.0) 순서로 점점 간결하게 표현할 수 있도록 발전시켜왔다.
- **왜 중요한가**: 델리게이트는 이벤트(5-3번), 콜백, LINQ 등 C#/Unity 전반의 기반 개념이다. "델리게이트가 뭐냐"는 질문에 함수 포인터에 빗대어 설명하면서, 이 문법 변천사를 코드로 보여줄 수 있으면 이해도를 확실히 증명할 수 있음.
- **내 코드에서 어떻게 썼는지**: `Study1/LambdaExpression.cs:113-151`에 세 버전이 나란히 정리되어 있음
  ```csharp
  // C# 1.0 델리게이트
  delegate int Func1(int a, int b);
  Func1 func1 = Cal_add;               // 함수를 변수에 담음(함수 포인터처럼)

  // C# 2.0 무명 메서드
  Func2 func2 = delegate (int a, int b) { return a + b; };

  // C# 3.0 람다식
  Func3 func3 = (a, b) => (a + b);     // delegate 키워드도, 타입 명시도 필요 없음
  ```
  `Study1/csDelegateStudy.cs`에는 같은 델리게이트 변수에 서로 다른 함수를 번갈아 연결하는 실험(`callNum1 = OnePlusNum; ... callNum1 = PowerNum;`)도 있음 — "함수를 변수처럼 다룬다"는 것을 직접 확인.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 람다식과 무명 메서드의 차이는? (람다식은 `delegate` 키워드가 없고 매개변수 타입도 대개 생략 가능 — 무명 메서드를 더 간결하게 만든 것)
  - C의 함수 포인터, C++의 함수 객체/람다(cpp_핵심정리.md 14번)와 델리게이트의 공통점은? (모두 "코드를 값처럼 다룬다"는 동일한 목적을 각 언어의 방식으로 구현한 것 — C는 원시 함수 포인터, C++은 템플릿 기반 함수 객체/람다, C#은 타입-안전한 델리게이트 객체)
- **최신 동향**: 델리게이트 문법 자체는 C# 표준의 안정적인 핵심으로 변화가 없다. 실무 C# 코드는 커스텀 델리게이트 타입을 직접 선언하기보다 프레임워크가 제공하는 범용 델리게이트 타입(`Action`, `Action<T>`, `Func<T,TResult>`)을 쓰는 것이 더 일반적이라는 점도 참고할 만하다(이 코드는 학습 목적으로 커스텀 델리게이트를 직접 선언).

### 5-3. `event` vs `delegate` — 캡슐화와 성능

- **한 줄 정의**: `event` 키워드로 선언된 델리게이트는 그 이벤트를 선언한 클래스 밖에서는 `+=`/`-=`로 구독/해지만 가능할 뿐 직접 호출(`invoke`)할 수 없다 — 델리게이트를 캡슐화한 것이 이벤트.
- **왜 중요한가**: "델리게이트와 이벤트가 뭐가 다른가"는 C# 면접의 고전적인 질문. 이 코드는 그 차이를 이론이 아니라 **실제로 안 되는 코드를 주석 처리**해서 눈으로 보여준다는 점에서 특히 좋은 예.
- **내 코드에서 어떻게 썼는지**: `Study1/csEventStudy.cs`
  ```csharp
  class Publish
  {
      public delegate void MyEventDelegate(string a);
      public event MyEventDelegate myEvent;      // event로 캡슐화

      public void DoActive(int num)
      {
          if (num % 3 == 0) myEvent("Event: " + num);   // 클래스 내부에서는 직접 호출 가능
      }
  }
  // 외부(csEventStudy)에서:
  publish.myEvent += Program.MyHandler1;   // 구독은 가능
  // publish.myEvent("직접 호출");          // 컴파일 에러! - 주석 처리된 "불가능(외부 접근)" 블록이 이걸 보여줌
  ```
  더 실전적인 비교는 `Study1/PlayerCtrl.cs`의 `PlayerDie1()`(적들을 `foreach`로 순회하며 `SendMessage`로 일일이 호출, 5-1번과 연결) vs `PlayerDie2()`(`OnPlayerDie` 이벤트 한 번 발생시켜 구독한 모든 적에게 한꺼번에 전파) — 코드 주석에 "적이 아주 많다면 순차 호출은 비효율적, 그래서 이벤트 방식으로 바꾼다"고 직접 설명되어 있음.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `event`가 캡슐화를 강제하는 게 실무에서 왜 중요한가? (구독자가 실수로 다른 구독자의 이벤트 발생을 대신 트리거해버리는 사고를 원천 차단 — 오직 이벤트를 소유한 클래스만 "언제 발생시킬지"를 결정할 수 있음)
  - `PlayerDie1`과 `PlayerDie2`의 실행 결과는 같은데 왜 성능이 다른가? (`SendMessage`는 리플렉션 기반 문자열 조회가 매번 일어나지만, 이벤트는 컴파일 타임에 연결된 함수 포인터 목록을 순회하는 것이라 훨씬 빠름)
- **최신 동향 (웹서칭 결과)**: C# 이벤트/델리게이트(`Action` 등)는 인스펙터 노출이 필요 없는 순수 코드 간 통신에서 `UnityEvent`보다도 더 빠르다는 것이 실측 벤치마크로 확인된 사실이다 — "인스펙터에서 기획자가 직접 연결해야 하면 `UnityEvent`, 코드로만 충분하면 C# 이벤트/`Action`"이 현재의 일반적인 선택 기준. ([JacksonDunstan: Event Performance](https://www.jacksondunstan.com/articles/3335))

### 5-4. 이벤트 구독/해제와 MonoBehaviour 생명주기

- **한 줄 정의**: 이벤트 구독(`+=`)은 반드시 그 오브젝트가 활성화되는 시점(`OnEnable`)에, 해지(`-=`)는 비활성화되는 시점(`OnDisable`)에 짝을 맞춰서 해야, 파괴된/비활성화된 오브젝트가 계속 이벤트에 반응하려다 에러를 내는 상황을 막을 수 있다.
- **왜 중요한가**: 이벤트를 실무에서 안전하게 쓰기 위한 필수 관행. 이걸 놓치면 생기는 메모리 누수/`MissingReferenceException`은 Unity에서 매우 흔한 버그 유형.
- **내 코드에서 어떻게 썼는지**: `Study1/Enemy.cs`
  ```csharp
  void OnEnable()  { PlayerCtrl.OnPlayerDie += this.OnPlayerDie; }   // 활성화될 때 구독
  void OnDisable() { PlayerCtrl.OnPlayerDie -= this.OnPlayerDie; }   // 비활성화될 때 반드시 해지
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `OnDisable`에서 구독 해지를 빼먹으면 어떤 문제가 생기는가? (그 오브젝트가 파괴되거나 비활성화된 뒤에도 정적 이벤트가 여전히 그 인스턴스의 메서드를 참조하고 있어, 이벤트가 발생할 때 이미 죽은 오브젝트의 메서드를 호출하려다 예외가 발생하거나, 가비지 컬렉터가 그 오브젝트를 회수하지 못해 메모리 누수로 이어짐)
  - `Awake`/`Start` 대신 `OnEnable`/`OnDisable`에서 구독하는 이유는? (`OnEnable`/`OnDisable`은 오브젝트가 껐다 켜질 때마다 반복 호출되므로, 비활성 상태에서는 이벤트에 반응하지 않고 다시 켜지면 정확히 다시 반응하게 만들 수 있음 — `Awake`는 생애주기당 1번뿐이라 이 목적에 맞지 않음)
- **최신 동향**: 이 관행은 지금도 C# 이벤트를 다루는 Unity 코드의 표준 모범 사례로 변함없이 유효하다.

### 5-5. 람다식 실전 활용 — 사용자 입력 기반 계산기

- **한 줄 정의**: 사용자가 무엇을 선택하느냐에 따라 델리게이트 변수에 서로 다른 람다식을 그때그때 할당해서, 조건 분기 없이 "지금 이 변수가 어떤 동작을 하는가"만으로 로직을 표현하는 실전 예제.
- **왜 중요한가**: 델리게이트/람다가 실제로 어떤 문제를 더 깔끔하게 풀어주는지 보여주는 응용 사례 — 단순 문법 설명을 넘어 "왜 쓰는가"에 답할 수 있게 해줌.
- **내 코드에서 어떻게 썼는지**: `Study1/LambdaExpression.cs:34-99`
  ```csharp
  delegate int DelegateMethod(int a, int b);
  DelegateMethod method = null;

  switch (chNums[0])
  {
      case 'A': method = (a, b) => (a + b); break;   // 덧셈 선택
      case 'B': method = (a, b) => (a - b); break;   // 뺄셈 선택
      // ...
  }
  Debug.Log(method(ia, ib));   // 선택된 연산이 그대로 실행됨
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이걸 `switch`문으로 매번 분기해서 계산하는 것과 비교하면 어떤 장점이 있는가? (연산을 "선택하는 시점"과 "실행하는 시점"을 분리할 수 있음 — 한 번 선택해두면 이후에는 어떤 연산인지 몰라도 그냥 호출만 하면 됨)
  - `Input.anyKeyDown`과 `Input.GetKeyDown(KeyCode.Return)`을 같이 쓴 이유는? (하나는 "아무 키나 눌렸을 때"(연산자 선택), 다른 하나는 "Enter 키가 눌렸을 때"(결과 확인)로 서로 다른 입력 단계를 구분하기 위함)
- **최신 동향**: 람다식으로 동작을 값처럼 넘기는 패턴은 C# 전반(LINQ, 이벤트 핸들러 등)에서 지금도 핵심적으로 쓰인다.

### 5-6. 프로퍼티(Property)의 `get`/`set`

- **한 줄 정의**: 필드를 `private`으로 감추고 `public` 프로퍼티(`get`/`set`)로만 접근하게 하면, 값을 읽고 쓰는 시점에 검증/부가 로직을 끼워넣을 수 있고, `get`만 두거나 `set`을 `private`으로 제한해서 읽기 전용처럼 만들 수도 있다.
- **왜 중요한가**: 캡슐화의 실전 적용. "필드를 그냥 `public`으로 두면 안 되는 이유"를 코드로 설명할 수 있어야 함.
- **내 코드에서 어떻게 썼는지**: `Study2/Property.cs`
  ```csharp
  private int health = 30;
  public int Health
  {
      get { return health; }
      private set { health = value; }   // 외부에서는 읽기만 가능, 쓰기는 클래스 내부에서만
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `private set`으로 제한하면 외부 코드가 `Health = 100`처럼 직접 대입하려 할 때 무슨 일이 생기는가? (컴파일 에러 — 클래스 내부 메서드를 통해서만 값이 바뀌도록 강제)
  - 자동 구현 프로퍼티(`public int Hp { get; private set; }`)와 이 코드처럼 필드를 직접 감싼 프로퍼티의 차이는? (자동 구현 프로퍼티는 컴파일러가 내부 필드를 자동으로 만들어줌 — 검증 로직이 필요 없다면 더 간결. 로그를 남기거나 조건 검사가 필요하면 이 코드처럼 직접 필드를 감싸야 함)
- **최신 동향**: 프로퍼티 문법 자체는 C#의 안정적인 핵심 기능. Unity의 인스펙터에는 자동 구현 프로퍼티가 기본적으로 노출되지 않는다는 것도 실무에서 자주 헷갈리는 지점(필드는 노출되지만 프로퍼티는 `[SerializeField]`를 직접 걸어야 함 — 5-9번 항목 참고).

### 5-7. `MonoBehaviour`를 `new`로 생성하면 안 되는 이유

- **한 줄 정의**: 일반 C# 클래스는 `new`로 자유롭게 인스턴스를 만들 수 있지만, `MonoBehaviour`를 상속한 클래스를 `new`로 만들면 Unity 엔진과 제대로 연결되지 않은 "가짜" 객체가 되어 정상적으로 동작하지 않는다 — 반드시 `AddComponent<T>()`로 만들거나 씬에 배치해야 한다.
- **왜 중요한가**: Unity 초심자가 반드시 한 번은 걸려 넘어지는 함정이자, "MonoBehaviour가 일반 C# 객체와 근본적으로 다른 이유"를 설명하는 핵심 질문. 이 코드는 이걸 세 가지 클래스로 나란히 직접 실험해서 확인해뒀다는 점이 훌륭함.
- **내 코드에서 어떻게 썼는지**: `Study2/Property.cs:34-44`
  ```csharp
  CsharpStudy aaa = new CsharpStudy();   // MonoBehaviour 상속 - 문제 생김("null 나온다"고 직접 주석에 기록)
  Debug.Log(aaa);

  Property bbb = new Property();         // 역시 MonoBehaviour 상속 - 마찬가지
  Debug.Log(bbb);

  CCC ccc = new CCC();                   // 평범한 C# 클래스(MonoBehaviour 아님) - 정상 동작("된다...ㅜㅜ")
  Debug.Log(ccc);
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 왜 `MonoBehaviour`는 생성자로 만들 수 없게 막아뒀을까? (`MonoBehaviour`는 에디터의 직렬화 과정 전후로 엔진 내부와 긴밀하게 연동되는 "네이티브 엔진 객체"와 짝을 이루는 구조라, 순수 C# `new`로는 그 네이티브 쪽 초기화가 전혀 이뤄지지 않음 — 그래서 겉보기엔 객체가 생성된 것 같아도 실제로는 정상 동작하지 않는 반쪽짜리 상태가 됨)
  - 그럼 런타임에 `MonoBehaviour` 컴포넌트를 새로 만들고 싶으면 어떻게 해야 하는가? (`gameObject.AddComponent<T>()`를 쓰거나, 이미 씬에 있는 오브젝트를 `Instantiate`해야 함 — St3-B의 제네릭 싱글톤(`MonoSingleton2/3`)이 정확히 이 방식으로 동적 생성을 처리하는 걸 다음 단계에서 볼 수 있음)
- **최신 동향 (웹서칭 결과)**: 이 제약은 Unity 엔진의 근본적인 아키텍처(관리 객체와 네이티브 객체의 연동)에서 비롯된 것으로 지금도 변화가 없다. 최신 Unity(2016 이후)는 아예 `MonoBehaviour`의 생성자 안에서 엔진 API를 호출하려 하면 명시적인 경고/에러를 띄워주는 방향으로 개선되어, 이 문제를 더 빨리 알아챌 수 있게 되었다. ([dev.to: Instantiating MonoBehaviours](https://dev.to/iamscottcab/instantiating-monobehaviours-in-unity-5c2g))

### 5-8. 순수 C# 싱글톤 vs `MonoBehaviour` 싱글톤

- **한 줄 정의**: 순수 C# 싱글톤은 `private` 생성자 + 정적 프로퍼티의 `get`에서 `new`로 지연 생성하면 되지만(cpp_핵심정리.md 20번과 동일한 발상), `MonoBehaviour` 싱글톤은 5-7번의 이유로 `new`를 쓸 수 없어 **씬에 배치되어 `Awake()`가 호출되는 시점**에 자기 자신을 등록하는 방식으로 대신한다.
- **왜 중요한가**: "왜 Unity의 싱글톤은 일반적인 싱글톤 구현과 다르게 생겼는가"를 설명하는 핵심 — C++/C#의 싱글톤 지식을 Unity라는 특수한 환경에 어떻게 적용해야 하는지 보여줌.
- **내 코드에서 어떻게 썼는지**:
  - 순수 C# 버전: `Study2/St_Singleton1.cs`
    ```csharp
    public class Singleton1
    {
        private static Singleton1 instance = null;
        public static Singleton1 Instance
        {
            get { if (instance == null) instance = new Singleton1(); return instance; }  // new로 지연 생성 가능
        }
        private Singleton1() { num = 100; }   // 생성자를 private으로 막음
    }
    ```
  - `MonoBehaviour` 버전: `Study2/Singleton2.cs`
    ```csharp
    private static Singleton2 _instance = null;
    public static Singleton2 Instance { get { /* new 불가 - null이면 에러만 로깅 */ return _instance; } }

    void Awake()
    {
        _instance = this;                    // new 대신 Awake에서 자신을 등록
        DontDestroyOnLoad(this.gameObject);
    }
    void Start() { Debug.Assert(assert); }   // 인스펙터 연결이 끊겼는지 항상 검증하는 습관
    ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Singleton2`의 `Instance` 프로퍼티가 `_instance`가 `null`일 때 `new`로 생성하지 못하고 그냥 에러만 로깅하는 이유는? (5-7번 항목 그대로 — `MonoBehaviour`라 `new`가 불가능하기 때문. 이 코드는 아직 "미완성" 버전이고, St3-B의 제네릭 싱글톤에서 `GameObject.AddComponent<T>()`로 이 문제를 실제로 해결하는 걸 보게 됨)
  - `Debug.Assert(assert)`를 항상 `Start()`에 걸어두는 습관이 왜 유용한가? (인스펙터에서 드래그-드롭으로 연결한 참조가 실수로 끊긴 채 방치되면, 나중에 특정 상황에서만 `NullReferenceException`이 터져 원인 파악이 어려워짐 — `Assert`로 개발 중에 즉시 알 수 있게 만드는 방어적 습관)
- **최신 동향**: "MonoBehaviour 싱글톤은 Awake에서 등록, 순수 C# 싱글톤은 생성자를 막고 지연 생성"이라는 이 구분은 지금도 Unity 개발의 표준 지식이다. 이 프로젝트의 St3-B 단계에서 이 패턴이 제네릭 베이스 클래스로 더 발전된 형태를 보게 될 예정.

### 5-9. `[System.Serializable]`/`[SerializeField]`로 커스텀 클래스를 인스펙터에 노출

- **한 줄 정의**: `MonoBehaviour`가 아닌 일반 C# 클래스도 `[System.Serializable]` 어트리뷰트를 붙이면 인스펙터에 필드처럼 펼쳐서 보여줄 수 있고, 그 안의 `private` 필드는 `[SerializeField]`를 붙여야 캡슐화를 유지하면서도 인스펙터에 노출할 수 있다.
- **왜 중요한가**: "캡슐화(필드를 private으로)"와 "인스펙터에서 기획자가 값을 조정하게 하기"라는 서로 상충하는 두 목표를 동시에 만족시키는 실무적으로 매우 자주 쓰이는 기법.
- **내 코드에서 어떻게 썼는지**: `Study2/CsharpStudy.cs`
  ```csharp
  [System.Serializable]
  public class Item1
  {
      [SerializeField]
      private int m_amount;         // private이지만 SerializeField 덕분에 인스펙터에 노출됨

      public int GetAmount() { return m_amount; }
      public void SetAmount(int num) { m_amount = num; }
  }
  public Item1 item1;   // 인스펙터에 Item1의 필드가 펼쳐져서 보임
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `[System.Serializable]`을 안 붙이면 어떻게 되는가? (인스펙터에 그 클래스 타입의 필드가 아예 표시되지 않음 — Unity의 직렬화 시스템이 이 어트리뷰트가 있는 타입만 다룰 수 있음)
  - 프로퍼티(5-6번의 `Item2.num`처럼 `get`/`set`으로 감싼 것)는 왜 인스펙터에 기본적으로 안 보이는가? (Unity의 기본 직렬화는 필드만 대상으로 하고 프로퍼티는 직렬화하지 않음 — 그래서 인스펙터 노출이 필요하면 필드를 `[SerializeField]`로 노출하고, 로직이 필요한 프로퍼티는 코드에서만 쓰는 것이 일반적)
- **최신 동향**: 이 직렬화 규칙(필드만 직렬화, 프로퍼티는 안 됨)은 Unity의 근본적인 설계로 지금도 동일하다. 최신 Unity(2020.1+)는 `[SerializeReference]`로 다형성 있는 객체 참조까지 직렬화할 수 있게 확장되는 등 계속 발전하고 있다.

---

**St3-A에서 확인한, 고쳐볼 만한 부분**

1. **`Singleton2`(Study2)의 인스턴스 자동 생성 로직 미완성** (5-8번 항목) — `_instance`가 `null`이어도 에러만 로깅할 뿐 실제로 만들어주지는 않음. St3-B의 제네릭 싱글톤에서 이 문제가 어떻게 해결되는지 확인할 것.
2. **이벤트 구독 해제가 없는 예제 존재** (5-3번, 5-4번 대조) — `csEventStudy.cs`의 `publish.myEvent += ...`는 학습용 1회성 데모라 해지 로직이 없지만, `Enemy.cs`처럼 실제 게임 오브젝트에 적용할 때는 반드시 `OnDisable`에서 해지해야 한다는 점을 대조해서 볼 것.

## St3-B. 자료구조/인터페이스/제네릭 싱글톤 (`Study3`+`Study4`)

### 5-10. 인터페이스(Interface) — 다중 구현과 제네릭 인터페이스

- **한 줄 정의**: 인터페이스는 메서드/프로퍼티의 "이름과 시그니처만" 정의하고 구현은 전혀 담지 않는 완전한 추상 계약이며, C#은 클래스 다중상속을 금지하는 대신 인터페이스는 여러 개를 동시에 구현할 수 있게 해서 그 자리를 메운다.
- **왜 중요한가**: "C#/Java는 왜 다중상속을 금지했고, 그 대안이 뭔가"는 객체지향 설계 면접의 고전 질문. 인터페이스끼리도 상속이 가능하다는 것, 제네릭과 결합할 수 있다는 것까지 아는지가 깊이를 가른다.
- **내 코드에서 어떻게 썼는지**: `Study3/List/Interface.cs`
  ```csharp
  public interface IPower { int Power { get; set; } void Method(); }
  public interface IUserName : IPower { string UserName { get; set; } }   // 인터페이스끼리 상속

  // 여러 인터페이스를 동시에 구현(다중상속의 대안)
  public class PlayerState1 : IPower, IUserName { /* Power, UserName, Method 모두 구현해야 함 */ }

  // 제네릭 인터페이스
  public interface Item<T> { void Method(T item); }
  public class ItemUse<T> : Item<T> { public void Method(T item) { Debug.Log(item); } }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 인터페이스를 구현한 클래스가 인터페이스의 메서드 하나를 빠뜨리면? (컴파일 에러 — 인터페이스의 멤버는 반드시 전부 구현해야 함, 5-11번의 추상 클래스는 일부만 추상화해도 되는 것과의 핵심 차이)
  - 인터페이스는 필드(멤버 변수)를 가질 수 있는가? (없음 — 프로퍼티(get/set)는 선언 가능하지만 필드는 불가. 상태를 갖지 않는 순수한 "행동 계약"이기 때문)
- **최신 동향**: 인터페이스 다중 구현은 C#의 변함없는 핵심 기능. C# 8.0부터는 인터페이스에 기본 구현(default implementation)을 넣을 수 있게 되어 일부 시나리오에서 추상 클래스와의 경계가 조금 흐려지긴 했지만, "상태 없는 계약"이라는 인터페이스 본연의 역할은 지금도 동일하다.

### 5-11. 추상 클래스 vs 인터페이스 + C# 소멸자를 지양하는 이유

- **한 줄 정의**: 추상 클래스(`abstract class`)는 인터페이스와 달리 일부 메서드는 실제 구현을 가지면서 일부만(`abstract` 키워드) 자식이 반드시 재정의하도록 강제할 수 있다 — "완전한 백지 계약" 인터페이스와 "일부는 이미 채워진 기반 클래스" 추상 클래스의 차이.
- **왜 중요한가**: 5-10번과 짝을 이루는 비교 질문. 추가로 이 코드는 C#의 소멸자(finalizer, `~ClassName()`)를 직접 실험해보고 "쓰지 말자"는 결론까지 스스로 내린 부분이 실무적으로 가치 있음.
- **내 코드에서 어떻게 썼는지**: `Study3/List/Abstract.cs`
  ```csharp
  abstract class Sword2
  {
      public abstract void Attack();   // 구현 없는 추상 메서드 - 자식이 반드시 override
      public Sword2() { Debug.Log("Sword2 생성자"); }
      ~Sword2() { Debug.Log("Sword2 소멸자"); }   // C#의 소멸자(finalizer)
  }
  class Man2 : Sword2
  {
      public override void Attack() { Debug.Log("Swing2"); }   // 반드시 재정의해야 컴파일됨
  }
  ```
  소멸자에 대해서는 "가비지 컬렉터가 다 해주는데 자원 낭비, CLR의 GC가 객체를 언제 쓰레기로 판단할지 정확히 알 수 없다"며 대신 Unity의 `OnDestroy()`(즉시 호출 보장)를 쓰라고 스스로 정리해둠.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 추상 클래스도 인스턴스를 직접 만들 수 없는 이유는? (완성되지 않은 "설계도"이기 때문 — `new Sword2()`는 컴파일 에러)
  - C#의 소멸자와 C++의 소멸자(cpp_핵심정리.md 2번, 7번)는 근본적으로 무엇이 다른가? (C++의 소멸자는 스코프를 벗어나거나 `delete`되는 시점에 **결정적으로(deterministic)** 호출되지만, C#의 소멸자는 가비지 컬렉터가 **언젠가** 회수할 때 호출되어 정확한 시점을 예측할 수 없음 — 그래서 즉각적인 자원 해제가 필요하면 C#은 `IDisposable`+`Dispose()` 패턴을 쓰고, Unity에서는 `OnDestroy()`를 씀)
- **최신 동향 (웹서칭 결과)**: "C# 소멸자는 정말 필요할 때(파일 핸들, 네이티브 리소스처럼 GC가 모르는 비관리 자원을 직접 들고 있을 때)만 최후의 수단으로 쓰고, 일반적인 정리는 `IDisposable`/`Dispose()` 패턴을 쓰라"는 것이 지금도 공식적으로 권장되는 지침이다 — 이 코드가 스스로 내린 결론과 정확히 일치한다. ([Microsoft Learn: Dispose Pattern](https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/dispose-pattern))

### 5-12. `virtual`/`override` 다형성 + `internal` 접근제한자

- **한 줄 정의**: 멤버 함수를 `virtual`로 선언하면 자식 클래스가 `override`로 재정의할 수 있고, 기반 클래스 타입의 변수에 자식 인스턴스를 담아 호출해도 실제 자식의 구현이 실행된다(동적 바인딩) — cpp_핵심정리.md의 다형성(6번)과 완전히 같은 개념을 C# 문법으로 재확인.
- **왜 중요한가**: "C++에서 배운 다형성이 C#/Unity에서도 똑같이 적용된다"는 걸 스스로 확인한 부분 — 언어를 넘나드는 개념 전이 능력을 보여줄 수 있음. 코드 주석에 실제로 "C++ 복습"이라고 적혀있다.
- **내 코드에서 어떻게 썼는지**: `Study3/List/Override.cs`
  ```csharp
  public class Player
  {
      internal virtual void ItemUse() { Debug.Log("Portion Use"); }   // internal: 같은 어셈블리(프로젝트) 안에서만 접근 가능
  }
  class GunPlayer : Player
  {
      internal override void ItemUse() { Debug.Log("Gun Use"); }
  }
  // 기반 타입 변수에 담아도 실제 타입의 메서드가 호출됨(동적 바인딩)
  Player player2 = new GunPlayer();
  player2.ItemUse();   // "Gun Use" 출력
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `internal`은 `public`/`private`/`protected`와 어떻게 다른가? (C#에만 있는 접근제한자 — "같은 어셈블리(빌드 출력 단위, 보통 하나의 프로젝트)" 안에서는 공개, 다른 프로젝트/DLL에서는 비공개. C++/Java에는 없는 개념이라 언어별 접근제어 모델의 차이를 짚기 좋은 질문)
  - `virtual` 없이 `override`만 쓰면? (컴파일 에러 — 재정의할 대상이 반드시 기반 클래스에 `virtual`/`abstract`로 선언되어 있어야 함)
- **최신 동향**: `virtual`/`override` 다형성은 C#의 핵심 기능으로 변화가 없다. `internal`도 어셈블리 단위 캡슐화가 필요한 라이브러리/패키지 설계에서 지금도 표준적으로 쓰인다.

### 5-13. 필드 캡슐화 — `const` vs `static readonly` vs 프로퍼티

- **한 줄 정의**: `const`는 컴파일 타임에 값이 고정되는 상수(항상 암묵적으로 정적), `static readonly`는 런타임에 한 번 초기화된 뒤 바뀌지 않는 값, 프로퍼티는 `private` 필드를 감싸 읽기/쓰기 시점에 로직을 끼워넣을 수 있는 캡슐화 수단이다.
- **왜 중요한가**: "이 세 가지 중 언제 뭘 써야 하는가"는 실무 코드 리뷰에서 실제로 자주 오가는 판단. C++의 `const` 멤버와의 차이까지 설명할 수 있으면 좋은 인상을 줌.
- **내 코드에서 어떻게 썼는지**: `Study3/List/csField.cs`, `FieldUse.cs`
  ```csharp
  public class Armor
  {
      public const int m_defence = 1000;              // 컴파일 타임 상수 - 항상 정적
      public static readonly string _Color = "Black";  // 런타임 1회 초기화, 이후 불변
  }
  // armor.m_defence처럼 인스턴스로 접근 불가 -> Armor.m_defence로 클래스 자체에서 접근
  Debug.Log(Armor.m_defence);
  ```
  주석에 "C++의 const 멤버는 모든 인스턴스가 각자 가지고 있지만 수정을 못 해 비효율적인데, 똑똑한 C#은 어차피 못 바꿀 값이니 클래스 전체가 하나만 공유하게(정적) 만들어버렸다"는 비교가 직접 적혀있음.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `const`와 `static readonly`의 실질적 차이는? (`const`는 컴파일 시점에 그 값이 사용하는 코드 안에 그대로 박혀버림(인라인) — 그래서 다른 어셈블리의 `const` 값을 참조하는 라이브러리를 다시 컴파일하지 않고 배포하면 옛날 값이 남아있는 문제가 생길 수 있음. `static readonly`는 런타임에 한 번 읽어오므로 이 문제가 없음)
  - 프로퍼티(5-6번)와 `static readonly` 필드를 언제 각각 써야 하는가? (단순히 "바뀌지 않는 값 공유"면 `static readonly`, "읽거나 쓸 때 검증/로그 등의 로직이 필요"하면 프로퍼티)
- **최신 동향**: 세 방식 모두 지금도 유효한 C# 표준 문법. 다만 진짜 "설정값"이라면 하드코딩된 `const`/`static readonly`보다 `ScriptableObject`(cpp_핵심정리 St_2 2-7번 등에서 언급된 것과 같은 흐름)로 데이터를 외부화해서 기획자가 코드 재빌드 없이 조정하게 하는 것이 최신 Unity 프로젝트의 일반적인 관행이다.

### 5-14. `List<T>` + `Predicate` 델리게이트 실전 활용

- **한 줄 정의**: `List<T>.Find`/`FindAll`/`RemoveAll`은 "조건에 맞는 요소를 찾아라"는 조건 자체를 `Predicate<T>`(요소를 받아 `bool`을 반환하는 델리게이트)로 넘겨받는다 — 5-2번(델리게이트)이 실제 컬렉션 API에서 어떻게 쓰이는지 보여주는 사례.
- **왜 중요한가**: 델리게이트가 추상적인 문법 설명에 그치지 않고 실전 코드에서 "조건을 함수로 표현해서 넘긴다"는 패턴으로 매우 흔하게 쓰인다는 걸 보여줌.
- **내 코드에서 어떻게 썼는지**: `Study3/List/ListStudy.cs`
  ```csharp
  // 이름 있는 메서드를 조건으로 전달
  dinosaurs.Find(EndsWithSaurus);
  dinosaurs.RemoveAll(EndsWithSaurus);

  // 무명 메서드로 즉석 조건 작성
  dinosaurs.RemoveAll(delegate (string data) { return (data == "Velociraptor" || data == "Gallimimus"); });

  // Sort도 마찬가지로 Comparison<T> 델리게이트를 받음
  sortList.Sort(delegate (int a, int b) { return a.CompareTo(b); });
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Find`와 `FindAll`의 차이는? (`Find`는 조건에 맞는 **첫 번째** 요소를 찾으면 즉시 멈추고, `FindAll`은 끝까지 순회해 조건에 맞는 **모든** 요소를 리스트로 반환)
  - 이 코드를 람다식으로 바꾸면 어떻게 되는가? (`dinosaurs.Find(s => s.EndsWith("saurus"))`처럼 훨씬 짧아짐 — 실제로 코드 주석에도 람다식 버전이 대안으로 적혀있음)
- **최신 동향**: `List<T>.Find`/`RemoveAll` 계열은 지금도 유효하지만, 최신 C# 코드는 이런 조건 기반 컬렉션 처리를 LINQ(`dinosaurs.Where(s => s.EndsWith("saurus"))`)로 표현하는 경우가 많아졌다 — LINQ는 더 다양한 컬렉션 연산(정렬, 그룹핑, 집계)을 일관된 문법으로 제공하기 때문.

### 5-15. UI 이벤트 후킹 인터페이스로 "클릭 관통" 버그 방지

- **한 줄 정의**: `IPointerEnterHandler`/`IPointerExitHandler` 같은 Unity UI 이벤트 인터페이스를 구현하면, 마우스가 UI 위에 있는지 여부 같은 상태를 코드로 감지할 수 있다 — 이를 이용해 "UI 버튼을 눌렀는데 그 아래 3D 월드의 총알 발사 로직까지 같이 실행되는" 흔한 버그를 막을 수 있다.
- **왜 중요한가**: 인터페이스(5-10번)를 게임플레이의 실제 문제 해결에 응용한 구체적 사례 — "왜 인터페이스를 쓰는가"에 대한 이론이 아닌 실전 답변이 됨.
- **내 코드에서 어떻게 썼는지**: `Study3/Hooking/MouseHover.cs`
  ```csharp
  public class MouseHover : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
  {
      public static MouseHover instance = null;
      public bool isUIHover = false;

      public void OnPointerEnter(PointerEventData eventData) { isUIHover = true; }
      public void OnPointerExit(PointerEventData eventData) { isUIHover = false; }
  }
  // 총알 발사 로직 쪽에서:
  // if (MouseHover.instance.isUIHover) return;   // UI 위라면 발사 취소
  ```
  `Study3/Hooking/csEventHookingAll.cs`는 이 아이디어를 더 확장해서 Unity UI가 제공하는 거의 모든 이벤트 인터페이스(`IBeginDragHandler`, `IDropHandler`, `IScrollHandler` 등)를 한 클래스에서 전부 구현해보며 각각 언제 호출되는지 실험한 참고용 스크립트.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이 방식과 5-1번의 `SendMessage`/`BroadcastMessage`의 차이는? (인터페이스 기반 이벤트는 컴파일 타임에 타입이 검증되고 리플렉션을 쓰지 않아 더 빠르고 안전 — Unity의 최신 UI 이벤트 시스템 자체가 `SendMessage`의 문제를 피하려고 이 인터페이스 방식으로 설계된 것)
  - 이 스크립트는 왜 `static instance`를 갖는가? (총알 발사 스크립트 등 다른 곳에서 "지금 마우스가 UI 위에 있는가"를 쉽게 물어볼 수 있도록 — 4-1번의 정적 인스턴스 매니저 패턴이 여기서도 그대로 쓰임)
- **최신 동향**: 인터페이스 기반 UI 이벤트 후킹은 지금도 Unity uGUI의 표준적인 확장 방법이다. 신형 Input System과 결합해 UI와 월드 입력을 더 명시적으로 분리하는 방식도 널리 쓰이지만, 이 인터페이스들 자체는 변화 없이 유효하다.

### 5-16. `MonoBehaviour` 싱글톤의 진화 — `Awake` 방식에서 제네릭 베이스 클래스로

- **한 줄 정의**: 5-8번에서 본 "각 싱글톤마다 `Awake`에 똑같은 코드를 반복해서 붙여넣는" 방식의 중복을 없애기 위해, 제네릭 베이스 클래스 `MonoSingleton<T>`를 한 번만 작성해두고 실제 매니저들은 `class MSingleton : MonoSingleton<MSingleton> { }`처럼 상속만 받으면 싱글톤 기능을 공짜로 얻게 만든 설계.
- **왜 중요한가**: 이 프로젝트에서 가장 정교한 설계 패턴 — "왜 같은 코드를 반복하지 않고 제네릭으로 뽑아냈는가", "자기 자신을 제네릭 인자로 넘기는 `where T : MonoSingleton3<T>`가 무슨 의미인가"까지 설명할 수 있으면 C# 제네릭에 대한 깊은 이해를 보여줄 수 있음.
- **내 코드에서 어떻게 썼는지**: `Study4/Singleton/MonoSingleton3.cs` (진화의 최종 버전)
  ```csharp
  // 자기 자신을 제네릭 인자로 넘기는 자가 참조 제약(C++의 CRTP와 같은 발상)
  public abstract class MonoSingleton3<T> : MonoBehaviour where T : MonoSingleton3<T>
  {
      private static T _Instance = null;
      public static T Instance
      {
          get
          {
              if (_Instance == null)
              {
                  _Instance = GameObject.FindObjectOfType(typeof(T)) as T;   // 씬에 이미 있으면 찾아옴
                  if (_Instance == null)
                      // 없으면 새 GameObject를 만들고 컴포넌트를 붙여서 생성(5-7번 - new 대신 AddComponent)
                      _Instance = new GameObject("Singleton_" + typeof(T)).GetComponent<T>();
                  DontDestroyOnLoad(_Instance);
              }
              return _Instance;
          }
      }
      protected virtual void Awake() { if (_Instance == null) { _Instance = this as T; _Instance.Init(); } }
      protected virtual void OnDestroy() { if (_Instance != null) { _Instance.Clear(); _Instance = null; } }
      private void OnApplicationQuit() { _Instance = null; }   // 앱 종료 시 참조 정리
      public virtual void Init() { }
      public virtual void Clear() { }
  }

  // 실제 사용
  public class MSingleton2 : MonoSingleton3<MSingleton2>
  {
      protected override void Awake() { base.Awake(); Debug.Log("부모/자식 다 호출"); }   // base 호출로 부모 로직도 함께 실행
      public override void Init() { Debug.Log(123); }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `where T : MonoSingleton3<T>`처럼 자기 자신을 제약 조건에 넣는 이유는? (이렇게 해야 베이스 클래스 안에서 `_Instance`를 정확히 자식 타입 `T`로 다룰 수 있고, `Instance` 프로퍼티가 `MonoSingleton3<T>`가 아니라 실제 자식 클래스 타입을 반환할 수 있게 됨 — 자식 클래스가 추가한 고유 메서드도 캐스팅 없이 바로 호출 가능)
  - 자식 클래스가 `Awake`를 재정의하면서 `base.Awake()`를 호출하지 않으면? (부모의 싱글톤 등록 로직 자체가 실행되지 않아 `_Instance`가 끝내 설정되지 않는 버그로 이어짐 — `MSingleton2`가 주석으로 "자식 클래스에 Awake 생략됨"과 "부모/자식 둘 다 호출" 두 버전을 비교해둔 이유)
  - `OnApplicationQuit`에서 `_Instance = null`을 하는 이유는? (앱이 종료되는 과정에서 오브젝트들이 파괴되는 순서는 보장되지 않는데, 이때 다른 싱글톤의 `OnDestroy`가 이미 파괴된 싱글톤의 `Instance`에 접근하려다 새로 재생성해버리는(FindObjectOfType로 못 찾아 또 만드는) 이상한 상황을 막기 위함 — Unity 싱글톤의 유명한 함정 중 하나)
- **최신 동향 (웹서칭 결과)**: 이런 제네릭 `MonoSingleton<T>` 베이스 클래스는 지금도 실무에서 널리 쓰이는 실용적인 패턴이다. 다만 프로젝트가 커질수록 "싱글톤 = 어디서나 접근 가능한 전역 상태"라는 근본적 문제(테스트 어려움, 숨겨진 의존성)가 부각되어, 최근에는 Zenject/VContainer 같은 의존성 주입(DI) 프레임워크로 옮기는 추세도 있다. 절충안으로 "실제 로직은 순수 C# 클래스에 두고, MonoBehaviour 싱글톤은 그 클래스를 Unity 생명주기에 연결해주는 얇은 어댑터 역할만 하게" 만드는 하이브리드 방식도 최근 많이 언급된다. ([Medium: Unity DI](https://medium.com/@yadavaman/elevating-unity-game-development-with-dependency-injection-22727cd5ddd5))

### 5-17. `var` 타입 추론과 무명 형식(Anonymous Type)

- **한 줄 정의**: `var`는 초기값으로부터 컴파일러가 타입을 추론하게 하는 키워드(cpp_핵심정리.md 16번의 `auto`와 동일한 발상)이고, 무명 형식(`new { Name = "홍길동", Age = 28 }`)은 이름을 붙이지 않고 그 자리에서 즉석으로 만드는 읽기 전용 데이터 묶음이다.
- **왜 중요한가**: "이름 없는 타입"이라는, C++에는 없는 C# 고유의 개념을 정확히 이해하고 있는지 확인하는 질문. "읽기 전용"이라는 말의 의미를 정확히 아는지(얕은 읽기전용 함정)까지 짚을 수 있으면 깊이를 보여줄 수 있음.
- **내 코드에서 어떻게 썼는지**: `Study4/VarStudy.cs`
  ```csharp
  var myInstance1 = new { Name = "홍길동", Age = 28 };
  // myInstance1.Age = 100;   // 컴파일 에러 - 무명 형식의 프로퍼티는 읽기 전용

  var myInstance2 = new { Subject = "수학", Scores = new int[] { 100, 90, 80, 70 } };
  myInstance2.Scores[0] = 10;   // 이건 됨! - Scores "자체"를 바꾸는 게 아니라 배열 내부 요소를 바꾸는 것이기 때문
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `myInstance2.Scores[0] = 10`이 왜 허용되는가? (무명 형식의 프로퍼티 자체(`Scores`가 가리키는 배열 참조)는 못 바꾸지만, 배열은 참조 타입이라 그 배열이 가리키는 내용물은 얼마든지 바꿀 수 있음 — "읽기 전용"이 얕은(shallow) 수준이라는 뜻)
  - `var`와 무명 형식을 실무에서 언제 쓰는가? (LINQ 쿼리 결과처럼 "그 자리에서 한 번만 쓰고 버릴 임시 데이터 묶음"을 표현할 때 유용 — 재사용할 데이터 구조라면 제대로 이름 있는 클래스/구조체로 만드는 것이 정석)
- **최신 동향**: `var`/무명 형식 모두 C#의 안정적인 핵심 기능으로 지금도 그대로 쓰인다. 특히 LINQ와 결합했을 때(`select new { ... }`) 진가를 발휘하는 조합이라는 점도 함께 알아두면 좋다.

---

**St3-B에서 확인한, 고쳐볼 만한 부분**

1. **`MonoSingleton3<T>`의 `Instance` 게터가 스레드 안전하지 않음** (5-16번 항목) — 두 스레드가 동시에 `Instance`를 처음 호출하면 `GameObject`가 중복 생성될 여지가 있음(다만 Unity API는 대부분 메인 스레드 전용이라 실무 영향은 제한적).
2. **인터페이스 다중 구현 예제(`PlayerState1`)의 필드가 캡슐화되지 않음** (5-10번 항목) — `int power`, `string userName`이 프로퍼티 뒤에 숨겨져 있긴 하지만, 다른 예제(`PlayerState2`)의 주석에 "public 접근자를 쓰지 않는 게 좋다"고 스스로 지적해둔 부분과 대조해서 볼 만함.

## St3-C. 에디터 확장 + AssetBundle (`Study5`)

### 5-18. 커스텀 메뉴 확장 — `[MenuItem]`

- **한 줄 정의**: 정적 메서드 위에 `[MenuItem("경로")]`를 붙이면 Unity 에디터의 메뉴/컨텍스트 메뉴에 새 항목이 추가되며, 단축키 지정, 같은 경로에 검증 함수를 등록해 메뉴 활성/비활성을 제어하는 것까지 가능하다.
- **왜 중요한가**: winapi_핵심정리.md에서 다룬 "메뉴 추가"(WinAPI 리소스 기반)와 원리는 비슷하지만, 여기서는 Unity 에디터 자체를 확장하는 관점 — 반복 작업을 자동화하는 사내 툴을 만드는 실무 역량으로 이어짐.
- **내 코드에서 어떻게 썼는지**: `Study5/Editor/ExportAssetBundles.cs`
  ```csharp
  [MenuItem("Build/Build AssetBundle #%&d")]   // Shift+Ctrl+Alt+D 단축키
  public static void BulidSceneToAssetBundle()
  {
      BuildPipeline.BuildAssetBundles("AssetBundles", BuildAssetBundleOptions.None, BuildTarget.StandaloneWindows64);
  }

  [MenuItem("CONTEXT/Rigidbody/Double Mass")]   // 컴포넌트 톱니바퀴 메뉴에 항목 추가
  static void DoubleMass(MenuCommand command)
  {
      Rigidbody body = (Rigidbody)command.context;
      body.mass *= 2;
  }

  // 검증 함수: 같은 경로 + true 인자 -> 메뉴 활성/비활성 결정
  [MenuItem("GameObject/MyCategory/Custom Game Object2", true)]
  static bool CreateCustomGameObjectCheak() { return Selection.activeObject.GetType() == typeof(SceneAsset); }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `[MenuItem]`이 붙는 메서드는 왜 반드시 `static`이어야 하는가? (에디터가 메뉴를 등록할 때 특정 인스턴스와 무관하게 호출해야 하므로 인스턴스 메서드로는 연결할 수 없음)
  - 검증 함수(`true` 인자 버전)가 하는 역할은? (실제 실행 함수를 호출하기 전에 먼저 호출되어, `false`를 반환하면 메뉴 항목이 비활성화(회색 처리)됨 — "지금 상황에서 이 명령을 실행해도 되는가"를 사전에 걸러줌)
- **최신 동향**: `[MenuItem]` 기반 에디터 확장은 Unity 에디터 툴링의 변함없는 표준 방법. 새 오브젝트를 만들 때 `Undo.RegisterCreatedObjectUndo`를 호출해 Ctrl+Z 실행취소 스택에 등록해주는 것도 지금까지 에디터 스크립트 작성 시의 정석 관행이다.

### 5-19. 커스텀 인스펙터 — `[CustomEditor]`/`OnInspectorGUI`

- **한 줄 정의**: `Editor` 클래스를 상속하고 `[CustomEditor(typeof(대상타입))]`을 붙인 뒤 `OnInspectorGUI()`를 오버라이드하면, 특정 컴포넌트의 인스펙터 화면 자체를 원하는 대로(버튼, 도움말 박스, 커스텀 필드 배치 등) 다시 그릴 수 있다.
- **왜 중요한가**: 기획자/아티스트가 쓰기 편한 도구를 만드는 실무 역량 — St3-D의 `PropertyDrawer`(개별 필드 단위 커스터마이징)와 짝을 이루는, 더 상위 단위(컴포넌트 전체)의 인스펙터 커스터마이징 기법.
- **내 코드에서 어떻게 썼는지**: `Study5/Editor/EditorCreate.cs`
  ```csharp
  [CanEditMultipleObjects]              // 여러 오브젝트 동시 선택 시에도 동작
  [CustomEditor(typeof(AutoMove))]
  public class EditorCreate : Editor
  {
      public override void OnInspectorGUI()
      {
          AutoMove autoM = (AutoMove)target;
          autoM.moveSpeed = EditorGUILayout.FloatField("hahaha", autoM.moveSpeed);   // 커스텀 라벨로 필드 노출
          if (GUILayout.Button("Origin Point")) autoM.OriginSet();                    // 버튼 -> 메서드 실행
          EditorGUILayout.HelpBox("안녕하세요!~ 좋은 하루!!~~~^^", MessageType.Info);

          if (GUI.changed) EditorUtility.SetDirty(target);   // 변경사항을 디스크 저장 대상으로 표시
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `EditorUtility.SetDirty(target)`를 호출하지 않으면 어떤 문제가 생기는가? (인스펙터에서 값을 바꿔도 Unity가 "저장해야 할 변경사항"으로 인식하지 못해, 씬을 저장하지 않고 닫으면 값이 사라질 수 있음)
  - `DrawDefaultInspector()`(주석 처리됨)와 직접 `EditorGUILayout` 필드를 하나하나 그리는 것의 차이는? (`DrawDefaultInspector()`는 원래 인스펙터 모습을 그대로 그려주고, 그 위에 커스텀 버튼 등을 추가하고 싶을 때 함께 씀 — 완전히 새로운 레이아웃을 원하면 이 코드처럼 필드를 하나하나 직접 배치)
- **최신 동향**: `CustomEditor`+IMGUI(`EditorGUILayout`) 조합은 지금도 표준. Unity 최신 버전은 이걸 UI Toolkit(`CreateInspectorGUI()`, `VisualElement` 기반)으로 작성하는 방식도 지원하기 시작했지만, 기존 IMGUI 방식도 폐기되지 않고 계속 쓰인다.

### 5-20. AssetBundle 빌드와 로드

- **한 줄 정의**: `BuildPipeline.BuildAssetBundles`로 에셋(프리팹, 씬 등)을 플랫폼별 바이너리 패키지(AssetBundle)로 미리 빌드해두고, 런타임에 `UnityWebRequestAssetBundle`로 필요할 때 다운로드/로드해서 쓰는 방식 — 앱을 다시 빌드/배포하지 않고도 콘텐츠를 갱신할 수 있게 해주는 핵심 기법.
- **왜 중요한가**: "게임을 업데이트할 때마다 스토어 심사를 다시 받지 않고 콘텐츠를 바꾸는 방법"이라는 실무적으로 중요한 질문에 대한 답. 캐싱, 비동기 로드, 메모리 관리(Unload)까지 한 번에 엮여있는 실전 주제.
- **내 코드에서 어떻게 썼는지**: `Study5/BundleLoad.cs`
  ```csharp
  while (!Caching.ready) yield return null;   // 캐시 시스템 준비 대기

  using (UnityWebRequest request = UnityWebRequestAssetBundle.GetAssetBundle(bundleURL, version, 0))
  {
      yield return request.SendWebRequest();   // 캐시에 있으면 캐시에서, 없으면 서버에서 다운로드
      AssetBundle bundle = DownloadHandlerAssetBundle.GetContent(request);

      AssetBundleRequest assetRequest = bundle.LoadAssetAsync<GameObject>("Cube 1");   // 번들 안 에셋을 비동기 로드
      yield return assetRequest;
      Instantiate(assetRequest.asset as GameObject);

      bundle.Unload(false);   // 반드시 언로드 - 안 하면 메모리에 계속 남고 중복 로드 시 에러
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `bundle.Unload(false)`와 `bundle.Unload(true)`의 차이는? (`false`는 이미 씬에 생성된(Instantiate된) 오브젝트는 유지한 채 번들 압축 데이터만 해제, `true`는 이미 만들어진 오브젝트까지 전부 파괴 — 잘못 쓰면 화면에 있던 오브젝트가 갑자기 깨져 보이는 버그로 이어짐)
  - `version` 파라미터는 왜 필요한가? (같은 URL이라도 버전이 다르면 캐시를 무시하고 새로 다운로드하게 만드는 기준 — 콘텐츠 갱신 시 버전을 올려서 클라이언트가 새 파일을 받게 함)
- **최신 동향 (웹서칭 결과)**: AssetBundle 시스템 자체는 지금도 Unity의 유효한 기반 기술이지만, Unity는 그 위에 의존성 관리·원격 호스팅·주소 기반 참조를 자동화한 **Addressables 시스템**을 공식 후속 기술로 제공하고 있어, 신규 프로젝트에서는 AssetBundle을 직접 다루기보다 Addressables를 우선 검토하는 것이 현재 권장 방향이다. 다만 Addressables도 내부적으로는 AssetBundle 위에서 동작하므로, 이 코드에서 다룬 캐싱/언로드 개념은 여전히 유효한 기초 지식이다. ([Unity Addressables 가이드](https://uhiyama-lab.com/en/notes/unity/unity-addressables-guide/))

### 5-21. Deprecated API 마이그레이션 실사례 2탄 — `WWW` → `UnityWebRequest`

- **한 줄 정의**: 네트워크 요청을 위해 예전엔 `WWW` 클래스(`WWW.LoadFromCacheOrDownload`)를 썼지만, Unity 2018.3부터 `[Obsolete]` 처리되어 더 효율적이고 기능이 많은 `UnityWebRequest`(`UnityWebRequestAssetBundle.GetAssetBundle`)로 대체되었다.
- **왜 중요한가**: ST_2의 `Application.loadedLevel`→`SceneManager` 사례에 이은 **두 번째 API 마이그레이션 실사례** — 오래된 Unity 코드베이스를 유지보수할 때 반복적으로 마주치는 패턴이라는 걸 두 번이나 직접 경험했다는 근거가 됨. 특히 이번엔 API 교체뿐 아니라 **에러 체크 방식 자체의 변화**(`isNetworkError`/`isHttpError` → `Result` enum)까지 조건부 컴파일로 두 버전을 공존시켜 다뤘다는 점이 한 단계 더 깊음.
- **내 코드에서 어떻게 썼는지**: `Study5/BundleLoad.cs`(옛 버전이 파일 하단에 전부 주석으로 보존되어 있어 비교 가능)
  ```csharp
  // 옛 버전 (Unity 2018.3부터 Obsolete)
  // WWW www = WWW.LoadFromCacheOrDownload(this.bundleURL, this.version);
  // if (www.error != null) { Debug.Log("fail :("); }

  // 현재 버전
  using (UnityWebRequest request = UnityWebRequestAssetBundle.GetAssetBundle(bundleURL, version, 0))
  {
      yield return request.SendWebRequest();
  #if UNITY_2020_1_OR_NEWER
      if (request.result != UnityWebRequest.Result.Success)      // 2020.1+ 새 방식
  #else
      if (request.isNetworkError || request.isHttpError)          // 구 방식
  #endif
      { Debug.LogError("fail :( " + request.error); yield break; }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `#if UNITY_2020_1_OR_NEWER` 같은 조건부 컴파일 지시문을 왜 쓰는가? (하나의 코드베이스가 여러 Unity 버전을 지원해야 할 때, 빌드 시점에 해당 버전에 맞는 코드만 골라 컴파일되게 함 — C/C++의 `#ifdef`(c_핵심정리.md 참고)와 원리가 같음)
  - `using (UnityWebRequest request = ...)` 처럼 `using` 블록으로 감싼 이유는? (네트워크 요청 객체가 다 쓰인 뒤 자동으로 `Dispose`되어 리소스가 확실히 정리됨 — C#의 `IDisposable` 패턴, 5-11번에서 언급한 결정적 자원 해제 방식)
- **최신 동향 (웹서칭 결과)**: `WWW` 클래스는 Unity 2018.3에서 Obsolete 처리된 이후 계속 유지보수되지 않는 상태이며, `UnityWebRequest`가 유일한 표준 네트워크 요청 API로 자리잡았다. 이 코드처럼 "옛날 방식"과 "현재 방식"을 한 파일에 나란히 남겨두는 습관은 실무에서 API 변화의 히스토리를 팀에 공유하는 좋은 문서화 방법이기도 하다. ([Unity WWW ScriptReference](https://docs.unity3d.com/ScriptReference/WWW.html))

---

**St3-C에서 확인한, 고쳐볼 만한 부분**

1. **`AutoMove.Instance` 프로퍼티가 게터(getter) 안에서 값을 변경함** (5-19번 관련) — `public float Instance { get { return moveSpeed = 3.0f; } }`는 "값을 읽기만 할 것"이라는 프로퍼티의 기본 기대를 깨고 부작용(side effect)을 일으킴. 커스텀 인스펙터에서 이 값을 표시할 때마다 `moveSpeed`가 3.0으로 덮어써지는 예상치 못한 동작으로 이어질 수 있어, 게터는 순수하게 값만 반환하도록 고치는 것이 안전.

## St3-D. 인벤토리 시스템 + 커스텀 에디터 툴 (`Study6`)

### 5-22. `ScriptableObject` 기반 데이터 정의 + 상속 계층

- **한 줄 정의**: `MonoBehaviour` 대신 `ScriptableObject`를 상속하면, 씬에 오브젝트를 배치하지 않고도 "데이터 그 자체"를 하나의 에셋 파일(.asset)로 프로젝트에 저장할 수 있다 — 아이템처럼 게임 로직과 무관하게 존재하는 데이터를 표현하기에 적합하며, 일반 클래스처럼 상속도 가능하다.
- **왜 중요한가**: "게임 데이터를 코드에 하드코딩하지 않고 에셋으로 분리하는" 실무 표준 설계 패턴(데이터 주도 설계). 기획자가 코드를 몰라도 새 아이템을 인스펙터에서 바로 추가할 수 있게 해주는 실질적 이점까지 설명할 수 있어야 함.
- **내 코드에서 어떻게 썼는지**: `Study6/Item/Item.cs`(기반) → `Equipment.cs`(장비류) → `Weapon.cs`(무기, 가장 구체적)
  ```csharp
  public class Item : ScriptableObject   // MonoBehaviour가 아니라 ScriptableObject
  {
      public enum ItemType { Default, Weapon, Armor, Ability, Food, Fuel, BuildItem, Coin, OtherItems, End }
      public virtual void Use() { /* 자식클래스에서 override로 재정의 */ }
  }
  public class Equipment : Item { public EquipmentSlot equipmentSlot; public override void Use() { base.Use(); } }

  [CreateAssetMenu(fileName = "New Item", menuName = "New Item/Weapon")]   // 우클릭 메뉴로 에셋 생성 가능하게
  public class Weapon : Equipment { public int damageUp; public override void Use() { base.Use(); /* 장착 로직 */ } }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `ScriptableObject`와 `MonoBehaviour`의 근본적인 차이는? (`MonoBehaviour`는 반드시 씬의 게임오브젝트에 붙어야 존재할 수 있지만, `ScriptableObject`는 독립된 에셋 파일로 프로젝트에 존재 — 씬을 넘나들며 공유되는 데이터, 실행 없이도 존재해야 하는 설정값에 적합)
  - 런타임에 `ScriptableObject` 에셋의 값을 직접 수정하면 위험한 이유는? (에셋 파일 자체가 바뀌어버려서, 플레이 모드를 끝내도 변경이 남아있거나(에디터에서), 여러 씬/오브젝트가 같은 에셋 인스턴스를 참조하고 있다면 의도치 않게 전부 영향을 받음 — "정의 데이터"와 "런타임 가변 상태"를 분리해야 하는 이유)
- **최신 동향 (웹서칭 결과)**: "정의(`ScriptableObject`)는 기획자를 위한 원본 데이터, 실제로 변하는 값(현재 개수, 내구도 등)은 별도의 런타임 인스턴스에 두라"는 것이 현재 권장되는 아키텍처다 — 이 코드의 `Item`이 정적인 정의 데이터(이름/설명/가격/모델)만 담고 있는 것은 이 원칙에 맞게 잘 설계된 부분. ([Unity 공식: Separate Game Data and Logic](https://unity.com/how-to/separate-game-data-logic-scriptable-objects))

### 5-23. 커스텀 `PropertyAttribute`+`PropertyDrawer` — 조건부 인스펙터 표시

- **한 줄 정의**: `PropertyAttribute`를 상속해 나만의 어트리뷰트(`[ShowIf(...)]`)를 정의하고, `PropertyDrawer`를 상속한 클래스에서 `.NET 리플렉션`으로 다른 필드/메서드의 값을 읽어와 "이 조건을 만족할 때만 이 필드를 그리거나 활성화한다"는 로직을 구현한 고급 에디터 확장.
- **왜 중요한가**: St3-C의 `[CustomEditor]`(컴포넌트 전체 커스터마이징)보다 더 세밀한 단위(필드 하나)를 다루는 기법이며, 리플렉션을 실전에 응용한 사례라 기술적 깊이를 보여주기 좋음.
- **내 코드에서 어떻게 썼는지**: `Study6/Item/ShowIfAttribute.cs`(어트리뷰트 정의) + `ShowIfAttributeDrawer.cs`(그리기 로직) + `Item.cs`(실제 사용)
  ```csharp
  // 사용하는 쪽: "showHideList1이 true일 때만 이 필드를 그린다"
  [ShowIf(ShowIfAttribute.ActionOnConditionFail.DontDraw, ShowIfAttribute.ConditionOperator.And, nameof(showHideList1))]
  public int id;

  // Drawer 쪽: 리플렉션으로 조건 필드/메서드를 찾아 값을 확인
  FieldInfo conditionField = GetField(target, condition);
  conditionValues.Add((bool)conditionField.GetValue(target));
  ...
  public override float GetPropertyHeight(SerializedProperty property, GUIContent label)
  {
      if (!meetsCondition && showIfAttribute.Action == ShowIfAttribute.ActionOnConditionFail.DontDraw)
          return 0;   // 높이를 0으로 만들어 아예 안 보이게
      return base.GetPropertyHeight(property, label);
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `GetPropertyHeight`가 0을 반환하는 것과 `OnGUI`에서 그냥 `return`(아무것도 안 그림)하는 것을 왜 둘 다 해줘야 하는가? (`GetPropertyHeight`는 "이 필드가 차지할 공간"을 미리 알려주는 역할이라, 이것도 0으로 맞춰주지 않으면 안 그려지는 필드 자리에 빈 공간이 남아버림)
  - `nameof(showHideList1)`을 문자열 `"showHideList1"` 대신 쓰는 이유는? (필드 이름이 바뀌면 리팩터링 도구가 `nameof`도 같이 바꿔주지만, 그냥 문자열은 컴파일러가 감지하지 못해 조용히 깨짐 — St3-A의 5-1번(`SendMessage`), St3-B의 4-2번(`InvokeRepeating`) 같은 "문자열 기반 API의 위험성" 논의와 정확히 같은 문제의식)
- **최신 동향**: `PropertyDrawer`/`PropertyAttribute` 기반 커스텀 인스펙터 필드는 지금도 Unity 에디터 확장의 표준 기법이다. 비슷한 목적의 검증된 서드파티 라이브러리(Odin Inspector 등)도 널리 쓰이지만, 이 코드처럼 직접 구현해본 경험은 그 라이브러리들이 내부적으로 어떻게 동작하는지 이해하는 데 큰 도움이 된다.

### 5-24. `OnValidate()`로 인스펙터 값 변경에 실시간 반응

- **한 줄 정의**: `OnValidate()`는 인스펙터에서 값이 바뀔 때마다(플레이 중이 아니어도) 에디터가 자동으로 호출해주는 콜백으로, "이 값이 바뀌면 다른 필드의 표시 여부도 같이 갱신한다" 같은 실시간 인스펙터 로직을 구현하는 데 쓰인다.
- **왜 중요한가**: 5-23번(ShowIf)이 실제로 언제 다시 평가되는지를 이해하는 데 필요한 짝꿍 개념 — "인스펙터 값을 바꿨는데 화면이 바로 갱신되는" 마법 같은 동작의 실체.
- **내 코드에서 어떻게 썼는지**: `Study6/Item/Item.cs`
  ```csharp
  void OnValidate()   // 인스펙터에서 값이 바뀔 때마다 호출됨
  {
      if (type == ItemType.Weapon) { showHideList1 = true; showHideList2 = false; }
      else if (type == ItemType.Armor) { showHideList2 = true; showHideList1 = false; }
      else if (type == ItemType.Ability) { showHideList1 = true; showHideList2 = true; }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `OnValidate()`와 `Awake()`/`Start()`의 차이는? (`Awake`/`Start`는 플레이 모드에서 게임이 실제로 실행될 때만 호출되지만, `OnValidate`는 에디터에서 인스펙터 값을 바꾸는 즉시, 플레이 모드가 아니어도 호출됨)
  - `OnValidate()` 안에서 무거운 연산을 하면 안 되는 이유는? (인스펙터에서 값을 조금만 조정해도 매번 호출되므로, 에디터 응답성이 크게 떨어질 수 있음)
- **최신 동향**: `OnValidate()`는 지금도 Unity의 표준 에디터 전용 콜백으로 변화 없이 쓰인다.

### 5-25. `EditorWindow` 심화 — 창 인스턴스 관리와 다양한 창 형태

- **한 줄 정의**: `EditorWindow`를 상속해 독립된 도구 창을 만들 때, 클릭할 때마다 새 창을 계속 만들 것인지(다중 인스턴스) 아니면 하나만 유지하고 재사용할 것인지(정적 참조로 관리하는 싱글톤 창)를 선택해야 하며, 상황에 따라 더 가벼운 `ScriptableWizard`(확인/취소 버튼이 기본 내장된 마법사 창)나 `PopupWindowContent`(다른 UI 옆에 붙는 팝업)를 쓸 수도 있다.
- **왜 중요한가**: St3-C에서 다룬 `EditorWindow` 기초를 넘어, "이 도구가 여러 개 떠 있어도 되는가"라는 실무적 판단까지 고려한 설계 감각을 보여줌.
- **내 코드에서 어떻게 썼는지**: `Study6/정리.cs`(여러 버전을 순서대로 실험한 학습 기록), `Study6/Editor/SlotMaker.cs`(최종 버전)
  ```csharp
  // 클릭할 때마다 새 창이 계속 생기는 버전
  static void CreateWindow() { EditorWindow.CreateInstance<SlotMaker>().Show(); }

  // 하나만 유지되는 "싱글톤 창" 버전 (정적 참조로 이미 열려있는지 확인)
  static SlotMaker slotMakerWindow;
  static void CreateWindow() { if (!slotMakerWindow) { /* 새로 생성 */ } }

  // 창 자체에 우클릭 컨텍스트 메뉴 추가
  public class SlotMaker : EditorWindow, IHasCustomMenu
  {
      public void AddItemsToMenu(GenericMenu menu)
      {
          menu.AddItem(new GUIContent("CONTEXT MENU1"), true, () => { Debug.Log("CONTEXT MENU1"); });
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `ScriptableWizard`와 일반 `EditorWindow`의 차이는? (`ScriptableWizard`는 `public`/`[SerializeField]` 필드를 자동으로 인스펙터처럼 그려주고 확인/취소 버튼까지 기본 제공 — 간단한 입력 몇 개 받아서 즉시 실행하는 마법사류 도구에 적합. `EditorWindow`는 완전히 자유로운 레이아웃이 필요할 때)
  - 다중 인스턴스 창과 싱글톤 창 중 어느 쪽이 더 나은가? (도구가 상태를 갖지 않고 매번 새로 시작해도 무방하면 다중 인스턴스도 무해하지만, 도구 자체가 어떤 작업 상태(선택된 오브젝트 리스트 등)를 유지해야 한다면 창이 여러 개 떠서 상태가 꼬이는 걸 막기 위해 싱글톤 창으로 관리하는 것이 안전)
- **최신 동향**: `EditorWindow`/`ScriptableWizard`/`PopupWindowContent` 모두 지금도 유효한 Unity 에디터 확장 API. UI Toolkit이 이 영역에도 점차 도입되고 있지만 기존 IMGUI 기반 방식은 계속 지원된다.

### 5-26. `Resources.FindObjectsOfTypeAll<T>()`로 런타임+에디터 오브젝트 전체 검색

- **한 줄 정의**: 일반적인 `FindObjectsOfType<T>()`는 활성화된 씬의 런타임 오브젝트만 찾지만, `Resources.FindObjectsOfTypeAll<T>()`는 비활성 오브젝트, 에디터 전용 오브젝트(예: `SceneView`)까지 전부 포함해서 검색하는 더 강력한(대신 더 무거운) 디버깅/에디터 도구용 API다.
- **왜 중요한가**: "찾고 싶은 오브젝트가 안 보일 때 쓸 수 있는 최후의 수단"을 아는지 확인하는 실전 팁 — 일반 검색 API의 한계를 정확히 이해하고 있어야 왜 이 API가 필요한지 알 수 있음.
- **내 코드에서 어떻게 썼는지**: `Study6/Editor/GetWindow.cs`
  ```csharp
  // 씬의 모든 Light(비활성 포함)를 에디터 도구에서 검색
  var sceneViews = Resources.FindObjectsOfTypeAll<Light>();
  str = sceneViews.Length.ToString();
  sceneViews[3].enabled = false;   // 찾은 오브젝트를 바로 조작
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이 함수를 일반 게임 로직(런타임)에서 자주 쓰면 안 되는 이유는? (프로젝트 전체를 뒤지는 무거운 연산이라, 매 프레임 호출하면 심각한 성능 저하로 이어짐 — 에디터 도구/디버깅처럼 "가끔, 사람이 버튼을 눌렀을 때"에만 적합)
  - `FindObjectsOfType<T>()`와의 차이를 실무에서 어떻게 판단하는가? (평소엔 가벼운 `FindObjectsOfType`로 충분하고, "분명히 씬에 있는데 안 찾아진다"(비활성 상태이거나 에디터 전용 오브젝트라서)는 상황에서만 이 API로 확장)
- **최신 동향**: 이 API 자체는 지금도 유효하지만, 최신 Unity(2023.1+)에서는 `Object.FindObjectsOfType`가 `FindObjectsByType`로 대체되며 정렬 옵션을 명시하도록 시그니처가 바뀌는 등 관련 API가 계속 다듬어지고 있다 — **확인 필요**: `Resources.FindObjectsOfTypeAll` 자체가 이 개편의 영향을 받았는지는 프로젝트의 정확한 Unity 버전을 확인해야 함.

### 5-27. Deprecated API 마이그레이션 3탄 — `[PreferenceItem]` → `[SettingsProvider]`

- **한 줄 정의**: Unity의 Preferences(환경설정) 창에 프로젝트 전용 설정 탭을 추가하던 옛 방식 `[PreferenceItem]`이 Unity 2018.3에서 폐기되고, 더 유연한 `[SettingsProvider]`로 대체되었다.
- **왜 중요한가**: 이 학생의 코드에서만 **세 번째로 발견된** Deprecated API 마이그레이션 사례(①`Application.loadedLevel`→`SceneManager`, ②`WWW`→`UnityWebRequest`, ③이번 것) — 우연이 아니라 "오래전에 만들어진 학습 자료/예제를 최신 Unity 버전에서 그대로 따라 하면 이런 경고를 반복해서 마주친다"는 것을 보여주는 좋은 증거이자, 매번 공식 대안을 찾아 스스로 교체해온 태도를 보여줌.
- **내 코드에서 어떻게 썼는지**: `Study6/Editor/PrejectSetting.cs`
  ```csharp
  //[PreferenceItem] // 에디터 전체셋팅을 위한 Preferences에 메뉴를 추가하는 속성이 deprecated 되었네;;;
  [SettingsProvider]   // 이걸 쓰면 된다
  static SettingsProvider ProjectSettingGUI()
  {
      var provider = AssetSettingsProvider.CreateProviderFromAssetPath("Project/Peace", "Assets/Study6/Item/CreateEditorWindow.asset");
      return provider;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `[SettingsProvider]`가 `[PreferenceItem]`보다 나은 점은? (검색 가능한 설정 창 통합, Project Settings/Preferences 양쪽에 유연하게 배치 가능, 에셋 파일과 직접 연동(`AssetSettingsProvider`) 등 더 풍부한 기능 제공)
- **최신 동향 (웹서칭 결과)**: `[PreferenceItem]`은 Unity 2018.3부터 공식적으로 Deprecated 처리되었고 `[SettingsProvider]`가 그 자리를 대체한 지 오래다. 세 번째 마이그레이션 사례까지 겹치는 걸 보면, 이 커리큘럼 자료 자체가 여러 Unity 버전에 걸쳐 누적되어온 것으로 보이며, "오래된 자료로 공부할 때는 컴파일러/에디터 경고를 무시하지 말고 그때그때 공식 문서에서 대안을 찾아 교체하는 습관"이 이 학생에게 실제로 체득되어 있다는 근거로 면접에서 언급할 만하다. ([Unity Discussions: PreferenceItem deprecated](https://forum.unity.com/threads/preferenceitem-is-deprecated-use-settingsprovider-instead.554437/))

---

**St3-D에서 확인한, 고쳐볼 만한 부분**

1. **`ItemManager`(MonoBehaviour)가 런타임 코드에서 에디터 전용 API를 사용** — `using UnityEditor;`와 `AssetDatabase.LoadAssetAtPath`를 `MonoBehaviour`의 `Awake()`에서 호출하고 있는데, `AssetDatabase`는 에디터 전용 API라 실제 빌드(플레이어)에는 포함되지 않음 — 이 스크립트는 에디터에서는 동작하지만 빌드하면 컴파일조차 되지 않거나(UnityEditor 참조 시 빌드 실패) 크래시로 이어질 수 있는 실질적 버그. 런타임에 에셋을 로드하려면 `Resources.Load`나 Addressables를 써야 함.
2. **`Item.cs`의 `new public string name`** — 부모(`ScriptableObject`가 상속하는 `UnityEngine.Object`)의 `name` 프로퍼티를 `new` 키워드로 의도적으로 가림(재정의가 아니라 "숨기기"). 다형성이 적용되지 않는 방식이라, `Item` 타입이 아니라 `Object`/`ScriptableObject` 타입 변수로 이 인스턴스를 다루면 원래의 `name`이 호출되는 혼란의 소지가 있음.

## St3-E. 프로시저럴 메시 생성 + 커스텀 기즈모 (`Study7`)

### 5-28. `OnDrawGizmos()` — 씬 뷰 디버그 시각화

- **한 줄 정의**: `OnDrawGizmos()`는 게임을 실행하지 않아도 씬 뷰에 도형(구, 선, 와이어프레임 등)을 그려주는 콜백으로, 콜라이더 범위나 AI 감지 반경처럼 눈에 보이지 않는 값을 시각적으로 확인하는 데 쓰인다.
- **왜 중요한가**: 디버깅을 `Debug.Log` 텍스트에만 의존하지 않고 시각적으로 하는 습관 — 특히 위치/범위/방향 관련 버그를 훨씬 빠르게 찾을 수 있게 해줌.
- **내 코드에서 어떻게 썼는지**: `Study7/CreateGizmo.cs`
  ```csharp
  public Color Mycolor = new Color(1f, 0f, 0f, 0.0f);
  public float Myraduis = 0.0f;

  void OnDrawGizmos()
  {
      Gizmos.color = Mycolor;
      Gizmos.DrawSphere(transform.position, Myraduis);   // 게임 실행 여부와 무관하게 씬 뷰에 항상 표시
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `OnDrawGizmos()`와 `OnDrawGizmosSelected()`의 차이는? (`OnDrawGizmos`는 항상 그려지고, `OnDrawGizmosSelected`는 그 오브젝트를 선택했을 때만 그려짐 — 씬에 오브젝트가 많을 때 항상 다 그리면 뷰가 지저분해지고 무거워지므로, 상황에 따라 골라 씀)
  - 기즈모는 빌드된 게임(실제 플레이어)에도 보이는가? (아니오 — 에디터 전용 시각화 도구이며 최종 빌드에는 포함되지 않음)
- **최신 동향**: `Gizmos`/`OnDrawGizmos`는 지금도 Unity 에디터 디버깅의 표준 기법으로 변화가 없다.

### 5-29. 프로시저럴 메시 생성 — `Mesh`를 코드로 직접 구성

- **한 줄 정의**: 3D 모델링 툴 없이, 정점 배열(`vertices`)·UV 좌표(`uv`)·법선(`normals`)·삼각형 인덱스(`triangles`)를 코드로 직접 채운 `Mesh` 객체를 `MeshFilter`에 할당해서 원하는 형태의 3D 도형을 런타임에 만들어내는 기법.
- **왜 중요한가**: 지형, 커스텀 UI 셰이프, 절차적 생성 콘텐츠(로그라이크 던전 등)의 기반 기술. "메시가 실제로 어떤 데이터로 이루어져 있는가"를 밑바닥부터 이해하고 있다는 증거가 됨.
- **내 코드에서 어떻게 썼는지**: `Study7/MeshCreate.cs`
  ```csharp
  Mesh mesh = new Mesh();
  mesh.vertices = vertices;                              // 정점 위치들
  mesh.uv = new Vector2[] { new Vector2(0,1), new Vector2(1,1), new Vector2(1,0), new Vector2(0,0) };
  mesh.normals = new Vector3[] { Vector3.back, Vector3.back, Vector3.back, Vector3.back };
  mesh.triangles = new int[] { 0, 1, 2,  2, 3, 0 };        // 정점 인덱스로 삼각형 2개(=사각형) 구성

  mesh.RecalculateBounds();    // 충돌/컬링 판정을 위한 경계 상자 재계산
  mesh.RecalculateNormals();   // 조명 계산을 위한 법선 재계산
  meshFilter.mesh = mesh;      // 최종적으로 렌더러에 반영
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `triangles` 배열의 `{0, 1, 2, 2, 3, 0}`이 의미하는 것은? (정점 0-1-2로 삼각형 하나, 정점 2-3-0으로 삼각형 하나 — 사각형은 삼각형 2개의 조합으로 표현된다는, 3D 그래픽스의 기본 원리)
  - 정점의 순서(시계/반시계 방향, winding order)가 왜 중요한가? (그 순서로 삼각형의 "앞면"이 결정됨 — 순서가 뒤바뀌면 면이 반대 방향을 보게 되어 컬링되어(안 보이게) 버리는 흔한 실수)
- **최신 동향 (웹서칭 결과)**: `mesh.vertices = 배열` 방식은 지금도 동작하지만, Unity 5.2 이후 도입된 `mesh.SetVertices()`(리스트를 받아 불필요한 배열 재할당을 줄임)가 빈번하게 메시를 갱신하는 상황(이 코드처럼 `Update()`에서 매 프레임 메시를 새로 만드는 경우)에서는 더 효율적인 대안으로 언급된다. 대규모/고성능 절차적 메시가 필요하면 Job System+`Mesh.MeshData` API(Unity 2020+)까지 고려하는 것이 최신 방향이다. ([Unity Discussions: SetVertices vs vertices](https://discussions.unity.com/t/new-mesh-setvertices-vs-old-mesh-vertices-array-versus-list-and-mobile-performance/907035))

### 5-30. 종합 예제 — 기즈모로 정점을 드래그해 실시간으로 메시 재구성

- **한 줄 정의**: 5-28번(기즈모)과 5-29번(프로시저럴 메시)을 결합해서, 메시의 각 정점 위치에 기즈모 컴포넌트가 붙은 빈 게임오브젝트를 만들어두고, 사용자가 씬 뷰에서 그 점들을 드래그하면 `Update()`가 매 프레임 그 위치들을 읽어 메시를 다시 그려주는 미니 모델링 툴.
- **왜 중요한가**: 이 폴더의 개념들이 실제로 하나의 도구로 합쳐지는 과정을 보여주는, `Study7`의 대표 예제. "여러 기본기를 조합해 하나의 도구를 만들 수 있는가"를 보여주는 좋은 사례.
- **내 코드에서 어떻게 썼는지**: `Study7/MeshCreate.cs`
  ```csharp
  void Start()
  {
      for (int i = 0; i < 4; i++)
      {
          pos[i] = new GameObject("Pos");
          pos[i].transform.parent = this.transform;
          pos[i].transform.localPosition = /* 정점 초기 위치 */;
          pos[i].AddComponent<CreateGizmo>();   // 각 정점을 씬 뷰에서 보이고 클릭 가능하게 만듦
      }
  }

  void Update()
  {
      // 매 프레임 각 포인트 오브젝트의 현재 위치를 읽어 메시를 다시 구성
      vertices = new Vector3[] { pos[0].transform.localPosition, pos[1].transform.localPosition, ... };
      mesh.vertices = vertices;
      meshFilter.mesh = mesh;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 매 프레임(`Update()`)마다 `new Mesh()`로 새로 만드는 대신 어떻게 최적화할 수 있는가? (기존 메시 객체를 재사용하며 `mesh.vertices`만 갱신하거나, 정점이 실제로 움직였을 때만 갱신하도록 변경 감지 로직을 추가할 수 있음)
  - 이 도구가 실제 게임에도 유용할까, 아니면 순수 학습용인가? (레벨 에디터, 커스텀 지형 툴의 축소판이라고 볼 수 있음 — 실제로 이런 방식으로 간단한 지형/장애물 편집 도구를 만드는 인디 게임 사례도 있음)
- **최신 동향**: 이런 "씬 뷰에서 직접 조작하며 즉시 결과를 보는" 에디터 도구 제작 방식은 지금도 유효한 접근이며, 더 정교하게 만들려면 `Handles` 클래스(커스텀 `Editor`의 `OnSceneGUI`)로 드래그 핸들 자체를 더 세밀하게 그리는 방향으로 발전시킬 수 있다(ST_2의 3DSortEditor/Rope 에디터가 실제로 이 `Handles` 방식을 썼던 것과 연결됨).

### 5-31. `[ContextMenu]`로 인스펙터 우클릭 메뉴에 함수 노출

- **한 줄 정의**: 메서드 위에 `[ContextMenu("표시할 이름")]`을 붙이면, 그 컴포넌트의 인스펙터 톱니바퀴(⋮) 메뉴에 항목이 추가되어 에디터에서 바로 그 함수를 실행할 수 있다 — St3-C/D에서 다룬 `[MenuItem]`(에디터 전역 메뉴), `[CustomEditor]`(인스펙터 전체 재작성), `[CustomPropertyDrawer]`(필드 단위)에 이은 네 번째 에디터 확장 어트리뷰트.
- **왜 중요한가**: 별도의 커스텀 에디터 클래스를 만들 필요 없이, 컴포넌트 스크립트 안에 메서드 하나만 추가하면 바로 에디터에 노출되는 가장 가벼운 확장 방법 — "언제 무거운 방법(`CustomEditor`)과 가벼운 방법(`ContextMenu`) 중 뭘 쓸지" 판단 기준을 보여줌.
- **내 코드에서 어떻게 썼는지**: `Study7/MeshCreate.cs`
  ```csharp
  [ContextMenu("Point Reset")]
  void FuncStart()
  {
      // 모든 정점 위치를 초기 상태로 되돌림
      for (int i = 0; i < 4; i++) { pos[i].transform.localPosition = /* 초기 위치 */; }
      Debug.Log("Point Reset");
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `[ContextMenu]`와 별도의 `[CustomEditor]`+버튼(St3-C의 5-19번) 중 언제 뭘 쓰는가? (한두 개의 간단한 "실행 버튼"만 필요하면 `[ContextMenu]`가 훨씬 간단 — 복잡한 레이아웃, 실시간 값 표시, 조건부 UI가 필요하면 `CustomEditor`가 필요)
  - 플레이 모드가 아닐 때도 이 메뉴가 동작하는가? (동작함 — 에디터 명령이므로 플레이 여부와 무관하게 실행 가능, 다만 코드 안에서 플레이 모드 전용 API를 쓰면 에디터 모드에서는 에러가 날 수 있음)
- **최신 동향**: `[ContextMenu]`는 지금도 가장 가벼운 에디터 확장 방법으로 표준적으로 쓰인다.

### 5-32. 런타임 메시를 에셋 파일로 저장

- **한 줄 정의**: 코드로 만들거나 수정한 `Mesh`를 그냥 메모리에만 두지 않고, `EditorUtility.SaveFilePanelInProject`로 저장 위치를 사용자에게 물어본 뒤 `AssetDatabase.CreateAsset`으로 프로젝트의 영구적인 `.asset` 파일로 저장하는 기법 — 여기에 메시의 피벗(기준점)을 재조정하는 로직까지 포함.
- **왜 중요한가**: "런타임 데이터"와 "영구 저장되는 에셋"의 경계를 넘나드는 에디터 툴 제작의 핵심 — St3-D의 `ScriptableObject` 에셋 생성과 같은 맥락(코드로 만든 데이터를 파일로 고정)의 다른 사례.
- **내 코드에서 어떻게 썼는지**: `Study7/SelectMeshSave.cs`
  ```csharp
  // 피벗을 메시 경계의 특정 지점으로 재조정
  Vector3 diff = Vector3.Scale(newMesh.bounds.extents, new Vector3(0, 0, -1));
  obj.transform.position -= Vector3.Scale(diff, obj.transform.localScale);
  Vector3[] verts = newMesh.vertices;
  for (int i = 0; i < verts.Length; i++) verts[i] += diff;   // 모든 정점을 피벗 이동만큼 보정
  newMesh.vertices = verts;

  string fileName = EditorUtility.SaveFilePanelInProject("Save Mesh", "mesh", "asset", "");
  AssetDatabase.CreateAsset(newMesh, fileName);   // 실제 .asset 파일로 영구 저장
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 오브젝트의 위치는 그대로 두고 정점만 옮기면 안 되는 이유는? (피벗을 옮기고 싶다는 건 "물체는 그 자리에 그대로 보이되, 회전/스케일의 기준점만 바꾸고 싶다"는 의도이므로, 정점을 옮긴 만큼 오브젝트의 트랜스폼 위치도 반대로 보정해줘야 시각적으로 제자리에 남아있음 — 이 둘을 함께 하지 않으면 물체가 순간이동한 것처럼 보임)
  - 왜 `sharedMesh`가 아니라 새 `Mesh`(`newMesh`)를 만들어서 저장하는가? (원본 메시 에셋을 직접 수정하면 그 메시를 참조하는 다른 모든 오브젝트에도 영향을 주므로, 복사본을 만들어 독립적인 새 에셋으로 저장하는 것이 안전)
- **최신 동향**: 메시를 코드로 조작해 에셋으로 저장하는 워크플로우는 지금도 유효한 에디터 툴 제작 패턴이다.

---

**St3-E에서 확인한, 고쳐볼 만한 부분**

1. **`Update()`에서 매 프레임 `new Mesh()`** (5-30번 항목) — 정점이 움직이지 않을 때도 매 프레임 새 메시 객체를 생성해 가비지 컬렉션 부담을 유발함. 변경 여부를 감지해서 실제로 움직였을 때만 갱신하도록 최적화할 여지가 있음.

---

## St3 종합 (Study1~7 관통 요약)

St3 전체(60개 스크립트, 6676줄, 5단계)를 관통해서 반복적으로 등장한 흐름들:

- **`MonoBehaviour`는 `new`로 못 만든다는 제약 하나가 계속 다른 문제를 만들어냄**: 5-7번(발견) → 5-8번(그래서 싱글톤이 이상하게 생김) → 5-16번(그래서 제네릭 베이스 클래스로 진화) → 5-22번(그래서 데이터는 아예 `ScriptableObject`로 분리) 순서로 하나의 제약이 프로젝트 전체의 설계에 어떻게 영향을 미치는지 이어서 볼 수 있음.
- **문자열/이름 기반 API의 반복된 위험성**: `SendMessage`(5-1) → `StartCoroutine("이름")`(St2, 2-8) → `InvokeRepeating`(4-6) → `nameof`로 회피(5-23)까지, "이름으로 호출하는 방식은 편하지만 리팩터링에 취약하다"는 하나의 교훈이 여러 프로젝트에 걸쳐 반복 확인됨.
- **Deprecated API 마이그레이션을 세 번이나 직접 경험**: `Application.loadedLevel`→`SceneManager`(ST_2) / `WWW`→`UnityWebRequest`(5-21) / `[PreferenceItem]`→`[SettingsProvider]`(5-27) — 오래된 학습 자료로 공부하면서 API 변화에 실제로 부딪히고 그때마다 공식 대안을 찾아 교체해온 이력이 뚜렷함.
- **에디터 확장 어트리뷰트 4종 세트**: `[MenuItem]`(전역 메뉴, 5-18) → `[CustomEditor]`(인스펙터 전체, 5-19) → `[CustomPropertyDrawer]`(필드 단위, 5-23) → `[ContextMenu]`(가장 가벼운 단일 기능, 5-31) — 커스터마이징 범위에 따라 무엇을 골라야 하는지 스펙트럼으로 정리 가능.
- **C의 매크로/C++의 인라인·CRTP → C#의 델리게이트/제네릭 자가참조 제약으로 이어지는 개념 전이**: c_핵심정리.md/cpp_핵심정리.md에서 다룬 개념이 언어를 바꿔가며 형태만 달리해 반복 등장 — 이 정리 5개 파일 전체를 관통하는 "5개 파일 관통 종합 정리" 단계에서 더 깊게 다룰 소재.

---

# 6. 3D_ST1 (2026-04-07)

> `C:\Study\Unity\3D_ST1\Assets` — 스크립트 66개 중 대부분(`Ch2/Standard Assets`)이 Unity의 옛 공식 "Standard Assets" 패키지(FirstPersonController, ThirdPersonController, CrossPlatformInput, Water 등)이고, `Ch3/Study5/FT_MagicEffect_Vol04`·`Ch2/Maps/.../atsV2`는 에셋스토어 서드파티 패키지라 정리에서 제외했다. 실제 학생 코드는 `Ch1/OpenManager.cs`, `Ch2/Ch2PlayerCtrl.cs`, `Ch3/Study1~5`의 일부 스크립트뿐이라 이 파일들만 다룬다.
> `Ch3/Study1/AnimationEvevnt.cs`는 `St3(ST_2)`에서 이미 다룬 `AnimationEvent.cs`(`Animator.StringToHash`/`GetCurrentAnimatorStateInfo` 실험)와 완전히 동일한 내용이라 별도 항목 없이 이 각주로만 남긴다.

## 6-1. `VideoPlayer` + 씬 전환 — 인트로 영상 재생

- **한 줄 정의**: `VideoPlayer` 컴포넌트로 인트로/컷신 영상을 재생하고, `video.isPlaying`이 꺼지는 시점을 감지해 다음 씬으로 자동 전환하는 패턴.
- **왜 중요한가**: 로고/인트로 영상 → 메인 게임으로 이어지는 거의 모든 상용 게임의 시작 흐름을 구현하는 기본기.
- **내 코드에서 어떻게 썼는지**: `Ch1/OpenManager.cs`
  ```csharp
  public VideoPlayer video;
  void Start() { video.Play(); }
  void Update()
  {
      if (!video.isPlaying)   // 영상이 끝나면
          SceneManager.LoadScene("scCh2");
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Update()`에서 매 프레임 `isPlaying`을 검사하는 대신 쓸 수 있는 더 나은 방법은? (`VideoPlayer.loopPointReached` 이벤트를 구독하면 영상이 끝나는 그 순간에만 콜백이 호출되어, 매 프레임 폴링(St1의 1-8번, ST_2의 3-6번과 같은 논의)할 필요가 없어짐)
  - 영상을 스킵할 수 있게 하려면 무엇을 추가해야 하는가? (아무 키 입력을 감지해서 `video.Stop()` 후 바로 씬을 전환하는 분기 추가)
- **최신 동향**: `VideoPlayer`는 지금도 Unity의 표준 동영상 재생 컴포넌트로 변화 없이 쓰인다.

## 6-2. `CharacterController` 기반 3D 이동

- **한 줄 정의**: `Rigidbody`+`AddForce`(물리 기반)와 달리, `CharacterController.Move()`는 물리 엔진을 거치지 않고 매 프레임 직접 위치를 이동시키는 "운동학적(kinematic)" 캐릭터 이동 방식 — 경사면/계단 오르기를 컴포넌트가 알아서 처리해준다.
- **왜 중요한가**: 지금까지 본 이동 방식(ST_2/St5 계열의 `AddForce`)과 전혀 다른 접근이라, "언제 어떤 이동 방식을 골라야 하는가"라는 실무적 판단 기준을 세울 수 있게 해줌.
- **내 코드에서 어떻게 썼는지**: `Ch2/Ch2PlayerCtrl.cs`
  ```csharp
  private CharacterController controller;
  void Update()
  {
      if (controller.isGrounded)   // 땅에 닿아있는지는 컨트롤러가 알아서 판정
      {
          MoveDir = new Vector3(0, 0, Input.GetAxis("Vertical"));
          MoveDir = transform.TransformDirection(MoveDir);   // 로컬(캐릭터 기준) -> 월드 좌표 방향으로 변환
          MoveDir *= speed;
          if (Input.GetButton("Jump")) MoveDir.y = jumpSpeed;
      }
      MoveDir.y -= gravity * Time.deltaTime;   // 중력은 직접 누적해줘야 함(물리 엔진이 대신 안 해줌)
      controller.Move(MoveDir * Time.deltaTime);
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `CharacterController`를 쓰면서 왜 중력을 직접 계산해서 더해줘야 하는가? (물리 엔진의 `Rigidbody`가 아니므로 중력이 자동으로 적용되지 않음 — 운동학적 이동이라 개발자가 원하는 움직임을 전부 명시적으로 계산해야 함)
  - `TransformDirection`은 왜 필요한가? (`Input.GetAxis`로 얻은 값은 "캐릭터가 보는 방향 기준"(로컬) 전후좌우인데, 실제로 캐릭터를 옮기려면 "세계 기준"(월드) 좌표가 필요하므로 변환이 필요함)
  - `CharacterController`와 `Rigidbody` 이동 중 어느 쪽을 골라야 하는가? (즉각적이고 예측 가능한 움직임, 계단/경사 자동 처리가 필요하면 `CharacterController` — 관성, 미끄러짐, 다른 물체에 물리적으로 밀리는 등 "진짜 물리 반응"이 필요하면 `Rigidbody`)
- **최신 동향 (웹서칭 결과)**: 두 방식 모두 지금도 유효하며 우열이 아니라 용도의 차이로 다뤄진다 — 캐릭터가 스냅되듯 즉각 반응해야 하는 액션/플랫포머류는 `CharacterController`가, 관성·충돌 반응이 중요한 물리 기반 게임은 `Rigidbody`가 여전히 선호된다. 다만 `CharacterController`는 캡슐 콜라이더 형태가 고정되어 있어 인간형이 아닌 캐릭터에는 잘 안 맞는다는 한계가 실무에서 자주 언급된다. ([Rigidbody vs CharacterController 비교](https://medium.com/@shubhamsinghsengar8/rigidbody-vs-character-controller-which-one-to-select-for-your-character-player-1362b262b0bb))

## 6-3. 레거시 `Animation` 컴포넌트 — `CrossFade`/`PlayQueued`

- **한 줄 정의**: `Animator`+Animator Controller(상태 머신 기반)가 표준이 되기 전, Unity는 `Animation` 컴포넌트에 애니메이션 클립을 직접 연결하고 `CrossFade`(부드러운 전환)/`PlayQueued`(순서대로 재생 예약)로 제어하는 더 단순한 시스템을 썼다.
- **왜 중요한가**: 지금까지의 모든 프로젝트가 `Animator`를 썼는데, 이 프로젝트에서 처음으로 그 이전 세대 시스템을 직접 다뤄봄 — "레거시 코드베이스를 유지보수하다 옛날 애니메이션 시스템을 마주치면 당황하지 않을 수 있는" 실무 대비.
- **내 코드에서 어떻게 썼는지**: `Ch3/Study2/Anim_L.cs`
  ```csharp
  [System.Serializable]
  public class Anim { public AnimationClip idle, run, attack1, attack2, attack3, attack4; }   // 클립들을 묶어 인스펙터에 노출

  private Animation _anim;   // Animator가 아니라 Animation(레거시)
  void Awake() { _anim = GetComponentInChildren<Animation>(); _anim.clip = anims.idle; }

  // 부드러운 전환(크로스페이드)
  _anim.CrossFade(anims.attack1.name, 0.35f);

  // 여러 애니메이션을 순서대로 재생 예약
  _anim.PlayQueued(anims.attack1.name, QueueMode.PlayNow);
  _anim.PlayQueued(anims.attack2.name, QueueMode.CompleteOthers);   // 앞 애니메이션이 끝나면 이어서
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `_anim["Attack1"].speed = 0.5f`처럼 인덱서로 접근하는 문법은 무엇을 의미하는가? (연결된 특정 애니메이션 클립의 재생 상태(`AnimationState`)에 접근해서 그 클립만의 속도/가중치 등을 개별 조정)
  - `Animator`(상태 머신 기반)와 `Animation`(클립 직접 재생)의 근본적인 차이는? (`Animator`는 상태 전환 조건(Transition)을 시각적 그래프로 정의하고 파라미터로 제어하는 반면, `Animation`은 코드에서 직접 "이 클립을 지금 재생해라"고 명령하는 더 단순하고 직접적인 방식)
- **최신 동향 (웹서칭 결과)**: 레거시 `Animation` 컴포넌트는 하위 호환을 위해 지금도 Unity에 남아있고 실제로 제거되지는 않았지만, 공식 문서 스스로 "새 프로젝트에는 쓰지 말고 `Animator`를 쓰라"고 명시하고 있다 — 즉 폐기되지는 않았으나 신규 개발에는 권장되지 않는 상태. 오래된 프로젝트를 유지보수할 때만 마주치게 되는 시스템이라는 점에서 winapi_핵심정리.md/mfc_핵심정리.md에서 다룬 "레거시 기술의 유지보수 맥락"과 같은 종류의 지식이다. ([Unity Manual: Legacy Animation](https://docs.unity3d.com/Manual/Animations.html))

## 6-4. 래그돌(Ragdoll) 물리 — 애니메이션과 물리 시뮬레이션 전환

- **한 줄 정의**: 캐릭터의 각 관절(팔, 다리, 몸통 등)에 개별 `Rigidbody`를 붙여두고, 평소에는 `isKinematic = true`로 애니메이션이 뼈대를 움직이게 하다가, 특정 순간(사망 등)에 `isKinematic = false`로 바꿔서 물리 엔진이 관절들을 자유낙하/충돌 반응하게 만드는 기법.
- **왜 중요한가**: "캐릭터가 죽으면 인형처럼 축 늘어지는" 연출은 액션 게임의 상징적인 효과. `isKinematic` 플래그 하나로 "애니메이션이 지배하는 상태"와 "물리가 지배하는 상태"를 전환한다는 개념이 핵심.
- **내 코드에서 어떻게 썼는지**: `Ch3/Study3/Ragdoll.cs`
  ```csharp
  Rigidbody[] rbody;
  void Start()
  {
      _anim.Play();
      rbody = GetComponentsInChildren<Rigidbody>();   // 모든 관절의 Rigidbody를 한 번에 수집
      SetRagdoll(false);                                // 평소엔 래그돌 꺼둠(애니메이션이 움직임)
      StartCoroutine(this.WakeupRagdoll());             // 5초 뒤 래그돌 활성화(데모용 타이머)
  }
  void SetRagdoll(bool isEnable)
  {
      foreach (Rigidbody _rbody in rbody) _rbody.isKinematic = !isEnable;   // 켜짐 <-> 꺼짐이 반전 관계
  }
  IEnumerator WakeupRagdoll()
  {
      yield return new WaitForSeconds(5.0f);
      _anim.Stop();
      SetRagdoll(true);   // 이 순간부터 물리 엔진이 관절들을 지배
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `isKinematic = true`인 `Rigidbody`는 물리 시뮬레이션에 어떻게 반응하는가? (중력/충돌력의 영향을 받지 않고, 오직 코드(여기서는 애니메이션)가 정한 위치로만 움직임 — "물리적으로는 존재하지만 힘의 영향은 안 받는" 상태)
  - 실제 게임에서 이 타이밍(5초 뒤 자동 전환)을 대신할 만한 트리거는? (사망 이벤트, 특정 애니메이션의 마지막 프레임, 피격 판정 등 — 이 코드는 학습용으로 고정 타이머를 썼지만 실전에서는 게임 이벤트에 연동)
- **최신 동향**: 래그돌 기법 자체는 지금도 3D 물리 게임의 표준 기법으로 변화 없이 쓰인다. 더 자연스러운 전환(애니메이션과 물리를 블렌딩하는 "액티브 래그돌")을 위한 기법들도 있지만, 이 코드의 On/Off 방식이 가장 기본적이고 여전히 널리 쓰이는 형태다.

## 6-5. 3D 충돌 기반 데미지 시스템

- **한 줄 정의**: 2D의 `OnTriggerEnter2D`/`OnCollisionEnter2D`(St2/ST_2에서 다룸)에 대응하는 3D 버전 `OnCollisionEnter`로 무기와 캐릭터의 물리적 충돌을 감지하고, 충돌 정보(`collision.contacts[0].point`)로 정확한 피격 위치에 이펙트를 생성하는 시스템.
- **왜 중요한가**: 2D와 3D의 충돌 콜백 API가 이름만 다르고 원리는 같다는 것, 그리고 `Collision` 객체가 단순히 "부딪혔다"는 사실 이상으로 "정확히 어디서" 부딪혔는지까지 알려준다는 걸 보여주는 실전 사례.
- **내 코드에서 어떻게 썼는지**: `Ch3/Study5/Scripts/CharCtrl.cs`
  ```csharp
  private void OnCollisionEnter(Collision collision)   // 3D 충돌 (2D는 OnCollisionEnter2D)
  {
      if (collision.gameObject.tag == "Weapon" && !collision.gameObject.GetComponent<Weapon>().isMine)   // 내 무기가 아닐 때만
      {
          Damage(collision.contacts[0].point, weapon.power);   // 정확한 충돌 지점 좌표를 그대로 활용
      }
  }
  IEnumerator CreateBloodEffect(Vector3 pos, int damage)
  {
      Instantiate(bloodEffect, pos, Quaternion.identity);   // 충돌 지점에 정확히 이펙트 생성
      Hp -= damage;
      yield return null;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Weapon.isMine` 체크가 왜 필요한가? (자신이 들고 있는 무기 콜라이더가 자기 몸과 부딪혀 스스로에게 데미지를 주는 것을 막기 위함 — 무기 소유자를 표시해두고 "내 무기가 아닌 무기와 부딪혔을 때만" 데미지 판정)
  - `collision.contacts`가 배열인 이유는? (하나의 충돌 프레임에 여러 지점이 동시에 닿을 수 있어(예: 넓은 면끼리 충돌) 배열로 제공됨 — 이 코드는 그중 첫 번째 지점만 사용)
- **최신 동향**: `OnCollisionEnter`/`Collision.contacts` API는 지금도 3D 물리 충돌 처리의 표준으로 변화가 없다.

---

**3D_ST1에서 확인한, 고쳐볼 만한 부분**

1. **`WakeupRagdoll`의 5초 고정 타이머** (6-4번 항목) — 실제 게임이라면 사망 이벤트나 특정 조건에 연동해야 할 부분이 학습용 고정 지연으로 대체되어 있음. 실전 적용 시 이벤트 기반으로 트리거하도록 교체 필요.
2. **`CharCtrl.Damage`가 코루틴을 쓰지만 실제로 시간차 로직이 없음** (6-5번 항목) — `CreateBloodEffect`가 `IEnumerator`인데 내부에 `yield return null` 하나뿐이라 사실상 코루틴으로 만들 실익이 없어 보임 — 일반 메서드로 바꿔도 동일하게 동작할 가능성이 높음.

---

# 7. TempleRun (2026-04-13)

> `C:\Study\Unity\TempleRun\Assets\04. Scripts` — 학생 코드는 `csBridge.cs`(다리 생성 매니저, 131줄)와 `csPlayer.cs`(플레이어 컨트롤, 226줄) 2개뿐인 "무한 러너(엔드리스 러너)" 소품 프로젝트. `Assets/unity-chan!` 폴더는 UTJ(Unity Technologies Japan)의 공식 무료 캐릭터 에셋(스프링본 물리, 카메라컨트롤러, 스플래시스크린 등 예제 스크립트 포함)이라 3D_ST1의 Standard Assets와 같은 이유로 정리에서 제외했다.
> **원본 강의자료 `Ch4.TempleRun.pdf`를 학생 코드와 대조**해서 정리했다. PDF는 강사가 배포한 기본 튜토리얼 코드(다리/교차로 프리팹 제작, `csBridge`/`csPlayer` 스크립트 초안)를 담고 있는데, 학생의 실제 코드는 여기서 몇 군데를 직접 변형했다 — 그 차이 자체가 좋은 정리 포인트라 아래 각 항목에 "PDF 원본과 비교" 형태로 반영했다.

## 7-1. 두 대의 카메라로 스테이지/배경 합성 — Standard Assets `SmoothFollow`

- **한 줄 정의**: 메인 카메라는 Unity 공식 Standard Assets의 `SmoothFollow.cs`(Utility 패키지)를 그대로 붙여 플레이어를 부드럽게 뒤쫓게 하고, `MaskCamera`라는 두 번째 카메라를 `Depth Only`로 겹쳐서 다리 스테이지 뒤에 출렁이는 바다(`WaterProDaytime`)만 별도로 그리는 2-카메라 합성 기법.
- **왜 중요한가**: `04. Scripts` 폴더에 카메라 관련 스크립트가 전혀 없는데도 실제로는 카메라가 플레이어를 따라간다 — PDF를 보기 전까지는 "카메라 추적 코드가 어디 있는지" 의문이었는데, 확인해보니 학생이 직접 짠 게 아니라 Unity 공식 유틸리티 스크립트를 그대로 갖다 붙인 것이었다. "모든 기능을 직접 구현할 필요는 없다"는 실무적 판단(바퀴를 다시 만들지 않기)을 보여주는 사례.
- **내 코드에서 어떻게 썼는지**: `Assets/Standard Assets/Utility/SmoothFollow.cs`를 `Main Camera`에 연결, `Target = Player`, `Height/Rotation Damping = 8`로 세팅(PDF 22p). 별도로 `MaskCamera`를 만들어 `Clear Flags = Depth Only`, `Depth = 0`(메인 카메라보다 낮은 우선순위)으로 설정하고 바다만 그리게 했다(PDF 36p). 씬 파일(`scGame.unity`)에서 `MaskCamera`/`WaterProDaytime` 오브젝트로 확인됨.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 카메라를 두 대 쓰면서 왜 `AudioListener`는 하나만 남겨야 하는가? (씬에 `AudioListener`가 2개 이상이면 Unity가 경고를 내고, 오디오가 어느 카메라 기준으로 들려야 할지 모호해짐 — PDF도 "메인카메라에 Audio Listener가 있으므로 체크를 해제한다. 둘다 사용하면 에러가 발생한다"고 명시하며 `MaskCamera` 쪽 `AudioListener`를 꺼두라고 안내함)
  - `Depth Only`로 카메라를 겹치는 것과 `Culling Mask`로 레이어를 나누는 것의 차이는? (`Depth Only`는 "이 카메라는 색상 버퍼를 지우지 않고 깊이 정보만 갱신하며 그린다"는 렌더링 순서 제어이고, 실제로 무엇을 그릴지는 `Culling Mask`가 결정 — 두 설정을 조합해 "배경은 먼저, 스테이지는 나중에" 같은 레이어링을 만든다)
- **최신 동향**: `SmoothFollow` 같은 Standard Assets 유틸리티는 여전히 참고용으로 쓰이지만, Unity 공식 패키지 매니저의 `Cinemachine`이 카메라 추적/전환의 사실상 표준으로 자리잡았다 — 댐핑, 충돌 회피, 여러 타겟 전환 등을 코드 없이 훨씬 정교하게 처리할 수 있어 신규 프로젝트라면 `SmoothFollow` 대신 `Cinemachine`을 우선 검토하는 것이 일반적이다.

## 7-2. 엔드리스 러너 스트리밍 생성/삭제 패턴

- **한 줄 정의**: 무한히 이어지는 길을 실제로 무한 생성하는 대신, 플레이어 앞쪽 구간만 일정 개수(여기서는 10개)씩 미리 만들어두고 지나간 이전 구간은 통째로 삭제하는 "앞은 생성, 뒤는 삭제"하는 스트리밍 구조.
- **왜 중요한가**: 러너/인피니티 계열 게임의 핵심 아이디어이자, "메모리에 무한히 쌓이지 않게" 콘텐츠를 흐르게 만드는 일반적인 패턴(오브젝트 풀링의 사촌 격)이라 면접에서 자주 나오는 소재.
- **내 코드에서 어떻게 썼는지**: `csBridge.cs:39-52`
  ```csharp
  void MakeBridge(string sDir)
  {
      DeleteOldBridge();   // Player가 지나간 이전 구간 삭제
      CalcRotation(sDir);  // 새 진행 방향 계산
      MakeNewBridge();     // 새 방향으로 다리 10개 생성
  }
  void DeleteOldBridge()
  {
      Destroy(oldBridge);              // 예전 다리(2턴 전) 삭제
      oldBridge = newBridge;           // 방금까지 쓰던 다리를 "다음에 지울 대상"으로 이관
      newBridge = new GameObject("StartBridge");   // 새 구간을 담을 부모 오브젝트 새로 생성
  }
  ```
  `MakeBridge`는 `Start()`에서 최초 1회, 이후 플레이어가 교차로에서 회전할 때마다(`csPlayer.RotateHuman` → `SendMessage`) 호출된다.
- **PDF 원본과 비교**: 다리 프리팹 5종(기본/바닥없음/우측없음/좌측없음/장애물)과 교차로를 에디터에서 직접 조립하는 과정 전체가 PDF 2~18p에 좌표값까지 상세히 나와 있다 — `csBridge.cs`의 로직(10개씩 생성, 홀수 인덱스는 장애물, 짝수 인덱스는 50% 확률로 동전)은 PDF 23~27p의 원본 코드와 로직상 동일하며, 학생이 이 부분은 튜토리얼을 그대로 따랐음을 확인했다.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 매번 `Destroy`/`Instantiate`로 오브젝트를 새로 만들고 없애는데, 왜 오브젝트 풀링을 안 썼는가? (다리 세그먼트가 회전 시마다 10개씩만 생기고 없어지는 소규모 트래픽이라 풀링 없이도 문제가 없음 — 스폰 빈도가 훨씬 높은 총알/이펙트 등에서는 풀링이 필요해진다는 것과 대비하기 좋은 포인트)
  - 부모-자식(`newBridge`/`childBridge`) 구조로 묶는 이유는? (개별 `Destroy` 호출 없이 부모 하나만 `Destroy`하면 자식 다리 10개가 한꺼번에 정리되기 때문 — Unity에서 오브젝트를 "그룹"으로 다루는 가장 기본적인 방법)
- **최신 동향**: `Instantiate`/`Destroy` 기반의 스트리밍 생성 자체는 지금도 유효한 기본기이지만, 실무에서는 `ObjectPool<T>`(Unity 2021+ 내장 API)로 재사용 풀을 관리하는 방식이 표준으로 자리잡았다 — 이 프로젝트 규모에서는 과할 수 있지만, "생성 빈도가 늘면 풀링으로 넘어간다"는 판단 기준으로 알아두면 됨.

## 7-3. Raycast 기반 접지/벽 판정

- **한 줄 정의**: 매 프레임 캐릭터 위치에서 아래/좌/우로 짧은 광선을 쏘아(`Physics.Raycast`) 충돌한 오브젝트의 태그를 확인함으로써 "바닥에 있는가", "왼쪽/오른쪽으로 이동 가능한가"를 판정하는 방식.
- **왜 중요한가**: `CharacterController.isGrounded`(3D_ST1의 6-2번)처럼 컴포넌트가 알아서 판정해주지 않는 상황에서, 개발자가 직접 물리 질의로 상태를 판정하는 대표적인 방법. Raycast의 인자 순서(기준점/방향/결과/거리)를 정확히 설명할 수 있는지가 면접 단골 질문.
- **내 코드에서 어떻게 썼는지**: `csPlayer.cs:48-77`
  ```csharp
  isGround = true;
  if (Physics.Raycast(transform.position, Vector3.down, out hit, 2f))
  {
      if (hit.transform.tag == "Bridge") isGround = true;
  }
  canLeft = true;
  if (Physics.Raycast(transform.position, Vector3.left, out hit, 0.7f))
  {
      if (hit.transform.tag == "Guard") canLeft = false;   // 좌측에 가드레일이 있으면 좌 이동 금지
  }
  ```
- **PDF 원본과 비교**: PDF의 원본 코드는 태그를 `"BRIDGE"`/`"GUARD"`(전부 대문자)로 비교하는데, 학생의 실제 코드는 `"Bridge"`/`"Guard"`(첫 글자만 대문자)로 비교한다. Unity의 태그 문자열 비교는 대소문자를 구분하므로, 실제로 Unity 에디터의 Tag Manager(`ProjectSettings/TagManager.asset`)에 등록된 태그 이름도 `Bridge`/`Guard`/`Dead`/`Turn`/`Coin`으로 되어있는지 직접 확인했다 — 코드와 정확히 일치했다. 즉 학생이 튜토리얼의 명명 규칙(전부 대문자)을 따르지 않고 태그 이름과 비교 코드를 처음부터 끝까지 일관되게 자기 스타일(첫 글자만 대문자)로 바꿔서 만들었다는 뜻. 만약 태그 이름과 코드 문자열의 대소문자가 어긋났다면 `Physics.Raycast`는 성공해도 `if (hit.transform.tag == "Bridge")`가 조용히 항상 실패하는, 눈에 잘 안 띄는 버그가 됐을 자리였다.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `isGround`는 왜 항상 `true`로 초기화한 뒤 조건이 맞을 때 또 `true`를 대입하는가? (이 코드는 사실상 "바닥이 아니어도 항상 true"가 되는 논리적 허점이 있음 — `Raycast`가 실패했거나 태그가 `Bridge`가 아닌 경우에 `false`로 떨어뜨리는 처리가 빠져있어, 원래 의도(공중에 있으면 점프 불가)가 코드상 완전히 보장되지 않는다. 참고로 PDF의 원본 코드도 이 부분은 동일한 구조라 튜토리얼 자체의 허점이 그대로 이어진 것으로 보인다.)
  - 태그 이름의 대소문자가 코드와 어긋나면 왜 컴파일 에러가 아니라 조용히 실패하는가? (태그는 문자열이라 컴파일 타임에는 존재 여부나 철자를 검사하지 않음 — 런타임에 `tag == "Bridge"` 비교가 그냥 `false`를 반환할 뿐이라, "왜 접지 판정이 안 되지?"처럼 원인을 한참 찾아야 하는 버그로 이어지기 쉽다)
  - `Debug.DrawRay`는 왜 별도로 호출하는가? (`Physics.Raycast` 자체는 아무것도 그리지 않으므로, 씬 뷰에서 광선의 경로를 눈으로 확인하려면 `Debug.DrawRay`를 따로 그려야 함 — 로직과 시각화 호출이 분리되어 있다는 점)
- **최신 동향**: `Physics.Raycast` API는 지금도 3D 물리 질의의 표준으로 변화 없이 쓰인다.

## 7-4. 문자열 기반 컴포넌트 통신의 반복된 위험성 — `SendMessage` / `StartCoroutine(string)`

- **한 줄 정의**: 메서드를 직접 참조하지 않고 문자열 이름으로 호출하는 두 가지 API — `gameObject.SendMessage("메서드명", …)`와 `StartCoroutine("메서드명")` — 를 이 프로젝트에서 나란히 사용하고 있다.
- **왜 중요한가**: St3(6번, `unity_핵심정리.md` St3 종합 요약)에서 이미 정리한 "문자열 기반 API의 반복된 위험성" 테마가 여기서도 그대로 재현된다 — 오타가 나도 컴파일은 통과하고 런타임에만 조용히 실패하며, IDE의 "이름 바꾸기(rename)" 리팩토링 기능이 이 문자열까지 따라가지 못한다는 공통 약점.
- **내 코드에서 어떻게 썼는지**: `csPlayer.cs:172` / `csPlayer.cs:115,135`
  ```csharp
  // 컴포넌트 간 통신: manager는 csBridge가 붙은 다른 오브젝트
  manager.SendMessage("MakeBridge", sDir, SendMessageOptions.DontRequireReceiver);

  // 코루틴 시작도 문자열로
  StartCoroutine("JumpHuman");
  ```
- **PDF 원본과 비교**: 두 API 모두 PDF의 원본 코드에 그대로 나온다(32~35p, 34p) — 즉 이건 학생이 만든 설계 선택이 아니라 강사가 배포한 튜토리얼의 기본 패턴을 그대로 따른 것이다. "학생이 잘 몰라서 위험한 API를 썼다"가 아니라 "실무에서도 흔히 볼 수 있는 교육용 예제 코드의 전형적인 습관을 그대로 물려받았다"는 쪽에 가깝다는 걸 짚어두면 면접에서 더 정확하게 설명할 수 있다.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `SendMessage` 대신 쓸 수 있는 더 안전한 대안은? (매니저의 참조를 직접 들고 있다면 `manager.GetComponent<csBridge>().MakeBridge(sDir)`처럼 강타입으로 직접 호출 — 컴파일 타임에 오류를 잡을 수 있음. 서로 다른 시스템 간 느슨한 결합이 꼭 필요하면 `UnityEvent`나 C# 이벤트가 요즘 더 선호되는 대안)
  - `StartCoroutine("JumpHuman")`처럼 문자열로 호출하면 얻는 것과 잃는 것은? (얻는 것: `StopCoroutine("JumpHuman")`처럼 이름으로 특정 코루틴을 멈출 수 있음. 잃는 것: 매개변수를 강타입으로 못 넘기고, 리네이밍에 안전하지 않으며, 리플렉션 기반이라 `StartCoroutine(JumpHuman())` 방식보다 약간의 오버헤드가 있음 — 단, 최신 Unity에서는 이 성능 차이가 실질적으로는 미미하다는 게 중론)
- **최신 동향 (웹서칭 결과)**: 두 API 모두 지금도 제거되지 않고 남아있지만, Unity 공식 권장은 오래전부터 강타입 직접 호출/이벤트를 우선시하고, `StartCoroutine`도 `IEnumerator`를 직접 넘기는 오버로드를 권장한다. 문자열 오버로드는 "이름으로 멈춰야 할 때"처럼 꼭 필요한 경우에만 쓰라는 것이 일반적인 가이드다. ([Unity Coroutine 가이드](https://gamedevbeginner.com/coroutines-in-unity-when-and-how-to-use-them/))

## 7-5. 모바일/데스크탑 입력 분기

- **한 줄 정의**: `Application.platform`으로 실행 플랫폼을 확인해 모바일(가속도계 기울기 + 터치 스와이프)과 데스크탑(키보드 축 입력)으로 입력 처리 코드를 완전히 분기하는 패턴.
- **왜 중요한가**: 하나의 게임을 여러 플랫폼에 배포할 때 "입력 방식이 근본적으로 다르다"는 문제를 코드 레벨에서 어떻게 다루는지 보여주는 실전 사례.
- **내 코드에서 어떻게 썼는지**: `csPlayer.cs:82-127`
  ```csharp
  if (Application.platform == RuntimePlatform.Android ||
      Application.platform == RuntimePlatform.IPhonePlayer)
      CheckMobile();
  else
      CheckKeyboard();

  // 모바일: 기기 기울기로 좌우 이동, 스와이프로 점프/회전
  float x = Input.acceleration.x;
  if (x < -0.2f) dirX = -0.6f;
  ...
  if (tmp.phase == TouchPhase.Moved && touchEnd.y - touchStart.y > 100)
      StartCoroutine("JumpHuman");   // 위로 스와이프 = 점프
  ```
- **PDF 원본과 비교**: 입력 분기 로직 자체는 PDF(29~35p)와 동일하지만, 전진 속도 값이 다르다 — PDF 원본은 `speedForward = 2`인데 학생의 실제 코드는 `speedForward = 10`으로 5배 올라가 있다. 학생이 직접 플레이해보고 원본 튜토리얼 속도가 너무 느리다고 판단해 체감 난이도/속도감을 조정한 흔적으로 보인다 — 튜토리얼을 그대로 베끼지 않고 실제로 플레이테스트를 거쳐 값을 튜닝했다는 근거.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 굳이 `if/else`로 완전히 다른 함수를 타게 나눈 이유는? (입력 소스 자체가 다르므로(`Input.acceleration` vs `Input.GetAxis`) 하나의 함수 안에서 억지로 합치면 조건문이 뒤섞여 가독성이 떨어짐 — 플랫폼별 책임을 함수 단위로 분리)
  - 요즘이라면 이 코드를 어떻게 개선하겠는가? (Unity의 신규 Input System 패키지는 액션 기반으로 "Jump"라는 하나의 액션에 키보드 스페이스바와 터치 제스처를 동시에 바인딩할 수 있어 이런 플랫폼 분기 자체를 줄일 수 있음 — 다만 이 프로젝트는 구 Input Manager 시절 코드)
- **최신 동향 (웹서칭 결과)**: 레거시 `Input` 클래스(구 Input Manager)는 여전히 동작하지만, Unity는 새 프로젝트에 `Input System` 패키지 사용을 권장한다 — 여러 플랫폼의 입력을 액션(Action) 단위로 추상화해 이런 수동 플랫폼 분기를 줄여주는 방향으로 발전했다. `mfc_핵심정리.md`/`winapi_핵심정리.md`에서 다룬 "레거시 기술의 유지보수 맥락"과 같은 종류의 지식이다.

## 7-6. 레거시 `Animation`에서 Mecanim `Animator`로 — 튜토리얼을 넘어선 직접 업그레이드

- **한 줄 정의**: `Animator.SetInteger`/`SetTrigger`로 애니메이터 컨트롤러의 파라미터 값만 바꿔주면, 실제 어떤 애니메이션을 재생할지/언제 전환할지는 Animator Controller의 상태 머신(Transition 조건)이 알아서 처리하는 방식.
- **왜 중요한가**: 3D_ST1(6-3번)에서 다룬 레거시 `Animation.CrossFade`/`PlayQueued`(코드가 직접 "이 클립을 재생해라"고 명령)와 정반대 철학 — 코드는 "상태"만 알려주고 "그 상태에서 뭘 재생할지"는 애니메이터 컨트롤러(디자인 데이터)의 책임이라는 역할 분리를 보여주는 좋은 대비 사례. 게다가 이 프로젝트는 그 전환 과정 자체가 코드에 흔적으로 남아있어서 더 의미가 있다.
- **PDF 원본과 비교(중요)**: PDF의 원본 코드는 레거시 `Animation` 컴포넌트를 쓴다 — `anim = GetComponent<Animation>();`, 점프 시 `anim.Play("jump_pose")`, 착지 시 `anim.Play("run")`, 사망 시 `anim.Play("idle")`(PDF 28p, 32p, 34p). 튜토리얼이 기본으로 쓰는 캐릭터는 유니티의 구버전 예제 모델인 `PrototypeCharacter.unitypackage`(레거시 `Animation` 기반, idle/run/walk/jump_pose 클립만 있음)였다. 그런데 학생의 실제 최종 코드는 `Animator anim;` + `SetInteger("Jump0", ...)`/`SetTrigger("Obstacle")`로 완전히 바뀌어 있고, 옛 `anim.Play(...)` 호출들은 `//anim.Play("jump_pose");`처럼 주석으로만 남아있다. 그리고 씬 파일(`scGame.unity`)을 확인해보면 실제 캐릭터가 `PrototypeCharacter`가 아니라 `unitychan`(Mecanim 리깅이 된 유니티쨩 에셋)으로 교체되어 있다 — 즉 **학생이 튜토리얼의 기본 캐릭터/애니메이션 시스템을 그대로 쓰지 않고, 스스로 유니티쨩 에셋(Mecanim)으로 캐릭터를 바꾸면서 애니메이션 제어 코드도 레거시 `Animation`에서 `Animator`로 직접 업그레이드**했다는 뜻이다. 지워지지 않고 남은 주석이 그 개조 과정의 증거로 남아있는 셈.
- **내 코드에서 어떻게 썼는지**: `csPlayer.cs:146-156`, `176-184`
  ```csharp
  IEnumerator JumpHuman()
  {
      canJump = false;
      gameObject.GetComponent<Rigidbody>().AddForce(Vector3.up * jumpPower);
      anim.SetInteger("Jump0", 1);   // "점프 상태"라고만 알려줌 — 실제 재생은 Animator Controller가 결정
      //anim.Play("jump_pose");      // PDF 원본(레거시 Animation) 코드의 흔적
      yield return new WaitForSeconds(1.5f);
      anim.SetInteger("Jump0", 0);
      canJump = true;
  }
  void OnCollisionEnter(Collision col)
  {
      if (col.transform.tag == "Dead")
      {
          isDead = true;
          anim.SetTrigger("Obstacle");   // 트리거는 "1회성 이벤트"를 알릴 때 (Bool과 달리 자동으로 소비됨)
      }
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `SetInteger`와 `SetTrigger`를 각각 언제 쓰는가? (`SetInteger`/`SetBool`은 "지속되는 상태"(점프 중이다/아니다)를 표현할 때, `SetTrigger`는 "한 번 일어나는 사건"(장애물에 부딪혔다)을 표현할 때 — Trigger는 한 번 소비되면 자동으로 꺼진다는 점이 Bool과 다름)
  - 왜 캐릭터와 애니메이션 시스템을 굳이 바꿨을까? (튜토리얼의 `PrototypeCharacter`는 이름 그대로 "프로토타입"용 임시 모델이라 완성도가 낮음 — 이미 다른 프로젝트에서 다뤄본 유니티쨩 에셋으로 교체하면서, 그 에셋이 Mecanim 기반이라 자연스럽게 `Animator` 제어 방식도 함께 바뀐 것으로 추정된다)
  - 옛 코드를 지우지 않고 주석으로 남겨둔 것을 어떻게 평가할 수 있는가? (실무에서는 지저분한 습관으로 볼 수도 있지만, 학습 기록의 관점에서는 "무엇을 바꿨는지"를 스스로 추적할 수 있는 단서가 되어 오히려 유용함 — 다만 최종 제출/배포용 코드라면 정리하는 것이 맞다)
- **최신 동향**: `Animator`/Animator Controller 기반 파라미터 제어는 지금도 Unity 애니메이션의 표준 방식으로 변화 없이 쓰인다.

## 7-7. `OnGUI` 레거시 즉시모드 UI

- **한 줄 정의**: `OnGUI()` 콜백 안에서 매 프레임 `GUI.Label`/`GUI.Button` 같은 즉시모드(Immediate Mode) API를 직접 호출해 점수 표시와 재시작/종료 버튼을 그리는, uGUI(Canvas 기반) 이전 세대의 UI 구현 방식.
- **왜 중요한가**: 지금까지의 프로젝트 대부분이 Canvas/uGUI를 썼는데, 여기서 그 이전 세대인 `OnGUI` 기반 UI를 직접 접함 — 오래된 코드베이스를 유지보수할 때 마주칠 수 있는 시스템이라는 점에서 3D_ST1의 레거시 `Animation`(6-3번)과 같은 성격의 지식.
- **내 코드에서 어떻게 썼는지**: `csPlayer.cs:208-225`
  ```csharp
  void OnGUI()
  {
      string str = "<size=20><color=#000000>score: ##</color></size>";
      GUI.Label(new Rect(10, 10, 300, 80), str.Replace("##", "" + (int)score));
      if (!isDead) return;
      if (GUI.Button(new Rect(w - 60, h - 50, 120, 50), "Play Game"))
      {
          SceneManager.LoadScene("scGame");
          //Application.LoadLevel("Main");   // 예전에 쓰던 API가 주석으로 남아있음
      }
  }
  ```
  이 주석에 남은 `Application.LoadLevel`은 ST_2(3번) 정리에서 이미 다룬 `Application.loadedLevel`→`SceneManager.LoadScene` 마이그레이션과 같은 계열의 흔적이 또 한 번 발견된 것.
- **PDF 원본과 비교**: PDF 원본은 `SceneManager.LoadScene("Main")`/`Application.LoadLevel("Main")`으로 씬 이름이 `"Main"`이다(34p). 학생의 실제 코드는 씬을 `"scGame"`으로 바꿔 불렀지만, 주석으로 남긴 옛 `Application.LoadLevel(...)` 줄은 `"Main"`이라는 원래 씬 이름 그대로 남아있다 — 즉 이 주석은 이미 이름이 바뀐 지금 기준으로는 실행해도 어차피 틀린 씬을 찾게 되는, 정리 안 된 채 남은 죽은 코드라는 것까지 PDF 대조로 정확히 짚을 수 있다.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `OnGUI`는 언제 지금도 실무에서 쓰이는가? (플레이어가 직접 상호작용하는 인게임 UI로는 더 이상 권장되지 않지만, 에디터 확장 UI나 디버그 오버레이용으로는 지금도 널리 쓰인다 — St3-C/D(5번)에서 다룬 `EditorWindow`/`[CustomEditor]`도 내부적으로 IMGUI 계열)
  - `OnGUI`가 매 프레임(그것도 이벤트당 여러 번) 호출된다는 것이 왜 성능상 유의할 점인가? (Layout/Repaint 등 이벤트마다 반복 호출되므로, 이 안에서 무거운 연산을 하면 uGUI 대비 비효율적 — 이 코드처럼 문자열 조작(`Replace`)을 매 프레임 하는 것도 실무에서는 지양할 부분)
- **최신 동향 (웹서칭 결과)**: `OnGUI`(IMGUI)는 지금도 완전히 제거되지 않았지만, Unity 공식 문서가 "일반적인 인게임 UI용으로는 의도된 것이 아니며 주로 에디터 툴/디버그용"이라고 명시한다. 실사용 UI는 uGUI(Canvas 기반, 여전히 유지보수됨) 또는 최신 권장인 UI Toolkit으로 만드는 것이 표준이다. ([Unity Manual: IMGUI](https://docs.unity3d.com/6000.2/Documentation/Manual/GUIScriptingGuide.html), [Unity Manual: UI systems 비교](https://docs.unity3d.com/6000.0/Documentation/Manual/UI-system-compare.html))

---

**TempleRun에서 확인한, 고쳐볼 만한 부분**

1. **`CheckMove`의 `isGround` 판정 로직 허점** (7-3번 항목) — `isGround = true`로 초기화한 뒤 `Raycast`가 `Bridge` 태그를 맞혀도 다시 `true`를 대입할 뿐, 실패 시 `false`로 떨어뜨리는 분기가 없어 사실상 항상 `true`가 된다. 공중에 있어도 점프가 가능해지는 버그로 이어질 수 있음 — `else isGround = false;` 보강 필요. PDF 원본 코드에도 같은 구조가 있어 튜토리얼 자체의 허점이 그대로 이어진 것으로 보인다.
2. **`OnGUI`에서 매 프레임 문자열 `Replace` 호출** (7-7번 항목) — 점수가 바뀌지 않는 프레임에도 매번 문자열을 새로 만들어 `Replace`하고 있어 불필요한 GC 할당이 반복됨. 점수가 실제로 바뀔 때만 문자열을 갱신하도록 캐싱하면 개선 가능.
3. **주석으로 남은 `Application.LoadLevel("Main")`이 실제로는 틀린 씬 이름** (7-7번 항목) — 씬을 `"scGame"`으로 리네임한 뒤에도 주석 속 옛 코드는 `"Main"`을 그대로 참조하고 있어, 나중에 실수로 주석을 해제하면 존재하지 않는 씬을 찾다 실패하는 죽은 코드로 남아있음. 정리 대상.
