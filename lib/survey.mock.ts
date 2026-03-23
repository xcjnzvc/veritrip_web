// // ─── 타입 정의 ───────────────────────────────────────────

// export type SelectType = "single_select" | "multi_select";

// export interface CityOption {
//   id: string;
//   label: string;
// }

// export interface RegionOption {
//   id: string;
//   label: string;
//   children: CityOption[];
// }

// export interface FlatOption {
//   id: string;
//   label: string;
// }

// // step 1은 children이 있는 RegionOption[], 나머지는 FlatOption[]
// export interface SurveyStep {
//   id: number;
//   totalSteps: number;
//   title: string;
//   description?: string;
//   type: SelectType;
//   options: RegionOption[] | FlatOption[];
// }

// export interface SurveyData {
//   steps: SurveyStep[];
// }

// // ─── 목데이터 ─────────────────────────────────────────────

// export const surveyMockData: SurveyData = {
//   steps: [
//     {
//       id: 1,
//       totalSteps: 6,
//       title: "어떤 곳으로 떠나볼까요?",
//       description: "도시 1곳을 선택해주세요.",
//       type: "single_select",
//       options: [
//         {
//           id: "jp",
//           label: "일본",
//           children: [
//             { id: "tokyo", label: "도쿄" },
//             { id: "osaka", label: "오사카" },
//             { id: "kyoto", label: "교토" },
//             { id: "nagoya", label: "나고야" },
//             { id: "fukuoka", label: "후쿠오카" },
//             { id: "sapporo", label: "삿포로" },
//             { id: "okinawa", label: "오키나와" },
//           ],
//         },
//         {
//           id: "vn",
//           label: "베트남",
//           children: [
//             { id: "danang", label: "다낭" },
//             { id: "phuquoc", label: "푸꾸옥" },
//             { id: "nhatrang", label: "나트랑" },
//             { id: "hoian", label: "호이안" },
//             { id: "hochiminh", label: "호치민" },
//           ],
//         },
//         {
//           id: "cn",
//           label: "중국/홍콩",
//           children: [
//             { id: "shanghai", label: "상하이" },
//             { id: "hongkong", label: "홍콩" },
//             { id: "beijing", label: "베이징" },
//           ],
//         },
//         {
//           id: "sea",
//           label: "동남아/대만",
//           children: [
//             { id: "bangkok", label: "방콕" },
//             { id: "phuket", label: "푸켓" },
//             { id: "taipei", label: "타이베이" },
//             { id: "kaohsiung", label: "가오슝" },
//             { id: "chiangmai", label: "치앙마이" },
//             { id: "bali", label: "발리" },
//             { id: "cebu", label: "세부" },
//             { id: "kualalumpur", label: "쿠알라룸푸르" },
//             { id: "singapore", label: "싱가포르" },
//           ],
//         },
//         {
//           id: "kr",
//           label: "대한민국",
//           children: [
//             { id: "jeju", label: "제주" },
//             { id: "busan", label: "부산" },
//             { id: "yeosu", label: "여수" },
//             { id: "taean", label: "태안" },
//             { id: "chuncheon", label: "춘천/평창" },
//             { id: "gangneung", label: "강릉/속초" },
//             { id: "gyeongju", label: "경주" },
//             { id: "incheon", label: "인천" },
//           ],
//         },
//         {
//           id: "eu",
//           label: "유럽",
//           children: [
//             { id: "paris", label: "파리" },
//             { id: "rome", label: "로마" },
//             { id: "lisbon", label: "리스본" },
//             { id: "madrid", label: "마드리드" },
//             { id: "vienna", label: "빈" },
//             { id: "barcelona", label: "바르셀로나" },
//             { id: "prague", label: "프라하" },
//             { id: "amsterdam", label: "암스테르담" },
//             { id: "porto", label: "포르투" },
//             { id: "london", label: "런던" },
//           ],
//         },
//         {
//           id: "me",
//           label: "서아시아",
//           children: [
//             { id: "dubai", label: "두바이" },
//             { id: "losangeles", label: "로스앤젤레스" },
//             { id: "sanfrancisco", label: "샌프란시스코" },
//             { id: "hawaii", label: "하와이" },
//             { id: "guam", label: "괌" },
//             { id: "newyork", label: "뉴욕" },
//             { id: "sydney", label: "시드니" },
//             { id: "vancouver", label: "밴쿠버" },
//           ],
//         },
//       ] as RegionOption[],
//     },
//     {
//       id: 2,
//       totalSteps: 6,
//       title: "여행 일정은 어떻게 되나요?",
//       description: "준비된 일정 중 하나를 선택해주세요.",
//       type: "single_select",
//       options: [
//         { id: "same_day", label: "당일치기" },
//         { id: "1n2d", label: "1박2일" },
//         { id: "2n3d", label: "2박3일" },
//         { id: "3n4d", label: "3박4일" },
//         { id: "4n5d", label: "4박5일" },
//         { id: "5n6d", label: "5박6일" },
//         { id: "6n7d", label: "6박7일" },
//       ] as FlatOption[],
//     },
//     {
//       id: 3,
//       totalSteps: 6,
//       title: "이번 여행의 동행자는 누구인가요?",
//       description: "중복 선택이 가능해요. 함께하는 분들을 선택해주세요.",
//       type: "multi_select",
//       options: [
//         { id: "solo", label: "혼자" },
//         { id: "friend", label: "친구" },
//         { id: "couple", label: "연인" },
//         { id: "spouse", label: "배우자" },
//         { id: "child", label: "아이" },
//         { id: "parents", label: "부모님" },
//         { id: "pet", label: "반려동물" },
//         { id: "group", label: "단체/워크숍" },
//         { id: "etc", label: "기타" },
//       ] as FlatOption[],
//     },
//     {
//       id: 4,
//       totalSteps: 6,
//       title: "당신의 여정에 어떤 감성을 더해드릴까요?",
//       description:
//         "중복 선택이 가능해요. 선택하신 감성에 딱 맞는 장소들을 연결해 드릴게요.",
//       type: "multi_select",
//       options: [
//         { id: "rest", label: "정적인 휴식" },
//         { id: "nature", label: "자연/풍경" },
//         { id: "activity", label: "액티비티" },
//         { id: "photo", label: "인생샷 투어" },
//         { id: "shopping", label: "쇼핑/마켓" },
//         { id: "food", label: "로컬 맛집" },
//         { id: "alley", label: "골목 탐방" },
//         { id: "culture", label: "문화/역사" },
//         { id: "hotel", label: "호캉스" },
//         { id: "night", label: "야경/시티" },
//       ] as FlatOption[],
//     },
//     {
//       id: 5,
//       totalSteps: 6,
//       title: "여행 중 가장 피하고 싶은 상황은 무엇인가요?",
//       description: "가장 스트레스 받는 상황 1가지만 알려주세요.",
//       type: "single_select",
//       options: [
//         { id: "complex_route", label: "복잡한 동선" },
//         { id: "long_wait", label: "끝없는 웨이팅" },
//         { id: "dirty_accommodation", label: "청결하지 못한 숙소" },
//         { id: "extra_expense", label: "계획 외 지출" },
//         { id: "crowd", label: "사람 많은 곳" },
//         { id: "unexpected", label: "예상치 못한 변수" },
//         { id: "unfriendly", label: "불친절/바가지" },
//       ] as FlatOption[],
//     },
//     {
//       id: 6,
//       totalSteps: 6,
//       title: "하루를 얼마나 알차게 채워볼까요?",
//       description: "당신의 페이스에 맞춰 하루 방문 장소 수를 조절해 드릴게요.",
//       type: "single_select",
//       options: [
//         { id: "packed", label: "알찬 일주" },
//         { id: "moderate", label: "적당한 쉼" },
//         { id: "relaxed", label: "느긋한 휴식" },
//       ] as FlatOption[],
//     },
//   ],
// };
