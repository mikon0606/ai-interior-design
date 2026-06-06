export interface ShowcaseCase {
  id: number;
  title: string;
  tag: string;
  before: string;
  after: string;
}

export const SHOWCASE_CASES: ShowcaseCase[] = [
  {
    id: 1,
    title: "客厅焕新",
    tag: "现代奶油风",
    before:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    id: 2,
    title: "卧室改造",
    tag: "温馨原木",
    before:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1616594039964-408345e4e4a7?w=800&q=80",
  },
  {
    id: 3,
    title: "开放式厨房",
    tag: "轻奢岛台",
    before:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1556912173-3bb406d7ef53?w=800&q=80",
  },
  {
    id: 4,
    title: "书房空间",
    tag: "极简留白",
    before:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1631889993959-41ae763f9e8f?w=800&q=80",
  },
  {
    id: 5,
    title: "卫浴升级",
    tag: "酒店质感",
    before:
      "https://images.unsplash.com/photo-1552328719-bc0b2ebdb936?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80",
  },
  {
    id: 6,
    title: "阳台休闲区",
    tag: "自然采光",
    before:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    after:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  },
];
