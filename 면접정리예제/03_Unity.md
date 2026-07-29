# 03. Unity

> `★` = 강사 언급 · `★★` = 실제 면접 출제 확인 · 표시 없음 = 추가 수집 문항
> 관련 원본 정리: `../unity_핵심정리.md` (프로젝트 22개, 개념 200여 개)

## 목차

| 번호 | 질문 | 표시 |
|---|---|---|
| Q3-01 | MonoBehaviour 생명주기 순서를 설명하라 | |
| Q3-02 | `Update`/`FixedUpdate`/`LateUpdate`의 차이는? | ★ |
| Q3-03 | Mono와 IL2CPP의 차이는? AOT와 JIT은? | |
| Q3-04 | `Awake`와 `Start`의 차이는? | |
| Q3-05 | 스크립트 실행 순서는 어떻게 정해지나? | |
| Q3-06 | 델타 타임이란? 왜 필요한가? | |
| Q3-07 | 프로젝트에서 사용한 싱글턴에 대해 설명하라 | ★★ |
| Q3-08 | `MonoBehaviour`를 `new`로 만들면 왜 안 되나? | |
| Q3-09 | `GetComponent`는 왜 캐싱해야 하나? | |
| Q3-10 | 코루틴이란? 스레드와 뭐가 다른가? | |
| Q3-11 | 코루틴과 `Invoke`의 차이는? | |
| Q3-12 | 콜라이더란? | ★★ |
| Q3-13 | 트리거와 콜리전의 차이는? | |
| Q3-14 | `Rigidbody`와 `isKinematic`을 설명하라 | |
| Q3-15 | 레이캐스트란? | ★★ |
| Q3-16 | 오브젝트 풀링이란? 왜 필요한가? | |
| Q3-17 | 드로우 콜과 배칭을 설명하라 | |
| Q3-18 | 본인이 아는 최적화 방법을 설명하라 | ★ |
| Q3-19 | 최적화는 어떻게 측정하나? (프로파일링) | |
| Q3-20 | 프러스텀 컬링과 오클루전 컬링이란? | |
| Q3-21 | `ScriptableObject`에 대해 아는가? | ★ |
| Q3-22 | 프리팹(Prefab)이란? | |
| Q3-23 | 씬 전환과 `DontDestroyOnLoad`를 설명하라 | |
| Q3-24 | `Resources`, AssetBundle, Addressables의 차이는? | |
| Q3-25 | Unity의 "Fake Null" 문제란? | |
| Q3-26 | `Destroy`와 `DestroyImmediate`의 차이는? | |
| Q3-27 | `Time.timeScale`로 일시정지를 구현할 때 주의점은? | |
| Q3-28 | Animator와 Mecanim, `StateMachineBehaviour`란? | |
| Q3-29 | uGUI 캔버스 최적화 방법은? | |
| Q3-30 | NGUI를 써본 적이 있는가? | ★★ |
| Q3-31 | 에디터 확장을 해본 적 있는가? | |
| Q3-32 | 네트워크 동기화를 해본 적 있는가? | |
| Q3-33 | 문자열 기반 API가 왜 위험한가? | |
| Q3-34 | Deprecated API 마이그레이션을 겪어봤는가? | |
| Q3-35 | 현재 Unity 버전과 앞으로의 변화는? | |

---

## Q3-01. MonoBehaviour 생명주기 순서를 설명하라

**30초 답변**
> 크게 **초기화 → 물리 → 게임 로직 → 렌더링 → 종료** 순서입니다. 오브젝트가 생성되면 `Awake` → `OnEnable` → `Start`가 한 번씩 불리고, 이후 매 프레임 `FixedUpdate`(물리, 고정 간격) → `Update` → `LateUpdate` 순으로 반복됩니다. 종료 시에는 `OnDisable` → `OnDestroy`, 앱이 꺼질 땐 `OnApplicationQuit`이 호출됩니다.

**상세 설명**
```
[초기화 - 1회]
Awake        모든 오브젝트의 Awake가 Start보다 먼저. 자기 자신 참조 캐싱에 적합
OnEnable     오브젝트가 활성화될 때마다 (재활성화 시 반복 호출)
Start        첫 Update 직전 1회. 다른 오브젝트 참조에 적합

[매 프레임 - 반복]
FixedUpdate  고정 시간 간격(기본 0.02초). 물리 연산. 한 프레임에 0~N번 호출 가능
  └ OnTriggerXXX / OnCollisionXXX
Update       매 프레임 1회. 게임 로직, 입력 처리
LateUpdate   모든 Update 이후. 카메라 추적 등

[렌더링]
OnBecameVisible / OnBecameInvisible
OnGUI (레거시 IMGUI, 프레임당 여러 번 호출)

[종료]
OnDisable → OnDestroy → OnApplicationQuit
```
- **핵심 원칙: 모든 오브젝트의 `Awake`가 끝난 뒤에야 `Start`들이 시작된다.** 그래서 "내 컴포넌트 캐싱은 `Awake`, 남의 컴포넌트 참조는 `Start`"가 안전한 규칙이다.
- `OnEnable`/`OnDisable`은 `SetActive` 토글마다 반복 호출된다. `Awake`/`Start`는 1회뿐이다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **1-1** — MonoBehaviour 생명주기 순서를 첫 프로젝트에서 직접 실습해 정리한 항목.
- `unity_핵심정리.md` 5-4 — 이벤트 구독을 `OnEnable`, 해제를 `OnDisable`에 배치하는 이유.

**꼬리질문**
- **Q.** 왜 `Awake`에서 다른 오브젝트를 참조하면 위험한가?
  **A.** 오브젝트 간 `Awake` 호출 순서는 보장되지 않는다. 상대의 `Awake`가 아직 안 돌아서 필드가 `null`일 수 있다. **자기 참조는 `Awake`, 남의 참조는 `Start`** 가 안전하다.
- **Q.** `OnDestroy`가 안 불리는 경우가 있나?
  **A.** 있다. `OnApplicationQuit` 상황이나 에디터 강제 종료, 앱 크래시 시에는 보장되지 않는다. 모바일에서는 앱이 백그라운드에서 시스템에 의해 종료되면 아예 안 불릴 수 있어, 저장은 `OnApplicationPause(true)` 시점에 하는 게 안전하다.
  > `mfc_핵심정리.md` 6번의 `OnSysCommand`(종료 메시지 가로채기)와 대응되는 개념이다.

---

## Q3-02. `Update`/`FixedUpdate`/`LateUpdate`의 차이는? `★`

**30초 답변**
> `Update`는 **매 프레임 1회** 호출되어 프레임률에 따라 간격이 불규칙하고, 입력 처리와 일반 게임 로직에 씁니다. `FixedUpdate`는 **고정된 시간 간격(기본 0.02초)** 으로 호출되어 프레임률과 무관하게 일정하므로 `Rigidbody` 물리 연산에 씁니다. `LateUpdate`는 **모든 `Update`가 끝난 뒤** 호출되어, 캐릭터가 움직인 결과를 보고 카메라를 따라가게 하는 데 씁니다.

**상세 설명**

| | `Update` | `FixedUpdate` | `LateUpdate` |
|---|---|---|---|
| 호출 시점 | 매 프레임 | 고정 간격(Fixed Timestep) | 모든 Update 후 |
| 호출 횟수 | 프레임당 1회 | 프레임당 **0~N회** | 프레임당 1회 |
| 시간 변수 | `Time.deltaTime` | `Time.fixedDeltaTime` | `Time.deltaTime` |
| 용도 | 입력, 로직, 타이머 | **물리(Rigidbody)** | 카메라 추적 |

- **`FixedUpdate`가 프레임당 여러 번 불릴 수 있는 이유**: 프레임이 0.05초 걸렸는데 Fixed Timestep이 0.02초면, 밀린 물리 스텝을 따라잡기 위해 2~3번 연속 호출된다. 반대로 프레임이 매우 빠르면 한 번도 안 불리는 프레임도 있다.
- **`Input.GetKeyDown`은 `FixedUpdate`에서 쓰면 안 된다.** 입력은 프레임 단위로 갱신되는데 `FixedUpdate`는 프레임과 주기가 달라 **입력을 놓치거나 중복 감지**할 수 있다. 입력은 `Update`에서 받아 플래그에 저장하고, 물리 적용은 `FixedUpdate`에서 하는 게 정석이다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **3-1** — `FixedUpdate` vs `Update` + 물리 기반 캐릭터 이동을 직접 실습.
- `unity_핵심정리.md` **3-5** — 카메라 추적 시스템을 `LateUpdate` + `Mathf.Lerp` + `Mathf.Clamp`로 구현.
- `unity_핵심정리.md` **3-6** — **주기적 실행의 3가지 방법 종합비교**(Update 폴링 / 코루틴 / Invoke).
- `winapi_핵심정리.md` 7번 — WinAPI에서 **타이머 기반 게임 루프**를 직접 짜본 경험. "엔진이 없으면 이 루프를 직접 만들어야 한다"는 이해를 보여줄 수 있다.

**꼬리질문**
- **Q.** 카메라 추적을 `Update`에 넣으면 어떻게 되나?
  **A.** 캐릭터 이동도 `Update`에서 일어나는데 **실행 순서가 보장되지 않아**, 카메라가 먼저 돌면 한 프레임 전 위치를 따라가게 되어 **화면이 떨린다(jitter)**. `LateUpdate`에 넣으면 캐릭터 이동이 모두 끝난 뒤 실행되므로 떨림이 없다.
- **Q.** Fixed Timestep을 낮추면(더 자주 호출) 어떻게 되나?
  **A.** 물리 정밀도는 올라가지만 **CPU 부하가 크게 증가**한다. 특히 프레임률이 낮은 기기에서는 `FixedUpdate`가 프레임당 여러 번 호출되며 더 느려지고, 그러면 더 많이 밀리는 **악순환(death spiral)** 이 생길 수 있다. Unity는 이를 막으려고 `Maximum Allowed Timestep` 제한을 둔다.
- **Q.** 물리를 `Update`에서 처리하면?
  **A.** 프레임률에 따라 물리 결과가 달라진다. 60fps 기기와 30fps 기기에서 점프 높이가 달라지는 식이다. 물리 시뮬레이션은 일정한 시간 간격을 전제로 하기 때문에 반드시 `FixedUpdate`를 써야 한다.

---

## Q3-03. Mono와 IL2CPP의 차이는? AOT와 JIT은?

**30초 답변**
> 둘 다 Unity의 **스크립팅 백엔드**입니다. Mono는 C#을 IL로 컴파일한 뒤 **실행 중에 JIT으로 기계어를 생성**하고, IL2CPP는 IL을 **C++ 코드로 변환한 뒤 각 플랫폼 네이티브 컴파일러로 미리 컴파일(AOT)** 합니다. IL2CPP가 실행 속도가 빠르고 코드 보호에 유리하며 iOS처럼 JIT이 금지된 플랫폼에서 필수지만, 빌드 시간이 훨씬 길고 런타임 코드 생성(리플렉션 일부)이 제한됩니다.

**상세 설명**

| | Mono | IL2CPP |
|---|---|---|
| 방식 | IL → **JIT**(실행 중 컴파일) | IL → C++ → **AOT**(사전 컴파일) |
| 빌드 시간 | 짧음 | **매우 김** |
| 실행 속도 | 보통 | **빠름** |
| 시작 시간 | JIT 워밍업 있음 | 없음 |
| 리버스 엔지니어링 | 쉬움(IL 디컴파일) | 어려움 |
| iOS | **불가**(애플이 JIT 금지) | **필수** |
| 리플렉션/동적 제네릭 | 자유 | **제한**(코드 스트리핑 문제) |
| GC | Boehm | Boehm(동일) |

- **AOT**(Ahead-Of-Time): 실행 전에 미리 기계어로 컴파일. 시작이 빠르고 최적화 시간이 넉넉하지만 실행 시점 정보를 못 쓴다.
- **JIT**(Just-In-Time): 실행 중 필요한 부분만 컴파일. 실제 CPU와 실행 패턴에 맞춰 최적화할 수 있지만 워밍업 비용이 있다.
- **IL2CPP의 대표적 함정**: 코드 스트리핑으로 "쓰이지 않는다고 판단된" 코드가 제거되어, 리플렉션으로만 호출하던 코드가 런타임에 사라진다. `link.xml`로 보존을 명시해야 한다.

**내 프로젝트 연결**
- `unity_핵심정리.md` 12번(UnityDll) — **네이티브 C++ 플러그인 P/Invoke**를 직접 다뤄봤다. IL2CPP가 결국 C++로 변환된다는 점과 개념적으로 이어진다.
- `unity_핵심정리.md` 8-11 — **전처리기 지시자로 플랫폼별 조건부 컴파일**을 다뤘다.

**꼬리질문**
- **Q.** IL2CPP에서 제네릭이 문제가 되는 이유는?
  **A.** AOT는 **컴파일 시점에 존재하는 타입 조합만 코드를 생성**한다. `Activator.CreateInstance(typeof(List<>).MakeGenericType(t))` 처럼 런타임에 새 제네릭 타입을 만들면 해당 코드가 없어서 예외가 난다. 미리 더미 코드로 해당 조합을 참조해두거나 리플렉션을 피해야 한다.
- **Q.** 그럼 개발 중엔 뭘 쓰나?
  **A.** 개발/이터레이션 중엔 빌드가 빠른 **Mono**, 실제 배포 빌드는 **IL2CPP**를 쓰는 게 일반적이다. 단 IL2CPP에서만 나타나는 버그가 있으므로 출시 전 IL2CPP 빌드로 충분히 테스트해야 한다.

---

## Q3-04. `Awake`와 `Start`의 차이는?

