export type ShowcaseCase = {
  slug: string;
  title: string;
  src: string;
  prompt: string;
};

export const showcaseCases: ShowcaseCase[] = [
  {
    slug: "modern-living-room",
    title: "现代极简客厅",
    src: "/showcase/living-room-minimal.png",
    prompt:
      "现代极简客厅，城市公寓大平层，落地窗自然采光，低矮模块沙发，天然石材茶几，浅橡木收纳墙，微水泥背景，柔和地毯，绿植点缀，暖白与浅灰配色，真实室内设计效果图，适合客户提案，无人物，无文字，无水印。",
  },
  {
    slug: "master-bedroom-luxe",
    title: "轻奢主卧",
    src: "/showcase/master-bedroom-luxe.png",
    prompt:
      "现代轻奢主卧，软包大床，木饰面与皮革床头背景，温润灯带，石材床头柜，香槟金金属细节，隐藏式衣柜，米白、灰褐和胡桃木配色，酒店式安静氛围，真实住宅尺度，高级但克制，无人物，无文字，无水印。",
  },
  {
    slug: "cream-kitchen-dining",
    title: "奶油风餐厨",
    src: "/showcase/kitchen-dining-cream.png",
    prompt:
      "奶油风开放式厨房餐厅，小户型精致改造，奶油白橱柜，浅色石材台面，圆角岛台，双吧椅，四人餐桌，拱形壁龛，嵌入式电器，浅橡木地板，柔和晨光，干净温暖，真实室内设计效果图，无人物，无文字，无水印。",
  },
  {
    slug: "japanese-spa-bathroom",
    title: "日式卫浴",
    src: "/showcase/spa-bathroom-japanese.png",
    prompt:
      "日式现代卫浴，干湿分离，悬浮浴室柜，石材台盆，木格栅背景墙，背光大镜，玻璃淋浴房，独立泡澡浴缸，小凳和叠放毛巾，微水泥墙地面，黑色五金，温润漫射灯光，安静 spa 氛围，无人物，无文字，无水印。",
  },
];

export function getShowcaseCase(slug: string) {
  return showcaseCases.find((item) => item.slug === slug);
}
