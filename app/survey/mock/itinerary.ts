export interface Schedule {
  id: number;
  name: string;
  category: "공항" | "관광" | "공원" | "음식점" | "쇼핑" | "숙소";
  subcategory: string;
  image: string;
  icon: string;
  lat: number; // 위도 추가
  lng: number; // 경도 추가
}

export interface DayItinerary {
  day: number;
  schedules: Schedule[];
}

export const sampleItinerary: DayItinerary[] = [
  {
    day: 1,
    schedules: [
      {
        id: 1,
        name: "나리타 국제 공항",
        category: "공항",
        subcategory: "공항",
        image: "/survey/1.png",
        icon: "location.svg",
        lat: 35.772,
        lng: 140.392,
      },
      {
        id: 2,
        name: "신주쿠 교엔",
        category: "공원",
        subcategory: "공원 · 신주쿠",
        image: "/survey/2.png",
        icon: "camera.svg",
        lat: 35.685,
        lng: 139.71,
      },
      {
        id: 3,
        name: "이치란 라멘",
        category: "음식점",
        subcategory: "음식점 · 신주쿠",
        image: "/survey/3.png",
        icon: "food.svg",
        lat: 35.691,
        lng: 139.703,
      },
      {
        id: 4,
        name: "이세탄 신주쿠",
        category: "쇼핑",
        subcategory: "쇼핑 · 신주쿠",
        image: "/survey/4.png",
        icon: "shopping.svg",
        lat: 35.691,
        lng: 139.705,
      },
      {
        id: 5,
        name: "숙소로 이동",
        category: "숙소",
        subcategory: "숙소 · 신주쿠",
        image: "/survey/5.png",
        icon: "location.svg",
        lat: 35.689,
        lng: 139.7,
      },
    ],
  },
  {
    day: 2,
    schedules: [
      {
        id: 1,
        name: "아사쿠사 센소지",
        category: "관광",
        subcategory: "사원 · 아사쿠사",
        image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&q=80",
        icon: "location.svg",
        lat: 35.714,
        lng: 139.796,
      },
      {
        id: 2,
        name: "스카이트리",
        category: "관광",
        subcategory: "전망대 · 아사쿠사",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80",
        icon: "location.svg",
        lat: 35.71,
        lng: 139.81,
      },
      {
        id: 3,
        name: "긴자 쇼핑",
        category: "쇼핑",
        subcategory: "쇼핑 · 긴자",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80",
        icon: "location.svg",
        lat: 35.671,
        lng: 139.765,
      },
      {
        id: 4,
        name: "스시로",
        category: "음식점",
        subcategory: "음식점 · 긴자",
        image:
          "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepaaFqLPCSBVuXL52QsXNalTECDzH5b_5zg_D2uW-Y9L0ToXiEe73jKyq6nzyi3a8T4ojQVggc9qfuW78NtyCfzSqV2-CO1PKYCicoDD3VUoMGwGwfaxmERpoO8Z9tFTQ2yaBv_2A=s680-w680-h510-rw",
        icon: "location.svg",
        lat: 35.672,
        lng: 139.763,
      },
    ],
  },
  {
    day: 3,
    schedules: [
      {
        id: 1,
        name: "시부야 스크램블",
        category: "관광",
        subcategory: "관광명소 · 시부야",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=200&q=80",
        icon: "location.svg",
        lat: 35.659,
        lng: 139.7,
      },
      {
        id: 2,
        name: "하라주쿠 타케시타",
        category: "쇼핑",
        subcategory: "쇼핑 · 하라주쿠",
        image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=200&q=80",
        icon: "location.svg",
        lat: 35.671,
        lng: 139.705,
      },
    ],
  },
];