**30초 답변**
> `Awake`는 오브젝트가 **생성될 때 즉시**, 비활성 상태여도 호출되고, `Start`는 **첫 `Update` 직전에** 활성 상태일 때만 호출됩니다. 가장 중요한 규칙은 **모든 오브젝트의 `Awake`가 끝난 후에 `Start`들이 실행된다**는 것이라, 자기 컴포넌트 캐싱은 `Awake`에, 다른 오브젝트 참조는 `Start`에 두는 게 안전합니다.

**상세 설명**
```csharp
private Rigidbody rb;
private GameManager gm;

void Awake() {
    rb = GetComponent<Rigidbody>();       // 자기 것 - 안전
}
void Start() {
    gm = GameManager.Instance;            // 남의 것 - Awake가 다 끝난 뒤라 안전
    gm.Register(this);
}
```
| | `Awake` | `Start` |
|---|---|---|
| 시점 | 생성 직후 | 첫 Update 직전 |
| 비활성 오브젝트 | **호출됨** | 호출 안 됨(활성화 시 호출) |
| 순서 보장 | 오브젝트 간 보장 X | 모든 Awake 이후 |
| 코루틴 | 사용 불가(권장 X) | 사용 가능 |

- `SetActive(false)` 상태로 씬에 있는 오브젝트는 `Awake`도 호출되지 않는다(정확히는 활성화되는 순간 호출).

**꼬리질문**
- **Q.** 싱글턴 인스턴스는 어디서 초기화해야 하나?
  **A.** `Awake`다. 다른 스크립트가 `Start`에서 접근할 때 이미 준비되어 있어야 하기 때문이다. 다만 `Awake` 간 순서는 보장되지 않으므로, 다른 스크립트의 `Awake`에서 싱글턴에 접근하는 건 여전히 위험하다. 그래서 **Script Execution Order로 매니저를 앞당기거나, 지연 초기화(lazy) 프로퍼티**를 쓴다. → Q3-07.

---

## Q3-05. 스크립트 실행 순서는 어떻게 정해지나?

**30초 답변**
> 기본적으로는 **정해지지 않았습니다.** 같은 생명주기 함수끼리는 Unity 내부 순서에 따르는데 이에 의존하면 안 됩니다. 명시적으로 정하려면 **Project Settings의 Script Execution Order**에서 스크립트별 우선순위를 지정하거나, `[DefaultExecutionOrder(-100)]` 어트리뷰트를 붙입니다. 값이 작을수록 먼저 실행됩니다.

**상세 설명**
```csharp
[DefaultExecutionOrder(-100)]     // 다른 스크립트보다 먼저
public class GameManager : MonoBehaviour { }
```
- 순서 의존이 필요한 대표 상황: ① 매니저/싱글턴 초기화, ② 입력 시스템이 다른 로직보다 먼저 갱신되어야 할 때, ③ 카메라가 항상 마지막에 갱신되어야 할 때.
- **더 나은 접근**: 실행 순서에 의존하는 설계 자체를 줄이는 것이다. `Awake`/`Start` 분리, 지연 초기화, 이벤트 기반 통신으로 순서 의존을 없애는 게 유지보수에 좋다.

**꼬리질문**
- **Q.** 순서에 의존하는 코드가 왜 위험한가?
  **A.** 팀원이 스크립트를 추가하거나 Unity 버전이 바뀌면 순서가 달라져 **재현하기 어려운 버그**가 생긴다. 특히 에디터에서는 되는데 빌드에서만 실패하는 경우가 흔하다.

---

## Q3-06. 델타 타임이란? 왜 필요한가?

**30초 답변**
> `Time.deltaTime`은 **이전 프레임부터 현재 프레임까지 걸린 시간(초)** 입니다. 프레임률은 기기와 상황에 따라 계속 달라지는데, 이동량에 델타 타임을 곱하면 **"초당 몇 유닛"** 이라는 실제 시간 기준이 되어 프레임률과 무관하게 같은 속도로 움직입니다. 곱하지 않으면 60fps 기기가 30fps 기기보다 두 배 빠르게 움직이는 버그가 됩니다.

**상세 설명**
```csharp
// 나쁨 - 프레임률에 따라 속도가 달라짐
transform.Translate(Vector3.forward * speed);

// 좋음 - 초당 speed 유닛으로 일정
transform.Translate(Vector3.forward * speed * Time.deltaTime);
```
- `FixedUpdate`에서는 `Time.fixedDeltaTime`을 쓴다(항상 고정값).
- **`Time.deltaTime`은 `Time.timeScale`의 영향을 받는다.** 일시정지 중에도 움직여야 하는 UI 연출에는 `Time.unscaledDeltaTime`을 써야 한다.

**내 프로젝트 연결**
- `winapi_핵심정리.md` **7번** — WinAPI에서 **타이머 기반 게임 루프를 직접 구현**하며 델타타임 개념을 다뤘다. Unity의 `Time.deltaTime`이 엔진이 대신 계산해주는 것임을 이해하고 있다는 근거가 된다.
- `unity_핵심정리.md` 3-11 — `AnimationCurve`로 커스텀 이징 곡선 구현(시간 기반 보간).

**꼬리질문**
- **Q.** `Lerp`에 `deltaTime`을 쓰는 게 맞나?
  **A.** `Vector3.Lerp(a, b, t * Time.deltaTime)` 형태는 흔히 쓰이지만 **엄밀히는 프레임률 독립적이지 않다.** 매 프레임 남은 거리의 일정 비율만큼 가는 지수 감쇠라서, 프레임률이 다르면 결과가 미세하게 달라진다. 정확히 하려면 `1 - Mathf.Exp(-k * Time.deltaTime)` 형태를 쓴다. 실무에선 대부분 무시하지만, 알고 있으면 좋은 인상을 준다.
- **Q.** 프레임률이 급락하면 어떤 문제가 생기나?
  **A.** `deltaTime`이 커져서 한 프레임에 이동량이 과도해지고, **빠른 물체가 벽을 뚫는 터널링** 현상이 생긴다. 대응책은 Rigidbody의 **Collision Detection을 Continuous로** 설정하거나, `Time.maximumDeltaTime`으로 상한을 두는 것이다.

---

## Q3-07. 프로젝트에서 사용한 싱글턴에 대해 설명하라 `★★`

> **실제 면접에서 나온 질문.** 개념 설명보다 **"내가 어떻게 썼고 어떤 문제를 겪었나"** 를 말하는 게 핵심이다.

**30초 답변**
> 싱글턴은 **클래스의 인스턴스가 프로그램 전체에 하나만 존재하도록 보장하고 전역 접근점을 제공**하는 패턴입니다. 게임에서는 GameManager, SoundManager처럼 여러 씬에서 하나만 있어야 하는 매니저에 씁니다. 저는 이걸 **세 단계로 발전시켜봤는데**, 처음엔 `Awake`에서 정적 필드에 자기를 대입하는 방식이었고, 다음엔 중복 인스턴스를 파괴하고 `DontDestroyOnLoad`를 붙였으며, 마지막엔 **제네릭 베이스 클래스로 만들어 매니저마다 코드를 반복하지 않도록** 했습니다.

**상세 설명**
```csharp
// 1단계 - 가장 단순
public class GameManager : MonoBehaviour {
    public static GameManager Instance;
    void Awake() { Instance = this; }        // 중복 시 나중 것이 덮어씀
}

// 2단계 - 중복 방지 + 씬 유지
void Awake() {
    if (Instance != null && Instance != this) { Destroy(gameObject); return; }
    Instance = this;
    DontDestroyOnLoad(gameObject);
}

// 3단계 - 제네릭 베이스 (자기 참조 제약)
public class MonoSingleton<T> : MonoBehaviour where T : MonoSingleton<T> {
    private static T instance;
    public static T Instance {
        get {
            if (instance == null) instance = FindObjectOfType<T>();
            return instance;
        }
    }
}
public class SoundManager : MonoSingleton<SoundManager> { }   // 상속만 하면 끝
```

**내 프로젝트 연결 — 이게 답변의 핵심**
- `unity_핵심정리.md` **5-8** — 순수 C# 싱글턴 vs `MonoBehaviour` 싱글턴 비교.
- `unity_핵심정리.md` **5-16** — `MonoSingleton1 → 2 → 3` 진화 과정. **`where T : MonoSingleton3<T>` 자기 참조 제약(CRTP류 패턴)** 까지 사용했다.
- `unity_핵심정리.md` **4-1** — SpaceShooter에서 정적 인스턴스 기반 매니저 패턴 적용.
- `unity_핵심정리.md` **15-1** — 로컬라이제이션을 **싱글턴 MonoBehaviour에서 정적 클래스로 리팩터링**한 사례. "싱글턴이 항상 답은 아니다"를 보여줄 수 있는 좋은 소재.
- `cpp_핵심정리.md` **20번** — C++에서 싱글턴 두 가지 구현과 **스레드 안전성** 문제를 다뤘고, **22번**에서 이중검사 잠금(DCLP)과 `call_once`까지 실습했다.

**꼬리질문**
- **Q.** 싱글턴의 단점은?
  **A.** ① **전역 상태**라 어디서든 바뀔 수 있어 버그 추적이 어렵고, ② 의존성이 코드에 숨겨져서(파라미터로 안 드러남) **결합도가 높아지며**, ③ **단위 테스트가 어렵고**, ④ 생명주기 관리가 까다롭다(씬 전환, 종료 순서). 그래서 남용하지 말고 정말 하나여야 하는 것에만 써야 한다.
- **Q.** 싱글턴 대신 뭘 쓸 수 있나?
  **A.** ① **의존성 주입(DI)** — 필요한 참조를 인스펙터나 생성자로 주입, ② **`ScriptableObject` 기반 아키텍처** — 데이터/이벤트 채널을 에셋으로 만들어 참조, ③ **정적 클래스** — 상태가 없고 유틸리티성이면 이게 더 단순하다(내 로컬라이제이션 리팩터링이 이 경우), ④ **서비스 로케이터**.
- **Q.** `MonoBehaviour` 싱글턴에서 조심할 점은?
  **A.** ① **씬 전환 시 파괴**되므로 `DontDestroyOnLoad`가 필요하고, ② 그러면 씬을 다시 로드할 때 **중복 인스턴스**가 생기므로 방어 코드가 필수다. ③ 애플리케이션 종료 중에 `Instance`에 접근하면 이미 파괴된 객체를 되살리려다 **유령 오브젝트**가 남는 문제가 유명하다(`isQuitting` 플래그로 방어). ④ `FindObjectOfType`은 느리므로 매번 호출하면 안 된다.
- **Q.** C++에서는 어떻게 다른가?
  **A.** C++에선 **스레드 안전성**이 큰 이슈다. 두 스레드가 동시에 인스턴스를 만들 수 있어 이중검사 잠금(DCLP)이나 `std::call_once`, 또는 함수 내 지역 정적 변수(Meyers 싱글턴)를 쓴다. Unity는 게임 로직이 메인 스레드에서만 도니까 이 문제가 덜하다. → `cpp_핵심정리.md` 20·22번.

---

## Q3-08. `MonoBehaviour`를 `new`로 만들면 왜 안 되나?

**30초 답변**
> `MonoBehaviour`는 C# 객체이면서 동시에 **엔진 내부의 네이티브 C++ 객체와 짝을 이루는** 구조입니다. `new`로 만들면 C# 껍데기만 생기고 네이티브 쪽이 없어서 `transform`이나 `gameObject` 접근이 실패하고, **`Awake`/`Start`/`Update` 같은 생명주기 콜백도 전혀 호출되지 않습니다.** 반드시 `AddComponent<T>()`나 `Instantiate`로 만들어야 합니다.

**상세 설명**
```csharp
// 잘못됨 - 경고가 뜨고 생명주기가 안 돈다
MyScript s = new MyScript();

// 올바름
MyScript s1 = gameObject.AddComponent<MyScript>();
GameObject go = Instantiate(prefab);
```
- Unity가 `"You are trying to create a MonoBehaviour using the 'new' keyword"` 경고를 띄운다.
- 같은 이유로 `ScriptableObject`도 `new`가 아니라 `ScriptableObject.CreateInstance<T>()`로 만들어야 한다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **5-7** — `MonoBehaviour`를 `new`로 생성하면 안 되는 이유를 **직접 실험한 코드(`Property.cs`)**. `00_작업계획.md`에도 "좋은 발견이었다"고 기록해둔 항목이다.

**꼬리질문**
- **Q.** 그럼 로직 클래스는 어떻게 만드나?
  **A.** `MonoBehaviour`를 상속하지 않는 **순수 C# 클래스**로 만들면 `new`로 자유롭게 생성할 수 있고, 오히려 테스트하기 쉽고 가볍다. "모든 클래스를 `MonoBehaviour`로 만들 필요는 없다"가 중요한 설계 원칙이다.
  > `winapi_핵심정리.md` 10번의 **엔진/윈도우 책임 분리**와 같은 발상이다 — UI/프레임워크에 묶이는 부분과 순수 로직을 분리한다.
- **Q.** `MonoBehaviour`에 생성자를 쓰면?
  **A.** 쓸 수는 있지만 **Unity가 언제 호출할지 보장하지 않고**, 메인 스레드가 아닌 곳에서 불릴 수도 있어 Unity API 호출이 위험하다. 초기화는 반드시 `Awake`/`Start`에서 해야 한다.

---

## Q3-09. `GetComponent`는 왜 캐싱해야 하나?

**30초 답변**
> `GetComponent`는 **오브젝트에 붙은 컴포넌트 목록을 순회하며 타입을 검사**하는 작업이라 공짜가 아닙니다. `Update`에서 매 프레임 호출하면 초당 수십~수백 번 반복되어 누적 비용이 큽니다. `Awake`나 `Start`에서 한 번 받아 필드에 저장해두고 재사용하는 게 기본입니다.

