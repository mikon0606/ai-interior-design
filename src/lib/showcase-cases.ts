export type ShowcaseCase = {
  slug: string;
  title: string;
  originalLabel: string;
  resultLabel: string;
  originalSrc: string;
  resultSrc: string;
  prompt: string;
};

export const showcaseCases: ShowcaseCase[] = [
  {
    slug: "modern-living-room",
    title: "现代极简客厅",
    originalLabel: "原图",
    resultLabel: "生成后",
    originalSrc: "/showcase/living-room-original.png",
    resultSrc: "/showcase/living-room-minimal.png",
    prompt:
      "保留原客厅的窗户位置和空间结构，改成现代极简风。使用浅橡木收纳墙、低矮模块沙发、天然石材茶几、微水泥背景、柔和地毯和绿植点缀。整体以暖白、浅灰和木色为主，增加隐藏灯带和自然采光氛围，生成适合客户提案的真实室内效果图，无人物、无文字、无水印。",
  },
  {
    slug: "master-bedroom-luxe",
    title: "轻奢主卧",
    originalLabel: "原图",
    resultLabel: "生成后",
    originalSrc: "/showcase/master-bedroom-original.png",
    resultSrc: "/showcase/master-bedroom-luxe.png",
    prompt:
      "保留卧室门窗位置和基本尺度，改成现代轻奢主卧。增加软包大床、木饰面与皮革床头背景、温润灯带、石材床头柜、香槟金金属细节和隐藏式衣柜。整体使用米白、灰褐、胡桃木和暖光，营造酒店式安静氛围，真实住宅尺度，高级但克制，无人物、无文字、无水印。",
  },
  {
    slug: "two-bedroom-floorplan-3d",
    title: "两居户型转 3D",
    originalLabel: "平面户型图",
    resultLabel: "生成后",
    originalSrc: "/showcase/floorplan-two-bedroom-original.png",
    resultSrc: "/showcase/floorplan-two-bedroom-3d.png",
    prompt:
      "根据这张两居室平面户型图生成 3D 俯瞰效果图。保留客厅、餐厅、厨房、主卧、次卧、卫生间和阳台的空间关系，按现代暖色极简风进行家具布置。客餐厅使用浅橡木地板、浅灰沙发、石材餐桌和隐藏收纳；卧室保持温暖简洁；厨房使用浅色橱柜；卫生间使用浅灰瓷砖。生成清晰的鸟瞰 3D 户型效果图，无人物、无文字、无水印。",
  },
  {
    slug: "studio-floorplan-3d",
    title: "小户型转 3D",
    originalLabel: "平面户型图",
    resultLabel: "生成后",
    originalSrc: "/showcase/floorplan-studio-original.png",
    resultSrc: "/showcase/floorplan-studio-3d.png",
    prompt:
      "根据这张小户型平面图生成 3D 俯瞰效果图。保留玄关、开放厨房、起居卧室、卫生间、收纳和阳台的布局关系，做成适合单身公寓的高利用率设计。使用多功能沙发床、内嵌收纳、浅色开放厨房、小餐台、阳台休闲座位和干净卫浴。整体奶油白、浅橡木、暖灰和鼠尾草绿配色，生成真实清晰的 3D 户型效果图，无人物、无文字、无水印。",
  },
];

export function getShowcaseCase(slug: string) {
  return showcaseCases.find((item) => item.slug === slug);
}
