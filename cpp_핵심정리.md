# C++ 핵심정리

> 국비 게임클라이언트(Unity) 과정 실습 코드 기반 복습/면접 자료.
> Part 1(기초) 원본 위치: `C:\Study\C\CPP_ST`, `C:\Study\C\OOP`, `C:\Study\C\Wordle_c`
> Part 2(중급/고급) 원본 위치: `C:\Study\API\CPP_PLUS` — 같은 과정에서 C++을 초급/중급/고급으로 나눠 배운 부분이라 이 파일에 함께 정리한다.
> (원본은 CP949 인코딩 — 필요하면 UTF-8로 재변환해서 볼 것)
> `TRPG_peace/`는 클래스 선언만 있고 메서드 본문이 전부 비어있는 미완성 스텁이라 이번 정리에서는 제외했다.
> `CPP_PLUS` 안의 `FMODENGIN`(사운드 라이브러리 헤더)은 실제로 어디서도 사용되지 않는 미사용 포함 파일이라 제외했다.

## 목차

**Part 1 — 기초 (OOP/클래스)**
1. [함수 오버로딩](#1-함수-오버로딩)
2. [클래스 기본 — 생성자/소멸자/복사생성자](#2-클래스-기본--생성자소멸자복사생성자)
3. [깊은 복사(Deep copy)와 Rule of Three/Five/Zero](#3-깊은-복사deep-copy와-rule-of-threefivezero)
4. [연산자 오버로딩 & friend 함수](#4-연산자-오버로딩--friend-함수)
5. [상속과 protected 접근제어](#5-상속과-protected-접근제어)
6. [다형성과 순수가상함수 / 추상클래스](#6-다형성과-순수가상함수--추상클래스)
7. [가상 소멸자 (virtual destructor) — 내 코드에서 실제로 발견한 이슈](#7-가상-소멸자-virtual-destructor--내-코드에서-실제로-발견한-이슈)
8. [템플릿 함수 & 템플릿 클래스](#8-템플릿-함수--템플릿-클래스)
9. [`char*` 수동 메모리관리 → `std::string` 전환](#9-char-수동-메모리관리--stdstring-전환)
10. [컴포지션 기반 책임 분리 설계](#10-컴포지션-기반-책임-분리-설계)
11. [`enum` vs `enum class`](#11-enum-vs-enum-class)
12. [종합 대표 예제 — OOP 계좌관리 시스템](#12-종합-대표-예제--oop-계좌관리-시스템)

**Part 2 — 중급/고급 (CPP_PLUS)**
13. [STL 컨테이너 & 반복자 기초](#13-stl-컨테이너--반복자-기초)
14. [람다식(Lambda)과 캡처](#14-람다식lambda과-캡처)
15. [구조체/클래스 메모리 정렬(Padding)과 `sizeof`](#15-구조체클래스-메모리-정렬padding과-sizeof)
16. [`auto` 키워드와 타입 추론](#16-auto-키워드와-타입-추론)
17. [템플릿 인자 추론의 모호성과 템플릿 특수화](#17-템플릿-인자-추론의-모호성과-템플릿-특수화)
18. [자료구조 직접구현의 진화 — 배열 스택 → 클래스 스택 → 템플릿 스택, 원형 큐](#18-자료구조-직접구현의-진화--배열-스택--클래스-스택--템플릿-스택-원형-큐)
19. [이중 연결 리스트 — 센티넬 노드 패턴과 템플릿화](#19-이중-연결-리스트--센티넬-노드-패턴과-템플릿화)
20. [싱글톤(Singleton) 패턴 — 두 가지 구현과 스레드 안전성](#20-싱글톤singleton-패턴--두-가지-구현과-스레드-안전성)
21. [C++11 동시성 — `mutex`/`lock_guard`/`unique_lock` (RAII 락)](#21-c11-동시성--mutexlock_guardunique_lock-raii-락)
22. [이중검사 잠금(DCLP)과 `call_once` — 지연 초기화의 스레드 안전성](#22-이중검사-잠금dclp과-call_once--지연-초기화의-스레드-안전성)
23. [세마포어(Semaphore)](#23-세마포어semaphore)
24. [소켓 프로그래밍 기초 (Winsock TCP/UDP)](#24-소켓-프로그래밍-기초-winsock-tcpudp)

---

## 1. 함수 오버로딩

- **한 줄 정의**: 매개변수의 타입/개수가 다르면 같은 이름의 함수를 여러 개 정의할 수 있는 C++ 기능.
- **왜 중요한가**: C에는 없는 C++ 최초의 차이점 중 하나. "컴파일러가 어떻게 어떤 함수를 호출할지 결정하는가(name mangling, 시그니처 매칭)"로 이어지는 단골 질문.
- **내 코드에서 어떻게 썼는지**: `C/CPP_ST/CPP_ST/CPP_ST.cpp:65-83` — `int`/`char`/`double` 각각에 대한 `swap` 오버로드
  ```cpp
  void swap(int* a, int* b) { double temp = *a; *a = *b; *b = temp; }
  void swap(char* a, char* b) { double temp = *a; *a = *b; *b = temp; }
  void swap(double* a, double* b) { double temp = *a; *a = *b; *b = temp; }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 반환 타입만 다르면 오버로딩이 성립하는가? (아니오 — 시그니처에 반환 타입은 포함 안 됨)
  - 위 예시에서 `int*`용 함수인데 `temp`를 `double`로 선언한 건 실수 아닌가? (실제로 타입 안전성이 느슨해지는 지점 — 템플릿으로 대체하면 해결됨, 8번 항목과 연결)
- **최신 동향**: 함수 오버로딩 자체는 변함없는 C++ 기본기. 다만 타입별로 거의 동일한 로직을 반복하는 이 패턴은 아래 8번의 템플릿 함수로 대체하는 것이 현대적인 접근.

---

## 2. 클래스 기본 — 생성자/소멸자/복사생성자

- **한 줄 정의**: 객체 생성 시 자동 호출되는 생성자, 소멸 시 자동 호출되는 소멸자, 복사 시 호출되는 복사생성자로 객체의 생명주기를 관리하는 C++의 핵심 메커니즘.
- **왜 중요한가**: RAII(자원 획득이 곧 초기화) 개념의 출발점. 면접에서 "생성자/소멸자가 호출되는 시점"을 정확히 설명할 수 있는지를 자주 확인.
- **내 코드에서 어떻게 썼는지**: `C/CPP_ST/CPP_ST/CPP_ST.cpp:101-146` — `NameCard` 클래스, 4개의 `char*` 멤버를 생성자에서 `new`로 할당하고 소멸자에서 `delete[]`로 해제
  ```cpp
  NameCard::NameCard(const char* name, ...) {
      this->name = new char[strlen(name) + 1];
      strcpy(this->name, name);
      ...
  }
  NameCard::~NameCard() {
      delete[] name; delete[] phoneNum; delete[] address; delete[] rank;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 소멸자에서 `delete[]`를 빼먹으면? (메모리 누수)
  - 생성자에서 예외가 발생하면 소멸자가 호출되는가? (아니오 — 생성이 완료되지 않은 객체의 소멸자는 호출되지 않음, 그래서 RAII/스마트 포인터가 중요해짐)
- **최신 동향**: 이렇게 직접 `new`/`delete`를 짝 맞춰 관리하는 패턴은 실수하기 쉬워서, 최신 C++에서는 `std::string`/`std::vector`/스마트 포인터로 이 책임 자체를 표준 라이브러리에 위임하는 것이 정석(9번 항목 참고).

---

## 3. 깊은 복사(Deep copy)와 Rule of Three/Five/Zero

- **한 줄 정의**: 포인터 멤버를 가진 클래스를 복사할 때, 주소만 복사(얕은 복사)하면 두 객체가 같은 메모리를 가리켜 이중 해제(double free) 문제가 생기므로, 새 메모리를 할당해 내용을 통째로 복사(깊은 복사)해야 한다는 원칙.
- **왜 중요한가**: C++ 면접에서 가장 클래식한 주제 중 하나. "왜 복사생성자를 직접 정의해야 하는가"를 설명하는 능력을 봄.
- **내 코드에서 어떻게 썼는지**: `C/CPP_ST/CPP_ST/mystring.h:48-73` — 직접 만든 `string` 클래스가 소멸자/복사생성자/대입연산자를 모두 정의(Rule of Three)
  ```cpp
  string::string(const string& s)          // 복사생성자: 새 메모리에 복사
  {
      this->str = new char[s.len + 1];
      strcpy(this->str, s.str);
      this->len = s.len;
  }
  string& string::operator=(const string& s) // 대입연산자: 기존 메모리 해제 후 새로 복사
  {
      delete[] this->str;
      this->str = new char[s.len + 1];
      strcpy(this->str, s.str);
      this->len = s.len;
      return *this;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 복사생성자를 정의하지 않으면 컴파일러가 기본으로 만들어주는 건 얕은 복사인가 깊은 복사인가? (얕은 복사 — 포인터 멤버는 주소만 그대로 복사)
  - `operator=`에서 자기 자신을 대입(`s = s`)하면 어떻게 되는가? (`delete[] this->str` 이후 `s.str`도 이미 해제된 상태를 참조하게 되는 자기대입 버그 — 이 코드엔 자기대입 체크(`if(this==&s)`)가 없다는 게 실제 약점)
- **최신 동향 (웹서칭 결과)**: C++11 이전에는 "소멸자·복사생성자·복사대입연산자 중 하나라도 직접 정의하면 셋 다 정의해야 한다"는 **Rule of Three**가 표준이었다. C++11에서 이동생성자·이동대입연산자가 추가되며 **Rule of Five**로 확장됐고, 요즘은 가능하면 이 5개를 아예 직접 안 쓰고 `std::string`/`std::vector`/스마트 포인터 같은 RAII 멤버에 위임하는 **Rule of Zero**가 권장된다. 이 코드는 Rule of Three까지만 구현했고 이동 연산이 없어 임시 객체 반환 시에도 항상 깊은 복사가 일어나는데, 이는 실무에서는 `std::string`으로 바로 대체될 부분(9번 항목).

---

## 4. 연산자 오버로딩 & friend 함수

- **한 줄 정의**: `+`, `==`, `<<` 같은 연산자를 클래스에 맞게 재정의해서, 사용자 정의 타입도 내장 타입처럼 자연스러운 문법으로 다룰 수 있게 하는 기능.
- **왜 중요한가**: "연산자를 멤버함수로 만들 때와 friend(비멤버) 함수로 만들 때의 차이"는 실무에서도 설계 판단이 필요한 주제.
- **내 코드에서 어떻게 썼는지**: `C/CPP_ST/CPP_ST/mystring.h:23-24, 30-41` — 스트림 연산자는 멤버가 아니라 `friend`로 선언
  ```cpp
  friend ostream& operator<<(ostream& os, const string& s);
  friend istream& operator>>(istream& is, string& s);
  ...
  ostream& operator<<(ostream& os, const string& s) { os << s.str; return os; }
  ```
  값 연산자는 `CPP_ST.cpp:546-596`의 `Point` 클래스에서 멤버 함수로 오버로딩(`operator+`, `operator-`, `operator!=`, `operator+=`).
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `operator<<`는 왜 멤버 함수로 만들 수 없는가? (좌변이 `ostream`이어야 하는데, 멤버 함수는 좌변이 항상 자기 클래스여야 하므로 — 그래서 `friend`나 비멤버 함수가 필요)
  - `friend`가 캡슐화를 깨는 것 아닌가? 그런데 왜 써도 되는가? (연산자 자체는 클래스와 논리적으로 강하게 결합되어 있으므로 예외적으로 허용되는 관용구)
- **최신 동향**: 연산자 오버로딩 문법은 안정적. 다만 `operator+`처럼 새 객체를 반환하는 연산자는 최신 컴파일러의 NRVO(Named Return Value Optimization)나 이동 생성자와 맞물려 성능 차이가 크게 날 수 있다는 점은 3번 항목의 Rule of Five와 연결해서 언급하기 좋다.

---

## 5. 상속과 protected 접근제어

- **한 줄 정의**: 기존 클래스(기반 클래스)의 멤버를 새 클래스(파생 클래스)가 물려받고, `protected`로 선언한 멤버는 자식 클래스에서는 접근 가능하지만 외부에서는 `private`처럼 숨겨지는 접근 제어.
- **왜 중요한가**: 코드 재사용과 계층 설계의 기본. `public`/`protected`/`private` 상속의 차이, "is-a" 관계를 언제 상속으로 표현해야 하는지가 실무 설계 면접에서 자주 나옴.
- **내 코드에서 어떻게 썼는지**: `C/CPP_ST/CPP_ST/CPP_ST.cpp:209-268` — `Person`의 `age`/`name`을 `protected`로 두어 `Student`가 직접 접근
  ```cpp
  class Person {
  protected:
      int age;
      char* name;
  public:
      Person(int _age = 1, const char* _name = "noname") { ... }
  };
  class Student : public Person {
      char* major;
  public:
      Student(int _age, const char* _name, const char* _major)
          : Person(_age, _name)   // 기반 클래스 생성자 위임
      { major = new char[strlen(_major) + 1]; strcpy(major, _major); }
  };
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Student`의 생성자 초기화 리스트에서 왜 `Person(_age, _name)`을 명시적으로 호출해야 하는가? (기반 클래스에 기본 생성자가 없으면 반드시 명시해야 함, 이 경우엔 기본값이 있어 생략도 가능하지만 명확성을 위해 명시)
  - `protected` 대신 `private`로 두면 `Student`는 어떻게 `age`/`name`에 접근해야 하는가? (기반 클래스가 제공하는 public getter를 통해서만 — 실제로 6번 항목의 `Account`/`Employee` 계열은 이 방식을 씀)
- **최신 동향**: 상속 문법 자체는 불변. 다만 최신 설계 트렌드는 "상속보다 컴포지션(composition over inheritance)"을 우선시하는 편으로, 계층이 깊어질수록 상속보다 조합으로 설계하길 권장한다(10번 항목의 Wordle 설계와 대조해서 설명하기 좋음).

---

## 6. 다형성과 순수가상함수 / 추상클래스

- **한 줄 정의**: 기반 클래스 포인터/참조로 파생 클래스 객체를 가리키고 `virtual` 함수를 호출하면, 실제 객체의 타입에 맞는 함수가 실행되는 것(동적 바인딩). 본문이 없는 `virtual ... = 0` 함수(순수가상함수)를 하나라도 가진 클래스는 추상클래스가 되어 직접 객체를 만들 수 없다.
- **왜 중요한가**: OOP 면접의 핵심 주제. "다형성이 실제로 무슨 문제를 해결하는가"(타입별 `if/switch` 분기를 없앤다)를 구체적 코드로 설명할 수 있어야 함.
- **내 코드에서 어떻게 썼는지**: `C/CPP_ST/CPP_ST/CPP_ST.cpp:378-494` — `Employee`가 추상클래스, `Permanent`/`Temporary`가 `GetPay()`를 서로 다르게 구현
  ```cpp
  class Employee {
  public:
      virtual int GetPay() = 0;   // 순수가상함수 -> 추상클래스
  };
  class Permanent : public Employee { int GetPay() { return salary; } };
  class Temporary : public Employee { int GetPay() { return time * pay; } };

  // Department는 실제 타입을 몰라도 됨 - 다형성의 핵심
  void Department::ShowList() {
      for (int i = 0; i < index; i++)
          cout << "salary: " << empList[i]->GetPay() << endl;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 추상클래스를 `new Employee()`로 직접 생성하면? (컴파일 에러 — 순수가상함수가 있어서 인스턴스화 불가)
  - `CPP_ST.cpp:341-376`의 `#8-2` 예제는 `Student`에 순수가상함수 `Work()`가 있는데 `p2->Study()`를 호출하면 에러가 난다고 주석에 적혀 있음 — 실제로는 `Student`도 추상클래스라 `Study()` 자체는 문제 없고, `p2`가 `Student*`인데 `Work()`를 부모 타입으로 호출한 것 자체는 가능(동적바인딩으로 `PartTimeStd::Work()` 호출됨). 이 주석은 실습 당시의 오개념일 가능성이 있음 — **확인 필요**: 면접에서 "이 코드가 실제로 컴파일/실행되는지" 직접 검증해보는 습관을 강조하기 좋은 사례.
- **최신 동향 (웹서칭 결과)**: 다형성 개념 자체는 불변이지만, C++11부터는 파생 클래스에서 재정의할 때 `override` 키워드를 붙이는 것이 표준 관행이다. `override`를 붙이면 시그니처가 기반 클래스의 `virtual` 함수와 정확히 일치하지 않을 경우 컴파일 에러로 즉시 잡아주기 때문에, 실수로 오버라이드가 아니라 새 함수를 만들어버리는 실수를 방지한다. 이 코드의 `GetPay()`, 12번 항목의 `AddBalance()` 모두 `override`가 없는데, 최신 코드라면 붙이는 게 정석이다. ([cppreference: override specifier](https://en.cppreference.com/cpp/language/override))

---

## 7. 가상 소멸자 (virtual destructor) — 내 코드에서 실제로 발견한 이슈

- **한 줄 정의**: 기반 클래스 포인터로 파생 클래스 객체를 `delete`할 때, 기반 클래스의 소멸자가 `virtual`이 아니면 파생 클래스의 소멸자가 호출되지 않아 정의되지 않은 동작(undefined behavior)이 발생한다.
- **왜 중요한가**: 다형성을 실무에서 쓸 때 가장 흔히 놓치는 함정. "언제 소멸자를 `virtual`로 선언해야 하는가"는 시니어 면접에서도 자주 나오는 질문.
- **내 코드에서 어떻게 썼는지**: `C/OOP/OOP/Account.h`(기반 클래스, 소멸자 미선언) + `C/OOP/OOP/Container.h:30-38`을 함께 보면 실제로 이 문제가 존재한다.
  ```cpp
  // Account.h - 소멸자가 선언되어 있지 않음(컴파일러가 만드는 기본 소멸자는 virtual이 아님)
  class Account {
  public:
      Account(int id, int balance, string name);
      virtual void AddBalance(int balance);
      // ~Account() 없음
  };

  // Container.h - T=Account* 로 인스턴스화되어 기반 클래스 포인터로 delete
  template<typename T>
  Container<T>::~Container() {
      for (int i = 0; i < aIndex; i++)
          delete arr[i];   // arr[i]의 실제 타입은 CreditAcc*/DonateAcc*일 수 있는데 Account*로 delete
  }
  ```
  `AccManager::MakeAccount()`에서 `ctr.Insert(new CreditAcc(...))`처럼 파생 클래스 객체를 만들어 기반 타입 컨테이너에 넣기 때문에, 프로그램 종료 시 `Container`가 이 객체들을 `Account*`로 `delete`하게 된다.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 이 코드가 지금 당장 크래시가 안 나는 이유는? (`CreditAcc`/`DonateAcc`가 추가로 갖는 멤버가 `double` 하나뿐이라 별도의 자원 해제가 필요 없어서 — 만약 파생 클래스가 `new`로 할당한 포인터 멤버를 가지고 있었다면 그 부분만 메모리 누수로 이어짐)
  - 고치려면? `Account`에 `virtual ~Account() {}`를 추가하면 해결됨.
- **최신 동향 (웹서칭 결과)**: C++ Core Guidelines C.35는 "기반 클래스의 소멸자는 `public`+`virtual`이거나, `protected`+비virtual이어야 한다"고 명시한다. 표준([expr.delete])도 정적 타입과 동적 타입이 다른 객체를 `delete`할 때 정적 타입에 가상 소멸자가 없으면 동작이 정의되지 않는다고 규정한다. clang-tidy의 `cppcoreguidelines-virtual-class-destructor` 검사가 바로 이 패턴을 자동으로 잡아준다. ([CERT OOP52-CPP](https://wiki.sei.cmu.edu/confluence/display/cplusplus/OOP52-CPP.+Do+not+delete+a+polymorphic+object+without+a+virtual+destructor), [C++ Core Guidelines 해설](https://www.modernescpp.com/index.php/c-core-guidelines-destructor-rules/))

---

## 8. 템플릿 함수 & 템플릿 클래스

- **한 줄 정의**: 타입을 매개변수(`typename T`)로 받아, 같은 코드를 여러 타입에 대해 재사용할 수 있게 하는 C++의 제네릭 프로그래밍 기능.
- **왜 중요한가**: 1번 항목(함수 오버로딩)의 반복을 없애는 다음 단계. STL 전체(`vector<T>`, `map<K,V>` 등)의 근간이 되는 개념이라 면접에서 비중있게 다뤄짐.
- **내 코드에서 어떻게 썼는지**:
  - 템플릿 함수: `C/CPP_ST/CPP_ST/CPP_ST.cpp:497-510`
    ```cpp
    template <typename T>
    T Add(T a, T b) { return a + b; }
    ```
  - 템플릿 클래스(직접 만든 제네릭 컨테이너): `C/OOP/OOP/Container.h:6-22`
    ```cpp
    template<typename T>
    class Container {
        T* arr; int length; int aIndex;
    public:
        Container(int len = 50);
        void Insert(T data);
        T Remove(int idx);
        T GetItem(int idx) const;
    };
    ```
    `AccManager`에서 `Container<Account*>`로 인스턴스화해서 사용(12번 항목).
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 템플릿은 언제 컴파일되는가? (사용되는 시점에 그 타입으로 실체화(instantiation)되므로, 템플릿 정의를 헤더에 둬야 하는 이유와 직결)
  - 이 `Container<T>`를 `std::vector<T>`와 비교하면 부족한 점은? (동적 크기 조정 없음 — 고정 `len`으로 시작, `Remove`가 O(n) 등)
- **최신 동향**: 템플릿 자체는 C++ 핵심 기능으로 계속 강화되는 중이며(C++20의 `concept`으로 템플릿 매개변수에 제약을 걸 수 있게 됨), 실무에서는 이런 자체 컨테이너보다 `std::vector`/`std::array` 등 표준 컨테이너를 우선 사용하는 것이 정석. 자체 구현 경험은 "왜 표준 라이브러리가 이렇게 설계되어 있는지" 이해했다는 근거로 면접에서 설명하기 좋다.

---

## 9. `char*` 수동 메모리관리 → `std::string` 전환

- **한 줄 정의**: 문자열을 `char*` + `new`/`delete`/`strcpy`로 직접 관리하던 방식에서, 메모리 관리를 캡슐화한 `std::string`으로 옮겨가는 리팩터링.
- **왜 중요한가**: "왜 실무에서는 직접 문자열 클래스를 안 만들고 `std::string`을 쓰는가"에 대한 가장 설득력 있는 근거 — 내 코드 안에 전후 버전이 나란히 남아있어서 비교하기 좋음.
- **내 코드에서 어떻게 썼는지**: `C/OOP/OOP/Account.cpp:1-11` — 이전 버전(주석 처리)과 현재 버전이 같은 파일에 공존
  ```cpp
  Account::Account(int id, int balance, string name) // 현재: std::string 사용
  {
      //this->name = new char[strlen(name) + 1]; // 이전: 수동 할당(주석 처리됨)
      //strcpy(this->name, name);
      this->name = name;                          // 현재: 대입 한 줄로 끝
      ...
  }
  ```
  이 변화 덕분에 `Account`는 소멸자/복사생성자/대입연산자를 **직접 정의할 필요가 없어졌다**(`Account.cpp:13-39`에서 관련 코드 전체가 주석 처리된 것이 그 증거) — 이게 바로 3번 항목에서 언급한 **Rule of Zero**의 실제 사례.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `std::string`으로 바꾸면서 왜 복사생성자/소멸자를 안 써도 안전해지는가? (`string` 멤버 자신이 이미 Rule of Five를 올바르게 구현하고 있어서, 컴파일러가 생성하는 기본 복사/소멸이 각 멤버의 복사/소멸을 그대로 호출해주기만 하면 되기 때문)
  - 그런데도 이 프로젝트의 `CPP_ST/mystring.h`에서는 왜 직접 문자열 클래스를 만들었는가? (실무 코드가 아니라 "`std::string`이 내부적으로 어떻게 동작하는지" 학습하기 위한 실습이라는 게 명확 — 면접에서 이 구분을 명확히 말할 수 있어야 함)
- **최신 동향**: `std::string`(그리고 C++17의 `std::string_view`)이 표준. 직접 문자열 클래스를 만드는 것은 학습 목적 외에는 실무에서 거의 없음.

---

## 10. 컴포지션 기반 책임 분리 설계

- **한 줄 정의**: 상속(is-a) 대신, 클래스가 다른 클래스를 멤버로 포함(has-a)해서 각자 하나의 책임만 지도록 나누는 설계 방식.
- **왜 중요한가**: "다 상속으로 풀지 않고 왜 나눴는가"를 설명할 수 있으면 설계 감각을 보여줄 수 있음. SOLID의 단일 책임 원칙(SRP)과 바로 연결됨.
- **내 코드에서 어떻게 썼는지**: `C/Wordle_c/Wordle_c/wordle.h:54-65` — 판정 로직(`Judge`)과 화면 출력(`UI`)을 분리하고, `WordleGame`이 이 둘을 조합만 함
  ```cpp
  class WordleGame {
      char answer[6];
      int maxTries;
      Judge judge;   // 정답 판정 책임
      UI ui;         // 입출력 책임
  public:
      void run();
  };
  ```
  `wordle.cpp:98-124`의 `run()`은 `judge.eval(...)`과 `ui.print...()`를 번갈아 호출할 뿐, 판정 로직도 출력 로직도 직접 갖고 있지 않다.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Judge`를 `WordleGame`이 상속했다면 뭐가 달라지는가? (상속은 "WordleGame이 곧 Judge다"라는 의미가 되어 부적절 — 판정기는 게임의 한 "부품"일 뿐이므로 컴포지션이 맞음)
  - `UI`를 인터페이스(추상클래스)로 뽑아서 콘솔 UI/GUI를 갈아끼울 수 있게 하려면 어떻게 바꿔야 하는가?
- **최신 동향**: "상속보다 컴포지션을 우선하라(Composition over Inheritance)"는 원칙은 최근 게임 엔진 아키텍처(Unity의 컴포넌트 시스템, ECS 등)에서 더욱 강조되는 흐름과도 직결된다 — Unity 정리 단계에서 이 개념을 다시 연결해서 다룰 예정.

---

## 11. `enum` vs `enum class`

- **한 줄 정의**: C 스타일의 `enum`은 정수로 암묵적 변환되고 이름 충돌이 나기 쉬운 반면, C++11의 `enum class`(scoped enum)는 반드시 `Mark::Correct`처럼 범위를 명시해야 하고 암묵적 정수 변환이 안 되는 타입-안전한 열거형.
- **왜 중요한가**: "C의 `enum`과 C++11 `enum class`의 차이"는 최신 문법을 아는지 확인하는 간단하지만 확실한 질문.
- **내 코드에서 어떻게 썼는지**: `C/Wordle_c/Wordle_c/wordle.h:6` (C++11 스타일) vs `C/OOP/OOP/Account.h:8-16` (C 스타일)
  ```cpp
  enum class Mark { Absent, Correct, Present };       // Wordle: scoped enum
  ...
  enum AccType { NORMAL = 1, CREDIT, DONATE };        // OOP: 전통적 enum
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `enum AccType`에서 `NORMAL`, `CREDIT`을 다른 enum에서도 같은 이름으로 쓰면 무슨 문제가 생기는가? (전역 이름공간 충돌 — `enum class`는 이 문제가 없음)
  - `Mark::Correct`를 `if (mark == 1)`처럼 정수와 비교하면? (`enum class`는 암묵적 변환이 없어 컴파일 에러 — 의도치 않은 비교를 막아줌)
- **최신 동향**: `enum class`가 C++11 이후 사실상 표준 권장 사항. 새 코드에서 구식 `enum`을 쓸 이유는 거의 없다.

---

## 12. 종합 대표 예제 — OOP 계좌관리 시스템

`C/OOP/OOP/` 프로젝트는 위에서 다룬 개념들(상속·다형성·템플릿·`std::string` 전환)이 하나의 프로그램에서 실제로 맞물려 동작하는, 이 폴더에서 가장 완성도 높은 대표 예제다.

- **구조**: `Account`(기반) ← `CreditAcc`/`DonateAcc`(파생) 상속 계층을, `Container<Account*>` 템플릿 컨테이너에 담고, `AccManager`가 사용자 메뉴 입출력을 담당.
- **다형성이 실제로 동작하는 지점**: `C/OOP/OOP/AccManager.cpp:90` — `Deposit()`에서 `ctr.GetItem(i)->AddBalance(money)`를 호출하면, 실제 객체가 `CreditAcc`면 이자가 붙고(`CreditAcc.cpp:17-20`), `DonateAcc`면 기부금이 차감된 잔액이 계산된다(`DonateAcc.cpp:17-20`) — 호출부는 어떤 타입인지 전혀 몰라도 됨.
  ```cpp
  // AccManager는 CreditAcc인지 DonateAcc인지 모른 채로 호출
  ctr.GetItem(i)->AddBalance(money);

  // CreditAcc의 오버라이드: 이자 적용
  void CreditAcc::AddBalance(int balance) {
      this->balance += balance;
      this->balance = (1 + interest) * this->GetBalance();
  }
  ```
- **면접에서 이 프로젝트로 답할 수 있는 질문들**:
  - "다형성을 실무에서 써본 경험이 있는가?" → 이 계좌 시스템을 예로 들며 `AddBalance` 오버라이드 설명.
  - "제네릭 프로그래밍(템플릿)을 써본 경험은?" → `Container<T>`를 `Account*` 전용이 아니라 어떤 타입도 담을 수 있게 설계한 이유 설명.
  - "이 코드에서 개선하고 싶은 부분은?" → **7번 항목의 가상 소멸자 누락**을 스스로 지적할 수 있으면 강한 인상을 줄 수 있음. 그 외에도 `Container::Remove()`가 인덱스 유효성 검사를 안 하는 점, `AccManager::Deposit/Withdraw`가 ID를 선형 탐색(O(n))하는 점도 개선 포인트로 언급 가능.

---

# Part 2 — 중급/고급 (CPP_PLUS)

> 아래 항목들은 대부분 `C:\Study\API\CPP_PLUS\CPP_PLUS\cppplusmain.cpp` 한 파일 안에 `#pragma region`으로 주제별로 나뉜 채 주석 처리되어 있다(Part 1의 `ST.cpp`와 같은 "실습 기록" 형태). 스택/연결리스트/싱글톤처럼 별도 클래스로 분리된 것들은 각각의 파일을 인용했다.

## 13. STL 컨테이너 & 반복자 기초

- **한 줄 정의**: `vector`(동적 배열), `list`(연결리스트), `map`(정렬된 키-값 트리) 같은 표준 템플릿 라이브러리 컨테이너와, 이들을 순회하는 공통 인터페이스인 반복자(iterator).
- **왜 중요한가**: 8번 항목에서 다룬 "왜 직접 템플릿 컨테이너를 만들었는가"의 답이 바로 STL이다. 실무 코드는 거의 대부분 STL 컨테이너 위에서 짜여지므로, 각 컨테이너의 시간복잡도와 선택 기준은 코딩테스트·실무 면접 모두에서 기본 소양으로 취급된다.
- **내 코드에서 어떻게 썼는지**: `API/CPP_PLUS/CPP_PLUS/cppplusmain.cpp`의 `#pragma region 컨테이너 vector`(391행), `맵 map, pair`(1127행), `리스트 list`(1223행), `반복자 iterator`(1252행), `벡터 vector`(1294행)에서 각각 기본 사용법(삽입/순회/`pair`로 키-값 다루기)을 실습.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `vector`에 원소를 추가하다가 용량을 초과하면? (내부적으로 더 큰 메모리를 새로 할당하고 기존 원소를 복사/이동 후 재할당 — 그래서 반복문 안에서 `reserve()` 없이 계속 `push_back`하면 상환(amortized) O(1)이지만 재할당 시점엔 O(n) 비용 발생)
  - `vector`를 순회하며 중간 원소를 `erase()`하면 반복자가 무효화되는데, 왜 그런가?
- **최신 동향 (웹서칭 결과)**: `map`(레드-블랙트리 기반, O(log n), 정렬 보장) vs `unordered_map`(해시테이블, 평균 O(1), 순서 없음)의 선택 기준은 지금도 실무·면접 단골 주제다 — 정렬이 필요 없고 조회 속도가 중요하면 `unordered_map`이 기본 선택지, 정렬된 순회나 범위 검색(`lower_bound`/`upper_bound`)이 필요하면 `map`을 쓴다. ([TheLinuxCode 비교](https://thelinuxcode.com/map-vs-unordered_map-in-c-practical-differences-tradeoffs-and-how-i-choose/))

## 14. 람다식(Lambda)과 캡처

- **한 줄 정의**: `[캡처](매개변수) -> 반환타입 { 코드 }` 형태로 이름 없는 함수 객체(클로저)를 즉석에서 만드는 C++11 문법.
- **왜 중요한가**: `std::sort`, `std::for_each` 같은 STL 알고리즘에 커스텀 로직을 넘길 때, 또는 콜백 함수를 짧게 표현할 때 실무에서 매우 자주 쓰임. "캡처 방식(`[=]` vs `[&]`)의 차이"는 실수하기 쉬운 포인트라 면접에서 자주 확인.
- **내 코드에서 어떻게 썼는지**: `cppplusmain.cpp:1339-1492` — 값 캡처와 참조 캡처의 차이를 직접 실험
  ```cpp
  int NumA = 100;
  auto TestA = [=] { cout << NumA << endl; };      // 값으로 캡처 - 원본 NumA에 영향 없음
  auto TestB = [&] { NumA *= 2; cout << NumA << endl; }; // 참조로 캡처 - 원본 NumA 변경됨

  // std::sort에 람다를 비교자로 전달
  std::sort(x, x + n, [](float a, float b) { return (std::abs(a) < std::abs(b)); });
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `[=]`로 캡처한 람다를 함수가 끝난 뒤에도 보관해서 실행하면 안전한가? (값 캡처는 캡처 시점의 복사본이라 안전, `[&]`로 캡처했다면 원본 변수가 이미 소멸된 뒤일 수 있어 댕글링 참조 위험)
  - 람다는 내부적으로 무엇으로 컴파일되는가? (`operator()`를 가진 익명 클래스 — 함수 객체(functor)와 본질적으로 동일)
- **최신 동향**: 람다 문법 자체가 C++11 이후 표준으로 자리잡았고, C++14의 제네릭 람다(`auto` 매개변수), C++20의 템플릿 람다까지 계속 확장되는 중. 실무에서는 함수 포인터나 별도 함수 객체보다 람다를 우선 쓰는 것이 일반적.

## 15. 구조체/클래스 메모리 정렬(Padding)과 `sizeof`

- **한 줄 정의**: 구조체의 각 멤버는 CPU가 효율적으로 읽을 수 있도록 특정 배수(자신의 타입 크기, 보통 4/8바이트) 경계에 맞춰 배치되며, 이 과정에서 멤버 사이/끝에 사용되지 않는 여백(padding)이 삽입되어 `sizeof`가 멤버 크기의 단순 합보다 커질 수 있다.
- **왜 중요한가**: 네트워크 패킷 구조체, GPU에 넘기는 정점 데이터처럼 "메모리 레이아웃이 그대로 의미를 가지는" 상황(직렬화, 바이너리 프로토콜)에서 반드시 알아야 하는 개념. "이 구조체의 `sizeof`가 왜 이 값인가"는 실력을 가리는 좋은 질문.
- **내 코드에서 어떻게 썼는지**: `cppplusmain.cpp:485-531` — 멤버 순서만 바꿔가며 크기가 달라지는 것을 직접 확인한 실습
  ```cpp
  struct sample3 { char ch1; char ch2; int num; };  // 8바이트 - char 2개가 4바이트 슬롯에 같이 들어감
  struct sample4 { char ch1; int num; char ch2; };  // 12바이트 - 순서만 바꿨는데 4바이트 더 커짐
  struct sample5 { char ch1; double num1; };        // 16바이트 - double의 8바이트 정렬 요구 때문
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `sample3`과 `sample4`는 멤버 구성이 같은데 왜 크기가 다른가? (정렬 때문에 큰 멤버 앞뒤로 생기는 패딩의 양이 순서에 따라 달라짐 — 멤버를 크기 내림차순으로 배치하면 패딩을 최소화할 수 있다는 실무 팁으로 연결)
  - `#pragma pack`은 언제, 왜 쓰는가? (패딩을 강제로 줄여서 파일/네트워크 포맷과 메모리 레이아웃을 맞출 때 — 대신 정렬되지 않은 접근으로 성능이 떨어질 수 있음)
- **최신 동향**: 정렬 규칙 자체는 컴파일러/아키텍처에 따라 세부 값이 달라질 수 있으므로, 실제 프로젝트에서는 항상 `sizeof`로 직접 확인하는 습관이 정석이다(이 실습 코드의 주석에 적힌 바이트 수도 "이 컴파일러/이 아키텍처 기준"이라는 전제가 깔려있다는 점을 면접에서 짚어주면 좋다) — **확인 필요**: 구체적 수치는 실제 빌드 환경(x86 vs x64, MSVC vs GCC)에 따라 달라질 수 있음.

## 16. `auto` 키워드와 타입 추론

- **한 줄 정의**: 변수 선언 시 초기값의 타입으로부터 컴파일러가 자동으로 타입을 추론하게 하는 C++11 키워드.
- **왜 중요한가**: 반복자(`std::map<string,int>::iterator` 같은 긴 타입)나 람다 타입처럼 직접 쓰기 번거로운 타입을 다룰 때 필수. "auto를 남용하면 가독성이 떨어진다"는 반론과 균형있게 설명할 수 있어야 함.
- **내 코드에서 어떻게 썼는지**: `cppplusmain.cpp:533-651` 구간에서 반복자, 람다, 함수 리턴값 등에 `auto`를 적용해보는 실습.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `auto`가 참조/`const`를 유지하지 않는 경우는? (`auto`는 기본적으로 값 타입으로 추론되므로, 참조가 필요하면 `auto&`, `const`를 유지하려면 `const auto&`를 명시해야 함)
  - `auto`와 템플릿의 타입 추론 규칙이 어떻게 비슷한가?
- **최신 동향**: `auto`는 이제 C++ 실무 코드베이스의 기본값에 가깝다. C++14의 함수 반환 타입 `auto` 추론, C++20의 축약 함수 템플릿(`auto` 매개변수)까지 계속 확장되고 있다.

## 17. 템플릿 인자 추론의 모호성과 템플릿 특수화

- **한 줄 정의**: 템플릿 함수가 인자 타입으로부터 `T`를 추론할 때 여러 타입이 섞이면 모호성 에러가 나며, 특정 타입에 대해서만 다르게 동작하도록 `template<>`로 별도 구현(특수화)할 수 있다.
- **왜 중요한가**: 8번 항목(템플릿 기초) 다음 단계로, "템플릿이 실패하는 지점"과 "그걸 어떻게 제어하는가"를 아는지는 C++ 실력을 좀 더 깊게 확인하는 질문.
- **내 코드에서 어떻게 썼는지**: `cppplusmain.cpp:2032-2062`
  ```cpp
  int Add(int _a, int _b) { return _a + _b; }             // ① 일반 함수

  template<typename T>
  T Add(T a, T b) { return a + b; }                        // ② 템플릿

  template<>
  int Add<int>(int a, int b) { return a + b; }              // ③ int에 대한 명시적 특수화

  // 호출 시 우선순위: ① 일반함수 > ③ 특수화된 템플릿 > ② 일반 템플릿
  ```
  같은 파일 2016-2029행에서는 `Add(10, 20.0f)`처럼 타입이 섞이면 "모호성의 에러"가 발생해서 `Add<float>(10, 20.0f)`처럼 템플릿 인자를 명시해야 한다는 것도 직접 확인.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 오버로드 결정 우선순위(일반함수 > 특수화 템플릿 > 일반 템플릿)를 정확히 설명할 수 있는가?
  - 템플릿 특수화와 함수 오버로딩(1번 항목)의 차이는? (특수화는 같은 템플릿의 "특정 타입 버전"을 정의하는 것이고, 오버로딩은 애초에 다른 함수를 여러 개 두는 것)
- **최신 동향**: C++20의 `concept`/`requires`가 등장하면서, 이런 모호성 문제를 템플릿 특수화 대신 제약 조건으로 더 명확하게 표현하는 방향으로 발전하고 있다.

## 18. 자료구조 직접구현의 진화 — 배열 스택 → 클래스 스택 → 템플릿 스택, 원형 큐

- **한 줄 정의**: 같은 "스택"이라는 자료구조를 (1) C 스타일 전역 배열+함수(C의 `miro.cpp`와 동일 패턴), (2) `int` 전용 클래스, (3) 모든 타입을 담는 템플릿 클래스로 세 번 발전시켜가며 캡슐화와 재사용성을 학습.
- **왜 중요한가**: "왜 처음부터 템플릿으로 안 짜고 단계를 밟았는가"를 설명할 수 있으면, 추상화 단계를 하나씩 올려가는 설계 감각을 보여줄 수 있음. 큐의 경우 "왜 배열을 원형으로 쓰는가"는 자료구조 기본기의 단골 질문.
- **내 코드에서 어떻게 썼는지**:
  - 1단계 (`cppplusmain.cpp:1494` 부근): 전역 배열 + 자유 함수로 만든 스택 (C의 `File_ST/miro.cpp` 스택과 동일한 발상)
  - 2단계: `API/CPP_PLUS/CPP_PLUS/StackST.h` — `int` 전용 클래스로 캡슐화
    ```cpp
    class Stack {
        int* m_Data = nullptr;
        const int STACK_MAX;
        int m_Top = STACK_EMPTY;
    public:
        bool Push(int _m_Data);
        bool Pop();
    };
    ```
  - 3단계: `API/CPP_PLUS/CPP_PLUS/Stack.h` — 위 클래스를 `template<typename T>`로 일반화, `IsOverflow()`/`IsUnderflow()` 방어 로직은 그대로 유지
  - 원형 큐: `cppplusmain.cpp:1780-1930` — `Front`/`Rear`를 `%(QUEUE_SIZE+1)`로 관리해서 배열을 한 바퀴 돌려쓰며, **큐 크기보다 1칸 더 큰 나머지 연산**을 써서 "가득 참"과 "완전히 빔" 상태를 구분하는 트릭이 핵심
    ```cpp
    bool IsOverflow() { return (Rear + 1) % (QUEUE_SIZE + 1) == Front; }
    bool IsUnderflow() { return Front == Rear; }
    ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 원형 큐에서 왜 `QUEUE_SIZE`가 아니라 `QUEUE_SIZE + 1`로 나머지를 취하는가? (한 칸을 항상 비워둬야 `Front == Rear`가 "가득 참"과 "완전히 빔" 둘 다를 의미하는 모호함을 피할 수 있음)
  - `Stack<T>`와 `std::stack<T>`(STL 어댑터)의 차이는? (`std::stack`은 내부적으로 `deque`를 기본 컨테이너로 감싸는 어댑터라는 점)
- **최신 동향**: 개념 자체는 CS 기본기로 불변. 실무에서는 이런 고정 크기 배열 기반 구현보다 `std::stack`/`std::queue`/`std::deque`를 쓰는 것이 정석이며, 이 실습은 "내부적으로 어떻게 동작하는지 이해했다"는 근거로 쓰기 좋다.

## 19. 이중 연결 리스트 — 센티넬 노드 패턴과 템플릿화

- **한 줄 정의**: 각 노드가 `Prev`/`Next` 포인터로 앞뒤 노드를 모두 가리키는 연결 리스트를, 실제 데이터가 없는 더미 head/tail 노드(센티넬)를 둬서 삽입/삭제 시 "리스트가 비었는가", "맨 앞/뒤인가" 같은 경계 조건 분기를 없애는 구현.
- **왜 중요한가**: 연결 리스트를 "제대로" 구현해본 경험을 보여주는 좋은 예 — 특히 센티넬 패턴은 실무 연결 리스트 구현에서도 흔히 쓰이는 기법이라 알고 있으면 설계 감각을 보여줄 수 있음.
- **내 코드에서 어떻게 썼는지**: `API/CPP_PLUS/CPP_PLUS/cDouble_LinkedList.h`/`.cpp`
  ```cpp
  // 초기화 시점에 데이터 없는 head/tail을 만들어 서로 연결해둔다
  void cDouble_LinkedList::Init(void) {
      m_Head = NewNode(-1, nullptr, nullptr);
      m_Tail = NewNode(-1, m_Head, nullptr);
      m_Head->Next = m_Tail;
  }
  // 삽입/삭제는 항상 "어떤 노드 앞/뒤에 두는가"로 통일 - 리스트가 비었는지 따로 검사할 필요 없음
  void cDouble_LinkedList::Insert_Front(tagDoubleNode* Node, int Data) {
      tagDoubleNode* pNew = NewNode(Data, Node->Prev, Node);
      Node->Prev->Next = pNew;
      Node->Prev = pNew;
  }
  ```
  이 클래스를 `template<typename T>`로 일반화한 버전이 `API/CPP_PLUS/CPP_PLUS/TemplateDLinkedList.h`(구조와 로직은 완전히 동일, `tagDoubleNode<T>`로만 바뀜) — 18번 항목의 스택과 동일한 "비템플릿 → 템플릿" 진화를 여기서도 반복 실습.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 센티넬 노드가 없다면 `Insert_Front`/`DelNode` 코드가 어떻게 더 복잡해지는가? ("리스트가 비어있는 경우"를 별도로 분기해야 함)
  - `push_select_front`/`pop_select` 같은 "특정 값을 찾아서 삽입/삭제"하는 연산의 시간복잡도는? (탐색 O(n) + 삽입/삭제 O(1))
- **최신 동향**: 개념은 불변. 실무에서는 `std::list`(이중 연결 리스트)를 바로 쓰는 것이 정석이며, `std::list`도 내부적으로 센티넬(더미) 노드를 두는 구현이 흔하다 — 이 실습이 표준 라이브러리 내부 구현 원리와 직결된다는 점을 언급하기 좋다.

## 20. 싱글톤(Singleton) 패턴 — 두 가지 구현과 스레드 안전성

- **한 줄 정의**: 프로그램 전체에서 객체가 단 하나만 존재하도록 생성자를 `private`으로 막고, 정적 함수(`GetInstance()`)를 통해서만 접근하게 하는 디자인 패턴.
- **왜 중요한가**: 디자인 패턴 중 실무/면접에서 가장 자주 등장. 특히 "멀티스레드 환경에서 안전한가"까지 이어지는 꼬리 질문이 정해진 코스처럼 따라온다.
- **내 코드에서 어떻게 썼는지**: 같은 폴더에 **의도적으로 두 가지 버전**을 나란히 구현해뒀다.
  ```cpp
  // API/CPP_PLUS/CPP_PLUS/Singleton.h,.cpp - 힙에 직접 할당하는 lazy singleton
  static Singleton* m_Instance;                 // 데이터 영역, 초기값 nullptr
  Singleton* Singleton::GetInstance() {
      if (m_Instance == nullptr) { m_Instance = new Singleton; }  // 멀티스레드에서 경쟁 상태(race condition) 위험
      return m_Instance;
  }

  // API/CPP_PLUS/CPP_PLUS/Singleton_other.h,.cpp - 함수 지역 정적 변수(Meyer's Singleton)
  Singleton_other* Singleton_other::GetInstance() {
      static Singleton_other pInstance;         // 최초 호출 시 한 번만 생성
      return &pInstance;
  }
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `Singleton.h` 버전은 왜 멀티스레드에서 위험한가? (두 스레드가 동시에 `if (m_Instance == nullptr)`를 통과하면 `new`가 두 번 일어날 수 있음 → 22번 항목의 이중검사 잠금/`call_once`로 해결)
  - `Singleton_other.h` 버전(함수 지역 `static`)은 왜 별도 잠금 없이도 스레드에 안전한가? (C++11부터 표준이 함수 지역 정적 변수의 초기화를 스레드-안전하게 보장 — 이른바 "매직 스태틱")
  - `new`로 만든 `m_Instance`는 프로그램 종료 시 `delete`되는가? (아니오 — 이 코드엔 해제 로직이 없어 엄밀히는 누수. `Singleton_other`는 함수 지역 정적 변수라 프로그램 종료 시 자동으로 소멸자가 호출됨)
- **최신 동향**: "함수 지역 `static` 변수 초기화는 스레드-안전하다"는 것은 C++11 표준(§6.7)에 명시된 보장이라, 지금은 굳이 이중검사 잠금을 직접 짤 필요 없이 Meyer's Singleton(`Singleton_other.h` 방식)이 사실상 표준 관용구다. 다만 싱글톤 자체가 전역 상태를 숨긴다는 이유로 최신 설계에서는 지양되고, 의존성 주입(Dependency Injection)으로 대체하는 경우가 많다는 점도 함께 알아두면 좋다.

## 21. C++11 동시성 — `mutex`/`lock_guard`/`unique_lock` (RAII 락)

- **한 줄 정의**: `std::mutex`로 공유 자원에 대한 배타적 접근을 보장하되, 잠금 해제를 손으로 챙기지 않도록 `lock_guard`/`unique_lock`이라는 RAII 래퍼가 생성자에서 잠그고 소멸자에서 자동으로 풀어주는 패턴.
- **왜 중요한가**: 2번 항목(생성자/소멸자로 자원 관리)의 동시성 버전. "왜 `mutex.lock()`/`unlock()`을 직접 쓰지 않는가"를 설명할 수 있으면 RAII를 진짜로 이해했다는 신호가 됨.
- **내 코드에서 어떻게 썼는지**: `cppplusmain.cpp:197-356`에 각 락 유틸리티의 차이가 상세한 한글 주석으로 정리되어 있다.
  ```cpp
  // lock_guard: 생성 시점에 무조건 잠그고, 소멸 시점에 무조건 해제. 중간에 조작 불가.
  std::mutex mutex;
  void func() { std::lock_guard<std::mutex> guard(mutex); /* work... */ }

  // unique_lock: 락 획득/해제 시점을 직접 제어 가능 (defer_lock, 중간 unlock/재lock)
  void func2() { std::unique_lock<std::mutex> guard(mutex); /* work... */ guard.unlock(); }
  ```
  주석에는 "예외가 던져지는 도중에도 `lock_guard`는 소멸자가 호출되어 안전하게 unlock된다"는 점을 `mutex.lock()`을 직접 쓴 경우와 대조해서 명확히 정리해둠.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - `mutex.lock()`을 직접 호출한 함수 중간에서 예외가 발생하면? (`unlock()`이 실행되지 않아 데드락 위험 — `lock_guard`를 쓰면 스택 풀림(stack unwinding) 과정에서 소멸자가 호출되어 안전)
  - `std::recursive_mutex`는 언제 필요한가? (같은 스레드가 이미 잠근 뮤텍스를 재귀호출 등으로 다시 잠가야 할 때 — 일반 `mutex`는 이 경우 데드락)
- **최신 동향 (웹서칭 결과)**: `lock_guard`/`unique_lock`은 지금도 표준 관용구다. C++20부터는 여러 뮤텍스를 한 번에 데드락 없이 잠그는 `std::scoped_lock`, 소멸 시 자동으로 `join()`을 호출해 스레드 관리 실수를 줄여주는 `std::jthread`가 추가되어 동시성 코드가 더 안전한 방향으로 발전하고 있다. ([modernescpp: C++20 Concurrency](https://www.modernescpp.com/index.php/c-20-concurrency/))

## 22. 이중검사 잠금(DCLP)과 `call_once` — 지연 초기화의 스레드 안전성

- **한 줄 정의**: "초기화되지 않았다면 초기화한다"는 지연 초기화(lazy initialization) 로직을 여러 스레드가 동시에 실행할 때, 잠금을 최소화하면서도 안전하게 한 번만 초기화되게 만드는 두 가지 기법 — 이중검사 잠금(Double-Checked Locking Pattern)과 `std::call_once`.
- **왜 중요한가**: 20번 항목의 `Singleton.h`(lazy singleton)가 가진 경쟁 상태 문제를 실제로 어떻게 고치는지 보여주는 해법. "락을 두 번 검사하는 이유"를 설명할 수 있어야 진짜 이해한 것.
- **내 코드에서 어떻게 썼는지**: `cppplusmain.cpp:775-867`
  ```cpp
  bool isInitialized = false;
  mutex mtx;
  void func() {
      if (isInitialized == false) {                 // 1차 검사 (락 없이, 대부분의 호출은 여기서 빠르게 리턴)
          unique_lock<mutex> lock(mtx);
          if (isInitialized == false) {              // 2차 검사 (락을 잡은 채로, 진짜 최초 1회만 통과)
              exam.Init();
              isInitialized = true;
          }
      }
  }

  // 같은 문제를 call_once로 더 간결하게 해결
  once_flag flag;
  void test() { call_once(flag, init); }   // init()은 여러 스레드가 동시에 호출해도 정확히 1번만 실행됨
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 1차 검사를 왜 락 없이 먼저 하는가? (이미 초기화된 이후의 모든 호출에서 매번 락을 잡는 비용을 없애기 위한 성능 최적화 — 최초 초기화 구간에서만 락이 필요)
  - `call_once`가 있는데 DCLP를 직접 구현할 이유가 있는가? (주석에도 "call_once를 쓰면 이 알고리즘이 굳이 필요없다"고 스스로 적어놓음 — 즉 DCLP는 원리를 이해하기 위한 학습용, 실무에서는 `call_once`나 20번 항목의 Meyer's Singleton을 쓰는 게 정석)
- **최신 동향**: DCLP는 C++11 이전에는 컴파일러 최적화/메모리 재배열 때문에 실제로는 안전하지 않을 수 있다는 것이 알려진 함정이었지만, C++11의 메모리 모델이 정립되면서(`std::atomic` 사용 시) 올바르게 구현하면 안전해졌다. 그럼에도 실무에서는 이 코드의 주석처럼 `std::call_once`나 함수 지역 `static`(20번 항목)으로 대체하는 것이 훨씬 안전하고 간결하다.

## 23. 세마포어(Semaphore)

- **한 줄 정의**: 뮤텍스가 "한 스레드만" 접근을 허용하는 것과 달리, 세마포어는 내부 카운트만큼 여러 스레드가 동시에 공유 자원에 접근하도록 허용하는 동기화 도구.
- **왜 중요한가**: "뮤텍스와 세마포어의 차이"는 C 정리(13번 항목)에서도 언급했던 단골 질문인데, 여기서는 WinAPI 함수(`CreateSemaphore`/`WaitForSingleObject`/`ReleaseSemaphore`) 수준까지 구체적으로 다뤘다는 점이 다름.
- **내 코드에서 어떻게 썼는지**: `cppplusmain.cpp:869-1077` — "화장실과 열쇠" 비유로 세마포어 동작 원리를 직접 정리해둔 주석이 인상적
  ```
  m_hMuxMsgSemaphore = CreateSemaphore(NULL, 1(화장실), 5(키), NULL);
  WaitForSingleObject(m_hMuxMsgSemaphore, INFINITE);  // 화장실에 들어감 (카운트 감소)
  ...
  ReleaseSemaphore(m_hMuxMsgSemaphore, 1, NULL);      // 화장실에서 나감 (카운트 증가)
  ```
  같은 구간에 "프로그램(정적) → 프로세스(동적, 자원 할당 단위) → 스레드(그 자원을 쓰는 실행 흐름 단위)"라는 3단계 정의도 스스로 정리해둠 — 면접 답변 그대로 쓸 수 있는 문장.
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - 뮤텍스와 세마포어(카운트=1)의 차이는? (뮤텍스는 "소유권" 개념이 있어 잠근 스레드만 풀 수 있지만, 세마포어는 소유권이 없어 다른 스레드가 `Release`할 수도 있음)
  - 세마포어의 초기 카운트를 5, 최대 카운트를 5로 잡으면(위 예시의 반대 상황)?
- **최신 동향**: C++20에 `std::counting_semaphore`/`std::binary_semaphore`가 표준에 추가되어, 더 이상 WinAPI의 `CreateSemaphore`에 의존하지 않고 플랫폼 독립적으로 세마포어를 쓸 수 있게 됐다. 다만 이 예제처럼 WinAPI 커널 오브젝트 기반 동기화는 여전히 Windows 네이티브 코드/레거시 시스템에서 쓰인다. ([cppreference: counting_semaphore](https://en.cppreference.com/cpp/thread/counting_semaphore))

## 24. 소켓 프로그래밍 기초 (Winsock TCP/UDP)

- **한 줄 정의**: `socket()`으로 통신 종단점을 만들고, TCP는 `bind → listen → accept`(서버)/`connect`(클라이언트) 후 `send`/`recv`로, UDP는 연결 없이 `sendto`/`recvfrom`으로 데이터를 주고받는 네트워크 프로그래밍의 기본 골격(Windows에서는 Winsock, `ws2_32.lib`).
- **왜 중요한가**: 게임 클라이언트/서버 통신의 최하위 계층 개념. 멀티플레이 게임을 다룬다면 "TCP와 UDP를 어떤 상황에 쓰는가"는 반드시 준비해야 할 질문.
- **내 코드에서 어떻게 썼는지**: `API/CPP_PLUS/CPP_PLUS/TCPIP_Server.cpp`/`TCPIP_Client.cpp`, `UDP_Server.cpp`/`UDP_Client.cpp` (※ 파일명과 실제 역할이 뒤바뀌어 있음 — `TCPIP_Client.cpp` 안에 `listen`/`accept`를 쓰는 서버 코드가, `TCPIP_Server.cpp` 안에 `connect`를 쓰는 클라이언트 코드가 들어있다. 실무 코드라면 이런 네이밍 자체가 리뷰에서 지적받을 부분)
  ```cpp
  #pragma comment(lib, "ws2_32.lib")
  WSAStartup(MAKEWORD(2, 2), &wsaData);            // Winsock 초기화 (Windows 전용 절차)
  ClientSocket = socket(PF_INET, SOCK_STREAM, 0);   // TCP 소켓 생성
  ...
  Result = connect(ClientSocket, (SOCKADDR*)&ServerInfo, sizeof(SOCKADDR_IN));
  recv(ClientSocket, Buf, sizeof(Buf) - 1, 0);
  closesocket(ClientSocket);
  ```
- **주의할 점 / 자주 나오는 꼬리 질문**:
  - TCP와 UDP 중 실시간 대전 게임의 위치 동기화에는 어떤 게 더 적합한가? (일반적으로 UDP + 자체 신뢰성 계층을 얹는 방식이 많이 쓰임 — 낮은 지연이 우선이고 약간의 패킷 손실은 허용 가능하기 때문. TCP는 재전송/순서보장 때문에 지연이 튈 수 있음)
  - `recv()`가 한 번에 보낸 데이터를 통째로 받는다고 보장할 수 있는가? (아니오 — TCP는 스트림 기반이라 여러 번에 나눠 도착할 수 있음, 그래서 별도의 메시지 경계 처리(길이 헤더 등)가 필요)
  - Winsock을 쓰기 전 `WSAStartup`을 왜 호출해야 하는가? (Windows에서 소켓 라이브러리를 초기화하는 절차 — 리눅스의 BSD 소켓 API에는 없는 Windows 고유 단계)
- **최신 동향**: Winsock의 저수준 API(`socket`/`bind`/`send`/`recv`) 자체는 지금도 그대로 유효하다. 다만 실무 게임 서버/클라이언트에서는 이 저수준 API를 직접 다루기보다 Boost.Asio, ENet, 또는 게임엔진(Unity의 Netcode, Unreal의 네트워킹 스택)이 제공하는 상위 레벨 네트워킹 라이브러리를 쓰는 것이 일반적 — 저수준 소켓 이해는 그 위에서 무슨 일이 일어나는지 아는 기초 체력으로서 의미가 있다.

---

## 이 폴더에서 확인한, 고쳐볼 만한 부분 (요약)

1. **`Account`에 가상 소멸자가 없음** (7번 항목) — `Container<Account*>`가 기반 포인터로 파생 객체를 `delete`하므로 정의되지 않은 동작의 소지가 있음. `virtual ~Account() {}` 추가로 해결.
2. **`mystring` 클래스의 자기대입(self-assignment) 처리 누락** (3번 항목) — `operator=`에 `if (this == &s) return *this;` 가드가 없어 `s = s` 같은 자기대입 시 문제가 될 수 있음.
3. **`override` 키워드 미사용** (6번 항목) — `CreditAcc::AddBalance`, `Permanent::GetPay` 등 오버라이드 함수에 `override`를 붙이면 시그니처 불일치를 컴파일 타임에 잡을 수 있음.
4. **`system("cls")` 및 콘솔 클리어 패턴**은 C 정리에서 지적한 것과 동일한 이슈이므로 C++ 코드에서도 동일하게 적용됨(c_핵심정리.md 12번 항목 참고).
5. **`Singleton.h`(lazy singleton)가 스레드 안전하지 않고, 할당한 객체를 해제하지도 않음** (20번 항목) — 실무라면 22번 항목의 `call_once`를 쓰거나, 아예 `Singleton_other.h`의 함수 지역 `static` 방식(Meyer's Singleton)으로 통일하는 게 더 안전하고 간결함.
6. **`TCPIP_Server.cpp`/`TCPIP_Client.cpp`의 파일명과 실제 역할이 뒤바뀜** (24번 항목) — `Client` 파일에 서버 로직(`listen`/`accept`)이, `Server` 파일에 클라이언트 로직(`connect`)이 들어있음. 실무였다면 리뷰에서 바로 지적됐을 네이밍 실수.