**상세 설명**
```csharp
// 나쁨
void Update() { GetComponent<Rigidbody>().AddForce(f); }

// 좋음
private Rigidbody rb;
void Awake() { rb = GetComponent<Rigidbody>(); }
void Update() { rb.AddForce(f); }
```
- 더 나쁜 것: **`GameObject.Find`, `FindObjectOfType`, `FindGameObjectsWithTag`** — 씬 전체를 훑기 때문에 `GetComponent`보다 훨씬 비싸다. 절대 `Update`에서 쓰면 안 되고, 가능하면 인스펙터 참조나 등록 방식으로 대체한다.
- `TryGetComponent<T>(out var c)`는 컴포넌트가 없을 때 **할당 없이** 실패를 알려줘서 `GetComponent` + null 체크보다 낫다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **1-5** — **`GetComponent` 캐싱 세 가지 접근법 비교**를 직접 실습해 정리한 항목. 이 질문에 정확히 대응한다.
- `unity_핵심정리.md` 2-1 — 태그/레이어 기반 탐색 + 물리 오버랩 판정.

**꼬리질문**
- **Q.** 참조를 얻는 방법 중 뭐가 가장 좋은가?
  **A.** 우선순위는 ① **인스펙터에서 직접 드래그해 연결**(비용 0, 가장 명확), ② `Awake`에서 `GetComponent` 캐싱, ③ 이벤트/등록 방식(오브젝트가 스스로 매니저에 등록), ④ 최후에 `Find` 계열. 인스펙터 연결이 안 되는 동적 생성 오브젝트에만 코드 탐색을 쓴다.
- **Q.** `[RequireComponent]`는 뭔가?
  **A.** 스크립트에 붙이면 해당 컴포넌트가 없을 때 **자동으로 추가**되고 제거도 막아준다. `GetComponent` 결과가 `null`일 걱정을 줄여주는 안전장치다.

---

## Q3-10. 코루틴이란? 스레드와 뭐가 다른가?

**30초 답변**
> 코루틴은 **실행을 중간에 멈췄다가 나중에 그 지점부터 재개할 수 있는 함수**입니다. C#의 `IEnumerator`와 `yield return` 문법을 활용한 것으로, Unity가 매 프레임 내부적으로 `MoveNext()`를 호출해 이어서 실행합니다. **스레드가 아니라 메인 스레드에서 돌기 때문에**, 코루틴 안에서 무거운 계산을 하면 여전히 프레임이 멈춥니다. 시간 흐름에 따른 연출이나 단계적 처리에 적합합니다.

**상세 설명**
```csharp
IEnumerator FadeOut() {
    float t = 0;
    while (t < 1f) {
        t += Time.deltaTime;
        img.color = new Color(1,1,1, 1-t);
        yield return null;                    // 다음 프레임까지 대기
    }
    yield return new WaitForSeconds(1f);      // 1초 대기 (timeScale 영향 받음)
    yield return new WaitForSecondsRealtime(1f);  // timeScale 무시
    yield return StartCoroutine(Other());     // 다른 코루틴 완료까지 대기
    yield return www.SendWebRequest();        // 네트워크 완료까지 대기
}
StartCoroutine(FadeOut());
```
| | 코루틴 | 스레드 |
|---|---|---|
| 실행 위치 | **메인 스레드** | 별도 스레드 |
| 병렬성 | 없음(협력적 양보) | 진짜 병렬 |
| Unity API | **호출 가능** | 호출 불가 |
| 무거운 계산 | **프레임 멈춤** | 안 멈춤 |
| 동기화 | 불필요 | 락 필요 |

**내 프로젝트 연결**
- `unity_핵심정리.md` **1-4**(코루틴과 `yield return` 기초), **2-8**(코루틴 자기 재귀 호출 + 레거시 문법), **3-6**(주기적 실행 3가지 방법 비교).
- `unity_핵심정리.md` **8-6** — zombieStudy의 **코루틴 기반 우선순위 상태머신(FSM)**. 코루틴을 상태 관리에 쓴 고급 사례다.
- `unity_핵심정리.md` **18-5** — A* 길찾기를 **동기 → 수동 스텝 → 코루틴 시각화** 3단계로 발전시킨 사례. 주석에 **"재귀 함수 호출의 제한으로 프로그램이 강제 종료될 수 있다"** 고 적고 코루틴을 택한 이유까지 남겨뒀다.

**꼬리질문**
- **Q.** 코루틴이 멈추는 경우는?
  **A.** ① `StopCoroutine`/`StopAllCoroutines` 호출, ② **`GameObject`가 `Destroy`될 때**, ③ **`SetActive(false)`로 비활성화될 때**(다시 켜도 재개되지 않고 완전히 끝난다 — 자주 놓치는 함정), ④ 스크립트 컴포넌트만 `enabled = false`로 끄면 **코루틴은 계속 돈다**(이것도 함정).
- **Q.** 코루틴이 가비지를 만드나?
  **A.** 만든다. ① `StartCoroutine`이 반환하는 `Coroutine` 객체, ② `new WaitForSeconds(1f)`를 **매번 새로 만들면** 매번 할당된다. 반복되는 대기는 `private readonly WaitForSeconds wait = new WaitForSeconds(1f);`로 **캐싱**하는 게 정석이다. ③ `yield return null`은 할당이 없다.
- **Q.** 코루틴 대신 뭘 쓸 수 있나?
  **A.** ① `async`/`await`(반환값·예외 처리 필요 시), ② **UniTask**(할당 없는 async 구현, 실무에서 많이 씀), ③ 단순 타이머면 `Update`에서 누적 시간 체크, ④ `Invoke`/`InvokeRepeating`(단순 지연). → Q3-11.

---

## Q3-11. 코루틴과 `Invoke`의 차이는?

**30초 답변**
> `Invoke`는 **메서드 이름을 문자열로 받아 일정 시간 뒤 한 번 호출**하는 단순한 기능입니다. 코루틴은 **실행 흐름 자체를 중단·재개**할 수 있어 여러 단계의 시간 기반 로직을 자연스럽게 표현합니다. `Invoke`는 문자열 기반이라 오타가 컴파일에 안 잡히고 리팩터링에 취약하며 매개변수를 넘길 수 없어서, 대부분의 경우 코루틴이 낫습니다.

**상세 설명**
```csharp
Invoke("Explode", 2f);                    // 2초 뒤 1회. 문자열 - 오타 위험
InvokeRepeating("Spawn", 1f, 0.5f);       // 1초 뒤부터 0.5초마다 반복
CancelInvoke("Spawn");

// 코루틴 - 타입 안전, 매개변수 가능, 복잡한 흐름 표현 가능
IEnumerator ExplodeAfter(float delay, int power) {
    yield return new WaitForSeconds(delay);
    Explode(power);
}
```
| | `Invoke` | 코루틴 |
|---|---|---|
| 호출 방식 | **문자열**(오타 위험) | 메서드 직접 |
| 매개변수 | **불가** | 가능 |
| 복잡한 흐름 | 불가 | 가능 |
| `timeScale` | 영향 받음 | 선택 가능 |
| IL2CPP 스트리핑 | **위험**(리플렉션) | 안전 |

**내 프로젝트 연결**
- `unity_핵심정리.md` **4-7** — `Invoke`를 이용한 단발성 지연 실행 + 코루틴 반복을 함께 실습.
- `unity_핵심정리.md` **3-6** — 주기적 실행 3가지 방법(Update 폴링/코루틴/Invoke) 종합 비교.
- `unity_핵심정리.md` **1-8** — `Time.time` 기반 폴링으로 주기적 이벤트 구현.

**꼬리질문**
- **Q.** `Invoke`가 IL2CPP에서 왜 위험한가?
  **A.** 문자열로 메서드를 찾는 **리플렉션 기반**이라, 코드 스트리핑이 "아무도 호출하지 않는다"고 판단해 해당 메서드를 제거할 수 있다. 그러면 에디터에선 되는데 빌드에서만 조용히 실패한다. → Q3-33.

---

## Q3-12. 콜라이더란? `★★`

**30초 답변**
> 콜라이더는 **오브젝트의 물리적 충돌 형태를 정의하는 컴포넌트**입니다. 실제 눈에 보이는 메시와 별개로, 충돌 판정에 쓸 단순한 형태(박스, 스피어, 캡슐 등)를 지정합니다. `Rigidbody`와 함께 쓰면 물리 시뮬레이션의 대상이 되고, `isTrigger`를 켜면 물리적으로 밀어내지 않고 **통과하면서 감지만** 하는 영역이 됩니다.

**상세 설명**

| 종류 | 특징 | 비용 |
|---|---|---|
| **Box / Sphere / Capsule** | 기본 도형, 수학적으로 단순 | **저렴** |
| **Mesh Collider** | 실제 메시 형태 | **비쌈** |
| Mesh Collider (Convex) | 볼록 껍데기로 단순화 | 중간 |
| Terrain Collider | 지형 전용 | 중간 |

- **성능 원칙: 가능한 한 기본 도형(Primitive)을 쓴다.** 캐릭터도 실제 형태가 아니라 캡슐 콜라이더 하나로 처리하는 게 표준이다.
- **Mesh Collider끼리는 충돌하지 않는다**(둘 다 Convex가 아니면). 움직이는 오브젝트에는 Convex Mesh Collider나 기본 도형을 써야 한다.
- 여러 콜라이더를 자식으로 조합해 복잡한 형태를 근사하는 **컴파운드 콜라이더** 기법을 자주 쓴다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **2-2**(2D 트리거 충돌 `OnTriggerEnter2D`), **3-3**(`OnCollisionEnter2D` + 무적시간 패턴), **6-5**(3D 충돌 기반 데미지 시스템), **4-8**(트리거 기반 화면 밖 처리 구역).
- `unity_핵심정리.md` 6-4 — **래그돌 물리**(여러 콜라이더 + 조인트 조합).

**꼬리질문**
- **Q.** 충돌이 감지되려면 무슨 조건이 필요한가?
  **A.** **양쪽 모두 콜라이더가 있어야 하고, 적어도 한쪽에 `Rigidbody`가 있어야 한다.** 둘 다 `Rigidbody`가 없으면 Unity는 둘 다 정적(static)으로 간주해 충돌 검사를 하지 않는다. 매우 자주 나오는 실전 질문이다.
- **Q.** 정적 콜라이더를 움직이면 왜 안 되나?
  **A.** `Rigidbody` 없는 콜라이더는 Unity가 "절대 움직이지 않는다"고 가정해 **정적 충돌 트리를 미리 구워둔다.** `transform`으로 옮기면 이 구조를 통째로 다시 계산해야 해서 비용이 매우 크다. 움직여야 하면 `Rigidbody`를 붙이고 `isKinematic = true`로 두는 게 맞다.
- **Q.** 레이어 기반 충돌 최적화란?
  **A.** Project Settings의 **Layer Collision Matrix**에서 어떤 레이어끼리 충돌을 검사할지 체크박스로 끌 수 있다. 예를 들어 "아이템"과 "적 총알"이 충돌할 일이 없으면 꺼두면 검사 자체를 건너뛴다. 오브젝트가 많은 씬에서 효과가 크다.

---

## Q3-13. 트리거와 콜리전의 차이는?

**30초 답변**
> **콜리전(Collision)** 은 물리적으로 서로를 **밀어내는** 실제 충돌이고, `OnCollisionEnter`로 감지하며 충돌 지점·법선 같은 상세 정보(`Collision` 객체)를 받습니다. **트리거(Trigger)** 는 `isTrigger`를 켠 콜라이더로, 물리적 반응 없이 **통과하면서 겹침만 감지**하고 `OnTriggerEnter`로 알림을 받으며 인자로 상대 `Collider`만 받습니다. 아이템 획득 영역이나 세이브 포인트처럼 "닿았는지만 알면 되는" 경우에 트리거를 씁니다.

**상세 설명**
```csharp
void OnCollisionEnter(Collision col) {
    // 물리적 충돌. 접촉점, 충격량 등 상세 정보
    Vector3 point = col.contacts[0].point;
    float impulse = col.impulse.magnitude;
}
void OnTriggerEnter(Collider other) {
    // 겹침만 감지. 물리 반응 없음
    if (other.CompareTag("Player")) GiveItem();
}
```
| | Collision | Trigger |
|---|---|---|
| 물리적 반응 | **있음**(밀어냄) | 없음(통과) |
| 콜백 인자 | `Collision`(상세) | `Collider`(대상만) |
| 설정 | `isTrigger` 끔 | `isTrigger` 켬 |
| 용도 | 벽, 바닥, 물리 상호작용 | 획득 영역, 감지 구역 |

- 두 경우 모두 `Enter`/`Stay`/`Exit` 세 가지 콜백이 있다.
- **`OnCollisionStay`/`OnTriggerStay`는 매 물리 프레임 호출되므로 무거운 로직을 넣으면 안 된다.**

**내 프로젝트 연결**
- `unity_핵심정리.md` **2-2** — 2D 트리거 충돌 처리.
- `unity_핵심정리.md` **4-8** — SpaceShooter에서 **트리거 기반 화면 밖 처리 구역**으로 게임 흐름을 제어한 사례.
- `unity_핵심정리.md` **3-3** — `OnCollisionEnter2D` + **무적시간(Invincibility Frame) 패턴**.

**꼬리질문**
- **Q.** `CompareTag`를 쓰라는 이유는?
  **A.** `other.tag == "Player"` 는 `tag` 프로퍼티가 **문자열을 새로 할당**해서 가비지가 생긴다. `CompareTag("Player")`는 내부적으로 할당 없이 비교한다. 충돌 콜백은 자주 불리므로 차이가 누적된다.
- **Q.** 트리거인데 감지가 안 되는 경우는?
  **A.** ① 양쪽 다 `Rigidbody`가 없거나, ② Layer Collision Matrix에서 꺼져 있거나, ③ 콜라이더 크기가 너무 작아 빠른 이동 시 **한 프레임에 통과(터널링)** 했거나, ④ `isTrigger`를 한쪽만 켰는데 나머지 조건이 안 맞는 경우다.

---

## Q3-14. `Rigidbody`와 `isKinematic`을 설명하라

**30초 답변**
> `Rigidbody`는 오브젝트를 **물리 엔진의 제어 대상으로 만드는 컴포넌트**로, 중력·힘·충돌 반응을 자동으로 계산해줍니다. `isKinematic`을 켜면 **물리 힘의 영향은 받지 않지만 여전히 물리 시스템의 일부**로 남아서, 스크립트로 직접 위치를 옮기면서도 다른 물체를 밀어낼 수 있습니다. 플랫폼, 문, 애니메이션으로 움직이는 오브젝트에 씁니다.

**상세 설명**
```csharp
rb.AddForce(dir * power, ForceMode.Impulse);   // 힘을 가함 (물리적)
rb.MovePosition(newPos);                        // 물리 시스템을 통한 이동 (kinematic에 적합)
transform.position = newPos;                    // 물리 무시 - 충돌 뚫림 가능
```
| 상태 | 물리 영향 | 이동 방법 | 용도 |
|---|---|---|---|
| Rigidbody 없음 (Static) | 없음 | 옮기면 안 됨 | 벽, 지형 |
| Rigidbody (Dynamic) | **받음** | `AddForce` | 공, 상자 |
| Rigidbody + `isKinematic` | 안 받음 | `MovePosition`/`transform` | 플랫폼, 문 |

- **핵심 규칙: Dynamic Rigidbody를 `transform.position`으로 옮기지 마라.** 물리 엔진의 내부 상태와 어긋나 충돌을 놓치거나 이상하게 튄다. `MovePosition`이나 `AddForce`를 써야 한다.
- **Interpolate** 옵션: 물리는 `FixedUpdate` 주기로 갱신되는데 렌더링은 매 프레임이라 움직임이 끊겨 보일 수 있다. Interpolate를 켜면 프레임 사이를 보간해 부드럽게 만든다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **3-1** — `FixedUpdate` + 물리 기반 캐릭터 이동 실습.
- `unity_핵심정리.md` **6-2** — `CharacterController` 기반 3D 이동(물리 엔진 대신 쓰는 대안).
- `unity_핵심정리.md` **6-4** — 래그돌 물리(애니메이션 ↔ 물리 시뮬레이션 전환).
- `unity_핵심정리.md` **10-4** — AR에서 타겟 기울기를 **내적으로 계산해 물리 낙하를 트리거**한 사례.

**꼬리질문**
- **Q.** `CharacterController`와 `Rigidbody` 중 뭘 써야 하나?
  **A.** `CharacterController`는 **물리 엔진을 거치지 않고 직접 이동/충돌 처리**를 해서 캐릭터 조작감을 정밀하게 통제할 수 있다(즉각 정지, 정확한 계단 오르기). 대신 다른 물체에 힘을 가하거나 물리적으로 밀리지 않는다. 정확한 조작감이 중요한 플레이어 캐릭터는 `CharacterController`, 물리적 상호작용이 중요하면 `Rigidbody`를 쓴다.
- **Q.** 빠른 물체가 벽을 뚫는 문제는 어떻게 해결하나?
  **A.** **터널링**이라 하며, 한 물리 스텝 사이에 물체가 벽 두께보다 많이 이동해서 생긴다. 해결책은 ① Rigidbody의 **Collision Detection을 Continuous/Continuous Dynamic**으로 변경, ② Fixed Timestep을 줄이기, ③ 벽을 두껍게, ④ 총알 같은 건 물리 대신 **Raycast로 판정**하는 것이다(가장 흔한 방법).

---

## Q3-15. 레이캐스트란? `★★`

**30초 답변**
> 특정 지점에서 특정 방향으로 **가상의 광선을 쏘아 무엇에 맞았는지 알아내는 기능**입니다. 맞은 지점의 좌표, 표면 법선, 거리, 콜라이더 정보를 얻을 수 있습니다. 게임에서는 **총알 히트 판정, 바닥 접지 체크, 마우스 클릭으로 오브젝트 선택, 시야 확인(가려졌는지), 벽 감지** 등에 광범위하게 쓰입니다.

**상세 설명**
```csharp
RaycastHit hit;
if (Physics.Raycast(transform.position, transform.forward, out hit, 100f, layerMask)) {
    Debug.Log(hit.collider.name + " / 거리 " + hit.distance);
    Instantiate(effect, hit.point, Quaternion.LookRotation(hit.normal));
}

// 마우스 클릭으로 오브젝트 선택
Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
if (Physics.Raycast(ray, out hit)) { ... }

// 바닥 접지 체크
bool grounded = Physics.Raycast(transform.position, Vector3.down, 1.1f, groundLayer);
```
**관련 함수 계열**

| 함수 | 용도 |
|---|---|
| `Raycast` | 가장 가까운 하나 |
| `RaycastAll` | 관통하며 전부 (배열 할당 있음) |
| `RaycastNonAlloc` | 미리 만든 배열에 채움 (**할당 없음**) |
| `SphereCast`/`BoxCast` | 두께가 있는 광선 |
| `OverlapSphere` | 구 범위 안 모든 콜라이더 |
| `Linecast` | 두 점 사이 |

**내 프로젝트 연결**
- `unity_핵심정리.md` **7-3** — TempleRun에서 **Raycast 기반 접지/벽 판정**. 이 프로젝트의 `isGround` 판정 로직에 허점이 있다는 것도 발견해 기록해뒀다.
- `unity_핵심정리.md` **8-8** — zombieStudy의 **Raycast 기반 터렛 자동조준 + 최단거리 타겟팅**.
- `unity_핵심정리.md` **3-2** — Raycast/Overlap 기반 상태 판정.
- `unity_핵심정리.md` **2-1** — 물리 오버랩 판정.

**꼬리질문**
- **Q.** Raycast를 최적화하려면?
  **A.** ① **LayerMask로 검사 대상을 좁힌다**(가장 효과적), ② `maxDistance`를 실제 필요한 만큼만 지정, ③ 매 프레임 여러 번 쏘지 말고 필요한 프레임에만, ④ `RaycastAll` 대신 **`RaycastNonAlloc`** 으로 배열 할당 제거, ⑤ `QueryTriggerInteraction`으로 트리거 무시.
- **Q.** UI 위를 클릭했는지 어떻게 구분하나?
  **A.** `EventSystem.current.IsPointerOverGameObject()`로 확인한다. 이걸 안 하면 UI 버튼을 눌렀는데 그 뒤 3D 오브젝트까지 선택되는 **"클릭 관통" 버그**가 생긴다.
  > 실제로 다뤄봤다 — `unity_핵심정리.md` **5-15**가 **UI 이벤트 후킹 인터페이스로 클릭 관통 버그를 방지**한 항목이다.
- **Q.** 총알을 Rigidbody로 날리는 것과 Raycast로 판정하는 것 중 뭐가 낫나?
  **A.** 빠른 총알은 **Raycast(히트스캔)** 가 낫다. Rigidbody는 터널링으로 벽을 뚫을 수 있고 물리 연산 비용도 든다. 다만 포물선 궤적이나 느린 투사체(수류탄, 화살)는 실제 물리가 필요하므로 Rigidbody를 쓰거나, 궤적을 직접 계산하며 구간마다 Raycast로 검사하는 방식을 쓴다.

---

## Q3-16. 오브젝트 풀링이란? 왜 필요한가?

**30초 답변**
> 오브젝트를 필요할 때마다 `Instantiate`/`Destroy` 하는 대신, **미리 만들어두고 비활성화 상태로 보관했다가 꺼내 쓰고 다시 반납**하는 기법입니다. `Instantiate`는 메모리 할당과 컴포넌트 초기화 비용이 크고, `Destroy`된 객체는 **GC 대상 가비지**가 되어 프레임 스파이크를 유발합니다. 총알, 이펙트, 적처럼 **자주 생성·파괴되는 오브젝트**에 필수적입니다.

**상세 설명**
```csharp
public class BulletPool : MonoBehaviour {
    [SerializeField] private Bullet prefab;
    [SerializeField] private int initialSize = 50;
    private readonly Queue<Bullet> pool = new Queue<Bullet>();

    void Awake() {
        for (int i = 0; i < initialSize; i++) {
            var b = Instantiate(prefab, transform);
            b.gameObject.SetActive(false);
            pool.Enqueue(b);
        }
    }
    public Bullet Get() {
        var b = pool.Count > 0 ? pool.Dequeue() : Instantiate(prefab, transform);
        b.gameObject.SetActive(true);
        return b;
    }
    public void Release(Bullet b) {
        b.gameObject.SetActive(false);
        pool.Enqueue(b);
    }
}
```
**왜 Unity에서 특히 중요한가** (Q2-09와 연결)
- Unity의 Boehm GC는 **힙을 압축하지 않아** 할당/해제를 반복하면 **단편화가 누적**된다.
- 세대 구분이 없어 **힙이 커질수록 GC 스캔 시간이 길어진다.**
- 풀링은 애초에 할당을 만들지 않으므로 이 두 문제를 동시에 피한다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **4-2** — SpaceShooter에서 **오브젝트 풀링을 직접 구현**한 항목.
- `unity_핵심정리.md` **9-3** — VR 프로젝트에서 오브젝트 재활용 패턴을 다시 구현(TempleRun 7-2의 스트리밍 생성/삭제와 대비되는 실제 풀링 사례).
- `unity_핵심정리.md` **4-5** — `OnBecameInvisible()`로 화면 밖 오브젝트를 자동 회수(풀 반납 트리거).
- `unity_핵심정리.md` **7-2** — TempleRun의 엔드리스 러너 스트리밍 생성/삭제 패턴.

**꼬리질문**
- **Q.** 풀이 비었을 때는 어떻게 하나?
  **A.** 세 가지 전략이 있다. ① **동적 확장**(새로 `Instantiate`) — 안전하지만 그 순간 스파이크, ② **가장 오래된 것 재사용** — 개수 고정, 총알 같은 데 적합, ③ **요청 거부** — 상한이 명확한 경우. 실무에선 초기 크기를 충분히 잡고 ①을 폴백으로 두는 경우가 많다.
- **Q.** 풀링할 때 주의할 점은?
  **A.** **상태 초기화**다. 재사용 시 이전에 쓰던 값(HP, 속도, 코루틴, 이벤트 구독)이 남아있으면 버그가 된다. `OnEnable`에서 초기화하거나 `Reset()` 메서드를 두는 게 정석이다. 특히 **`Rigidbody`의 `velocity`를 0으로 안 되돌리면** 반납 전 속도로 튀어나가는 흔한 버그가 생긴다.
- **Q.** Unity에 내장 풀이 있나?
  **A.** 있다. Unity 2021부터 **`UnityEngine.Pool` 네임스페이스**에 `ObjectPool<T>`, `LinkedPool<T>`가 추가되어 직접 구현하지 않아도 된다. 생성/획득/반환/파괴 콜백을 델리게이트로 넘기는 구조다. 다만 직접 구현해본 경험이 있으면 동작 원리를 설명할 수 있어서 면접에 유리하다.

---

## Q3-17. 드로우 콜과 배칭을 설명하라

**30초 답변**
> 드로우 콜은 **CPU가 GPU에게 "이걸 그려라"라고 명령하는 호출**입니다. 호출마다 렌더 상태 설정 비용이 들어서, 개수가 많으면 GPU가 놀아도 **CPU가 병목**이 됩니다. 배칭은 **같은 재질을 쓰는 여러 오브젝트를 묶어 한 번에 그리는** 최적화로, 정적 배칭·동적 배칭·GPU 인스턴싱·SRP Batcher가 있습니다. 핵심 전제는 **재질(Material)을 공유하는 것**입니다.

**상세 설명**

| 기법 | 방식 | 조건 | 비고 |
|---|---|---|---|
| **Static Batching** | 빌드/로드 시 메시를 미리 결합 | 오브젝트가 Static, 같은 재질 | 메모리 사용 증가 |
| **Dynamic Batching** | 런타임에 CPU가 정점 합침 | 정점 수 제한(~900), 같은 재질 | CPU 비용, SRP에선 보통 끔 |
| **GPU Instancing** | 같은 메시를 한 번에 여러 개 | 같은 메시+재질, 인스턴싱 셰이더 | 나무·풀처럼 반복 오브젝트 |
| **SRP Batcher** | 드로우 콜은 유지하되 **상태 변경을 줄임** | URP/HDRP, 같은 셰이더 변형 | 현재 SRP의 기본 |

- **SRP Batcher는 드로우 콜 수를 줄이는 게 아니라 드로우 콜 사이의 렌더 상태 변경 비용을 줄인다.** 이 차이를 정확히 말하면 좋은 인상을 준다.
- 파이프라인별 권장: **Built-in RP** → Static Batching + GPU Instancing / **URP·HDRP** → SRP Batcher 우선, 반복 메시가 수천 개면 GPU Resident Drawer.
- **주의**: 오브젝트를 Static으로 표시해 배칭되면 Unity가 **해당 오브젝트의 GPU 인스턴싱을 비활성화**한다(둘은 동시에 적용되지 않는다).

**꼬리질문**
- **Q.** 배칭이 깨지는 대표적 원인은?
  **A.** ① **재질이 다름**(가장 흔함 — 텍스처만 달라도 다른 재질이면 안 묶임), ② 런타임에 `material` 프로퍼티에 접근하면 **재질 인스턴스가 복제**되어 배칭이 깨진다(읽기만 하려면 `sharedMaterial`을 써야 함), ③ 스케일이 음수이거나 비균등, ④ 라이트맵/라이트 프로브가 다름, ⑤ 그리는 순서 사이에 다른 재질이 끼어듦.
- **Q.** 재질을 공유하려면 어떻게 하나?
  **A.** **텍스처 아틀라스**로 여러 텍스처를 한 장으로 합치고 UV를 조정하면 하나의 재질로 여러 오브젝트를 그릴 수 있다. UI에서는 **Sprite Atlas**가 같은 역할을 한다.
- **Q.** 드로우 콜과 SetPass Call의 차이는?
  **A.** Unity Statistics 창에 둘 다 나온다. **SetPass Call은 렌더 상태(셰이더/재질)를 바꾸는 횟수**로, 실제 성능에는 드로우 콜 수보다 SetPass Call이 더 직접적인 영향을 준다. 그래서 SRP Batcher가 이걸 줄이는 데 집중하는 것이다.

**출처**: [Unity Manual - Optimizing draw calls](https://docs.unity.cn/Manual/optimizing-draw-calls.html), [SRP Batcher](https://docs.unity3d.com/Manual//SRPBatcher.html)

---

## Q3-18. 본인이 아는 최적화 방법을 설명하라 `★`

> 원본 엑셀 답변은 **구조체 패딩 얘기 하나뿐**이었다. 게임 클라 면접에서는 **범주를 나눠서** 답해야 한다.

**30초 답변**
> 크게 **CPU, GPU, 메모리** 세 축으로 나눠서 봅니다. CPU 쪽은 `Update`에서 도는 코드 줄이기, `GetComponent`/`Find` 캐싱, 오브젝트 풀링으로 GC 줄이기가 핵심이고, GPU 쪽은 드로우 콜 배칭, 텍스처 아틀라스, LOD, 컬링, 오버드로우 감소입니다. 메모리 쪽은 텍스처 압축, 에셋 언로드, 힙 할당 최소화입니다. **다만 무엇보다 먼저 프로파일러로 병목을 측정하는 게 순서입니다.**

**상세 설명**

**① CPU 최적화**
- `Update`에서 매 프레임 안 해도 되는 일 빼기(코루틴/이벤트/n프레임마다)
- `GetComponent`, `Find` 계열 캐싱 (`unity_핵심정리` 1-5)
- 오브젝트 풀링 (`unity_핵심정리` 4-2, 9-3)
- 문자열 연결·LINQ·박싱 제거 → GC 감소 (`02_CSharp.md` Q2-11)
- 물리: LayerMask 활용, Fixed Timestep 조정, 콜라이더 단순화
- `RaycastNonAlloc` 등 할당 없는 API

**② GPU 최적화**
- 드로우 콜 배칭 / 재질·아틀라스 공유 (Q3-17)
- **LOD**(거리별 저폴리 메시 교체)
- **오클루전 컬링 / 프러스텀 컬링** (Q3-20)
- **오버드로우 감소** — 반투명 겹침 줄이기, 파티클 화면 점유 줄이기
- 셰이더 단순화, 실시간 그림자 제한, 라이트맵 굽기
- 텍스처 해상도·밉맵 관리

**③ 메모리 최적화**
- 텍스처 압축 포맷(ASTC/ETC2 등 플랫폼별)
- 오디오 로드 타입 설정(짧은 건 Decompress on Load, 긴 건 Streaming)
- `Resources.UnloadUnusedAssets()`, Addressables로 필요한 것만 로드
- 힙 할당 최소화 → 단편화 방지 (Q2-09)

**내 프로젝트 연결**
- `unity_핵심정리.md` **1-5**(GetComponent 캐싱), **4-2**(오브젝트 풀링), **4-5**(화면 밖 자동 회수), **9-3**(오브젝트 재활용), **7-7**(매 프레임 문자열 할당 이슈 발견), **9-7**(플랫폼별 절전모드 방지).
- `cpp_핵심정리.md` **15번** — 구조체 패딩/메모리 정렬(원본 엑셀 답변의 그 내용. 저수준 최적화 축으로 언급하면 좋다).

**꼬리질문**
- **Q.** 가장 먼저 뭘 하겠나?
  **A.** **측정.** Unity Profiler로 CPU/GPU 중 어디가 병목인지, CPU라면 어느 함수가, 메모리라면 GC Alloc이 어디서 나는지 확인한다. 추측으로 고치면 효과 없는 곳만 건드리게 된다.
- **Q.** CPU 바운드인지 GPU 바운드인지 어떻게 구분하나?
  **A.** Profiler에서 **`Gfx.WaitForPresent`(CPU가 GPU를 기다림)** 가 크면 GPU 바운드, 반대로 스크립트/물리 시간이 크면 CPU 바운드다. 또 **해상도를 낮췄을 때 FPS가 크게 오르면 GPU 바운드**라는 간단한 판별법도 있다.

---

## Q3-19. 최적화는 어떻게 측정하나? (프로파일링)

**30초 답변**
> Unity **Profiler**로 프레임별 CPU/GPU/메모리 사용량을 봅니다. CPU 탭에서 어떤 함수가 오래 걸리는지, **GC Alloc 열에서 어느 코드가 프레임마다 힙 할당을 만드는지**를 확인하는 게 가장 중요합니다. 메모리 상세는 Memory Profiler 패키지, 렌더링 문제는 Frame Debugger로 드로우 콜 순서를 하나씩 뜯어봅니다. **반드시 에디터가 아니라 실제 기기 빌드에서 측정**해야 의미가 있습니다.

**상세 설명**

| 도구 | 용도 |
|---|---|
| **Profiler** | CPU/GPU/메모리/렌더링 시간, GC Alloc |
| **Frame Debugger** | 드로우 콜을 하나씩 단계별로 확인 |
| **Memory Profiler**(패키지) | 힙 스냅샷, 누수 추적 |
| **Profile Analyzer**(패키지) | 두 프로파일 결과 비교(개선 전후) |
| **Stats 창** | 드로우 콜, 배치, 삼각형 수 빠른 확인 |
| `Profiler.BeginSample/EndSample` | 내 코드 구간에 커스텀 마커 삽입 |

```csharp
Profiler.BeginSample("MyHeavyLogic");
DoHeavyThing();
Profiler.EndSample();
```
- **에디터 측정의 함정**: 에디터는 자체 오버헤드가 크고 IL2CPP도 아니라서 수치가 실제와 다르다. **Development Build + Autoconnect Profiler**로 실기기에서 재야 한다.
- **Deep Profile**은 모든 함수 호출을 추적해 정확하지만 매우 느려져서 전체 수치를 왜곡한다. 범위를 좁힐 때만 쓴다.

**꼬리질문**
- **Q.** 목표 수치는 어떻게 잡나?
  **A.** 60fps면 프레임당 **16.6ms**, 30fps면 **33.3ms** 안에 모든 작업이 끝나야 한다. 모바일은 발열/배터리까지 고려해 여유를 더 둔다. 그리고 **평균보다 최악 프레임(1% low)** 을 봐야 체감 품질과 맞는다.
- **Q.** GC Alloc 목표는?
  **A.** **매 프레임 0 B**가 이상적이다. 프레임마다 조금씩이라도 할당하면 결국 GC가 돌고 스파이크가 생긴다. 로딩이나 초기화 시점의 할당은 괜찮다.

---

## Q3-20. 프러스텀 컬링과 오클루전 컬링이란?

**30초 답변**
> 둘 다 **화면에 안 보이는 것을 안 그려서 GPU 부하를 줄이는** 기법입니다. **프러스텀 컬링**은 카메라의 시야 절두체(frustum) 밖에 있는 오브젝트를 제외하는 것으로 Unity가 자동으로 해줍니다. **오클루전 컬링**은 시야 안에는 있지만 **다른 물체에 완전히 가려진** 오브젝트를 제외하는 것으로, 미리 데이터를 구워야(bake) 동작합니다.

**상세 설명**
```
카메라 시야                    프러스텀 컬링: B 제외 (시야 밖)
   /\                          오클루전 컬링: C 제외 (벽 A에 가려짐)
  /  \  [A 벽] [C 상자]
 /____\                 [B 나무]
```
| | 프러스텀 컬링 | 오클루전 컬링 |
|---|---|---|
| 기준 | 카메라 시야 밖 | 다른 물체에 가려짐 |
| 설정 | **자동** | 사전 베이크 필요 |
| 비용 | 저렴 | 베이크 데이터 + 런타임 조회 |
| 효과적인 곳 | 항상 | 실내, 도시처럼 가림이 많은 씬 |

- 오클루전 컬링은 **오클루더(가리는 물체)와 오클루디(가려지는 물체)** 를 지정하고 씬을 베이크해야 한다.
- 넓은 개활지처럼 가리는 게 없는 씬에서는 **오히려 오버헤드만 늘 수 있다.**

**내 프로젝트 연결**
- `unity_핵심정리.md` **4-5** — `OnBecameInvisible()`로 화면 밖 오브젝트를 자동 회수한 사례. 렌더링 컬링과 게임 로직을 연결한 예다.
- `unity_핵심정리.md` **4-3** — 뷰포트 좌표계로 해상도 독립적 위치 계산.

**꼬리질문**
- **Q.** LOD는 뭔가?
  **A.** **Level of Detail** — 카메라에서 멀어질수록 폴리곤이 적은 저해상도 메시로 교체해 GPU 부하를 줄이는 기법이다. `LODGroup` 컴포넌트로 거리별 메시를 지정한다. 멀리 있으면 어차피 픽셀 몇 개로 보이니 디테일이 필요 없다는 원리다.
- **Q.** 오버드로우가 뭔가?
  **A.** **같은 픽셀을 여러 번 그리는 것**이다. 반투명 오브젝트나 파티클이 겹치면 심해지고, 모바일 GPU에서 특히 치명적이다. 씬 뷰의 Overdraw 모드로 확인할 수 있으며, 파티클 수를 줄이거나 화면 점유 면적을 줄여 대응한다.

---

## Q3-21. `ScriptableObject`에 대해 아는가? `★`

> 원본 엑셀에서 **링크만 있고 답변이 비어있던 문항.**

**30초 답변**
> `MonoBehaviour` 대신 상속받아 **씬의 게임오브젝트에 붙지 않고 데이터 그 자체를 `.asset` 파일로 저장**할 수 있게 해주는 클래스입니다. 아이템 정보, 밸런스 수치, 설정처럼 **게임 로직과 무관한 데이터를 코드에서 분리**하는 데 쓰며, 기획자가 코드를 몰라도 인스펙터에서 새 데이터를 만들 수 있습니다. 인스턴스가 하나라 **여러 오브젝트가 참조해도 메모리를 공유**한다는 이점도 있습니다.

**상세 설명**
```csharp
[CreateAssetMenu(fileName = "New Weapon", menuName = "Item/Weapon")]
public class Weapon : ScriptableObject {
    public string weaponName;
    public int damage;
    public Sprite icon;
}
```
- **프리팹과의 차이**: 프리팹은 씬에 인스턴스화되어 각자 상태를 갖지만, `ScriptableObject`는 **에셋 하나를 여럿이 공유**한다. 100마리 슬라임이 같은 `SlimeData`를 참조하면 데이터는 메모리에 한 벌만 있다.
- 활용: 아이템/스킬 데이터, 게임 밸런스 테이블, 이벤트 채널(SO 기반 아키텍처), 설정 프로필.
- **주의**: 에디터에서 런타임 중 값을 바꾸면 **에셋에 영구 저장**된다(플레이 종료 후에도 남음). 런타임 상태를 SO에 저장하면 안 된다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **5-22** — `Item`(기반) → `Equipment` → `Weapon` **`ScriptableObject` 상속 계층**을 직접 구현했다. `[CreateAssetMenu]`로 우클릭 메뉴에서 생성하는 것까지.
- `unity_핵심정리.md` **22-2** — 다차원 격자 데이터를 `ScriptableObject` 에셋으로 만든 사례(커스텀 에디터 툴).
- `unity_핵심정리.md` **5-23** — 커스텀 `PropertyAttribute`/`PropertyDrawer`로 인스펙터 조건부 표시.

**꼬리질문**
- **Q.** `ScriptableObject`는 `new`로 만들 수 있나?
  **A.** 안 된다. `ScriptableObject.CreateInstance<T>()`를 써야 한다. `MonoBehaviour`와 같은 이유로 Unity가 내부 초기화를 해줘야 하기 때문이다. → Q3-08.
- **Q.** 빌드된 게임에서 `ScriptableObject` 값을 바꾸면 저장되나?
  **A.** 저장되지 않는다. 빌드에서는 읽기 전용 데이터로 취급되어 다음 실행 시 원래 값으로 돌아온다. 저장이 필요한 데이터는 `PlayerPrefs`나 파일로 따로 관리해야 한다. **에디터에서만 저장되는 이 차이 때문에 "에디터에선 되는데 빌드에선 안 되는" 버그가 자주 난다.**
- **Q.** 어떤 생명주기 함수가 있나?
  **A.** `OnEnable`, `OnDisable`, `OnDestroy`, `OnValidate`가 있다. `Update`는 없다(씬 오브젝트가 아니므로). `OnValidate`는 인스펙터 값이 바뀔 때마다 호출되어 유효성 검사에 유용하다. → `unity_핵심정리.md` 5-24, 22-2.

---

## Q3-22. 프리팹(Prefab)이란?

**30초 답변**
> 게임오브젝트와 그 컴포넌트·자식 구조를 **재사용 가능한 템플릿으로 저장한 에셋**입니다. 프리팹을 수정하면 씬에 배치된 모든 인스턴스에 반영되고, 개별 인스턴스에서 값을 바꾸면 **오버라이드**로 기록되어 그 인스턴스만 달라집니다. 런타임에 `Instantiate`로 복제해 생성합니다.

**상세 설명**
- **프리팹 배리언트(Variant)**: 기존 프리팹을 상속하듯 파생시켜 일부만 다르게 만드는 것. 원본이 바뀌면 배리언트에도 반영된다(오버라이드한 부분 제외).
- **중첩 프리팹(Nested Prefab)**: 프리팹 안에 다른 프리팹을 넣는 것. Unity 2018.3부터 지원.
- 씬 파일에는 프리팹 참조(guid)와 오버라이드 정보만 저장되어 씬 파일이 가벼워지고 **병합 충돌도 줄어든다.**

**내 프로젝트 연결**
- `unity_핵심정리.md` **1-9** — `Instantiate` 문법의 버전별 변화를 정리.
- `unity_핵심정리.md` **12-6**, **22-x** 관련 — **씬 파일(`.unity`) YAML을 직접 열어 `MonoBehaviour` 블록의 `m_Script` guid와 `.meta` 파일 guid를 대조**해서 "어떤 스크립트가 실제로 어디 붙어있는지" 검증한 경험이 있다. 프리팹/씬이 guid로 참조를 관리한다는 걸 실제로 확인한 셈이다.

**꼬리질문**
- **Q.** `.meta` 파일은 왜 필요한가?
  **A.** Unity는 파일명이 아니라 **guid로 에셋을 참조**한다. `.meta` 파일이 그 guid와 임포트 설정을 담고 있어서, `.meta`를 지우면 새 guid가 발급되어 **모든 참조가 끊어진다.** 그래서 버전 관리에 `.meta` 파일을 반드시 포함해야 한다.
- **Q.** 프리팹 인스턴스의 오버라이드는 어떻게 관리하나?
  **A.** 인스펙터 상단의 Overrides 드롭다운에서 확인·적용(Apply)·되돌리기(Revert)할 수 있다. 오버라이드가 무분별하게 쌓이면 "프리팹을 고쳤는데 반영이 안 되는" 혼란이 생기므로 팀에서 규칙을 정하는 게 좋다.

---

## Q3-23. 씬 전환과 `DontDestroyOnLoad`를 설명하라

**30초 답변**
> `SceneManager.LoadScene`으로 씬을 전환하면 **기존 씬의 모든 오브젝트가 파괴**됩니다. `DontDestroyOnLoad(gameObject)`를 호출하면 그 오브젝트를 특수한 영역으로 옮겨 씬이 바뀌어도 살아남게 하며, GameManager·SoundManager 같은 전역 매니저에 씁니다. 큰 씬은 `LoadSceneAsync`로 비동기 로드하고 진행률(`progress`)로 로딩바를 표시합니다.

**상세 설명**
```csharp
SceneManager.LoadScene("Stage1");                          // 동기 - 프레임 멈춤
SceneManager.LoadScene("UI", LoadSceneMode.Additive);      // 기존 씬 유지하고 추가

IEnumerator LoadAsync(string name) {
    var op = SceneManager.LoadSceneAsync(name);
    op.allowSceneActivation = false;                        // 로딩 완료 후 대기
    while (op.progress < 0.9f) {                            // 0.9에서 멈춤에 주의
        bar.fillAmount = op.progress / 0.9f;
        yield return null;
    }
    op.allowSceneActivation = true;                         // 실제 전환
}
```
- **`progress`가 0.9에서 멈추는 이유**: 나머지 0.1은 씬 활성화 단계인데, `allowSceneActivation = false`면 그 단계로 진입하지 않고 대기한다. 이걸 모르면 로딩바가 90%에서 멈춘 것처럼 보인다. **자주 나오는 실전 질문이다.**
- Additive 로드는 UI를 별도 씬으로 분리하거나 오픈월드를 구역별로 스트리밍할 때 쓴다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **1-2** — `SceneManager.LoadScene` + `DontDestroyOnLoad` 기초.
- `unity_핵심정리.md` **1-3** — **비동기 씬 로딩과 로딩바 UI** 직접 구현.
- `unity_핵심정리.md` **20-6** — `PlayerPrefs` + `SceneManager.LoadScene`으로 씬 전환 시 상태 유지.
- `unity_핵심정리.md` **3-9** — Deprecated API 마이그레이션 사례로 `Application.loadedLevel` → `SceneManager` 전환을 다뤘다.

**꼬리질문**
- **Q.** `DontDestroyOnLoad`의 문제점은?
  **A.** ① 같은 씬을 다시 로드하면 **매니저가 중복 생성**되므로 싱글턴 방어 코드가 필수다(Q3-07). ② 이 오브젝트가 씬 오브젝트를 참조하고 있으면 **씬이 파괴돼도 참조가 남아 메모리 누수**가 된다. ③ 자식 오브젝트에는 적용되지 않고 루트 오브젝트에만 유효하다(자식이면 루트로 올라간 뒤 적용).
- **Q.** 씬 전환 시 데이터를 어떻게 넘기나?
  **A.** ① `DontDestroyOnLoad` 매니저에 저장, ② `static` 필드, ③ `ScriptableObject`에 저장(가장 깔끔한 편), ④ `PlayerPrefs`/파일. 상황에 따라 고르되 `static` 남용은 피하는 게 좋다.

---

## Q3-24. `Resources`, AssetBundle, Addressables의 차이는?

**30초 답변**
> `Resources` 폴더는 **모든 내용이 빌드에 무조건 포함되고 시작 시 인덱스가 로드**되어 간편하지만, 빌드 크기와 초기 로딩이 커져서 **Unity가 공식적으로 권장하지 않습니다.** AssetBundle은 에셋을 별도 패키지로 빌드해 **런타임에 필요할 때 다운로드/로드**할 수 있어 콘텐츠 업데이트가 가능하지만 의존성 관리를 직접 해야 합니다. **Addressables**는 그 위에 주소 기반 참조와 의존성·메모리 관리를 자동화한 현재의 표준 방식입니다.

**상세 설명**

| | `Resources` | AssetBundle | **Addressables** |
|---|---|---|---|
| 빌드 포함 | 전부 무조건 | 별도 패키지 | 별도 패키지 |
| 원격 업데이트 | 불가 | 가능 | 가능 |
| 의존성 관리 | 자동(비효율) | **수동** | **자동** |
| 메모리 해제 | `UnloadUnusedAssets` | `bundle.Unload` | 참조 카운팅 자동 |
| 현재 권장도 | ✗ 비권장 | △ 저수준 | **○ 표준** |

```csharp
// Addressables
var handle = Addressables.LoadAssetAsync<GameObject>("Enemy_Slime");
await handle.Task;
Instantiate(handle.Result);
Addressables.Release(handle);      // 참조 카운트 감소
```

**내 프로젝트 연결**
- `unity_핵심정리.md` **5-20** — **AssetBundle 빌드와 로드**를 직접 실습했다. `BuildPipeline.BuildAssetBundles`, 캐싱(`Caching.ready`), 비동기 로드, **`bundle.Unload(false)` vs `Unload(true)` 차이**까지 정리해뒀다.
- `unity_핵심정리.md` **8-10** — zombieStudy에서 AssetBundle 다운로드를 `WWW` → `UnityWebRequestAssetBundle`로 마이그레이션.
- `unity_핵심정리.md` **15-2** — CSV를 `Resources`에서 로드한 사례.

**꼬리질문**
- **Q.** `bundle.Unload(true)`와 `Unload(false)`의 차이는?
  **A.** `false`는 **이미 `Instantiate`된 오브젝트는 살려두고** 번들의 압축 데이터만 해제한다. `true`는 그 번들에서 로드된 **모든 객체까지 전부 파괴**해서, 화면에 있던 오브젝트가 갑자기 분홍색으로 깨져 보이는 버그로 이어진다. 실제로 실습하며 정리해둔 내용이다.
- **Q.** 왜 `Resources`를 쓰지 말라고 하나?
  **A.** ① 폴더 안 모든 에셋이 **쓰든 안 쓰든 빌드에 포함**되어 앱 크기가 커지고, ② 앱 시작 시 **전체 인덱스를 로드**해서 초기 구동이 느려지며(에셋이 많을수록 심각), ③ 문자열 경로 기반이라 오타에 취약하고, ④ 세밀한 메모리 해제가 어렵다. Unity 공식 문서에도 사용을 피하라고 명시되어 있다.

---

## Q3-25. Unity의 "Fake Null" 문제란?

**30초 답변**
> Unity 오브젝트를 `Destroy`하면 **네이티브 객체는 파괴되지만 C# 객체는 아직 남아있습니다.** Unity는 이를 감추려고 `==` 연산자를 오버로딩해서 파괴된 오브젝트가 `null`처럼 보이게 만듭니다. 문제는 **`?.`나 `??` 같은 null 조건 연산자는 이 오버로딩을 무시하고 실제 참조만 확인**하기 때문에 결과가 달라진다는 것입니다. 그래서 Unity 오브젝트에는 이 연산자들을 쓰면 안 됩니다.

**상세 설명**
```csharp
Destroy(myObject);
// 다음 프레임
if (myObject == null)      { }   // true  (Unity가 오버로딩한 == 사용)
if (myObject is null)      { }   // false (실제 C# 참조는 살아있음!)
myObject?.DoSomething();          // 실행됨! -> MissingReferenceException 발생
```
- 오버로딩된 `==`는 내부적으로 네이티브 객체 포인터가 유효한지 검사한다. 그래서 **비용도 일반 참조 비교보다 약간 비싸다**(매 프레임 수천 번이면 유의미).
- `?.`, `??`, `??=` 는 C# 언어 차원의 기능이라 연산자 오버로딩을 타지 않는다.

**꼬리질문**
- **Q.** 그럼 어떻게 체크해야 하나?
  **A.** 반드시 `if (obj != null)` 또는 `if (obj)` 형태를 쓴다(Unity `Object`에는 `bool` 변환도 오버로딩되어 있다). `?.`는 **순수 C# 객체에만** 쓴다.
- **Q.** 왜 Unity는 이렇게 설계했나?
  **A.** C# 객체와 C++ 네이티브 객체가 **1:1로 짝지어진 구조**이고, 네이티브 쪽 수명은 엔진이 관리한다. `Destroy` 시 C# 객체까지 즉시 없앨 수는 없으니(다른 곳에서 참조 중일 수 있음), "파괴됐다"는 상태를 `null`처럼 보이게 해서 개발자가 자연스럽게 다루도록 한 것이다. 편의를 위한 선택이지만 C# 문법과 충돌하는 부작용을 낳았다.

---

## Q3-26. `Destroy`와 `DestroyImmediate`의 차이는?

**30초 답변**
> `Destroy`는 **현재 프레임의 Update가 모두 끝난 뒤 파괴를 예약**하는 지연 방식이고, `DestroyImmediate`는 **즉시 파괴**합니다. 런타임에는 반드시 `Destroy`를 써야 하는데, 순회 중에 즉시 파괴하면 컬렉션이나 물리 상태가 꼬여 예측 불가능한 문제가 생기기 때문입니다. `DestroyImmediate`는 **에디터 스크립트에서만** 쓰는 게 원칙입니다.

**상세 설명**
```csharp
Destroy(go);              // 프레임 끝에 파괴 (런타임 표준)
Destroy(go, 3f);          // 3초 뒤 파괴
DestroyImmediate(go);     // 즉시 - 에디터 전용
```
- `Destroy` 직후에도 그 프레임 동안은 **오브젝트가 아직 살아있다.** `Destroy(go); go.SetActive(false);` 는 정상 동작한다.
- 씬을 편집하는 에디터 툴에서는 즉시 반영이 필요하므로 `DestroyImmediate`를 쓴다.

**내 프로젝트 연결**
- `unity_핵심정리.md` 22번(다차원배열에디터), 5-18~5-27(St3 에디터 확장) — 에디터 스크립트 작업 경험이 있어 이 구분을 실제로 마주쳤다.

**꼬리질문**
- **Q.** `Destroy` 대신 풀에 반납하면 뭐가 좋나?
  **A.** 파괴 자체를 안 하므로 **GC 가비지가 생기지 않고** 재생성 비용도 없다. Q3-16과 이어지는 답변이다.

---

## Q3-27. `Time.timeScale`로 일시정지를 구현할 때 주의점은?

**30초 답변**
> `Time.timeScale = 0`으로 두면 **`Time.deltaTime`이 0이 되고 `FixedUpdate`가 호출되지 않아** 물리와 시간 기반 로직이 멈춥니다. 다만 `Update` 자체는 계속 호출되고 **입력도 정상 동작**하며, `WaitForSeconds` 코루틴도 멈춥니다. 그래서 일시정지 중에도 움직여야 하는 UI 연출에는 `Time.unscaledDeltaTime`이나 `WaitForSecondsRealtime`을 써야 합니다.

**상세 설명**
```csharp
Time.timeScale = 0f;              // 일시정지
// - Time.deltaTime == 0
// - FixedUpdate 호출 안 됨
// - Update / LateUpdate 는 계속 호출됨
// - WaitForSeconds 는 진행 안 됨
// - WaitForSecondsRealtime, unscaledDeltaTime 은 정상 진행

Time.timeScale = 1f;              // 해제
Time.timeScale = 0.5f;            // 슬로우 모션
```
- **주의**: `Time.timeScale`을 바꾸면 `Time.fixedDeltaTime`은 자동으로 바뀌지 않는다. 슬로우 모션에서 물리 정밀도를 유지하려면 `Time.fixedDeltaTime = 0.02f * Time.timeScale` 처럼 같이 조정해야 한다.
- 오디오는 `timeScale`의 영향을 받지 않는다(`AudioSource.pitch`를 따로 조정해야 슬로우 효과가 난다).

**내 프로젝트 연결**
- `unity_핵심정리.md` **3-7** — `Time.timeScale`로 일시정지 구현을 직접 실습한 항목.

**꼬리질문**
- **Q.** `timeScale = 0`인데 애니메이션이 계속 도는 경우가 있다. 왜인가?
  **A.** Animator의 **Update Mode**가 `Unscaled Time`으로 되어 있으면 `timeScale`을 무시한다. 반대로 UI 애니메이션을 일시정지 중에도 돌리고 싶으면 일부러 이 설정을 쓴다.
- **Q.** 파티클도 멈추나?
  **A.** 기본적으로는 멈춘다. `ParticleSystem`의 Main 모듈에서 **Simulation Space/Custom Simulation Speed** 및 Unscaled Time 옵션으로 제어할 수 있다.
  > `unity_핵심정리.md` 17-5에서 **파티클 시스템 모듈별 스터디 그리드**를 만들어 SimulationSpace 등을 실험해본 적이 있다.

---

## Q3-28. Animator와 Mecanim, `StateMachineBehaviour`란?

**30초 답변**
> Mecanim은 Unity의 애니메이션 시스템이고, **Animator Controller**는 애니메이션 클립들을 **상태(State)와 전이(Transition)로 구성한 상태 기계**입니다. 파라미터(`Bool`/`Int`/`Float`/`Trigger`)로 전이 조건을 정의하고 스크립트에서 그 값만 바꾸면 애니메이션이 알아서 전환됩니다. **`StateMachineBehaviour`**는 각 상태에 붙이는 스크립트로 `OnStateEnter`/`OnStateUpdate`/`OnStateExit` 콜백을 제공해, 상태별 로직을 애니메이터 쪽에 둘 수 있게 합니다.

**상세 설명**
```csharp
animator.SetFloat("Speed", velocity.magnitude);
animator.SetBool("IsGrounded", grounded);
animator.SetTrigger("Attack");                   // 한 번만 발동하고 자동 리셋

// 문자열 대신 해시를 캐싱하면 더 빠름
private static readonly int SpeedHash = Animator.StringToHash("Speed");
animator.SetFloat(SpeedHash, v);
```
- **Has Exit Time**: 켜면 현재 애니메이션이 지정 비율만큼 재생된 뒤에야 전이한다. 공격 모션이 끝까지 나와야 할 때 켜고, 즉각 반응해야 하는 이동 전환에는 꺼야 한다. **안 끄면 "입력했는데 반응이 늦다"는 흔한 문제가 생긴다.**
- **Blend Tree**: 파라미터 값에 따라 여러 클립을 섞는다(걷기↔뛰기 등).
- **Animation Event**: 클립의 특정 프레임에 함수 호출을 심어 발소리·타격 판정 타이밍을 맞춘다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **13-2** — **`StateMachineBehaviour` 활용법**을 직접 실습.
- `unity_핵심정리.md` **13-1** — FSM을 **절차적 `if/else` → 순수 C# State 패턴 → Animator `StateMachineBehaviour`** 세 가지 방식으로 다시 구현한 비교 사례. 매우 좋은 면접 소재다.
- `unity_핵심정리.md` **13-3** — Animator 파라미터/트랜지션으로 상태 전환 제어(책임 분리 관점).
- `unity_핵심정리.md` **7-6** — 레거시 `Animation`에서 Mecanim `Animator`로 직접 업그레이드한 사례.
- `unity_핵심정리.md` **20-4** — Animator 파라미터 트랜지션 + `Has Exit Time`.
- `unity_핵심정리.md` **2-5**, **6-3**, **8-9** — 애니메이션 이벤트, 레거시 `Animation`/`CrossFade`/`PlayQueued`, 인덱서 제어.

**꼬리질문**
- **Q.** 레거시 `Animation`과 `Animator`의 차이는?
  **A.** 레거시 `Animation`은 클립을 **코드에서 직접 재생**(`anim.Play("jump")`)하는 단순한 방식이고, `Animator`는 **상태 기계로 전이를 관리**하며 블렌딩·레이어·IK·Humanoid 리타게팅을 지원한다. 신규 프로젝트는 무조건 `Animator`를 쓴다.
  > 실제로 TempleRun 프로젝트에서 **강의 자료의 레거시 `Animation` 코드를 학생 본인이 `Animator`로 업그레이드한 흔적**을 확인했다(옛 코드가 주석으로 남아있음). `unity_핵심정리.md` 7-6.
- **Q.** `SetTrigger`가 예상대로 동작 안 하는 경우는?
  **A.** Trigger는 **소비될 때까지 남아있어서**, 전이 조건이 안 맞는 상황에서 세팅되면 나중에 엉뚱한 타이밍에 발동한다. `ResetTrigger`로 명시적으로 지우거나 애초에 `Bool`을 쓰는 게 안전한 경우가 많다.
- **Q.** FSM을 Animator로 하는 것과 코드로 하는 것 중 뭐가 낫나?
  **A.** Animator는 **시각적으로 보이고 애니메이션과 자연스럽게 묶인다**는 장점이 있지만, 상태가 많아지면 그래프가 복잡해지고 디버깅과 버전 관리가 어렵다. 코드 FSM은 로직 표현과 테스트가 쉽지만 애니메이션 연동을 직접 해야 한다. **실무에선 애니메이션 전환은 Animator, 게임 로직 상태는 코드 FSM으로 분리**하는 경우가 많다. 세 방식을 다 구현해본 경험(13-1)으로 이 판단 근거를 설명할 수 있다.

---

## Q3-29. uGUI 캔버스 최적화 방법은?

**30초 답변**
> 핵심은 **캔버스를 분리하는 것**입니다. 캔버스 안의 UI 요소가 하나라도 바뀌면 **그 캔버스 전체가 다시 배칭(rebuild)** 되기 때문에, 자주 변하는 요소(체력바, 점수)와 정적인 요소를 **다른 캔버스로 나눠야** 합니다. 그 외에 Raycast Target 끄기, 레이아웃 그룹 남용 피하기, Sprite Atlas로 드로우 콜 줄이기, 비활성화 대신 캔버스 그룹 알파 조절 등이 있습니다.

**상세 설명**

| 문제 | 대응 |
|---|---|
| 요소 하나 바뀌면 캔버스 전체 리빌드 | **캔버스 분리**(정적/동적) |
| 모든 이미지가 레이캐스트 대상 | 클릭 불필요한 것은 **Raycast Target 해제** |
| Layout Group이 매 변경마다 재계산 | 정적 배치는 앵커로 직접 배치 |
| UI 이미지마다 드로우 콜 | **Sprite Atlas**로 묶기 |
| `SetActive` 토글이 리빌드 유발 | `CanvasGroup.alpha`나 별도 캔버스 |
| 화면 밖 UI도 계산 | 필요 없으면 캔버스 자체를 비활성화 |
| 매 프레임 텍스트 갱신 | **값이 바뀔 때만** 갱신 |

**내 프로젝트 연결**
- `unity_핵심정리.md` **3-8** — 모바일 대응(조이스틱 입력 + 해상도별 UI 스케일링).
- `unity_핵심정리.md` **5-15** — UI 이벤트 후킹 인터페이스로 클릭 관통 방지.
- `unity_핵심정리.md` **17-3** — Animator 기반 UI 버튼 상태 애니메이션.
- `unity_핵심정리.md` **17-7** — TextMeshPro SDF 폰트 커스터마이징.

**꼬리질문**
- **Q.** Canvas의 Render Mode 세 가지는?
  **A.** **Screen Space - Overlay**(항상 화면 최상단, 카메라 무관), **Screen Space - Camera**(카메라에 종속되어 3D 오브젝트와 섞이거나 원근 효과 가능), **World Space**(3D 공간에 배치되는 UI — VR이나 캐릭터 머리 위 체력바에 사용).
  > `unity_핵심정리.md` 9-2에서 VR **응시 시간(Dwell Time) 게이지 UI**를 만들 때 World Space 캔버스를 다뤘다.
- **Q.** TextMeshPro를 쓰는 이유는?
  **A.** 기존 `Text`는 비트맵 폰트라 확대하면 깨지지만, TMP는 **SDF(Signed Distance Field)** 방식이라 크기와 무관하게 선명하고 외곽선·그림자·그라데이션 같은 효과를 셰이더로 처리할 수 있다. Unity에서 사실상 표준이 되어 기본 `Text`는 레거시로 밀려났다.

---

## Q3-30. NGUI를 써본 적이 있는가? `★★`

> 원본 엑셀에서 **답변이 비어있던 문항.** 실제 면접에서 나온 질문이다.

**30초 답변**
> 직접 써본 적은 없습니다. NGUI는 Unity에 내장 UI 시스템이 없던 시절 사실상 표준으로 쓰이던 **서드파티 에셋**인데, Unity 4.6에서 **uGUI가 공식 도입되면서 대체**되었습니다. 저는 uGUI와 TextMeshPro를 사용했고, 현재 Unity가 밀고 있는 **UI Toolkit**도 에디터 확장 작업을 하며 접해봤습니다. NGUI는 아틀라스 기반 드로우 콜 최적화나 뎁스 기반 렌더 순서 같은 개념을 먼저 도입했고, 그 아이디어들이 uGUI에 상당 부분 반영되었다고 알고 있습니다.

**상세 설명 (배경 지식)**

| | NGUI | uGUI | UI Toolkit |
|---|---|---|---|
| 제공 | 서드파티 에셋(유료) | **Unity 내장**(4.6~) | Unity 내장(신규) |
| 방식 | GameObject 기반 | GameObject 기반 | **UXML/USS**(웹 유사) |
| 현재 위치 | 레거시 | **런타임 표준** | 에디터 표준, 런타임 확대 중 |

- 오래된 프로젝트를 유지보수하는 회사라면 여전히 NGUI를 쓰는 경우가 있어서 이런 질문이 나온다.
- **모르는 걸 아는 척하면 안 된다.** "안 써봤다"고 솔직히 말하되 **배경 지식과 대체 기술 경험**을 붙이는 게 최선의 답변이다.

**내 프로젝트 연결**
- uGUI: `unity_핵심정리.md` 3-8, 5-15, 17-3, 17-7.
- UI Toolkit 관련: `unity_핵심정리.md` 5-19, 5-25, 22-3 — **에디터 확장(IMGUI 기반)** 을 다수 해봤고, Unity가 이 영역을 UI Toolkit으로 옮기고 있다는 흐름도 정리해뒀다.

**꼬리질문**
- **Q.** 안 써봤다면 새 UI 프레임워크를 어떻게 학습하겠나?
  **A.** 공식 문서로 기본 개념(레이아웃, 이벤트, 배칭 방식)을 파악하고, 기존 프로젝트에서 **드로우 콜과 리빌드가 어떻게 일어나는지 프로파일러로 확인**하면서 익히겠다. UI 시스템은 결국 "언제 배칭이 깨지는가"를 이해하는 게 핵심이라 그 관점은 uGUI 경험에서 이어진다.

---

## Q3-31. 에디터 확장을 해본 적 있는가?

**30초 답변**
> 여러 번 해봤습니다. `[MenuItem]`으로 상단 메뉴에 기능을 추가하고, `[CustomEditor]`로 인스펙터를 직접 그리고, `EditorWindow`로 독립 도구 창을 만들었습니다. 커스텀 `PropertyAttribute`와 `PropertyDrawer`로 **조건부 필드 표시** 기능을 만든 적도 있고, `SerializedProperty`로 `private` 필드를 다루면서 `Undo`와 `SetDirty`를 짝지어 처리하는 것까지 다뤘습니다. 기획자가 코드 없이 데이터를 편집할 수 있게 만드는 게 목적이었습니다.

**상세 설명**

| 기능 | 용도 |
|---|---|
| `[MenuItem]` | 상단 메뉴 / 단축키 등록 |
| `[CustomEditor]` + `OnInspectorGUI` | 인스펙터 전체 커스터마이징 |
| `[CustomPropertyDrawer]` | **필드 단위** 커스터마이징 |
| `EditorWindow` | 독립 도구 창 |
| `[ContextMenu]` | 인스펙터 우클릭 메뉴 |
| `OnDrawGizmos` / `Handles` | 씬 뷰 시각화·조작 |
| `Undo.RecordObject` + `EditorUtility.SetDirty` | 실행취소·저장 보장 |

**내 프로젝트 연결 (풍부한 편)**
- `unity_핵심정리.md` **5-18**(`[MenuItem]`), **5-19**(`[CustomEditor]`), **5-23**(커스텀 `PropertyAttribute`+`PropertyDrawer` — `ShowIfAttribute`로 조건부 표시), **5-25**(`EditorWindow` 심화 — 다중 인스턴스 vs 싱글턴 창), **5-26**(`Resources.FindObjectsOfTypeAll`), **5-31**(`[ContextMenu]`).
- `unity_핵심정리.md` **5-28~5-32** — `OnDrawGizmos`, 프로시저럴 메시 생성, **기즈모로 정점을 드래그해 실시간으로 메시 재구성**하는 종합 예제, 메시를 에셋으로 저장.
- `unity_핵심정리.md` **13-4, 13-5** — **커스텀 Script Template**(FSM 상태 클래스 자동 생성)과 **커스텀 키보드 단축키**(`%&n` = Ctrl+Alt+N).
- `unity_핵심정리.md` **22-3~22-6** — `SerializedProperty`로 private 필드 직접 노출, `Event.current`로 **드래그 페인팅 그리드** 구현, `DragAndDrop` API로 에셋 드롭 연동, `Undo`+`SetDirty` 짝지어 호출.
- `unity_핵심정리.md` **3-10** — `EditorWindow`와 `Gizmos`/`Handles`.

**꼬리질문**
- **Q.** 에디터 스크립트는 왜 `Editor` 폴더에 넣어야 하나?
  **A.** `UnityEditor` 네임스페이스는 **빌드에 포함되지 않기 때문**이다. 런타임 스크립트에 `using UnityEditor;`가 있으면 빌드 시 컴파일 에러가 난다. `Editor` 폴더에 넣거나 `#if UNITY_EDITOR`로 감싸야 한다.
  > 실제로 이 버그를 발견한 적이 있다 — `unity_핵심정리.md` 5-x의 `ItemManager`가 **런타임 `MonoBehaviour`에서 에디터 전용 `AssetDatabase`를 사용**하고 있었다.
- **Q.** `SetDirty`를 왜 호출해야 하나?
  **A.** 호출하지 않으면 Unity가 **"저장해야 할 변경사항"으로 인식하지 못해서**, 씬이나 에셋을 저장하지 않고 닫으면 편집한 값이 사라진다. 그리고 `Undo.RecordObject`는 **값을 바꾸기 전에** 호출해야 되돌릴 스냅샷이 제대로 남는다.
- **Q.** IMGUI와 UI Toolkit 중 뭘 쓰나?
  **A.** 내가 다룬 건 IMGUI(`EditorGUILayout`, `OnInspectorGUI`)다. Unity는 에디터 UI를 **UI Toolkit(`CreateInspectorGUI`, UXML/USS)** 으로 옮기고 있고 신규 에디터 툴은 그쪽이 권장되지만, IMGUI도 폐기되지 않고 계속 지원된다.

---

## Q3-32. 네트워크 동기화를 해본 적 있는가?

**30초 답변**
> Photon PUN으로 멀티플레이어 좀비 슈팅을 만들어봤습니다. `PhotonView`로 오브젝트 소유권을 구분해 **내 캐릭터만 입력을 처리**하고, `[PunRPC]`로 원격 함수를 호출하며, `OnPhotonSerializeView`로 위치·상태를 주기적으로 동기화했습니다. 특히 몬스터처럼 주인이 없는 오브젝트는 **Master Client가 권한을 갖고 계산한 뒤 결과를 브로드캐스트**하는 권위 서버 방식을 적용하고, Master Client가 나가면 다른 클라이언트가 이어받는 **페일오버**까지 다뤘습니다.

**상세 설명**
```csharp
// 소유권 기반 분기
void Update() {
    if (!pv.IsMine) return;          // 남의 캐릭터는 입력 처리 안 함
    HandleInput();
}

// 상태 동기화
void OnPhotonSerializeView(PhotonStream stream, PhotonMessageInfo info) {
    if (stream.IsWriting) { stream.SendNext(hp); stream.SendNext(state); }
    else                  { hp = (int)stream.ReceiveNext(); state = (int)stream.ReceiveNext(); }
}

// 원격 호출
pv.RPC("TakeDamage", RpcTarget.All, damage);
```

**내 프로젝트 연결 (zombieStudy — 개념 12개 전부 네트워킹)**
- `unity_핵심정리.md` **8-1** PhotonView 소유권(`pv.isMine`/`ownerId`), **8-2** RPC, **8-3** `OnPhotonSerializeView` 커스텀 동기화, **8-4** **Master Client 권위 서버 + 페일오버**, **8-5** 소유권 vs 권위 두 가지 권한 모델 비교, **8-7** 정수 상태코드를 실어보내는 애니메이션 동기화.
- `unity_핵심정리.md` 21-2~21-5 — `WWWForm`/서버 통신, 로그인 흐름(클라이언트 1차 검증 + 서버 2차 인증).
- `cpp_핵심정리.md` **24번** — Winsock으로 **TCP/UDP 소켓 프로그래밍**을 직접 해봤다. "엔진 없이 바닥부터 해봤나"는 꼬리질문에 답할 수 있다.

**꼬리질문**
- **Q.** 클라이언트 권위와 서버 권위의 차이는?
  **A.** **클라이언트 권위**는 각 클라이언트가 자기 캐릭터를 계산해 결과만 알리는 방식으로 반응이 즉각적이지만 **치팅에 취약**하다. **서버 권위**는 서버가 모든 판정을 하고 클라이언트는 입력만 보내므로 치팅에 강하지만 지연이 생긴다. 상용 게임은 서버 권위 + **클라이언트 예측(prediction)과 서버 보정(reconciliation)** 을 조합한다. 내 프로젝트에서는 Photon의 Master Client가 서버 역할을 하는 절충 방식을 썼다.
- **Q.** 위치 동기화 시 끊겨 보이는 문제는 어떻게 해결하나?
  **A.** 네트워크 패킷은 초당 10~20회 정도만 오므로 그대로 적용하면 뚝뚝 끊긴다. **보간(interpolation)** 으로 수신한 위치 사이를 부드럽게 이어주고, 패킷이 늦으면 **추측 항법(dead reckoning)** 으로 마지막 속도를 기반으로 예측 이동시킨다.
- **Q.** TCP와 UDP 중 게임은 뭘 쓰나?
  **A.** 실시간 위치 동기화처럼 **최신 데이터가 중요하고 약간의 손실은 무방한** 데이터는 UDP를, 아이템 거래·채팅처럼 **반드시 도달해야 하는** 데이터는 TCP를 쓴다. 실무에선 UDP 위에 필요한 신뢰성만 얹은 커스텀 프로토콜을 쓰는 경우가 많다. → `06_CS기본.md` 참고.

---

## Q3-33. 문자열 기반 API가 왜 위험한가?

**30초 답변**
> `SendMessage("함수명")`, `StartCoroutine("이름")`, `Invoke("이름")`, `animator.SetBool("파라미터")` 같은 API는 **오타가 컴파일 시점에 잡히지 않고 런타임에 조용히 실패**합니다. 리팩터링으로 이름을 바꿔도 문자열은 따라 바뀌지 않고, 리플렉션 기반이라 느리며 **IL2CPP 코드 스트리핑에 제거될 위험**도 있습니다. 가능하면 타입 안전한 대안을 씁니다.

**상세 설명**
```csharp
// 위험
SendMessage("TakeDamage", 10);
StartCoroutine("Fade");
animator.SetBool("IsRunning", true);

// 안전
target.GetComponent<Health>().TakeDamage(10);      // 직접 호출
StartCoroutine(Fade());                             // 메서드 참조
private static readonly int RunHash = Animator.StringToHash("IsRunning");
animator.SetBool(RunHash, true);                    // 해시 캐싱 (빠르기까지 함)
```
- `StartCoroutine("이름")`은 `StopCoroutine("이름")`으로 멈출 수 있다는 장점이 있어서 쓰이기도 하지만, 코루틴 참조를 변수에 저장하면 같은 일을 타입 안전하게 할 수 있다.

**내 프로젝트 연결**
- `unity_핵심정리.md` **5-1** — `SendMessage`/`SendMessageUpwards`/`BroadcastMessage`의 **리플렉션 기반 메시징과 그 한계**를 정리.
- `unity_핵심정리.md` **7-4** — TempleRun에서 문자열 기반 컴포넌트 통신의 위험성을 실제 코드로 확인(다만 **강의 자료 원본에도 있던 튜토리얼의 기본 패턴**이라 학생의 설계 실수는 아니라는 것까지 PDF 대조로 확인했다).
- `unity_핵심정리.md` **8-12** — `SendMessage` + `object[]`로 다중 인자를 우회 전달한 사례.
- `unity_핵심정리.md` 1-2, 3-9 관련 — 씬 이름 문자열이 바뀐 뒤에도 **옛 이름이 주석 속 죽은 코드로 남아있는 것**을 발견한 적이 있다(TempleRun `Application.LoadLevel("Main")`).

**꼬리질문**
- **Q.** `Animator.StringToHash`가 왜 빠른가?
  **A.** 문자열로 파라미터를 찾을 때마다 **해시 계산 + 문자열 비교**가 일어나는데, 해시를 미리 계산해 `int`로 저장해두면 정수 비교만 하면 된다. 매 프레임 호출되는 애니메이션 파라미터에서는 차이가 누적된다.
- **Q.** 태그 비교도 같은 문제가 있나?
  **A.** `gameObject.tag == "Player"`는 `tag` 프로퍼티가 **문자열을 새로 할당**해 가비지가 생긴다. `CompareTag("Player")`는 할당 없이 비교한다. 다만 태그 자체가 문자열이라는 오타 위험은 남으므로, 상수로 빼거나 레이어를 쓰는 게 더 안전하다.

---

## Q3-34. Deprecated API 마이그레이션을 겪어봤는가?

**30초 답변**
> 여러 번 겪었습니다. `Application.LoadLevel` → `SceneManager.LoadScene`, `WWW` → `UnityWebRequest`, `[PreferenceItem]` → `[SettingsProvider]`, XR Interaction Toolkit의 **파라미터 기반 콜백에서 EventArgs 기반으로의 전환**까지 실제로 코드를 고쳐봤습니다. 이런 경험에서 배운 건, 오래된 프로젝트를 유지보수할 때 **API 교체뿐 아니라 에러 체크 방식 같은 주변 규약까지 함께 바뀐다**는 점입니다.

**상세 설명**
```csharp
// WWW -> UnityWebRequest (에러 체크 방식까지 바뀜)
using (UnityWebRequest req = UnityWebRequestAssetBundle.GetAssetBundle(url, ver, 0)) {
    yield return req.SendWebRequest();
#if UNITY_2020_1_OR_NEWER
    if (req.result != UnityWebRequest.Result.Success)     // 신 방식
#else
    if (req.isNetworkError || req.isHttpError)            // 구 방식
#endif
    { Debug.LogError(req.error); yield break; }
}
```

**내 프로젝트 연결 (마이그레이션 사례만 6건)**
1. `unity_핵심정리.md` **3-9** — `Application.loadedLevel` → `SceneManager` (1번째)
2. `unity_핵심정리.md` **5-21** — `WWW` → `UnityWebRequest` (2번째, **조건부 컴파일로 두 버전 공존**)
3. `unity_핵심정리.md` **5-27** — `[PreferenceItem]` → `[SettingsProvider]` (3번째)
4. `unity_핵심정리.md` **8-10** — AssetBundle `WWW` → `UnityWebRequestAssetBundle` (4번째)
5. `unity_핵심정리.md` **10-5** — 레거시 Input Manager → **New Input System** (가장 큰 규모)
6. `unity_핵심정리.md` **11-1** — XR Toolkit 파라미터 기반 → EventArgs 기반 (**구/신 오버라이드가 쌍으로 나란히 남아있어 가장 촘촘한 대조 사례**)
7. `unity_핵심정리.md` **14-5** — Built-in RP CG Surface Shader → **URP HLSL** (스크립팅 API가 아니라 **렌더 파이프라인 자체 전환**)

**꼬리질문**
- **Q.** 옛 코드를 주석으로 남기는 게 좋은가?
  **A.** 무분별하게 남기면 코드가 지저분해지지만, **API 변경 히스토리를 팀에 공유하는 문서 역할**을 할 때는 유용하다. 다만 버전 관리 시스템이 있으니 커밋 메시지나 문서로 남기는 게 더 낫고, 남긴다면 "왜 바뀌었는지"를 함께 적어야 의미가 있다.
- **Q.** 여러 Unity 버전을 동시에 지원해야 한다면?
  **A.** `#if UNITY_2020_1_OR_NEWER` 같은 **버전 전처리기**로 분기한다. C/C++의 `#ifdef`와 원리가 같다(`c_핵심정리.md` 참고). 실제로 `CSVReader`를 만들 때 이 방식으로 동기/비동기 구현을 조건부로 컴파일했다(`unity_핵심정리.md` 15-6).

---

## Q3-35. 현재 Unity 버전과 앞으로의 변화는?

**30초 답변**
> 현재는 **Unity 6 계열이 LTS**로 제공되고 있고, C# 언어 버전은 **C# 9**까지 지원합니다. 가장 큰 변화는 **Mono 런타임을 CoreCLR로 교체하는 작업**으로, 로드맵상 Unity 6.8에서 Mono를 걷어낼 예정입니다. CoreCLR로 가면 현대적인 **세대별 GC**, 개선된 JIT, .NET 최신 라이브러리, 최신 C# 문법을 쓸 수 있게 됩니다. 렌더링 쪽은 URP/HDRP가 표준이 되었고 Built-in RP는 레거시로 밀려나는 흐름입니다.

**상세 설명**

| 영역 | 현재 | 방향 |
|---|---|---|
| 런타임 | Mono / IL2CPP | **CoreCLR**(6.8 예정) |
| GC | Boehm(비세대별, 비압축) | **세대별 GC** |
| C# 버전 | C# 9 | C# 14 수준까지 |
| 렌더 파이프라인 | Built-in / URP / HDRP | **URP·HDRP 중심** |
| UI | uGUI(런타임) / UI Toolkit(에디터) | UI Toolkit 확대 |
| 에셋 로딩 | Resources/AssetBundle | **Addressables** |
| 고성능 | 기본 MonoBehaviour | **DOTS/ECS + Burst + Job System** |

**꼬리질문**
- **Q.** DOTS/ECS가 뭔가?
  **A.** **Data-Oriented Technology Stack** — 객체지향 대신 **데이터 지향 설계**로 성능을 극대화하는 Unity의 기술 묶음이다. **ECS**(Entity Component System)로 데이터를 배열에 모아 캐시 효율을 높이고, **Job System**으로 멀티코어를 안전하게 활용하며, **Burst 컴파일러**로 C# 코드를 SIMD 최적화된 네이티브 코드로 컴파일한다. 수만 개 유닛을 다루는 게임에서 효과가 크지만 학습 곡선이 가파르고 기존 MonoBehaviour 방식과 다르다.
  → `01_C_CPP.md` Q1-12의 "OOP vs DOD" 꼬리질문과 이어진다.
- **Q.** 왜 이런 흐름을 알고 있어야 하나?
  **A.** 실무에서 **어떤 기술을 선택할지 판단**해야 하기 때문이다. 신규 프로젝트에 Built-in RP나 `Resources`를 쓰면 나중에 마이그레이션 비용을 치른다. 내가 이미 여러 번 Deprecated API 마이그레이션을 겪어봤기 때문에(Q3-34) 이 판단의 중요성을 체감하고 있다.

**출처**
- [Unity 6.3 LTS 릴리스](https://unity.com/blog/unity-6-3-lts-is-now-available)
- [Unity Manual - C# compiler and language version](https://docs.unity3d.com/6000.0/Documentation/Manual/csharp-compiler.html)
- [Porting Unity to CoreCLR](https://unity.com/blog/engine-platform/porting-unity-to-coreclr)
- [Unity 2026 로드맵 - CoreCLR](https://digitalproduction.com/2025/11/26/unitys-2026-roadmap-coreclr-verified-packages-fewer-surprises/)
